from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from pydub import AudioSegment
import json
import wave
import os
import time
import logging
from datetime import datetime
from pymongo import MongoClient
from bson import ObjectId
import speech_recognition as sr
from io import BytesIO
from vosk import Model, KaldiRecognizer

# Initialize FastAPI app
app = FastAPI()

# CORS middleware setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Update with your frontend URL
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)

# MongoDB setup
MONGO_URI = "mongodb://localhost:27017/"
client = MongoClient(MONGO_URI)
db = client["interview_db"]
responses_collection = db["responses"]
questions_collection = db["questions"]

# Logging setup
logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")

def convert_to_text(audio_file_path):
    recognizer = sr.Recognizer()
    try:
        with sr.AudioFile(audio_file_path) as source:
            logging.info("Converting audio to text...")
            audio_data = recognizer.record(source)
        text = recognizer.recognize_google(audio_data)
        logging.info("Conversion complete.")
        return text
    except sr.UnknownValueError:
        logging.warning("Speech not recognized.")
        return "Speech not recognized."
    except sr.RequestError as e:
        logging.error(f"Google Speech Recognition service error: {e}")
        return f"Error: {e}"  
# API to process and store audio responses
@app.post("/record-response/")
async def record_response(question_id: str = Form(...),session_id: str = Form(...), file: UploadFile = File(...)):
    try:
        logging.info(f"Received question_id: {question_id}")

        # Ensure question_id is valid in MongoDB
        if not ObjectId.is_valid(question_id):
            logging.error("❌ Invalid Question ID format!")
            raise HTTPException(status_code=400, detail="Invalid Question ID format.")

        question_exists = questions_collection.find_one({"_id": ObjectId(question_id)})
        if not question_exists:
            logging.error("❌ Question ID not found in database!")
            raise HTTPException(status_code=404, detail="Question ID not found in database.")

        # Read the uploaded file's content into memory
        file_content = await file.read()

        # Use pydub to convert the audio to 16-bit PCM WAV format
        audio = AudioSegment.from_file(BytesIO(file_content))
        audio = audio.set_sample_width(2)  # Ensure 16-bit PCM
        audio = audio.set_frame_rate(16000)  # Optional: Set frame rate to 16kHz
        audio = audio.set_channels(1)  # Optional: Set to mono

        # Prepare the directory to save the converted audio
        os.makedirs("responses", exist_ok=True)
        timestamp = datetime.now().isoformat().replace(":", "-")
        pcm_audio_path = f"responses/{question_id}_{timestamp}.wav"

        # Export the audio in 16-bit PCM WAV format
        audio.export(pcm_audio_path, format="wav")

        # Convert speech to text
        text_response = convert_to_text(pcm_audio_path)

        # Save response in MongoDB
        response_data = {
            "question_id": question_id,
            "audio_file": pcm_audio_path,
            "text_response": text_response,
            "session_id":session_id,
            "timestamp": datetime.utcnow().isoformat()
        }
        inserted_response = responses_collection.insert_one(response_data)
        response_data["_id"] = str(inserted_response.inserted_id)

        return JSONResponse(status_code=200, content={"message": "Success", "data": response_data})

    except Exception as e:
        logging.error(f"❌ Error processing audio: {e}")
        return JSONResponse(status_code=500, content={"error": str(e)})
