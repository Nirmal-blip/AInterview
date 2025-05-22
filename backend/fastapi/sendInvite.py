from fastapi import FastAPI, HTTPException
from pymongo import MongoClient
from passlib.context import CryptContext
import smtplib
import random
import string
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Restrict in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# MongoDB connection
client = MongoClient("mongodb://localhost:27017/")
db = client["student_db"]
users_collection = db["students"]

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Function to generate a unique password
def generate_password():
   
    return ''.join(random.choices(string.ascii_letters + string.digits, k=8))

# Function to send email
def send_email(email, password):
    sender_email = "gupta.aniket120168@gmail.com"
    sender_password = "sxgv zsnw aoyz ghyq"
    login_link = f"http://localhost:5173/interview-login"
    
    message = f"""\
Subject: Your Interview Portal Access

Dear Student,

You have been invited to the interview portal. 

Your login credentials:
- **Username:** {email}
- **Password:** {password} (One-time use only)

Click the link below to log in:
{login_link}

Regards,
Interview Team
"""

    

    try:
        server = smtplib.SMTP("smtp.gmail.com", 587)
        server.starttls()
        server.login(sender_email, sender_password)
        server.sendmail(sender_email, email, message)
        server.quit()
    except Exception as e:
        print(f"Failed to send email to {email}: {str(e)}")

@app.post("/send-invites")
def send_invites(payload: dict):
    students = payload.get("students", [])
    if not students:
        raise HTTPException(status_code=400, detail="No students provided")

    sent_students = []  # List to store email-password pairs
   
    for student in students:
        email = student["email"]

        existing_user = users_collection.find_one({"email": email})

        if existing_user:
         print(f"⚠️ User {email} already exists. Skipping insertion.")  # Debugging
         continue

        password = generate_password()
        hashed_password = pwd_context.hash(password)



        # Store in database
        users_collection.insert_one({
            "email": email,
            "password": hashed_password,
            "used": False
        })
   
        # Send email
        send_email(email, password)

        # Store the credentials for response
        sent_students.append({"email": email, "password": password})  # Use plain password for frontend

    return {
        "message": "Invites sent successfully!",
        "students": sent_students  # Return list of all students with credentials
    }
