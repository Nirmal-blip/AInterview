import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { useAuthContext } from "../../context/Authcontext";
import Navbar from "../../components/Navbar";
import { Shield, Mail, Lock, ChevronRight } from "lucide-react";
const IntervieweeLogin = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const location=useLocation();
  const { setAuthInterviewee}=useAuthContext();
  const {DB_name,id}=location.state || {};
  console.log(DB_name,id);
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await fetch("http://localhost:5000/api/auth/student-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({db_name:DB_name,email:formData.email,password:formData.password}),
        credentials: "include",
      });
      const result = await response.json();
      if (response.ok) {
        setLoading(false);
        toast.success("Login successful!", {
          position: "top-center",
          duration: 4000,
        });
        localStorage.setItem("company-interviewee", JSON.stringify(result));
        setAuthInterviewee(result);
        navigate(`/interview/${id}/${DB_name}/locked`);
      } else {
        setLoading(false);
        toast.error(result.message || "Login failed");
      }
    } catch (error) {
      setLoading(false);
      console.error("Login error:", error);
      toast.error("An error occurred. Please try again.");
    }
  };

  return (
    <>
      <div className="w-full">
            <Navbar />
      </div>
       <div className="relative min-h-screen bg-gradient-to-b from-[#000814] to-[#010814] flex items-center justify-center p-4 overflow-hidden">
        <Toaster />
           
  
  {/* Background Video */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Foreground Video */}

  <video
     src="../src/assets/IntervieweeLogin.mp4" 
  autoPlay
  muted
  loop
  playsinline           
  aria-hidden="true"    
  className="absolute inset-0 w-full h-full object-cover" 
  ></video>
 
  {/* Name */}

          <h1 className=" lg:text-5xl font-bold leading-[1.1]  mt-28 block bg-gradient-to-r from-[#000000] via-white to-[#000000] bg-clip-text text-transparent drop-shadow-none  text-[48px] ">
            AInterview Assistant
          </h1>
          </div>

    
        <div className="relative z-10 flex items-center justify-center min-h-screen bg-opacity-50">
          <div className=" bg-black/80 hover:bg-black/90 backdrop-blur-xl border border-white/10 shadow-lg rounded-2xl mt-28 pt-4 p-12 max-w-md w-full">
              {/* Animated border */}
            <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-transparent via-[#ffff] to-transparent animate-pulse" />
            <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-transparent via-[#ffff] to-transparent animate-pulse delay-300" />
            <div className="absolute inset-y-0 left-0 w-0.5 bg-gradient-to-b from-transparent via-[#ffff] to-transparent animate-pulse delay-500" />
            <div className="absolute inset-y-0 right-0 w-0.5 bg-gradient-to-b from-transparent via-[#ffff] to-transparent animate-pulse delay-700" />

                {/* Header*/}
                <div className="text-center mb-8">
           <div className="flex justify-center mb-4">
                <Shield className="w-12 h-12 text-white animate-pulse" />
              </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-[#ffffff] via-[#929090]  to-[#8e8d8d] bg-clip-text pb-2 text-transparent mb-6">
              Interviewee Login
            </h1>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="mb-5">
                <label
                  htmlFor="email"
                  className="block text-white text-lg -700 mb-2 font-medium"
                >
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6e6c6c]"
                  placeholder="Enter your email"
                  required
                />
              </div>
              <div className="mb-5">
                <label
                  htmlFor="password"
                  className="block text-white mb-2 text-lg font-medium"
                >
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6e6c6c]"
                  placeholder="Enter your password"
                  required
                />
              </div>
              <button
                type="submit"
                
                className={`w-full py-3 bg-black text-white font-semibold rounded-lg hover:bg-white drop-shadow-[0_0_10px_white] hover:text-black transition duration-300 ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={loading}
              >
                {loading ? "Logging in..." : "Login"}
              </button>
            </form>
          </div>
        </div>
      </div>
   
    </>
  );
};

export default IntervieweeLogin;
