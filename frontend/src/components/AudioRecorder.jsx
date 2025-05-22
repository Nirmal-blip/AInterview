import React, { useState } from "react";
import axios from "axios";
import WavEncoder from "wav-encoder";

function AudioRecorder() {
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [transcription, setTranscription] = useState("");
  const [elapsedTime, setElapsedTime] = useState(0);

  const startRecording = async () => {
    setElapsedTime(0); // Reset timer
    const timerInterval = setInterval(() => {
      setElapsedTime((prev) => prev + 1);
    }, 1000);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      const audioChunks = [];

      // Ensure audio chunks are collected properly
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunks.push(event.data);
        }
      };

      // Handle stopping the recording and processing the audio
      mediaRecorder.onstop = async () => {
        clearInterval(timerInterval); // Stop the timer
        const audioBlob = new Blob(audioChunks, { type: "audio/wav" });
        const arrayBuffer = await audioBlob.arrayBuffer();

        // Re-encode the audio as a valid PCM WAV file
        const audioBuffer = new Float32Array(arrayBuffer);
        const wavFile = await WavEncoder.encode({
          sampleRate: 44100, // Ensure the correct sample rate
          channelData: [audioBuffer], // Mono channel data
        });

        const audioFile = new File([new Uint8Array(wavFile)], "recorded-audio.wav", { type: "audio/wav" });

        const formData = new FormData();
        formData.append("file", audioFile);

        setIsLoading(true); // Show loading message
        try {
          const API_URL = "http://127.0.0.1:8000"; // Backend URL
          const response = await axios.post(`${API_URL}/transcribe/`, formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });
          console.log(response);
          setTranscription(response.data.transcription);
        } catch (error) {
          console.error("Error during transcription:", error);
          alert("Failed to transcribe the audio. Please try again.");
        } finally {
          setIsLoading(false);
        }
      };

      mediaRecorder.start();

      // Stop recording after 5 seconds
      setTimeout(() => {
        mediaRecorder.stop();
        setIsRecording(false);
      }, 5000);
    } catch (err) {
      clearInterval(timerInterval); // Stop timer if error occurs
      console.error("Error accessing the microphone:", err);
    }
  };

  const toggleRecording = () => {
    if (isRecording) {
      setIsRecording(false);
    } else {
      setIsRecording(true);
      startRecording();
    }
  };

  return (
    <div>
      <h1>Interview Portal</h1>
      <button onClick={toggleRecording} disabled={isLoading}>
        {isRecording ? "Stop Recording" : "Start Recording"}
      </button>
      {isRecording && <p>Recording... {elapsedTime}s</p>}
      {isLoading && <p>Transcribing audio, please wait...</p>}
      <div>
        <h2>Transcription:</h2>
        <p>{transcription}</p>
      </div>
    </div>
  );
}

export default AudioRecorder;
