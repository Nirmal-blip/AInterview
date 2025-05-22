from fastapi import FastAPI, HTTPException, Depends
from pydantic import BaseModel
from pymongo import MongoClient
from passlib.context import CryptContext
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Restrict in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Database connection
client = MongoClient("mongodb://localhost:27017/")
db = client["student_db"]
users_collection = db["students"]

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Request model for login
class LoginRequest(BaseModel):
    email: str
    password: str

@app.post("/login")
def login(payload: LoginRequest):
    email = payload.email
    password = payload.password

    user = users_collection.find_one({"email": email})

    if not user:
        raise HTTPException(status_code=400, detail="Invalid email or password.")

    if user.get("used"):
        raise HTTPException(status_code=400, detail="This password has already been used.")
    
    

    if not pwd_context.verify(password, user["password"]):
        raise HTTPException(status_code=400, detail="Invalid password.")

    # Mark OTP as used
    users_collection.update_one({"email": email}, {"$set": {"used": True}})

    return {
        "message": "Login successful!",
        "redirect_url": "/interview-portal",
        "user": {"email": email}  # You can include additional user details if needed
    }
