import React from 'react';
import Typewriter from 'typewriter-effect';
import {  FaUsers, FaHeadset, FaUser,FaChalkboardTeacher, FaProductHunt, FaChartLine, FaLock, FaRegChartBar, FaChartBar, FaUserCheck, FaCalendarAlt, FaComments, FaBrain, FaClipboardList } from 'react-icons/fa';
import { useState, useEffect } from 'react';
import {  FaSync } from 'react-icons/fa'; // Import the new icons
import Navbar from './Navbar';
import Footer from './Footer';
import HeroSection from './Hero';
const Home = () => {
    const [fade, setFade] = useState(false);
    useEffect(() => {
      setTimeout(() => setFade(true), 200);
    }, []);
  return (
    <>
    <div className="absolute top-0 -left-40 w-96 h-96 bg-indigo-500/30 rounded-full blur-3xl"></div>
      <div className="absolute top-40 right-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-20 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"></div>
    <div className="w-full">
        <Navbar />
      </div>
    <div className="font-sans">
    
      {/* Hero Section */}
      <section className="relative bg-center h-[120vh] items-center text-left text-white">
 < HeroSection />
  
</section>
   {/* What We Do Section */}
   <section className="relative py-24 bg-gradient-to-b from-[#000814] to-[#010814] overflow-hidden">
  
  {/* Enhanced background elements */}
  <div className="absolute inset-0">
    {/* Gradient mesh background */}
    {/* Foreground image */}
  <img
    src="../src/assets/WhatWedo.png"
    alt="Decorative foreground"
  />
    <div 
    
      className="absolute inset-0 opacity-5"
      style={{
        backgroundImage: `radial-gradient(circle at 2% 50%, rgba(59,130,246,0.1) 0%, transparent 25%),
                         radial-gradient(circle at 98% 30%, rgba(147,51,234,0.1) 0%, transparent 25%),
                         linear-gradient(rgba(59,130,246,0.05) 1px, transparent 1px),
                         linear-gradient(90deg, rgba(59,130,246,0.05) 1px, transparent 1px)`,
        backgroundSize: '80% 80%, 80% 80%, 40px 40px, 40px 40px',
        backgroundPosition: 'center center'
      }}
    />
    
    {/* Enhanced glowing elements */}
    <div className="absolute top-0 left-0 w-[800px] h-[800px] bg-blue-500/5 rounded-full blur-[150px] animate-pulse-slow"/>
    <div className="absolute bottom-0 right-0 w-[800px] h-[800px] bg-purple-500/5 rounded-full blur-[150px] animate-pulse-slow delay-700"/>
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/5 rounded-full blur-[130px] animate-pulse-slow delay-300"/>
  </div>

  <div className="container mx-auto text-center px-4 relative z-10">
    {/* Section Title with cyber effect */}
    <div className="relative mb-20 ">
      <h2 className="text-8xl font-bold block bg-gradient-to-r to-[#0f0f0f] via-[#fffcfc] from-[#0e0e0e] bg-clip-text text-transparent drop-shadow-none">
        What We Do
      </h2>
      <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-white via-gray-500 to-[#424040] rounded-full" />
    </div>

    {/* Grid of cyberpunk cards */}
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
     

      {[
        {
          icon: <FaUserCheck />,
          title: "AI-Powered Evaluation",
          description: "Leverage AI to analyze candidate responses, identify key skills, and provide objective scoring based on predefined criteria for a seamless interview process.",
          color: "from-[#ffff]/40  to-black/40"
        },
        {
          icon: <FaCalendarAlt />,
          title: "Interview Scheduling",
          description: "Streamline scheduling with automated tools that coordinate between candidates and interviewers, saving time and reducing manual effort.",
          color:"from-[#ffff]/40  to-black/40"
        },
        {
          icon: <FaComments />,
          title: "Real-Time Feedback",
          description: "Provide real-time guidance to interviewers during the session to ensure the right questions are asked and biases are minimized.",
          color: "from-[#ffff]/40  to-black/40"
        },
        {
          icon: <FaBrain />,
          title: "Skill Gap Analysis",
          description: "Identify candidate strengths and areas for improvement with comprehensive AI-driven insights into skills and potential gaps.",
          color: "from-[#ffff]/40  to-black/40"
        },
        {
          icon: <FaClipboardList />,
          title: "Interview Templates",
          description: "Access a library of customizable interview templates tailored for various roles, ensuring consistency and relevance in every interaction.",
          color: "from-[#ffff]/40  to-black/40"
        },
        {
          icon: <FaChartBar />,
          title: "Advanced Analytics",
          description: "Gain insights into hiring trends, candidate performance, and interview effectiveness with robust analytics and reporting tools.",
          color: "from-[#ffff]/40  to-black/40"
        }
      ].map((item, index) => (
        <div 
          key={index}
          className="group relative"
        >
          {/* Card outer glow and border */}
          <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl opacity-0 group-hover:opacity-100 blur-xl transition-all duration-500" />
          
          {/* Card content */}
          <div className="relative flex flex-col h-full bg-gray-900/60 backdrop-blur-xl border border-gray-800/50 rounded-2xl p-8 transition-all duration-300 group-hover:border-gray-700/50 group-hover:bg-gray-900/80">
            {/* Icon with gradient background */}
            <div className="mb-6 relative">
              <div className={`absolute inset-0 bg-gradient-to-r ${item.color} blur-lg opacity-75 rounded-xl`} />
              <div className="relative text-4xl text-white flex justify-center items-center w-16 h-16 mx-auto bg-gray-900/80 rounded-xl border border-gray-700/50">
                {item.icon}
              </div>
            </div>
            
            {/* Title with gradient text */}
            <h3 className="text-2xl font-semibold mb-4 text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white 
            goup-hover: via-[#615d5d]
            group-hover:to-black transition-all">
              {item.title}
            </h3>
            
            {/* Description with hover effect */}
            <p className="text-gray-400 group-hover:text-gray-300 transition-colors">
              {item.description}
            </p>

            {/* Animated corner accents */}
            <div className="absolute top-0 left-0 w-12 h-12 border-t border-l border-blue-500/30 rounded-tl-2xl opacity-0 group-hover:opacity-100 transition-all" />
            <div className="absolute bottom-0 right-0 w-12 h-12 border-b border-r border-purple-500/30 rounded-br-2xl opacity-0 group-hover:opacity-100 transition-all" />
          </div>
        </div>
      ))}
    </div>
  </div>

  {/* Add custom animations */}
  <style jsx>{`
    @keyframes pulse-slow {
      0%, 100% { opacity: 0.3; }
      50% { opacity: 0.6; }
    }

    .animate-pulse-slow {
      animation: pulse-slow 6s ease-in-out infinite;
    }
  `}</style>
</section>

     {/* Why Choose Us Section */}

<section className="relative bg-gradient-to-b from-[#000814] to-[#010814] text-white py-16 overflow-hidden">

  {/* 📸 Foreground background image, placed in front of gradient but behind content */}
  <img
    src="../src/assets/WhatWedo.png" // ✅ Replace with your actual image path
    alt="Visual Layer"
    className="absolute inset-0 w-full h-full object-cover opacity-70 z-0 pointer-events-none"
  />

  {/* Glowing background elements */}
  <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/5 rounded-full filter blur-3xl animate-[float_6s_ease-in-out_infinite] z-0" />
  <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple-500/5 rounded-full filter blur-3xl animate-[float_8s_ease-in-out_infinite] z-0" />

  {/* 🔒 Main Content Layer (z-10 keeps it above everything) */}
  <div className="container mx-auto flex flex-col md:flex-row items-center justify-center px-4 relative z-10">
    
    {/* Left Side: Image */}
    <div className="w-full md:w-1/2 flex justify-center mb-8 md:mb-0">
      <div className="relative w-4/5 md:w-3/4">
        <div className="absolute -inset-2 bg-gradient-to-r to-[#1d2329] via-[#0c223f] from-[#0f182e] rounded-xl opacity-75 animate-pulse" />
        <img
          src="../src/assets/AI Model 5.png"
          alt="AI Interview Assistant"
          className="relative rounded-xl border-2 border-blue-500/30 shadow-[0_0_30px_rgba(59,130,246,0.3)] transform transition-transform duration-300 hover:scale-105"
        />
      </div>
    </div>

    {/* Right Side: Text */}
    <div className="w-full md:w-1/2 text-center md:text-left mt-0 md:mt-0">
      <h2 className="text-7xl bg-gradient-to-r to-[#0f0f0f] via-[#9c9c9c] bg-clip-text text-transparent from-[#fffdfd]  pb-6 font-extrabold mb-2">
        <Typewriter
          onInit={(typewriter) => {
            typewriter
              .typeString('Why Choose Us?')
              .pauseFor(1000)
              .deleteAll()
              .typeString('Why Choose Us?')
              .pauseFor(1000)
              .start();
          }}
          options={{
            loop: true, 
            deleteSpeed: 80, 
            typeSpeed: 150, 
          }}
        />
      </h2>
      <p className="text-xl mb-8 max-w-xl mx-auto md:mx-0 text-white/70">
        Revolutionize your hiring process with AI-powered insights that go beyond traditional interview methods.
      </p>

      <div className="space-y-8">
        {/* Card 1 */}
        <div className="flex items-start group hover:bg-white/5 p-4 rounded-lg transition-all duration-300">
          <div className="mr-6 p-4 rounded-full bg-gradient-to-r from-[#b0afaf] via-[#504f4f] to-[#1b1a1a] text-white transform transition-transform group-hover:rotate-12">
            <FaUsers className="text-4xl" />
          </div>
          <div>
            <h3 className="text-3xl font-semibold mb-4 text-transparent bg-gradient-to-r from-[#fff9f9] via-[#8f8c8c] to-[#1b1a1a] bg-clip-text">
              Advanced Candidate Matching
            </h3>
            <p className="text-base text-white/70">
              Leverage AI to analyze candidate responses, soft skills, and cultural fit with unprecedented accuracy and depth.
            </p>
          </div>
        </div>

        {/* Card 2 */}
        <div className="flex items-start group hover:bg-white/5 p-4 rounded-lg transition-all duration-300">
          <div className="mr-6 p-4 rounded-full bg-gradient-to-r  from-[#b0afaf] via-[#504f4f] to-[#1b1a1a] text-white transform transition-transform group-hover:rotate-12">
            <FaSync className="text-4xl" />
          </div>
          <div>
            <h3 className="text-3xl font-semibold mb-4 text-transparent bg-gradient-to-r  from-[#fff9f9] via-[#8f8c8c] to-[#1b1a1a] bg-clip-text">
              Intelligent Integration
            </h3>
            <p className="text-base text-white/70">
              Seamlessly connect with existing HR platforms, ATS systems, and recruitment workflows for a unified hiring experience.
            </p>
          </div>
        </div>

        {/* Card 3 */}
        <div className="flex items-start group hover:bg-white/5 p-4 rounded-lg transition-all duration-300">
          <div className="mr-6 p-4 rounded-full bg-gradient-to-r  from-[#b0afaf] via-[#504f4f] to-[#1b1a1a] text-white transform transition-transform group-hover:rotate-12">
            <FaHeadset className="text-4xl" />
          </div>
          <div>
            <h3 className="text-3xl font-semibold mb-4 text-transparent bg-gradient-to-r from-[#fff9f9] via-[#8f8c8c] to-[#1b1a1a] bg-clip-text">
              Continuous AI Support
            </h3>
            <p className="text-base text-white/70">
              Get real-time insights, automated candidate scoring, and intelligent recommendations throughout the recruitment process.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

{/* How It Works Section */}

<section className="relative min-h-screen bg-gradient-to-b from-[#000814] to-[#010814] overflow-hidden py-16">
  {/* Futuristic animated background */}
  <div className="absolute inset-0">
    {/* Animated gradient mesh */}
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(50,50,255,0.1),rgba(0,0,0,0))] animate-[pulse_4s_ease-in-out_infinite]" />
    
    {/* Hexagonal grid pattern */}
    <div 
      className="absolute inset-0 opacity-20"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0l25.98 15v30L30 60 4.02 45V15z' fill-opacity='0.2' fill='%234A5568'/%3E%3C/svg%3E")`,
        backgroundSize: '60px 60px',
      }}
    />
     <div 
      className="absolute inset-0 opacity-20"
      style={{
        backgroundImage: `url("../src/assets/WhatWedo.png")`,
        backgroundSize: '100%',
        backgroundRepeat: 'no-repeat',
      }}
    />
      <div 
      className="absolute inset-0 opacity-20"
      style={{
        backgroundImage: `url("../src/assets/WhatWedo.png")`,
        backgroundSize: '100%',
        backgroundRepeat: 'no-repeat',
      }}
    />
    {/* Animated scan lines */}
    <div 
      className="absolute inset-0 bg-repeat-y opacity-5"
      style={{
        backgroundImage: 'linear-gradient(0deg, transparent 0%, transparent 49%, rgba(255,255,255,.1) 50%, transparent 51%, transparent 100%)',
        backgroundSize: '100% 4px',
        animation: 'scanlines 1s linear infinite',
      }}
    />
  </div>

  <div className="container mx-auto px-4 relative z-10 flex flex-col lg:flex-row  items-center justify-between">
    {/* Left: Cards Section */}
    <div className="w-full lg:w-2/3">
      {/* Title */}
      <h3 className="text-3xl lg:ml-[30%] font-medium text-white/60 mb-4 tracking-wide">
        <span className="line-through text-white/30">How to</span> <span className="bg-gradient-to-r from-[#6f6f6f] via-white to-[#6a6868] bg-clip-text text-transparent">Start</span>
      </h3>

      <h2 className="text-8xl font-bold lg:ml-[30%] md:ml-[10%] mb-4 text-white">
        Transforming Your <span className="bg-gradient-to-r from-[#5c5959]  via-white to-[#6d6c6c] bg-clip-text text-transparent">Business</span>
      </h2>

      <p className="text-lg lg:ml-[30%] md:ml-[20%] text-white/60 max-w-2xl mb-12">
        Only three easy steps to the business of your dreams:
      </p>

      {/* Cards Row */}
      <div className="flex flex-col md:flex-row md:space-x-6 space-y-6 md:space-y-0">
  {[
    {
      number: "01",
      title: "Pick a program",
      desc: "Choose from a variety of programs tailored to your needs.",
      gradient: "from-[#7e95dd] hover:from-white/60",
      numberGradient: "from-[#fff9f9] via-[#8f8c8c] to-[#1b1a1a]",
    },
    {
      number: "02",
      title: "Make a payment",
      desc: "We accept all types of payments, round the clock.",
      gradient: "from-[#7e95dd] hover:from-white/60 ",
      numberGradient: "from-[#fff9f9] via-[#8f8c8c] to-[#1b1a1a]",
    },
    {
      number: "03",
      title: "Get access",
      desc: "Start using our platform and see the difference.",
      gradient:"from-[#7e95dd] hover:from-white/60 ",
      numberGradient: "from-[#fff9f9] via-[#8f8c8c] to-[#1b1a1a]",
    },
  ].map((step, i) => (
    <div key={i} className="w-full md:w-1/3 p-4 group">
      <div className="relative overflow-hidden rounded-xl">
        {/* Animated border */}
        <div className={`absolute -inset-0.5 bg-gradient-to-r ${step.gradient} rounded-xl opacity-30 group-hover:opacity-75 transition-opacity duration-300`} />

        {/* Card body */}
        <div className="relative bg-black/40 backdrop-blur-lg  w-full  h-60 rounded-xl p-6 border border-white/10 transform transition duration-300 group-hover:scale-105">
          {/* Inner subtle background */}
          <div className={`absolute inset-0 bg-gradient-to-r ${step.gradient.replace('600', '500')}/10 opacity-50`} />

          {/* Step Number */}
          <div className={`relative bg-gradient-to-r ${step.numberGradient} rounded-full w-16 h-16 mx-auto flex items-center justify-center mb-4 text-white text-xl font-bold`}>
            {step.number}
          </div>

          {/* Step Title */}
          <h3 className="text-2xl font-semibold mb-4 text-white">{step.title}</h3>

          {/* Step Description */}
          <p className="text-base text-white/60">{step.desc}</p>
        </div>
      </div>
    </div>
  ))}
</div>

    </div>

    {/* Right: Viedo Section */}
    <div className="w-full hidden lg:block  lg:w-1/3 mt-12 lg:mt-0 justify-center">
      <video
        src="../public/videos/TransformingBusiness.mp4"
        alt="Illustration"
        className="w-4/4 rounded-full mt-64 mr-28 max-w-sm  shadow-2xl shadow-[#7e95dd] hover:shadow-3xl hover:shadow-[#6d77ff] ml-24 transform transition-transform duration-300 hover:scale-105"
        autoPlay
        loop
        muted
        playsInline
        aria-hidden="true"

      ></video>
    </div>
  </div>


  <style jsx>{`
    @keyframes slide {
      0% { transform: translateX(-100%) rotate(45deg); }
      100% { transform: translateX(200%) rotate(45deg); }
    }

    @keyframes scanlines {
      0% { transform: translateY(0); }
      100% { transform: translateY(4px); }
    }
  `}</style>
</section>

{/*footer*/}
<Footer path='/footer' /> 
    </div>
    </>
  );
};

export default Home;