import React, { useEffect, useRef } from 'react';
import aiModel from '../assets/AI Model.png';  // Make sure this path is correct in your project
import { ZapIcon, Sparkles, Shield, Cpu } from 'lucide-react';

const HeroSection = () => {
  return (
    <div className="relative top-0 left-0 w-full h-full overflow-hidden">
      <section className="relative h-full min-w-full  flex items-center px-24 py-8 bg-gradient-to-b  from-[#000814] to-[#010814] overflow-hidden">
 {/* Enhanced background elements */}
  <div className="absolute inset-0">
    {/* Gradient mesh background */}
    {/* Foreground image */}
  <img
    src="../src/assets/model3.png"
    alt="Decorative foreground"
  />
        {/* Background Effects (from 2nd code) */}
        <div className="absolute inset-0 bg-[radial-gradient(white_1px,transparent_1px),radial-gradient(white_1px,transparent_1px)] bg-[length:100px_50px] bg-[0_0,25px_25px] opacity-10 animate-twinkling z-0" />
        
        <div className="absolute top-[10%] right-[15%] w-[300px] h-[300px] rounded-full bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.2)_0%,rgba(255,255,255,0.1)_30%,transparent_70%)] blur-[40px] animate-float z-0" />
        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_65%,rgba(255,255,255,0.05)_77%,rgba(255,255,255,0.1)_88%,transparent_100%)] animate-lightning z-0" />
        <div className="absolute top-[20%] right-[45%] w-[200px] h-[200px] rotate-45 bg-gradient-to-br from-transparent to-white/10 blur-[20px] animate-pulseCustom z-0" />
        
</div>
        {/* Hero Content (from 2nd code) */}
        <div className="relative max-w-[600px] z-10">
          <div className="inline-flex items-center mb-8 px-4 py-2 rounded-[20px] text-white text-sm bg-white/10 backdrop-blur-sm shadow-[0_0_20px_rgba(255,255,255,0.1)]">
            <span className="bg-white text-black font-bold text-xs px-2 py-1 rounded-[12px] mr-3 shadow-[0_0_10px_rgba(255,255,255,0.3)]">NEW</span>
            Latest integration just arrived
          </div>
          

          <h1 className="text-white lg:text-6xl font-bold leading-[1.1] mb-6 text-[50px] drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]md:text-5xl md:leading-[1.2]">
            Your Real-Time
            <span className="block bg-gradient-to-r from-[#494949] via-white to-[#a0a0a0] bg-clip-text text-transparent drop-shadow-none">Interview Assistant</span>
          </h1>

          <p className="text-[#a0a0a0] md:text-sm lg:text-lg leading-relaxed mb-10 drop-shadow-[0_0_10px_rgba(160,160,160,0.1)]">
            AI is a simple tool that converts interviews into actionable insights
          </p>

          <div className="flex gap-4">
            <button className="bg-white text-black px-8 py-4 rounded-full font-semibold transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:-translate-y-0.5 hover:shadow-[0_5px_25px_rgba(255,255,255,0.3)]">
              Try For Free →
            </button>
            <button className="bg-black/70 text-white px-8 py-4 rounded-full font-semibold border border-white/20 backdrop-blur-sm transition-all duration-300 hover:bg-white/10 hover:shadow-[0_0_15px_rgba(255,255,255,0.1)]">
              Schedule Demo →
            </button>
          </div>

        
        </div>



{/* Hero Image (Above the Glow) */}
<div
  className="hidden md:block absolute top-[53%] right-0 transform -translate-y-1/2 w-1/2 h-full m-x-12 bg-no-repeat bg-contain bg-right drop-shadow-[0_0_30px_rgba(255,255,255,0.2)] z-10"
  style={{ backgroundImage: `url(${aiModel})` }}
/>


      </section>
    </div>
  );
};

export default HeroSection;
