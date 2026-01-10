import tensorflow as tf
import numpy as np
from app.db.mongo import db
from datetime import datetime

EMBEDDING_DM = 50

async def fetch_user_activity(user_id: str):
    """
    Fetches user activity from userAnalytics collection.
    """
    user_analytics = await db.db.userAnalytics.find_one({"userId": user_id}, {"actions": 1})
    if not user_analytics or "actions" not in user_analytics:
        return []
    return user_analytics["actions"]

async def recommend_products(user_id: str, all_products: list) -> list[str]:
    """
    Recommends products for a user based on collaborative filtering.
    """
    user_actions = await fetch_user_activity(user_id)
    if not user_actions:
        return []

    # Preprocess data
    # We need to map userIds and productIds to integer indices
    
    # Collect all interactions
    # Note: In a real production system, we would train the model offline or periodically.
    # Here, we are replicating the TS logic which seems to train on-the-fly or at least locally with available data.
    # The TS logic takes `userId` and `allProducts`.
    # It seems to build a mini-dataset from the current user's actions?
    # Wait, the TS logic:
    # const userActions = await fetchActivity(userId);
    # const processedData = preProcessData(userActions, allProducts);
    # It seems to train on just this user's interactions? That's odd for collaborative filtering.
    # Collaborative filtering usually needs interactions from MANY users.
    # Let's re-read the TS code.
    # `preProcessData(userActions, allProducts)`
    # If it only uses `userActions` (which is for ONE user), then `userCount` will be 1.
    # And `userEmbedding` inputDim will be 1.
    # This effectively learns to predict products for THIS user based on their past actions?
    # But if there's only 1 user, the user embedding is constant.
    # The model learns product embeddings that predict high scores for products the user interacted with.
    # This is more like a content-based filtering or just memorizing user preferences, but using matrix factorization architecture.
    # It's a bit weird but I will replicate it as requested.
    
    interactions = []
    for action in user_actions:
        interactions.append({
            "userId": user_id,
            "productId": action["productId"],
            "actionType": action["action"]
        })
    
    if not interactions:
        return []

    # Map IDs to indices
    user_map = {}
    product_map = {}
    user_count = 0
    product_count = 0

    # We need to include ALL products in the product map to be able to predict for them
    for product in all_products:
        p_id = str(product["_id"])
        if p_id not in product_map:
            product_map[p_id] = product_count
            product_count += 1
            
    # And ensure interacted products are in map (should be if all_products covers them)
    for interaction in interactions:
        u_id = interaction["userId"]
        p_id = interaction["productId"]
        
        if u_id not in user_map:
            user_map[u_id] = user_count
            user_count += 1
        
        # If product not in all_products (e.g. deleted), we might skip or add it.
        # TS code: `if (!(productId in productMap)) productMap[productId] = productCount++;`
        if p_id not in product_map:
            product_map[p_id] = product_count
            product_count += 1

    # Prepare training data
    user_indices = []
    product_indices = []
    labels = []

    for interaction in interactions:
        u_idx = user_map.get(interaction["userId"])
        p_idx = product_map.get(interaction["productId"])
        
        if u_idx is not None and p_idx is not None:
            user_indices.append(u_idx)
            product_indices.append(p_idx)
            
            weight = 0.0
            action = interaction["actionType"]
            if action == "purchase":
                weight = 1.0
            elif action == "add_to_cart":
                weight = 0.7
            elif action == "add_to_wishlist":
                weight = 0.5
            elif action == "product_view":
                weight = 0.1
            
            labels.append(weight)

    if not user_indices:
        return []

    user_tensor = np.array(user_indices, dtype=np.int32)
    product_tensor = np.array(product_indices, dtype=np.int32)
    label_tensor = np.array(labels, dtype=np.float32)

    # Build Model
    user_input = tf.keras.layers.Input(shape=(1,), dtype=tf.int32, name="user_input")
    product_input = tf.keras.layers.Input(shape=(1,), dtype=tf.int32, name="product_input")

    user_embedding = tf.keras.layers.Embedding(input_dim=user_count + 1, output_dim=EMBEDDING_DM)(user_input)
    product_embedding = tf.keras.layers.Embedding(input_dim=product_count + 1, output_dim=EMBEDDING_DM)(product_input)

    user_vec = tf.keras.layers.Flatten()(user_embedding)
    product_vec = tf.keras.layers.Flatten()(product_embedding)

    merged = tf.keras.layers.Dot(axes=1)([user_vec, product_vec])
    output = tf.keras.layers.Dense(1, activation="sigmoid")(merged)

    model = tf.keras.Model(inputs=[user_input, product_input], outputs=output)
    model.compile(optimizer="adam", loss="binary_crossentropy", metrics=["accuracy"])

    # Train
    model.fit([user_tensor, product_tensor], label_tensor, epochs=5, batch_size=32, verbose=0)

    # Predict for all products for this user
    # We want to score all products
    all_product_indices = np.array(list(product_map.values()), dtype=np.int32)
    # User index is constant
    target_user_idx = user_map[user_id]
    user_indices_pred = np.full(len(all_product_indices), target_user_idx, dtype=np.int32)

    predictions = model.predict([user_indices_pred, all_product_indices], verbose=0)
    
    # Combine scores with product IDs
    scored_products = []
    product_ids = list(product_map.keys())
    
    for i, score in enumerate(predictions):
        scored_products.append({
            "productId": product_ids[i],
            "score": float(score[0])
        })
    
    # Sort by score descending
    scored_products.sort(key=lambda x: x["score"], reverse=True)
    
    # Return top 10 product IDs
    return [p["productId"] for p in scored_products[:10]]
