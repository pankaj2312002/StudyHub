import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { signupUser, resetAuthState } from '../redux/Slices/Authslice';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import ClipLoader from 'react-spinners/ClipLoader';
import { FaUser, FaBuilding, FaCalendar, FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';

import svgBackground from '../Images/signin.58ee1d5a.svg';

const Signup = () => {
  const [formData, setFormData] = useState({
    username: '',
    branch: '',
    year: '',
    email: '',
    password: '',
  });

  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, success, error } = useSelector((state) => state.auth);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { username, branch, year, email, password } = formData;

    dispatch(signupUser({ username, branch, year, email, password }));
  };

  useEffect(() => {
    if (success) {
      toast.success('Check your email for OTP verification.');
      navigate('/OtpVerification');
    }
    if (error) {
      toast.error(error);
    }
    return () => {
      dispatch(resetAuthState());
    };
  }, [success, error, navigate, dispatch]);

  return (
    <div
      className="flex justify-center items-center min-h-screen bg-slate-50"
      style={{
        backgroundImage: `url(${svgBackground})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div className="bg-white p-6 sm:p-8 rounded-lg shadow-lg w-full max-w-sm sm:max-w-md lg:max-w-lg mx-4">
        <h2 className="text-2xl font-semibold text-center mb-4 sm:mb-6">Create an account</h2>

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          <FormField
            label="Username"
            name="username"
            type="text"
            placeholder="Enter your username"
            icon={<FaUser className="text-gray-400" />}
            value={formData.username}
            onChange={handleChange}
            required
          />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField
              label="Branch"
              name="branch"
              type="text"
              placeholder="Enter your branch"
              icon={<FaBuilding className="text-gray-400" />}
              value={formData.branch}
              onChange={handleChange}
              required
            />
            <FormField
              label="Year"
              name="year"
              type="text"
              placeholder="Enter your year"
              icon={<FaCalendar className="text-gray-400" />}
              value={formData.year}
              onChange={handleChange}
              required
              pattern="\d*"
            />
          </div>

          <FormField
            label="Email Address"
            name="email"
            type="email"
            placeholder="Enter your email"
            icon={<FaEnvelope className="text-gray-400" />}
            value={formData.email}
            onChange={handleChange}
            required
          />

          <FormField
            label="Password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Enter your password"
            icon={<FaLock className="text-gray-400" />}
            value={formData.password}
            onChange={handleChange}
            required
            isPasswordField={true}
            showPassword={showPassword}
            togglePasswordVisibility={togglePasswordVisibility}
          />

          <button
            type="submit"
            className={`w-full py-2 px-4 rounded-md text-white transition ${loading ? 'bg-gray-400' : 'bg-black'}`}
            disabled={loading}
          >
            {loading ? <ClipLoader size={20} color="#ffffff" className="inline-block mr-2" /> : 'Sign Up'}
          </button>
        </form>

        <p className="text-center mt-4">
          Already have an account? <Link to="/login" className="text-blue-600 hover:underline">Login here</Link>
        </p>
      </div>
    </div>
  );
};

const FormField = ({
  label,
  name,
  type,
  value,
  onChange,
  required,
  placeholder,
  icon,
  isPasswordField,
  showPassword,
  togglePasswordVisibility,
}) => (
  <div className="relative">
    <label htmlFor={name} className="block text-sm font-medium text-gray-700">{label}</label>
    <div className="flex items-center mt-1">
      {icon && <span className="absolute left-3">{icon}</span>}
      <input
        type={type}
        id={name}
        name={name}
        className="mt-1 block w-full px-10 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        value={value}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
      />
      {isPasswordField && (
        <button
          type="button"
          onClick={togglePasswordVisibility}
          className="absolute right-3 text-gray-500 focus:outline-none"
        >
          {showPassword ? <FaEyeSlash /> : <FaEye />}
        </button>
      )}
    </div>
  </div>
);

export default Signup;
