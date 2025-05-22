import React, { useState, useEffect, useRef } from "react";
import { useSocket } from "../../context/SocketContext";
import { useAuthContext } from "../../context/Authcontext";
import './interview.css'

const Chat = () => {
  const { socket } = useSocket();
  const { Authuser, Authadmin } = useAuthContext();
  const [message, setMessage] = useState("");
  const [voiceMessage, setVoiceMessage] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const videoRef = useRef(null);
  const [isRecording, setIsRecording] = useState(false);

  useEffect(() => {
    const getVideoStream = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error("Error accessing media devices:", error);
      }
    };

    getVideoStream();

    if (!socket) return;

    socket.on("receiveMessage", ({ sender, message }) => {
      const receivedMessage = message?.parts[0]?.text;
      setChatMessages((prevMessages) => [
        ...prevMessages,
        { sender, message: receivedMessage },
      ]);
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, [socket]);

  const sendMessage = (text) => {
    const senderId = Authuser?._id || Authadmin?._id;

    if (socket && text.trim() && senderId) {
      socket.emit("sendMessage", { senderId, message: text });

      setChatMessages((prevMessages) => [
        ...prevMessages,
        { sender: "You", message: text },
      ]);

      if (text === message) setMessage("");
      if (text === voiceMessage) setVoiceMessage("");
    } else {
      console.error("Socket not connected or sender ID is missing.");
    }
  };

  const startVoiceRecognition = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Your browser does not support speech recognition.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.continuous = true;

    recognition.onstart = () => {
      setIsRecording(true);
    };

    recognition.onresult = (event) => {
      const transcript = event.results[event.results.length - 1][0].transcript;
      setVoiceMessage(transcript);
      sendMessage(transcript);
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      setIsRecording(false);
    };

    recognition.start();
  };

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        overflow: "hidden",
        fontFamily: "Arial, sans-serif",
        margin: 0,
      }}
    >
      {/* Chat Section */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          padding: "10px",
          boxSizing: "border-box",
          borderRight: "1px solid #ccc",
          height: "100%",
        }}
      >
        <h3 style={{ margin: 0, marginBottom: "10px" }}>Chat</h3>
        <div
          style={{
            flex: 1,
            border: "1px solid #ccc",
            padding: "10px",
            overflowY: "auto",
            boxSizing: "border-box",
          }}
        >
          {chatMessages.length > 0 ? (
            chatMessages.map((msg, index) => (
              <div
                key={index}
                style={{
                  display: "flex",
                  justifyContent: msg.sender === "You" ? "flex-end" : "flex-start",
                  marginBottom: "10px",
                }}
              >
                <div
                  style={{
                    maxWidth: "70%",
                    padding: "10px",
                    borderRadius: "8px",
                    backgroundColor: msg.sender === "You" ? "#007BFF" : "#f1f1f1",
                    color: msg.sender === "You" ? "#fff" : "#000",
                    textAlign: msg.sender === "You" ? "right" : "left",
                  }}
                >
                  <strong>{msg.sender}:</strong> {msg.message}
                </div>
              </div>
            ))
          ) : (
            <p>No messages yet.</p>
          )}
        </div>

        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message"
            style={{
              flex: 1,
              padding: "10px",
              border: "1px solid #ccc",
              borderRadius: "4px",
              boxSizing: "border-box",
            }}
          />
          <button
            onClick={() => sendMessage(message)}
            style={{
              padding: "10px 20px",
              backgroundColor: "#007BFF",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Send
          </button>
        </div>
      </div>

      {/* Video Stream */}
      <div
        style={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
          boxSizing: "border-box",
        }}
      >
        <video
          ref={videoRef}
          autoPlay
          muted
          style={{
            width: "100%",
            maxWidth: "800px",
            height: "auto",
            border: "1px solid #ccc",
            borderRadius: "8px",
          }}
        />
      </div>
    </div>
  );
};

export default Chat;
