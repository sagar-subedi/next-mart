from motor.motor_asyncio import AsyncIOMotorClient
from app.config import config

class MongoDB:
    client: AsyncIOMotorClient = None
    db = None

    async def connect(self):
        self.client = AsyncIOMotorClient(config.DATABASE_URL)
        # Assuming database name is 'eshop' or extracted from URL
        # Motor doesn't automatically select DB from URL in the same way as some drivers if not specified?
        # Actually it does if it's in the connection string.
        # But to be safe/explicit, we can get_default_database()
        self.db = self.client.get_default_database("eshop")
        print("Connected to MongoDB")

    async def close(self):
        if self.client:
            self.client.close()
            print("Disconnected from MongoDB")

db = MongoDB()

async def get_database():
    return db.db
