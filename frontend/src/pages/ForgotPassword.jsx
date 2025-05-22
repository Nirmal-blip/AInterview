

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Shield, Mail, Lock, ChevronRight } from "lucide-react";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const sendOtp = async () => {
    if (!email) {
      toast.error("Please enter your email.");
      return;
    }

    try {
      setLoading(true);
      await axios.post(
        "http://localhost:5000/api/auth/send-otp",
        { email, reason: "forgot-password" },
        { withCredentials: true }
      );
      setOtpSent(true);
      toast.success("OTP sent to your email.");
    } catch (error) {
      toast.error("Error sending OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    if (!otp) {
      toast.error("Please enter the OTP.");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(
        "http://localhost:5000/api/auth/verify-otp",
        { email, otp },
        { withCredentials: true }
      );
      if (response.data.verified) {
        setOtpVerified(true);
        toast.success("OTP verified. You can now reset your password.");
      } else {
        toast.error("Invalid OTP. Please try again.");
      }
    } catch (error) {
      toast.error("Error verifying OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!newPassword || !confirmPassword) {
      toast.error("Please fill in all password fields.");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match. Please try again.");
      return;
    }

    try {
      setLoading(true);
      await axios.post(
        "http://localhost:5000/api/auth/reset-password",
        { email, newPassword },
        { withCredentials: true }
      );
      toast.success("Password reset successfully! You can now log in.");
      navigate("/login");
    } catch (error) {
      toast.error("Error resetting password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="w-full">
        <Navbar />
      </div>
      <div className="relative min-h-screen bg-black flex items-center justify-center p-4 overflow-hidden">
        <Toaster />
        
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute w-full h-full">
            <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-blue-500 rounded-full filter blur-3xl opacity-20 animate-pulse" />
            <div className="absolute top-1/3 right-1/4 w-32 h-32 bg-purple-500 rounded-full filter blur-3xl opacity-20 animate-pulse delay-700" />
            <div className="absolute bottom-1/4 left-1/3 w-32 h-32 bg-cyan-500 rounded-full filter blur-3xl opacity-20 animate-pulse delay-1000" />
          </div>
          
          {/* Grid overlay */}
          <div className="absolute inset-0" 
               style={{
                 backgroundImage: 'linear-gradient(rgba(17, 17, 17, 0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(17, 17, 17, 0.8) 1px, transparent 1px)',
                 backgroundSize: '50px 50px',
                 opacity: '0.2'
               }} />
        </div>
  
        {/* Forgot Password Form Card */}
        <div className="relative w-full max-w-md">
          <div className="relative bg-black/40 backdrop-blur-xl rounded-2xl border border-white/10 p-8 shadow-2xl overflow-hidden">
            {/* Animated border */}
            <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-transparent via-blue-500 to-transparent animate-pulse" />
            <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-transparent via-purple-500 to-transparent animate-pulse delay-300" />
            <div className="absolute inset-y-0 left-0 w-0.5 bg-gradient-to-b from-transparent via-blue-500 to-transparent animate-pulse delay-500" />
            <div className="absolute inset-y-0 right-0 w-0.5 bg-gradient-to-b from-transparent via-purple-500 to-transparent animate-pulse delay-700" />
  
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                Forgot Password
              </h1>
            </div>
  
            {!otpVerified && (
              <>
                <div className="mb-5">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="w-full bg-white/5 text-white border border-white/10 rounded-lg px-4 py-3 
                               outline-none focus:border-blue-400/50 focus:bg-white/10
                               transition-all duration-300 placeholder-white/30"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
  
                {otpSent ? (
                  <div className="mb-5">
                    <input
                      type="text"
                      placeholder="Enter OTP"
                      className="w-full bg-white/5 text-white border border-white/10 rounded-lg px-4 py-3 
                                 outline-none focus:border-purple-400/50 focus:bg-white/10
                                 transition-all duration-300 placeholder-white/30"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      required
                    />
                    <button
                      onClick={verifyOtp}
                      disabled={loading}
                      className="w-full relative group mt-3"
                    >
                      <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg blur opacity-60 group-hover:opacity-100 transition duration-500" />
                      <div className={`relative flex items-center justify-center px-4 py-3 bg-black rounded-lg
                                      ${loading ? "cursor-not-allowed" : "cursor-pointer"}`}>
                        {loading ? (
                          <div className="flex items-center space-x-2">
                            <div className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin" />
                            <span className="text-white">Verifying...</span>
                          </div>
                        ) : (
                          <span className="text-white font-medium">Verify OTP</span>
                        )}
                      </div>
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={sendOtp}
                    disabled={loading}
                    className="w-full relative group"
                  >
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg blur opacity-60 group-hover:opacity-100 transition duration-500" />
                    <div className={`relative flex items-center justify-center px-4 py-3 bg-black rounded-lg
                                    ${loading ? "cursor-not-allowed" : "cursor-pointer"}`}>
                      {loading ? (
                        <div className="flex items-center space-x-2">
                          <div className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin" />
                          <span className="text-white">Sending...</span>
                        </div>
                      ) : (
                        <span className="text-white font-medium">Send OTP</span>
                      )}
                    </div>
                  </button>
                )}
              </>
            )}
  
            {otpVerified && (
              <>
                <div className="mb-5">
                  <input
                    type="password"
                    placeholder="Enter new password"
                    className="w-full bg-white/5 text-white border border-white/10 rounded-lg px-4 py-3 
                               outline-none focus:border-blue-400/50 focus:bg-white/10
                               transition-all duration-300 placeholder-white/30"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-5">
                  <input
                    type="password"
                    placeholder="Confirm new password"
                    className="w-full bg-white/5 text-white border border-white/10 rounded-lg px-4 py-3 
                               outline-none focus:border-purple-400/50 focus:bg-white/10
                               transition-all duration-300 placeholder-white/30"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
                <button
                  onClick={handleResetPassword}
                  disabled={loading}
                  className="w-full relative group"
                >
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg blur opacity-60 group-hover:opacity-100 transition duration-500" />
                  <div className={`relative flex items-center justify-center px-4 py-3 bg-black rounded-lg
                                  ${loading ? "cursor-not-allowed" : "cursor-pointer"}`}>
                    {loading ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin" />
                        <span className="text-white">Resetting...</span>
                      </div>
                    ) : (
                      <span className="text-white font-medium">Reset Password</span>
                    )}
                  </div>
                </button>
              </>
            )}
  
            <div className="text-center mt-4">
              <Link
                to="/login"
                className="text-white/50 hover:text-blue-400 transition-colors duration-300"
              >
                Back to Login
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Footer path="/footer" />
    </>
  );
};

export default ForgotPassword;
