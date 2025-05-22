import React from "react";
import "@fortawesome/fontawesome-free/css/all.min.css";

const Footer = () => {
  return (
    <footer className="relative bg-gradient-to-b from-[#000814] to-[#010814]  text-gray-300 py-16 px-8 overflow-hidden">
      {/* Cyberpunk background elements */}
      <div className="absolute inset-0">
        <div 
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `linear-gradient(rgba(59,130,246,0.1) 1px, transparent 1px),
                             linear-gradient(90deg, rgba(59,130,246,0.1) 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
            backgroundPosition: 'center center'
          }}
        />

      </div>

      <div className="container mx-auto text-center relative z-10">
        {/* Footer Header */}
        <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-black via-[#fffcfc] to-black bg-clip-text text-transparent">
          Get in Touch with Us
        </h2>
        <p className="text-lg mb-12 text-gray-400 leading-relaxed max-w-3xl mx-auto">
          Feel free to contact us for any inquiries, plans, or feedback! We're
          always here to assist you.
        </p>

        {/* Footer Sections */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Contact Information */}
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold bg-gradient-to-r from-white via-white to-black bg-clip-text text-transparent">
              Contact Information
            </h3>
            <ul className="space-y-4 text-gray-300 text-lg">
              <li className="flex items-center justify-center gap-3 hover:text-[#8aa2aa] transition-colors">
                <i className="fas fa-envelope text-white text-xl"></i>
                <a href="mailto:fitnest@example.com">aiinterview@gmail.com</a>
              </li>
              <li className="flex items-center justify-center gap-3  hover:text-[#8aa2aa] transition-colors">
                <i className="fas fa-phone-alt  text-white] text-xl"></i>
                <a href="tel:+1234567890">+1 234 567 890</a>
              </li>
              <li className="flex items-center justify-center gap-3">
                <i className="fas fa-map-marker-alt text-white text-xl"></i>
                <p>123 Street, City, 12345</p>
              </li>
            </ul>
          </div>

          {/* Social Media Links */}
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold bg-gradient-to-r from-black via-[#fffcfc] to-black bg-clip-text  text-transparent">
              Follow Us
            </h3>
            <div className="flex justify-center gap-6 mt-4">
              {['facebook', 'instagram', 'linkedin'].map((social) => (
                <a
                  key={social}
                  href={`https://${social}.com/fitnest`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-3xl relative group"
                >
                  <div className="absolute -inset-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg blur opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <i className={`fab fa-${social} relative text-gray-300 group-hover:text-blue-400 transition-colors duration-300`}></i>
                </a>
              ))}
            </div>
          </div>

          {/* Send Us a Message Section */}
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold bg-gradient-to-r from-black via-[#fffcfc] to-black  bg-clip-text text-transparent">
              Send Us a Message
            </h3>
            <form className="space-y-4">
              <input
                type="email"
                name="email"
                placeholder="Your Email"
                className="w-full px-6 py-3 rounded-lg bg-gray-900/60 text-gray-300 border border-gray-700 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-xl transition duration-300 text-lg"
                required
              />
              <textarea
                name="message"
                placeholder="Your Message"
                className="w-full px-6 py-3 rounded-lg bg-gray-900/60 text-gray-300 border border-gray-700 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-xl transition duration-300 text-lg"
                rows="4"
                required
              ></textarea>
              <button
                type="submit"
                className="w-full relative group"
              >
                <div className="absolute -inset-0.5 bg-gradient-to-r from-white to-[#605c5c] rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-300" />
                <div className="relative bg-gray-900 text-gray-300 py-3 px-6 rounded-lg group-hover:bg-white hover:text-black transition duration-300">
                  Send Message
                </div>
              </button>
            </form>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="relative">
          <div className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent" />
          <p className="text-gray-500 text-sm pt-8">
            © 2025 AI Interview Assistant. All rights reserved. Powered by S. AIntelligence
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.6; }
        }

        .animate-pulse-slow {
          animation: pulse-slow 6s ease-in-out infinite;
        }
      `}</style>
    </footer>
  );
};

export default Footer;