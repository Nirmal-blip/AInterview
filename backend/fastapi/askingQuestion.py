from fastapi import FastAPI, HTTPException
from pymongo import MongoClient
import pyttsx3
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Update with your frontend URL
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)

# MongoDB Setup
client = MongoClient("mongodb://localhost:27017/")
db = client["interview_db"]
questions_collection = db["questions"]
sessions_collection = db["sessions"]

# Function to make the bot speak
def speak(text):
    engine = pyttsx3.init()
    engine.say(text)
    engine.runAndWait()

# Function to serialize MongoDB documents
def serialize_doc(doc):
    doc["_id"] = str(doc["_id"])
    return doc

# API: Select random questions and create session
@app.post("/select-questions/")
def select_questions(num_questions: int):
    total_questions = questions_collection.count_documents({})
    if num_questions > total_questions:
        num_questions = total_questions

    selected_questions = list(questions_collection.aggregate([{"$sample": {"size": num_questions}}]))
    selected_questions = [serialize_doc(q) for q in selected_questions]

    session_id = f"session_{int(datetime.utcnow().timestamp())}"
    session_data = {
        "session_id": session_id,
        "questions": selected_questions,
        "current_index": 0,  # Track question progress
        "created_at": datetime.utcnow()
    }
    sessions_collection.insert_one(session_data)
   

    return {"session_id": session_id, "questions": selected_questions}

# API: Get the next question and speak it
@app.get("/next-question/{session_id}/")
def get_next_question(session_id: str):
    session = sessions_collection.find_one({"session_id": session_id})
    if not session:
        raise HTTPException(status_code=404, detail="Session not found.")

    current_index = session["current_index"]
    questions = session["questions"]

    if current_index >= len(questions):
        return {"message": "Interview complete!"}

    question_text = questions[current_index]["question"]
    question_id = questions[current_index]["_id"]
    # Speak the question immediately
    speak(question_text)

    # Update session progress
    sessions_collection.update_one(
        {"session_id": session_id}, 
        {"$set": {"current_index": current_index + 1}}
    )

    return {
        "question": question_text,
        "_id":question_id
    }