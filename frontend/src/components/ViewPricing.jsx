import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import Navbar from './Navbar';
import Footer from "../components/Footer";
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Typography,
} from '@mui/material';
import { FaChalkboardTeacher, FaBrain, FaClipboardList } from 'react-icons/fa';
import { useAuthContext } from '../context/Authcontext';

const ViewPricing = () => {
  const { Authuser } = useAuthContext();
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [hoveredCard, setHoveredCard] = useState(null);

  const plans = [
    {
      name: 'Basic Plan',
      price: 5000,
      credits: 100,
      info: 'Get started with our AI Interview Assistant for basic interview preparation and practice.',
      icon: <FaClipboardList size={40} className="text-cyan-400" />,
      details: 'Perfect for individuals preparing for entry-level job interviews.',
      gradient: 'from-cyan-500 via-cyan-400 to-blue-500'
    },
    {
      name: 'Pro Plan',
      price: 10000,
      credits: 250,
      info: 'Enhance your skills with detailed analytics and personalized interview tips.',
      icon: <FaBrain size={40} className="text-purple-400" />,
      details: 'Ideal for professionals looking to level up their interview performance.',
      gradient: 'from-purple-500 via-purple-400 to-pink-500'
    },
    {
      name: 'Elite Plan',
      price: 20000,
      credits: 600,
      info: 'Unlock exclusive features, including expert feedback and industry-specific preparation.',
      icon: <FaChalkboardTeacher size={40} className="text-blue-400" />,
      details: 'Best for individuals targeting senior-level or specialized roles.',
      gradient: 'from-blue-500 via-indigo-400 to-violet-500'
    },
  ];

  const handleBuyNow = (plan) => {
    setSelectedPlan(plan.name);
    if (!Authuser) {
      setOpenDialog(true);
    } else if (Authuser.PaidByAdmin) {
      toast('You have already purchased a subscription.', {
        position: 'top-center',
        duration: 5000,
        icon: 'ℹ️',
      });
    } else {
      toast.success(`Redirecting to payment for ${plan.name} plan`);
      navigate('/admin-dashboard');
    }
  };

  const handleDialogClose = () => setOpenDialog(false);
  const navigateToSignup = () => {
    navigate('/signup');
    setOpenDialog(false);
  };
  const navigateToLogin = () => {
    navigate('/login');
    setOpenDialog(false);
  };

  return (
    <>
      <div className="w-full">
        <Navbar />
      </div>
      <div className="min-h-screen bg-gradient-to-r from-[#000814] to-[#010814] flex flex-col items-center p-8 relative overflow-hidden">
        {/* Enhanced Cyberpunk Background */}
        <div className="absolute inset-0">
          {/* Background Video */}
         <video src="../public/videos/pricing.mp4" autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover blur-md" ></video>
        </div>

        <Toaster />
        
        {/* Enhanced Title */}
        <div className="relative z-10 text-center mb-10 mt-12 animate-fadeIn">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 relative">
            <span className="bg-gradient-to-r from-[#666262] via-white to-[#3b3939] bg-clip-text text-transparent
              animate-gradient-x">
              Choose Your Plan
            </span>
            <div className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#fff] to-transparent
              animate-pulse" />
          </h1>
          <p className="text-gray-400 text-lg animate-fadeIn opacity-0" style={{ animationDelay: '0.5s' }}>
            Unlock the power of AI-driven interview preparation
          </p>
        </div>

        {/* Enhanced Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 relative z-10 w-full max-w-7xl">
          {plans.map((plan, index) => (
            <div
              key={plan.name}
              className="relative transform transition-all duration-500 hover:scale-105"
              onMouseEnter={() => setHoveredCard(index)}
              onMouseLeave={() => setHoveredCard(null)}
              style={{
                animationDelay: `${index * 0.2}s`
              }}
            >
              {/* Animated border with glow effect */}
              <div className={`absolute -inset-0.5 bg-gradient-to-r ${plan.gradient} rounded-2xl opacity-75 
                blur group-hover:opacity-100 animate-gradient-xy transition-all duration-300
                ${hoveredCard === index ? 'opacity-100 blur-md' : 'opacity-75 blur-sm'}`} />
              
              {/* Card Content with Glass Effect */}
              <div className="group relative h-full bg-black/80 backdrop-blur-xl rounded-2xl p-6 border border-white/10
                shadow-xl transition-all  duration-300 hover:cursor-pointer">
                {/* Floating Icon */}
                <div className={`flex justify-center mb-8 transform transition-all duration-500
                  ${hoveredCard === index ? 'scale-110 -translate-y-2' : ''}`}>
                  <div className="relative">
                    {plan.icon}
                    <div className={`absolute inset-0 blur-md opacity-50 ${hoveredCard === index ? 'scale-150' : 'scale-100'}`}>
                      {plan.icon}
                    </div>
                  </div>
                </div>
                
                {/* Plan Details with Enhanced Typography */}
                <h2 className="text-4xl font-bold bg-gradient-to-tr from-[#ffff] via-[#848484] to-white bg-clip-text text-transparent mb-6 hover:cursor-pointer group-hover:text-white text-center">{plan.name}</h2>
                <p className="text-lg text-gray-300 mb-6 min-h-[80px]">{plan.info}</p>
                <p className="text-sm text-gray-400 mb-6 min-h-[60px]">{plan.details}</p>
                
                <div className="mt-auto space-y-6">
                  {/* Credits Counter with Animation */}
                  <div className="flex items-center justify-center space-x-2">
                    <span className="text-gray-400">Credits:</span>
                    <span className="font-mono text-xl text-cyan-400 animate-pulse">{plan.credits}</span>
                  </div>
                  
                  {/* Price with Floating Effect */}
                  <div className="text-center">
                    <p className="text-4xl font-bold">
                      <span className={`bg-gradient-to-r ${plan.gradient} bg-clip-text text-transparent`}>
                        ₹{plan.price}
                      </span>
                    </p>
                  </div>
                  
                  {/* Enhanced Button */}
                  <button
                    onClick={() => handleBuyNow(plan)}
                    className="w-full relative group/btn overflow-hidden rounded-xl transition-all  duration-300"
                  >
                    <div className={`absolute inset-0 bg-gradient-to-r ${plan.gradient}  opacity-70
                      group-hover/btn:opacity-100 transition-opacity duration-300`} />
                    <div className="relative px-6 py-3 bg-black/50 backdrop-blur-sm rounded-xl
                      group-hover/btn:bg-transparent transition-all duration-300">
                      <span className="text-lg font-medium text-white group-hover/btn:text-white">
                        Get Started
                      </span>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

       <Dialog
  open={openDialog}
  onClose={handleDialogClose}
  BackdropProps={{
    className: "backdrop-blur-xl bg-black/30", // this creates the blur and semi-transparent dark effect
  }}
  PaperProps={{
    sx:{
      backgroundColor: "rgba(15, 234, 255, 0.1)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    borderRadius: "10px",
    padding: "24px",
    backdropFilter: "blur(10px)",
    }
     
  }}
>
  
  <DialogTitle className="text-3xl font-bold text-white text-center border-b border-blue-500/20 pb-4">
    Proceed to Payment
  </DialogTitle>
  <DialogContent className="my-6">
    <Typography className="text-gray-300 text-center">
      Please sign up if you are not a member or log in to continue with the payment.
    </Typography>
  </DialogContent>
  <DialogActions className="justify-center space-x-4 border-t border-blue-500/20  pt-4">

    <Button
      onClick={navigateToSignup}
        color="inherit"
      className="bg-gradient-to-r  from-[#605f5f] to-[#fffefe] text-white px-6 py-2 rounded-lg
        hover:from-white hover:to-white transition-all duration-300"
    >
      Sign Up
    </Button>
    <Button
      onClick={navigateToLogin}
       color="inherit"
      
      className="bg-gradient-to-r from-[#4b4949] to-white text-white px-6 py-2 rounded-lg
         hover:from-white hover:to-white transition-all duration-300"
    >
      Log In
    </Button>
  </DialogActions>
</Dialog>

      </div>

      <style jsx>{`
        @keyframes slide {
          0% { transform: translateX(-100%) rotate(45deg); }
          100% { transform: translateX(200%) rotate(45deg); }
        }
        
        @keyframes gradient-x {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        @keyframes gradient-xy {
          0%, 100% { background-position: 0% 0%; }
          50% { background-position: 100% 100%; }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .animate-gradient-x {
          animation: gradient-x 15s linear infinite;
          background-size: 200% auto;
        }

        .animate-gradient-xy {
          animation: gradient-xy 15s linear infinite;
          background-size: 200% 200%;
        }

        .animate-fadeIn {
          animation: fadeIn 1s ease-out forwards;
        }
      `}</style>
      
      <Footer path="/footer" />
    </>
  );
};

export default ViewPricing;