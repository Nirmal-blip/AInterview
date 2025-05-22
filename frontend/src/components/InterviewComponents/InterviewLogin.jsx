import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const styles = {
    container: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "100vh",
      backgroundColor: "#f0f2f5",
      fontFamily: "Arial, sans-serif",
    },
    card: {
      backgroundColor: "#ffffff",
      borderRadius: "8px",
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
      padding: "32px",
      width: "100%",
      maxWidth: "400px",
      textAlign: "center",
    },
    title: {
      fontSize: "24px",
      fontWeight: "600",
      color: "#333333",
      marginBottom: "24px",
    },
    input: {
      width: "100%",
      padding: "12px",
      marginBottom: "16px",
      border: "1px solid #dddddd",
      borderRadius: "4px",
      fontSize: "16px",
      outline: "none",
      transition: "border-color 0.3s ease",
    },
    button: {
      width: "100%",
      padding: "12px",
      backgroundColor: "#007bff",
      color: "#ffffff",
      border: "none",
      borderRadius: "4px",
      fontSize: "16px",
      fontWeight: "600",
      cursor: "pointer",
      transition: "background-color 0.3s ease",
    },
    message: {
      marginTop: "16px",
      color: "#ff0000",
      fontSize: "14px",
    },}

  const handleLogin = async () => {
    if (!email || !password) {
      setMessage("Please enter both email and password.");
      return;
    }

    try {
      const response = await fetch("http://localhost:8001/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Login successful! Redirecting...");
        window.location.href = data.redirect_url; // Redirect to interview session
      } else {
        setMessage(data.detail);
      }
    } catch (error) {
      setMessage("Login failed. Try again.");
    }
  };

  return (
    <div style={styles.container}>
    <div style={styles.card}>
      <h2 style={styles.title}>Login to AI Interview Portal</h2>
      <input
        type="email"
        placeholder="Enter your email"
        style={styles.input}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Enter One-Time Password"
        style={styles.input}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button style={styles.button} onClick={handleLogin}>
        Login
      </button>
      {message && <p style={styles.message}>{message}</p>}
    </div>
  </div>
  );
}
