from fastapi import FastAPI, UploadFile
from fastapi.middleware.cors import CORSMiddleware
import os
import wave
import logging
import speech_recognition as sr

logging.basicConfig(level=logging.INFO)

app = FastAPI()

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Allow your frontend's origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Ensure 'uploads' directory exists
if not os.path.exists("uploads"):
    os.makedirs("uploads")

# Convert audio to text
def convert_to_text(audio_file):
    recognizer = sr.Recognizer()
    try:
        with sr.AudioFile(audio_file) as source:
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

# Endpoint to transcribe audio
@app.post("/transcribe/")
async def transcribe_audio(file: UploadFile):
    file_location = f"uploads/{file.filename}"

    # Save the uploaded file
    with open(file_location, "wb") as f:
        f.write(await file.read())

    # Validate the file as a WAV file
    try:
        with wave.open(file_location, "rb") as wf:
            wf.getparams()  # Check if the file is a valid WAV file
    except wave.Error as e:
        return {"error": f"Invalid WAV file: {e}"}

    # Convert the audio file to text
    transcription = convert_to_text(file_location)
    return {"transcription": transcription}
