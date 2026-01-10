import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    PORT = int(os.getenv("PORT", 6007))
    DATABASE_URL = os.getenv("DATABASE_URL", "mongodb://localhost:27017/eshop")
    FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:3000")
    FRONTEND_SELLER_URL = os.getenv("FRONTEND_SELLER_URL", "http://localhost:3001")
    FRONTEND_ADMIN_URL = os.getenv("FRONTEND_ADMIN_URL", "http://localhost:3002")

config = Config()
