import React, { useState, useEffect, useCallback } from "react";
import * as XLSX from "xlsx";
import axios from "axios";
import toast from "react-hot-toast";
import "./AdminDashboard.css";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../../context/Authcontext";
import AudioRecorder from "../AudioRecorder";
import { FaBars, FaTimes, FaHome } from 'react-icons/fa';

import { Button, Card, CardActionArea, CardContent, Typography, Container, Grid } from "@mui/material";
import { motion } from "framer-motion";


const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("company-info");
  const [file, setFile] = useState(null);
  const [students, setStudents] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const {setAuthuser}=useAuthContext();
  const navigate = useNavigate();
  const fetchStudents = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/students",{withCredentials:true});
      setStudents(response.data.students);
    } catch (error) {
      console.error("Error fetching students:", error);
      toast.error("Failed to fetch students.");
    }
  };

  useEffect(() => {
    if (activeTab === "upload") {
      fetchStudents();
    }
  }, [activeTab]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      toast.error("Please select a file.");
      return;
    }

    const reader = new FileReader();
    reader.onload = async (event) => {
      const data = event.target.result;
      const workbook = XLSX.read(data, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

      // Validate required columns
      const requiredColumns = ["student_name", "email", "phone_number"];
      const missingColumns = requiredColumns.filter(
        (col) => !Object.keys(sheetData[0] || {}).includes(col)
      );

      if (missingColumns.length > 0) {
        toast.error(`Missing columns: ${missingColumns.join(", ")}`);
        return;
      }
      try {
        const response = await axios.post(
          "http://localhost:5000/api/students/upload",
          { students: sheetData },
          {withCredentials:true},
          { headers: { "Content-Type": "application/json" } }
        );
        if (response.status === 200) {
          toast.success("Students uploaded successfully!");
          fetchStudents(); // Refresh table data
          setFile(null);
        } else {
          toast.error("Failed to upload students.");
        }
      } catch (error) {
        console.error("Error uploading students:", error);
        toast.error("An error occurred. Please try again.");
      }
    };
    reader.readAsBinaryString(file);
  };
  const handleLogout = useCallback(async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/logout",
        {},
        { withCredentials: true }
      );

      if (response.status === 200) {
        toast.success("Logged out successfully!", { position: "top-center", duration: 5000 });
        localStorage.removeItem("GYM-ADMIN");
        setAuthuser(null);
        navigate("/login");
      } else {
        toast.error("Logout failed. Please try again.");
      }
    } catch (error) {
      console.error("Logout error:", error);
      toast.error(error.response?.data?.message || "An error occurred. Please try again.");
    }
  }, [navigate, setAuthuser]);

  const handleSendLink = async (student) => {
    try {
      await axios.post(
        `http://localhost:5000/api/students/send-link`,
        { studentId: student._id },
        {withCredentials:true},
        { headers: { "Content-Type": "application/json" } }
      );
      toast.success(`Link sent to ${student.email}!`);
    } catch (error) {
      console.error("Error sending link:", error);
      toast.error("Failed to send link.");
    }
  };

  const handleBackToHome = () => {
    navigate('/home');
  };

  const renderContent = () => {
    switch (activeTab) {
      case "company-info":
        return  <AudioRecorder/>;
      case "roles":
        return <div>Roles Content</div>;
      case "reports":
        return <div>Reports Content</div>;
      case "upload":
        return (
          <div>
            <h3>Upload Excel Sheet</h3>
            <form onSubmit={handleUpload}>
              <input type="file" accept=".xlsx, .xls" onChange={handleFileChange} />
              <button type="submit">Upload</button>
            </form>
            <h3>Uploaded Student Data</h3>
            <table border="1">
              <thead>
                <tr>
                  <th>Student Name</th>
                  <th>Email</th>
                  <th>Phone Number</th>
                  <th>Unique Link</th>
                  <th>Tech Stack</th>
                  <th>Send Link</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr key={student._id}>
                    <td>{student.student_name}</td>
                    <td>{student.email}</td>
                    <td>{student.phone_number}</td>
                    <td>{student.unique_link}</td>
                    <td>Full Stack</td> {/* Example tech stack */}
                    <td>
                      <button onClick={() => handleSendLink(student)}>Send Link</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      case "payment-options":
        return <div>Payment Options Content</div>;
      default:
        return <div>Welcome to the Admin Dashboard</div>;
    }
  };
  const roles = [
    "Software Engineer",
    "MERN Stack",
    "React Developer",
    "Data Scientist",
    "Product Manager",
    "UI/UX Designer",
    "Marketing Analyst",
    "HR Recruiter",
    "DevOps Engineer",
    "Business Analyst",
  ];
  const [selectedRoles, setSelectedRoles] = useState([]);
  

  const toggleRole = (role) => {
    setSelectedRoles((prev) =>
      prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role]
    );
  };

  const handleNext = () => {
    if (selectedRoles.length > 0) {
      navigate("/admin-dashboard/import-students", { state: { selectedRoles } });
    } else {
      alert("Please select at least one role");
    }
  };

  return (
    <div className="admin-dashboard relative">
      {/* Mobile Sidebar Toggle */}
      <button 
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="md:hidden fixed top-4 left-4 z-50 bg-gray-800 text-white p-2 rounded"
      >
        {isSidebarOpen ? <FaTimes /> : <FaBars />}
      </button>

      {/* Back to Home Button */}
      <button 
        onClick={handleBackToHome}
        className="fixed top-4 right-4 z-50 bg-gray-800 text-white p-2 rounded flex items-center"
      >
        <FaHome />
      </button>

      <aside 
        className={`sidebar 
          fixed 
          md:relative 
          top-0 
          left-0 
          h-full 
          w-64 
          bg-gray-800 
          text-white 
          transform 
          transition-transform 
          duration-300 
          ease-in-out 
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0 
          z-40
        `}
      >
        <ul className="p-4">
          <li 
            onClick={() => {
              setActiveTab("company-info");
              setIsSidebarOpen(false);
            }} 
            className="p-2 hover:bg-gray-700 cursor-pointer"
          >
            Company Info
          </li>
          <li 
            onClick={() => {
              setActiveTab("roles");
              setIsSidebarOpen(false);
            }} 
            className="p-2 hover:bg-gray-700 cursor-pointer"
          >
            Roles
          </li>
          <li 
            onClick={() => {
              setActiveTab("reports");
              setIsSidebarOpen(false);
            }} 
            className="p-2 hover:bg-gray-700 cursor-pointer"
          >
            Reports
          </li>
          <li 
            onClick={() => {
              setActiveTab("upload");
              setIsSidebarOpen(false);
            }} 
            className="p-2 hover:bg-gray-700 cursor-pointer"
          >
            Upload
          </li>
          <li 
            onClick={() => {
              setActiveTab("payment-options");
              setIsSidebarOpen(false);
            }} 
            className="p-2 hover:bg-gray-700 cursor-pointer"
          >
            Payment Options
          </li>
          <li 
            onClick={handleLogout} 
            className="p-2 hover:bg-gray-700 cursor-pointer"
          >
            Logout
          </li>
        </ul>
      </aside>

     {/* <main 
        className="content 
          md:pl-64 
          p-4 
          transition-all 
          duration-300 
          ease-in-out 
          mt-16
        "
        onClick={() => setIsSidebarOpen(false)}
      >
        {renderContent()}
      </main>*/}
       <Container maxWidth="md" className="flex flex-col items-center justify-center min-h-screen p-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <Typography variant="h4" gutterBottom>Select Interview Roles</Typography>
      </motion.div>
      
      <Grid container spacing={2} justifyContent="center">
        {roles.map((role) => (
          <Grid item xs={6} sm={4} md={3} key={role}>
            <Card
              onClick={() => toggleRole(role)}
              sx={{
                border: selectedRoles.includes(role) ? "2px solid #1976d2" : "1px solid #ccc",
                backgroundColor: selectedRoles.includes(role) ? "#e3f2fd" : "#fff",
                transition: "0.3s",
              }}
            >
              <CardActionArea>
                <CardContent>
                  <Typography align="center" variant="body1">{role}</Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
      
      <Button
        onClick={handleNext}
        variant="contained"
        color="primary"
        sx={{ mt: 4 }}
      >
        Next
      </Button>
    </Container>


    </div>
  );
};

export default AdminDashboard;
