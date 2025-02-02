

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { verifyOtp, resendOtp } from '../redux/Slices/Authslice';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import ClipLoader from 'react-spinners/ClipLoader';
import { motion } from 'framer-motion';

const OtpVerification = () => {
  const [otp, setOtp] = useState(Array(6).fill('')); 
  const [timeLeft, setTimeLeft] = useState(60); 
  const [loading, setLoading] = useState(false); 
  const [showResend, setShowResend] = useState(false); 
  const [inputError, setInputError] = useState(''); 
  const [isVerified, setIsVerified] = useState(false); 

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { email } = useSelector((state) => state.auth); 

 
  useEffect(() => {
    if (timeLeft > 0) {
      const timerId = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timerId); 
    } else {
      setShowResend(true); 
    }
  }, [timeLeft]);

 
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

 
  const handleOtpSubmit = (e) => {
    e.preventDefault();
    if (otp.join('').length !== 6) {
      setInputError('Please enter a valid 6-digit OTP.');
      return;
    }
    setInputError(''); 
    setLoading(true);
    dispatch(verifyOtp({ email, otp: otp.join('') })) 
      .unwrap()
      .then((response) => {
        setLoading(false);
        if (response.success) {
          toast.success(response.message || 'OTP verified successfully.');
          setIsVerified(true); 
          setTimeout(() => navigate('/'), 2000); 
        } else {
          toast.error(response.message || 'Failed to verify OTP. Please try again.');
        }
      })
      .catch((error) => {
        setLoading(false);
        toast.error(error);
        console.error('OTP verification error:', error);
      });
  };

 
  const handleChange = (e, index) => {
    const value = e.target.value;
    if (/^[0-9]{0,1}$/.test(value)) { 
      const newOtp = [...otp];
      newOtp[index] = value; 
      setOtp(newOtp);
  
      
      if (value && index < otp.length - 1) {
        document.getElementById(`otp-${index + 1}`).focus();
      }
    }
  };
  
 
  const handleFocus = (index) => {
    
  };
  

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`).focus(); 
    }
  };
  

 
  const handleResendOtp = () => {
    if (!email) {
      toast.error('Email not found. Please try again.');
      return;
    }
    setLoading(true);
    dispatch(resendOtp({ email }))
      .unwrap()
      .then((response) => {
        setLoading(false);
        if (response.success) {
          setTimeLeft(60); 
          setShowResend(false); 
          setOtp(Array(6).fill('')); 
          toast.success('OTP has been resent to your email.');
        } else {
          toast.error(response.message || 'Failed to resend OTP. Please try again.');
        }
      })
      .catch((error) => {
        setLoading(false);
        toast.error('An error occurred while resending OTP. Please try again.');
        console.error('Resend OTP error:', error);
      });
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm">
        <h2 className="text-2xl font-semibold text-center mb-4">OTP Verification</h2>
        <p className="text-center text-gray-600 mb-6">OTP has been sent to: <span className="font-medium">{email}</span></p>

        {isVerified ? (
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: -20 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: 20 }} 
            transition={{ duration: 0.5 }}
          >
            <div className="p-6 bg-green-100 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-green-800">OTP Verified Successfully!</h3>
              <p className="text-green-700 mt-2">You will be redirected shortly.</p>
            </div>
          </motion.div>
        ) : (
          <form onSubmit={handleOtpSubmit} className="space-y-6">
           <div className="flex justify-between">
  {otp.map((digit, index) => (
    <input
      key={index}
      id={`otp-${index}`} 
      type="text"
      maxLength={1}
      value={digit}
      onChange={(e) => handleChange(e, index)}
      onFocus={() => handleFocus(index)}
      onKeyDown={(e) => handleKeyDown(e, index)}
      className={`w-12 h-12 text-center text-2xl border-2 rounded-md focus:outline-none transition-all duration-300 
        ${inputError ? 'border-red-500' : 'border-gray-300'} 
        ${digit ? 'bg-blue-100' : 'bg-white'} 
        focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
      style={{ color: digit ? 'black' : 'transparent' }} 
      placeholder="" 
    />
  ))}
</div>
            {inputError && <p className="text-red-500 text-sm mt-1">{inputError}</p>}

            
            <div className="text-center text-gray-600 mt-4">
              {timeLeft > 0 ? (
                <p>OTP expires in: {formatTime(timeLeft)}</p>
              ) : (
                <p className="text-red-500">OTP expired. Please resend OTP.</p>
              )}
            </div>

           
            {!showResend && (
              <button
                type="submit"
                className={`w-full py-2 px-4 rounded-md text-white transition-all duration-300 ${loading || otp.join('').length !== 6 || timeLeft === 0 ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'}`}
                disabled={loading || otp.join('').length !== 6 || timeLeft === 0}
              >
                {loading ? <ClipLoader size={20} color="#ffffff" className="inline-block mr-2" /> : 'Verify OTP'}
              </button>
            )}
          </form>
        )}

        
        {showResend && !loading && (
          <button
            onClick={handleResendOtp}
            className="w-full py-2 mt-4 bg-blue-600 text-white rounded-md transition-all duration-300 hover:bg-blue-700"
          >
            Resend OTP
          </button>
        )}
      </div>
    </div>
  );
};

export default OtpVerification;

