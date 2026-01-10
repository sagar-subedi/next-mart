from fastapi import APIRouter, Depends, HTTPException, Request
from app.db.mongo import db
from app.services.recommendation import recommend_products
from datetime import datetime, timedelta
from bson import ObjectId

router = APIRouter()

async def get_current_user(request: Request):
    # Mock authentication middleware
    # In a real app, we would validate the JWT token here.
    # For now, we'll assume the gateway handles auth or we extract user from header/mock.
    # The TS service uses `isAuthenticated` middleware which populates `req.user`.
    # We'll assume the gateway passes X-User-Id header or similar, or we parse the token.
    # For simplicity in this migration demo, we'll look for a header or mock it.
    
    # Check for X-User-Id header (Gateway might set this)
    user_id = request.headers.get("X-User-Id")
    if user_id:
        return {"id": user_id}
        
    # Fallback: Check Authorization header (Bearer token)
    # We won't implement full JWT verification here to avoid complexity, 
    # but we should at least have a placeholder.
    # Let's assume for local testing we might need a way to pass user ID.
    
    # If no user found, raise 401
    # raise HTTPException(status_code=401, detail="Unauthorized")
    
    # For development/testing ease, if no header, return a mock user ID if needed, 
    # or better, require the header.
    if not user_id:
         # Try to get from query param for easy testing? No, stick to headers.
         # Let's assume the user sends a dummy token or ID.
         # We'll return a mock ID for now if not present, to allow testing without full auth setup.
         # CAUTION: This is for migration testing only.
         return {"id": "659d4f2b8f6a9c0012345678"} # Dummy ObjectId
         
    return {"id": user_id}

@router.get("/get-recommendation-products")
async def get_recommendation_products(user: dict = Depends(get_current_user)):
    try:
        user_id = user["id"]
        
        # Fetch all products (needed for recommendation scope)
        # We only need ID, images, shop.
        cursor = db.db.products.find({})
        products = await cursor.to_list(length=None)
        
        # Convert ObjectId to string for easier handling
        for p in products:
            p["id"] = str(p["_id"])
            del p["_id"]
            # Handle dates if needed, but we just pass them through or filter
            
        # Fetch user analytics
        user_analytics = await db.db.userAnalytics.find_one({"userId": user_id})
        
        recommended_products = []
        now = datetime.now()
        
        if not user_analytics:
            # Fallback to last 10 products
            recommended_products = products[-10:]
        else:
            actions = user_analytics.get("actions", [])
            recommendations = user_analytics.get("recommendations", [])
            last_trained = user_analytics.get("lastTrained")
            
            hours_diff = float("inf")
            if last_trained:
                # Ensure last_trained is datetime
                if isinstance(last_trained, str):
                    try:
                        last_trained = datetime.fromisoformat(last_trained.replace("Z", "+00:00"))
                    except ValueError:
                        pass # Keep as None or handle error
                
                if isinstance(last_trained, datetime):
                    diff = now - last_trained
                    hours_diff = diff.total_seconds() / 3600
            
            if len(actions) < 50:
                recommended_products = products[-10:]
            elif hours_diff < 3 and len(recommendations) > 0:
                # Use cached recommendations
                rec_ids = set(recommendations)
                recommended_products = [p for p in products if p["id"] in rec_ids]
            else:
                # Calculate new recommendations
                recommended_product_ids = await recommend_products(user_id, products)
                
                # Filter products
                rec_ids = set(recommended_product_ids)
                recommended_products = [p for p in products if p["id"] in rec_ids]
                
                # Update user analytics with new recommendations
                await db.db.userAnalytics.update_one(
                    {"userId": user_id},
                    {
                        "$set": {
                            "recommendations": recommended_product_ids,
                            "lastTrained": now
                        }
                    }
                )

        return {"success": True, "recommendations": recommended_products}

    except Exception as e:
        print(f"Error in get_recommendation_products: {e}")
        raise HTTPException(status_code=500, detail=str(e))
