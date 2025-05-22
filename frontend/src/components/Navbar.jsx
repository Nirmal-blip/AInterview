import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FaHome,
  FaEnvelope,
  FaBars,
  FaTimes,
  FaDollarSign,
  FaUser,
  FaSignInAlt,
  FaSignOutAlt,
  FaTachometerAlt
} from 'react-icons/fa';
import { useAuthContext } from '../context/Authcontext';
import toast from 'react-hot-toast';
import axios from 'axios';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [prevScrollY, setPrevScrollY] = useState(0);
  const [navbarVisible, setNavbarVisible] = useState(true);
  const { Authuser, setAuthuser } = useAuthContext();
  const navigate = useNavigate();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isProfileDropdownOpen) {
        setIsProfileDropdownOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isProfileDropdownOpen]);

  const handleScroll = () => {
    if (window.scrollY > prevScrollY) {
      setNavbarVisible(false);
    } else {
      setNavbarVisible(true);
    }
    setPrevScrollY(window.scrollY);
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [prevScrollY]);

  const handleLogout = async (e) => {
    e.stopPropagation();
    try {
      const response = await axios.post(
        'http://localhost:5000/api/auth/logout',
        { company_db_name: Authuser.company_db_name },
        { withCredentials: true }
      );
      if (response.status === 200) {
        toast.success('Logged out successfully!', {
          position: 'top-center',
          duration: 5000,
        });
        localStorage.removeItem('company-admin');
        setAuthuser(null);
        navigate('/login');
      } else {
        toast.error('Logout failed. Please try again.');
      }
    } catch (error) {
      console.error('Logout error:', error);
      toast.error(
        error.response?.data?.message || 'An error occurred. Please try again.'
      );
    }
  };

  const handleDashboardNavigation = (e) => {
    e.stopPropagation();
    if (Authuser.PaidByAdmin) {
      navigate('/admin-dashboard');
    } else {
      navigate('/payment-for-admin');
    }
  };

  const toggleProfileDropdown = (e) => {
    e.stopPropagation();
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
  };

  return (
    <nav
      className={`bg-black/30 backdrop-blur-md border-b border-white/10 text-white p-4 sm:py-2 transition-all duration-300 ease-in-out ${
        navbarVisible ? 'translate-y-0' : '-translate-y-full'
      } fixed w-full top-0 left-0 z-50`}
    >
      <div className="container mx-10 flex justify-between items-center relative">
        {/* Logo */}
        <div className="flex items-center group">
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r  from-[#ffff] via-[#ffff] to-[#5f5e5e]  rounded-lg opacity-25 group-hover:opacity-50 blur transition duration-300" />
            <img
              src="/logo.jpeg"
              alt="logo"
              className="relative h-12 mr-3 hover:opacity-90 transition-opacity rounded-lg"
            />
          </div>
          <h1 className="font-bold m-x-auto text-2xl bg-gradient-to-r from-[#ffff] via-[#ffff] to-[#5f5e5e] bg-clip-text text-transparent">
            AIntelligence
          </h1>
        </div>

        {/* Navigation and Profile Section */}
        <div className="flex items-center">
          {/* Desktop Navigation */}
          <ul className="hidden md:flex space-x-6 items-center text-base">
            {[ 
              { href: '/home', label: 'Home', icon: <FaHome className="h-5 w-5" /> },
              { href: '/view-pricing', label: 'Pricing', icon: <FaDollarSign className="h-5 w-5" /> },
              { href: '/footer', label: 'Contact Us', icon: <FaEnvelope className="h-5 w-5" /> },
            ].map((link, idx) => (
              <li key={idx} className="group relative">
                <Link
                  to={link.href}
                  className="flex items-center text-white/80 font-medium py-2 px-3 rounded-lg hover:bg-white/5 hover:text-gradient-to-r from-[#ffff] via-[#ffff] to-[#5f5e5e] transition-all duration-300"
                >
                  <span className="mr-2 group-hover:scale-110 transition-transform">{link.icon}</span>
                  <span>{link.label}</span>
                </Link>
                <span className="absolute left-0 bottom-0 h-0.5 w-full bg-gradient-to-r from-[#2c2b2b] via-[#ffff] to-[#5f5e5e]   scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
              </li>
            ))}

            {/* Profile/Login Section */}
            <li className="relative">
              {Authuser ? (
                <div className="relative">
                  <button 
                    onClick={toggleProfileDropdown}
                    className="text-white hover:bg-white/10 p-2 rounded-lg transition-colors"
                  >
                    <FaUser className="h-6 w-6" />
                  </button>
                  {isProfileDropdownOpen && (
                    <div 
                      className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button 
                        onClick={handleDashboardNavigation}
                        className="w-full flex items-center px-4 py-2 text-gray-800 hover:bg-gray-100 transition-colors"
                      >
                        <FaTachometerAlt className="mr-2" /> Dashboard
                      </button>
                      <button 
                        onClick={handleLogout}
                        className="w-full flex items-center px-4 py-2 text-red-600 hover:bg-gray-100 transition-colors"
                      >
                        <FaSignOutAlt className="mr-2" /> Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link 
                  to="/login" 
                  className="text-white hover:bg-white/10 p-2 rounded-lg transition-colors"
                >
                  <FaSignInAlt className="h-6 w-6" />
                </Link>
              )}
            </li>
          </ul>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center space-x-2">
            {Authuser ? (
              <div className="relative">
                <button 
                  onClick={toggleProfileDropdown}
                  className="text-white hover:bg-white/10 p-2 rounded-lg transition-colors"
                >
                  <FaUser className="h-6 w-6" />
                </button>
                {isProfileDropdownOpen && (
                  <div 
                    className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button 
                      onClick={handleDashboardNavigation}
                      className="w-full flex items-center px-4 py-2 text-gray-800 hover:bg-gray-100 transition-colors"
                    >
                      <FaTachometerAlt className="mr-2" /> Dashboard
                    </button>
                    <button 
                      onClick={handleLogout}
                      className="w-full flex items-center px-4 py-2 text-red-600 hover:bg-gray-100 transition-colors"
                    >
                      <FaSignOutAlt className="mr-2" /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link 
                to="/login" 
                className="text-white hover:bg-white/10 p-2 rounded-lg transition-colors"
              >
                <FaSignInAlt className="h-6 w-6" />
              </Link>
            )}

            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)} 
              className="text-white hover:bg-white/10 p-2 rounded-lg transition-colors focus:outline-none border border-white/20"
            >
              {isMenuOpen ? <FaTimes className="h-6 w-6" /> : <FaBars className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <ul className="flex flex-col items-center space-y-4 mt-4 bg-black/50 backdrop-blur-xl rounded-xl p-4 border border-white/10">
            {[ 
              { href: '/home', label: 'Home' },
              { href: '/view-pricing', label: 'Pricing' },
              { href: '/footer', label: 'Contact Us' },
            ].map((link, idx) => (
              <li key={idx} className="group relative w-full">
                <Link
                  to={link.href}
                  className="block w-full text-white/80 font-medium py-3 px-6 rounded-lg hover:bg-white/5 hover:text-from-[#ffff] via-[#ffff] to-[#5f5e5e]  transition-all duration-300"
                >
                  {link.label}
                </Link>
                <span className="absolute left-1/2 transform -translate-x-1/2 bottom-0 h-0.5 w-3/4 bg-gradient-to-r from-[#ffff] via-[#ffff] to-[#5f5e5e]  scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Decorative elements */}
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-purple-500/30 to-transparent transform translate-y-[1px]" />
    </nav>
  );
};

export default Navbar;