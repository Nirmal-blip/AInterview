import axios from 'axios';
import React, { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from "../components/Footer";
import { useAuthContext } from '../context/Authcontext';

const PaymentForAdmin = () => {
  const { Authuser, setAuthuser } = useAuthContext();
  const [Amount, setAmount] = useState(0);
  const [PlanType, setPlanType] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const handleLogout = async () => {
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
  const handlePayment = async () => {
    if (!Amount || !PlanType) {
      toast.error('Please select a plan before proceeding with the payment.');
      return;
    }
    try {
      const orderResponse = await axios.post(
        'http://localhost:5000/api/Payment/create-order-for-Admin',
        {
          userId: Authuser._id,
          amount: Amount,
          company_name: Authuser.company_name,
          company_email: Authuser.company_email,
          credits: PlanType === 'Basic' ? 100 : PlanType === 'Pro' ? 250 : 600,
        },
        { withCredentials: true }
      );
      const { orderId, amount, currency } = orderResponse.data;
      setLoading(true);
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: amount * 100,
        currency: currency,
        name: 'AI-INTERVIEW-ASSITANT',
        description: `Order Payment for ${orderId}\nAmount: ${amount} ${currency}`,
        order_id: orderId,
        handler: async (response) => {
          try {
            const verificationResponse = await axios.post(
              'http://localhost:5000/api/Payment/verify-payment-for-Admin',
              {
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
                company_email: Authuser?.company_email,
                company_name: Authuser?.company_name,
                Amount: amount,
                credits: PlanType === 'Basic' ? 100 : PlanType === 'Pro' ? 250 : 600,
                company_db_name: Authuser?.company_db_name,
                PlanType: PlanType,
              },
              { withCredentials: true }
            );

            if (verificationResponse.data.success) {
              setLoading(false);
              const updatedAuthuser = { ...Authuser, PaidByAdmin: true ,credits: PlanType === 'Basic' ? 100 : PlanType === 'Pro' ? 250 : 600};
              setAuthuser(updatedAuthuser);
              localStorage.setItem('company-admin', JSON.stringify(updatedAuthuser));
              toast.success('Payment successful!');
              navigate('/admin-dashboard');
            } else {
              setLoading(false);
              toast.error('Payment verification failed. Please contact support.');
              navigate(`/Check-Status/${response.razorpay_payment_id}/${amount}`);
            }
          } catch (error) {
            setLoading(false);
            toast.error('Payment verification failed. Please contact support.');
            console.error('Payment verification failed:', error);
            navigate(`/Check-Status/${response.razorpay_payment_id}/${amount}`);
          }
        },
        prefill: {
          name: Authuser?.company_name,
          email: Authuser?.company_email,
        },
        theme: {
          color: 'cyan',
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error('Error creating Razorpay order:', error);
      alert('An error occurred. Please try again.');
    }
  };

  const selectPlan = (planType) => {
    if (planType === 'Basic') {
      setAmount(5000);
      setPlanType('Basic');
    } else if (planType === 'Pro') {
      setAmount(10000);
      setPlanType('Pro');
    } else if (planType === 'Elite') {
      setAmount(20000);
      setPlanType('Elite');
    }
  };

  return (
    <>
      <div className="min-h-screen bg-[#E6E1E1] flex flex-col items-center justify-center p-6">
        <div className="w-full">
          <Navbar />
        </div>
        <Toaster />
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-3xl w-full space-y-8">
          <h1 className="text-3xl font-extrabold text-gray-800 text-center">
            Choose Your Plan
          </h1>
          <p className="text-sm text-center text-gray-600">
            Select a plan that best suits your needs. Secure and seamless payments guaranteed.
          </p>

          {/* Plan Options */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <button
              onClick={() => selectPlan('Basic')}
              className={`w-full px-6 py-4 text-sm font-semibold rounded-lg transition-all ${
                PlanType === 'Basic'
                  ? 'bg-[#B3D9F7] text-black shadow-xl'
                  : 'bg-gray-100 text-gray-800 border border-gray-300 hover:bg-[#B3D9F7] hover:border-indigo-500'
              }`}
            >
              Basic Plan - ₹5,000 (100 credits)
            </button>

            <button
              onClick={() => selectPlan('Pro')}
              className={`w-full px-6 py-4 text-sm font-semibold rounded-lg transition-all ${
                PlanType === 'Pro'
                  ? 'bg-[#B3D9F7] text-black shadow-xl'
                  : 'bg-gray-100 text-gray-800 border border-gray-300 hover:bg-[#B3D9F7] hover:border-indigo-500'
              }`}
            >
              Pro Plan - ₹10,000 (250 credits)
            </button>

            <button
              onClick={() => selectPlan('Elite')}
              className={`w-full px-6 py-4 text-sm font-semibold rounded-lg transition-all ${
                PlanType === 'Elite'
                  ? 'bg-[#B3D9F7] text-black shadow-xl'
                  : 'bg-gray-100 text-gray-800 border border-gray-300 hover:bg-[#B3D9F7] hover:border-indigo-500'
              }`}
            >
              Elite Plan - ₹20,000 (600 credits)
            </button>
          </div>

          {/* Buttons (Buy Now and Logout) */}
          <div className="flex justify-center space-x-4 mt-6">
            <button
              onClick={handlePayment}
              className="w-40 px-5 py-2 text-sm bg-[#5D1F0C] text-white font-semibold rounded-full shadow-lg hover:shadow-xl hover:scale-105 transform transition disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading || !PlanType}
            >
              {loading ? 'Processing...' : 'Buy Now'}
            </button>

            <button
              onClick={handleLogout}
              className="w-36 px-4 py-2 text-sm bg-red-500 text-white font-semibold rounded-full shadow-md hover:bg-red-600 hover:shadow-lg hover:scale-105 transform transition"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
      <Footer path='/footer' /> 
    </>
  );
};

export default PaymentForAdmin;
