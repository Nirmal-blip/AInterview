import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useAuthContext } from "../../context/Authcontext";

const InterviewLogin = () => {
  const { organizationName, studentId } = useParams(); // Capture the unique student ID from the route.
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("");
  const [linkValid, setLinkValid] = useState(null); // Initially null to distinguish between loading and validation states.
  const [loginStatus, setLoginStatus] = useState("");
  const { Authuser, setAuthuser } = useAuthContext()

  const validateLink = async () => {
    try {
      const response = await axios.post(`http://localhost:5000/api/admin/validateLink?organizationName=${organizationName}`, { studentId }, { withCredentials: true });
      if (response.data.success) {
        setLinkValid(true);
        setStatus("Valid Link! Please enter your credentials to log in.");
      } else {
        setLinkValid(false);
        setStatus("This link has expired or is invalid.");
      }
    } catch (error) {
      console.error("Error validating link:", error);
      setLinkValid(false);
      setStatus("An error occurred. Please try again later.");
    }
  };

  const handleLogin = async () => {
    try {
      const response = await axios.post(`http://localhost:5000/api/admin/studentLogin?organizationName=${organizationName}`, {
        studentId,
        username,
        password,
      }, { withCredentials: true });
      const data=response.data
      if (data.success) {
        localStorage.setItem("student-data", JSON.stringify(data.student));
        setAuthuser(data.student);
        console.log(Authuser)
      } else {
        
        setLoginStatus("Invalid username or password. Please try again.");
      }
    } catch (error) {
      if (error.response) {
        setLoginStatus(error?.response?.data?.message || "An error occurred.");
      } else if (error.request) {
        setLoginStatus("No response from server. Please try again.");
      } else {
        // An error occurred in setting up the request
        setLoginStatus("Error setting up request: " + error.message);
      }
      // setLoginStatus("An error occurred during login. Please try again later.");
    }
  };

  useEffect(() => {
    validateLink();
  }, [studentId]);

  if (linkValid === null) {
    return <p>Loading...</p>; // Show a loading state while validating the link.
  }

  if (!linkValid) {
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <h1>404 - Page Not Found</h1>
        <p>The link you followed is invalid or has expired.</p>
      </div>
    );
  }

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>AI Interview Login</h1>
      {status && <p>{status}</p>}
      {linkValid && (
        <div>
          <div>
            <label>
              <strong>Username:</strong>
            </label>
            <br />
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
              style={{ margin: "10px", padding: "5px", width: "200px" }}
            />
          </div>
          <div>
            <label>
              <strong>Password:</strong>
            </label>
            <br />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              style={{ margin: "10px", padding: "5px", width: "200px" }}
            />
          </div>
          <button
            onClick={handleLogin}
            style={{
              padding: "10px 20px",
              marginTop: "20px",
              backgroundColor: "#007BFF",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Login
          </button>
          {loginStatus && <p style={{ marginTop: "20px" }}>{loginStatus}</p>}
        </div>
      )}
    </div>
  );
};

export default InterviewLogin;

