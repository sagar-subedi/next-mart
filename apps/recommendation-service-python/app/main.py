from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import config
from app.db.mongo import db
from app.routes import recommendation
import uvicorn

app = FastAPI()

# CORS
origins = [
    config.FRONTEND_URL,
    config.FRONTEND_SELLER_URL,
    config.FRONTEND_ADMIN_URL,
    "http://localhost:3000",
    "http://localhost:3001",
    "http://localhost:3002",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Database events
@app.on_event("startup")
async def startup_db_client():
    await db.connect()

@app.on_event("shutdown")
async def shutdown_db_client():
    await db.close()

@app.get("/")
async def root():
    return {"message": "Welcome to recommendation service (Python)!"}

# Routes
app.include_router(recommendation.router, prefix="/api")

if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=config.PORT, reload=True)
