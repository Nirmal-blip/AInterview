import React, { useState, useRef } from "react";
import axios from "axios";

const App = () => {
  const [sessionId, setSessionId] = useState("");
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [currentId, setCurrentId] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [recordedBlobUrl, setRecordedBlobUrl] = useState(null); // CHANGED: renamed for clarity
  const [recordedAudioBlob, setRecordedAudioBlob] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [results, setResults] = useState([]);
  const [isInterviewComplete, setIsInterviewComplete] = useState(false);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  // Function to make the bot speak the question
  const speakQuestion = (text) => {
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(text);
    synth.speak(utterance);
  };

  // Start Interview
  const startInterview = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8000/select-questions/?num_questions=5"
      );
      setSessionId(response.data.session_id);
      fetchNextQuestion(response.data.session_id);
    } catch (error) {
      console.error("Error starting interview:", error.message);
    }
  };

  // Fetch next question
  const fetchNextQuestion = async (session_id) => {
    try {
      const response = await axios.get(
        `http://localhost:8000/next-question/${session_id}/`
      );
      if (response.data.message === "Interview complete!") {
        alert("Interview completed!");
        setIsInterviewComplete(true);
        return;
      }
      setCurrentQuestion(response.data.question);
      setCurrentId(response.data._id);
      speakQuestion(response.data.question);
    } catch (error) {
      console.error("Error fetching next question:", error.message);
    }
  };

  // Start recording using MediaRecorder
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      //mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/wav", // CHANGED: consistent type with recorder
        });
        const audioUrl = URL.createObjectURL(audioBlob);
        setRecordedBlobUrl(audioUrl);
        setRecordedAudioBlob(audioBlob); // CHANGED: store Blob directly
      };
      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Error accessing microphone:", error);
    }
  };

  // Stop recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  // Upload recorded audio
  const uploadAudio = async () => {
    if (!recordedAudioBlob) {
      alert("No audio recorded!");
      return;
    }

    if (!currentId) {
      alert("Question ID is missing!");
      console.error("❌ Missing question ID in frontend");
      return;
    }

    setIsUploading(true);

    try {
      const audioFile = new File(
        [recordedAudioBlob],
        "interview-response.webm",
        {
          // CHANGED: better filename
          type: "audio/webm;codecs=opus", // CHANGED: consistent type
        }
      );

      // Prepare FormData
      const formData = new FormData();
      formData.append("file", audioFile);
      formData.append("question_id", currentId);
      formData.append("session_id", sessionId);

      console.log("⬆️ Uploading audio:", formData);

      // Upload to backend
      const { data, status } = await axios.post(
        "http://localhost:8001/record-response/",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (status === 200) {
        console.log("✅ Audio uploaded successfully:", data);
        fetchNextQuestion(sessionId);
      } else {
        throw new Error(`Unexpected response from server: ${status}`);
      }
    } catch (error) {
      console.error(
        "❌ Error uploading audio:",
        error.response?.data || error.message
      );
      alert(
        error.response?.data?.error ||
          "Failed to upload audio. Please try again."
      );
    } finally {
      setIsUploading(false);
    }
  };

  const checkScore = async () => {
    if (!sessionId || !currentId) {
      console.warn("Missing sessionId or currentId.");
      alert("Session ID and Question ID are required.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8002/evaluate-answer/",
        {
          session_id: sessionId,
          question_id: currentId,
        }
      );
      console.log(response.data);
      if (response.data && Array.isArray(response.data.evaluated_responses)) {
        const evaluations = response.data.evaluated_responses;

        if (evaluations.length === 0) {
          console.warn("No evaluations found.");
          alert("No evaluations available for this session.");
          return;
        }

        setResults(evaluations); // Store all evaluation results in state
      } else {
        console.warn("Unexpected API response:", response.data);
        alert("Unexpected response format from server.");
      }
    } catch (error) {
      console.error("Evaluation API Error:", error);
      alert("Error fetching evaluation. Please try again.");
    }
  };

  return (
    <div>
      <h1>Interview Portal</h1>
      <button onClick={startInterview} disabled={isRecording || isUploading}>
        Start Interview
      </button>

      {currentQuestion && (
        <div>
          <h2>Question: {currentQuestion}</h2>

          <button
            onClick={startRecording}
            disabled={isRecording || isUploading}
          >
            🎤 Start Recording
          </button>
          <button
            onClick={stopRecording}
            disabled={!isRecording || isUploading}
          >
            ⏹ Stop Recording
          </button>

          {recordedBlobUrl && (
            <audio controls>
              <source src={recordedBlobUrl} type="audio/webm" />
              <a href={recordedBlobUrl} download>
                Download
              </a>
            </audio>
          )}

          <button
            onClick={uploadAudio}
            disabled={!recordedAudioBlob || isUploading}
          >
            {isUploading ? "Uploading..." : "Submit Answer"}
          </button>
        </div>
      )}

      {isInterviewComplete && (
        <div>
          <button onClick={checkScore}>Check Score</button>
        </div>
      )}

      <div>
        <h2>Evaluation Results</h2>
        {results.length === 0 ? (
          <p>Loading...</p>
        ) : (
          <div className="flex gap-2">
            {results.map((item, index) => (
              <div key={index} className="flex flex-col space-y-1 ">
                <h4>Question {index + 1}</h4>
                <p>
                  <strong>Response:</strong> {item.text_response}
                </p>
                <p>
                  <strong>Similarity Score:</strong>{" "}
                  {item.evaluation_scores.similarity_score.toFixed(2)}
                </p>
                <p>
                  <strong>Technical Skills:</strong>{" "}
                  {item.evaluation_scores.technical_skills}
                </p>
                <p>
                  <strong>Soft Skills:</strong>{" "}
                  {item.evaluation_scores.soft_skills}
                </p>
                <p>
                  <strong>Conciseness:</strong>{" "}
                  {item.evaluation_scores.conciseness}
                </p>
                <p>
                  <strong>Confidence:</strong>{" "}
                  {item.evaluation_scores.confidence}
                </p>
                <hr />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
