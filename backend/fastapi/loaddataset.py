import csv
from pymongo import MongoClient

# MongoDB setup
client = MongoClient("mongodb://localhost:27017/")
db = client["interview_db"]
questions_collection = db["questions"]

# Function to load dataset into MongoDB
def load_dataset_to_mongodb(filename="dataset.csv"):
    # Clear existing questions
    questions_collection.delete_many({})
    
    questions = []
    try:
        with open(filename, newline='', encoding='utf-8') as file:
            reader = csv.DictReader(file)
            for row in reader:
                question = {
                    "question": row["Question"],
                    "answer": row["Answer"],
                    "difficulty": row["Difficulty"]
                }
                questions.append(question)

        if questions:
            questions_collection.insert_many(questions)
            print(f" Successfully loaded {len(questions)} questions into MongoDB.")
        else:
            print(" No questions found in the dataset.")

    except Exception as e:
        print(f" Error loading dataset: {e}")

# Run the function when the script is executed
if __name__ == "__main__":
    load_dataset_to_mongodb("backend\fastapi\dataset.csv")
