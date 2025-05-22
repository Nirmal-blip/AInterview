import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import axios from "axios";
import { useAuthContext } from "../../context/Authcontext";

const Home = () => {
  const [file, setFile] = useState(null);
  const [uploadedData, setUploadedData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchedData, setFetchedData] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [customQuestion, setCustomQuestion] = useState("");
  const { Authadmin } = useAuthContext();

  const organizationName = Authadmin.organizationName;

  useEffect(() => {
    fetchDataFromAPI();
    fetchInterviewQuestions();
  }, []);

  const fetchInterviewQuestions = async () => {
    // Replace with your predefined question API or hardcoded questions
    const predefinedQuestions = [
      "What are your strengths and weaknesses?",
      "Describe a challenging project you worked on.",
      "How do you handle tight deadlines?",
      "Why are you interested in this role?",
      "Where do you see yourself in five years?"
    ];
    setQuestions(predefinedQuestions);
  };

  const handleFileSelection = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
  };

  const uploadDataToAPI = async () => {
    if (!file) {
      alert("Please select a file before uploading.");
      return;
    }

    try {
      setLoading(true);
      const reader = new FileReader();
      reader.onload = (event) => {
        const binaryStr = event.target.result;
        const workbook = XLSX.read(binaryStr, { type: "binary" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const data = XLSX.utils.sheet_to_json(sheet);
        setUploadedData(data);

        axios
          .post(`http://localhost:5000/api/admin/uploadData?organizationName=${organizationName}`, data, {
            headers: { "Content-Type": "application/json" },
          })
          .then(() => {
            alert("Data uploaded successfully!");
            fetchDataFromAPI();
          })
          .catch((error) => {
            console.error("Error uploading data:", error);
            alert("Failed to upload data.");
          })
          .finally(() => {
            setLoading(false);
            setFile(null);
          });
      };
      reader.readAsBinaryString(file);
    } catch (error) {
      console.error("Error reading file:", error);
      setLoading(false);
    }
  };

  const fetchDataFromAPI = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `http://localhost:5000/api/admin/getData?organizationName=${organizationName}`
      );
      setFetchedData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      alert("Failed to fetch data.");
    } finally {
      setLoading(false);
    }
  };

  const handleSendLink = async (email) => {
    if (selectedQuestions.length === 0) {
      alert("Please select or add at least one question.");
      return;
    }

    try {
      await axios.post(
        `http://localhost:5000/api/admin/sendLink?organizationName=${organizationName}`,
        {
          email,
          questions: selectedQuestions,
        }
      );
      alert(`Link sent to ${email} with selected questions.`);
    } catch (error) {
      console.error("Error sending link:", error);
      alert("Failed to send link.");
    }
  };

  const handleAddCustomQuestion = () => {
    if (customQuestion.trim()) {
      setSelectedQuestions((prev) => [...prev, customQuestion.trim()]);
      setCustomQuestion("");
    }
  };

  return (
    <div>
      <h2>Upload Excel File</h2>
      <input type="file" accept=".xlsx, .xls" onChange={handleFileSelection} />
      <button onClick={uploadDataToAPI} disabled={loading}>
        {loading ? "Uploading..." : "Upload Data"}
      </button>
      {loading && <p>Loading...</p>}

      {fetchedData.length > 0 && (
        <div>
          <h3>Fetched Data:</h3>
          <table border="1">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Mobile</th>
                <th>Performance</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {fetchedData.map((item, index) => (
                <tr key={index}>
                  <td>{item.name}</td>
                  <td>{item.email}</td>
                  <td>{item.mobile}</td>
                  <td>
                    <ul>
                      <li>Feature 1: {item.performance?.feature1}</li>
                      <li>Feature 2: {item.performance?.feature2}</li>
                      <li>Feature 3: {item.performance?.feature3}</li>
                      <li>Feature 4: {item.performance?.feature4}</li>
                    </ul>
                  </td>
                  <td>
                    <div>
                      <select
                        multiple
                        onChange={(e) =>
                          setSelectedQuestions(
                            Array.from(e.target.selectedOptions, (option) => option.value)
                          )
                        }
                      >
                        {questions.map((question, i) => (
                          <option key={i} value={question}>
                            {question}
                          </option>
                        ))}
                      </select>
                      <input
                        type="text"
                        placeholder="Add custom question"
                        value={customQuestion}
                        onChange={(e) => setCustomQuestion(e.target.value)}
                      />
                      <button onClick={handleAddCustomQuestion}>Add Question</button>
                      <button onClick={() => handleSendLink(item.email)}>Send Link</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Home;
