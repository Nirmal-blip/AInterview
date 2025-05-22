from fastapi import FastAPI, HTTPException, Depends
from pydantic import BaseModel
from motor.motor_asyncio import AsyncIOMotorClient
import numpy as np
import torch
import re
from bson import ObjectId
from transformers import AutoTokenizer, AutoModel
from sklearn.metrics.pairwise import cosine_similarity
from fastapi.middleware.cors import CORSMiddleware

# -----------------------------
# FastAPI App Initialization
# -----------------------------
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Restrict in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -----------------------------
# Database Connection (Async)
# -----------------------------
MONGO_URI = "mongodb://localhost:27017/"
DB_NAME = "interview_db"

async def get_database():
    client = AsyncIOMotorClient(MONGO_URI)
    return client[DB_NAME]

# -----------------------------
# Paraphrase Detection (Optimized)
# -----------------------------
class ParaphraseDetector:
    def __init__(self, model_name="sentence-transformers/all-MiniLM-L6-v2"):
        self.tokenizer = AutoTokenizer.from_pretrained(model_name)
        self.model = AutoModel.from_pretrained(model_name)
        self.model.eval()  # Set to eval mode for inference efficiency

    def get_embeddings(self, sentences):
        inputs = self.tokenizer(sentences, padding=True, truncation=True, return_tensors="pt")
        with torch.no_grad():
            outputs = self.model(**inputs)
        return outputs.last_hidden_state.mean(dim=1).numpy()

    def detect_paraphrase(self, reference_answers, user_answer):
        embeddings_ref = self.get_embeddings(reference_answers)
        embedding_user = self.get_embeddings([user_answer])[0]
        similarities = cosine_similarity(embeddings_ref, [embedding_user])
        return float(np.max(similarities))  # Ensure float return type

# Load model once (Singleton)
paraphrase_detector = ParaphraseDetector()

# -----------------------------
# Data Models
# -----------------------------
class EvaluationRequest(BaseModel):
    question_id: str
    session_id: str

# -----------------------------
# Helper Functions
# -----------------------------
def preprocess_text(text):
    """Removes extra whitespace, special characters, and normalizes the text."""
    if not text:
        return ""
    text = re.sub(r'\s+', ' ', text).strip()  # Normalize spaces
    return text

def generate_feedback(similarity_score, transcription):
    """
    Generates structured feedback based on the similarity score and response quality.
    """
    transcription = preprocess_text(transcription)

    feedback = {
        "similarity_score": similarity_score,
        "technical_skills": "",
        "soft_skills": "",
        "conciseness": "",
        "confidence": ""
    }

    # Similarity-based feedback
    if similarity_score > 0.8:
        feedback["technical_skills"] = "Excellent understanding of the topic."
        feedback["soft_skills"] = "Clear and structured response."
        feedback["conciseness"] = "Answer is to the point and well-articulated."
        feedback["confidence"] = "Strong confidence in response delivery."
    elif similarity_score > 0.6:
        feedback["technical_skills"] = "Good understanding but can be more precise."
        feedback["soft_skills"] = "Well-explained but could use a more structured approach."
        feedback["conciseness"] = "Slightly verbose; try to be more direct."
        feedback["confidence"] = "Fairly confident but could be more assertive."
    elif similarity_score > 0.4:
        feedback["technical_skills"] = "Partial understanding, but some gaps exist."
        feedback["soft_skills"] = "Lacks clarity in explanation."
        feedback["conciseness"] = "Too lengthy or too brief."
        feedback["confidence"] = "Lacks confidence; try to be more sure of your response."
    else:
        feedback["technical_skills"] = "Weak understanding of the topic."
        feedback["soft_skills"] = "Needs a more structured and clear response."
        feedback["conciseness"] = "Response lacks clarity and completeness."
        feedback["confidence"] = "Seems unsure; improve confidence while answering."

    return feedback

# -----------------------------
# Evaluation Functions
# -----------------------------
def evaluate_response(transcription, reference_answer):
    """Evaluates the response similarity with structured feedback."""
    transcription = preprocess_text(transcription)

    if not transcription:
        return {
            "similarity_score": 0.0,
            "feedback": "No response provided. Please provide a valid response."
        }

    similarity_score = paraphrase_detector.detect_paraphrase([reference_answer], transcription)
    feedback = generate_feedback(similarity_score, transcription)

    return feedback

# -----------------------------
# API Endpoint: Evaluate Answer
# -----------------------------
@app.post("/evaluate-answer/")
async def evaluate_answer(request: EvaluationRequest, db=Depends(get_database)):
    responses_collection = db["responses"]
    questions_collection = db["questions"]

    # Fetch all user responses for the session
    session_responses = await responses_collection.find({"session_id": request.session_id}).to_list(None)
    if not session_responses:
        raise HTTPException(status_code=404, detail=f"No answers found for session ID: {request.session_id}")

    evaluated_results = []
    for response in session_responses:
        question_id = response.get("question_id")
        transcription = response.get("text_response")
        if not transcription:
            continue

        # Fetch reference answer
        question = await questions_collection.find_one({"_id": ObjectId(question_id)})
        if not question or "answer" not in question:
            continue

        reference_answer = question["answer"]
        evaluation_result = evaluate_response(transcription, reference_answer)
        evaluated_results.append({
            "question_id": question_id,
            "text_response": transcription,
            "evaluation_scores": evaluation_result
        })

    return {"session_id": request.session_id, "evaluated_responses": evaluated_results}
