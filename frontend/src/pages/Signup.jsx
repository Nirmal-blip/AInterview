import React, { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import Navbar from '../components/Navbar';
import Footer from "../components/Footer";
import { useAuthContext } from "../context/Authcontext";
import { Shield, Mail, Lock, Building, ChevronRight } from "lucide-react";

const Signup = () => {
  const [formData, setFormData] = useState({
    company_name: "",
    company_email: "",
    password: "",
    confirm_password: ""
  });
  const navigate = useNavigate();
  const { setAuthuser } = useAuthContext();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    if(!formData.company_name || !formData.company_email || !formData.password || !formData.confirm_password){
      toast.error("All fields are required.");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.company_email)) {
      toast.error("Invalid email format.");
      return false;
    }
    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters long.");
      return false;
    }
    if (formData.password !== formData.confirm_password) {
      toast.error("Passwords do not match.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      setLoading(true);
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
        credentials: "include",
      });
      const result = await response.json();
      if (response.ok) {
        setLoading(false);
        localStorage.setItem("company-admin", JSON.stringify(result));
        setAuthuser(result);
        toast.success("Signup successful!", {
          position: "top-center",
          duration: 5000,
        });
        navigate("/admin-dashboard");
      } else {
        setLoading(false);
        toast.error(result.message || "Signup failed.");
      }
    } catch (error) {
      setLoading(false);
      console.error("Signup error:", error);
      toast.error("An error occurred. Please try again.");
    }
  };

  return (
    <>
      <div className="w-full">
        <Navbar />
      </div>
      <div className="rrelative min-h-screen bg-gradient-to-b from-[#000814] to-[#010814] flex items-center justify-center p-4 overflow-hidden">
        <Toaster />
        
        {/* Background Video */}
         <div className="absolute inset-0 overflow-hidden">
          {/* Foreground Video */}
  
  <video
     src="../src/assets/login.mp4" 
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

        {/* Signup Form Card */}
        <div className={`relative mt-[140px] pt-0 w-full max-w-md transform transition-all duration-1000 ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="relative bg-black/40 backdrop-blur-xl rounded-2xl border border-white/10 p-4 pl-8 pr-8 shadow-2xl overflow-hidden">

             {/* Animated border */}
            <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-transparent via-[#ffff] to-transparent animate-pulse" />
            <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-transparent via-[#ffff] to-transparent animate-pulse delay-300" />
            <div className="absolute inset-y-0 left-0 w-0.5 bg-gradient-to-b from-transparent via-[#ffff] to-transparent animate-pulse delay-500" />
            <div className="absolute inset-y-0 right-0 w-0.5 bg-gradient-to-b from-transparent via-[#ffff] to-transparent animate-pulse delay-700" />
            
            {/* Header */}
            <div className="text-center mb-4">
                          <div className="flex justify-center mb-4">
                            <Shield className="w-10 h-10 text-white animate-pulse" />
                          </div>
               <h1 className="text-3xl font-bold bg-gradient-to-r from-[#ffffff]  to-[#3e3e3e] bg-clip-text pb-2 text-transparent">
                Sign Up
              </h1>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                {/* Company Name Input */}
                <div className="relative group">
                  <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/30 group-hover:text-white transition-colors duration-300" />
                  <input
                    type="text"
                    name="company_name"
                    value={formData.company_name}
                    onChange={handleChange}
                    className="w-full bg-white/5 text-white border border-white/10 rounded-lg pl-12 pr-4 py-3 
                             outline-none focus:border-blue-400/50 focus:bg-white/10
                             transition-all duration-300 placeholder-white/30"
                    placeholder="Company Name"
                    required
                  />
                  <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-black to-white group-hover:w-full transition-all duration-500" />
                </div>

                {/* Email Input */}
                <div className="relative group">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/30 group-hover:text-white transition-colors duration-300" />
                  <input
                    type="text"
                    name="company_email"
                    value={formData.company_email}
                    onChange={handleChange}
                    className="w-full bg-white/5 text-white border border-white/10 rounded-lg pl-12 pr-4 py-3 
                             outline-none focus:border-purple-400/50 focus:bg-white/10
                             transition-all duration-300 placeholder-white/30"
                    placeholder="Company Email"
                    required
                  />
                  <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-black to-white group-hover:w-full transition-all duration-500" />
                </div>

                {/* Password Input */}
                <div className="relative group">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/30 group-hover:text-cyan-400 transition-colors duration-300" />
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full bg-white/5 text-white border border-white/10 rounded-lg pl-12 pr-4 py-3 
                             outline-none focus:border-cyan-400/50 focus:bg-white/10
                             transition-all duration-300 placeholder-white/30"
                    placeholder="Password"
                    required
                  />
                  <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-black to-white group-hover:w-full transition-all duration-500" />
                </div>

                {/* Confirm Password Input */}
                <div className="relative group">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/30 group-hover:text-blue-400 transition-colors duration-300" />
                  <input
                    type="password"
                    name="confirm_password"
                    value={formData.confirm_password}
                    onChange={handleChange}
                    className="w-full bg-white/5 text-white border border-white/10 rounded-lg pl-12 pr-4 py-3 
                             outline-none focus:border-blue-400/50 focus:bg-white/10
                             transition-all duration-300 placeholder-white/30"
                    placeholder="Confirm Password"
                    required
                  />
                  <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-black to-white group-hover:w-full transition-all duration-500" />
                </div>
              </div>

              {/* Link */}
              <div className="text-sm">
                <Link 
                  to="/login" 
                  className="text-white/50 hover:text-white transition-colors duration-300 flex items-center"
                >
                  Already have an account? Login <ChevronRight className="w-4 h-4 ml-1" />
                </Link>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full relative group"
              >
                 <div className="absolute -inset-0.5 bg-gradient-to-r from-white via-[#646262] to-white rounded-lg blur opacity-60 group-hover:opacity-100 transition duration-500" />
                <div className={`relative flex items-center justify-center px-4 py-3 bg-black  hover:bg-white rounded-lg
                                ${loading ? "cursor-not-allowed" : "cursor-pointer"}`}>
                  {loading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin" />
                      <span className="text-white hover:text-black">Signing up...</span>
                    </div>
                  ) : (
                    <span className="text-white font-medium
                    group-hover:text-black hover:font-medium">Sign Up</span>
                  )}
                </div>
              </button>
            </form>
          </div>
        </div>
      </div>
      <Footer path='/footer' />
    </>
  );
};

export default Signup;