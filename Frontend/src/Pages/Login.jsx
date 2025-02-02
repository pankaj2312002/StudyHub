import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../redux/Slices/Authslice';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import ClipLoader from 'react-spinners/ClipLoader';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, isAuthenticated, error } = useSelector((state) => state.auth);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginUser({ email, password }));
  };

  useEffect(() => {
    if (isAuthenticated) {
      toast.success('Login successful!');
      navigate('/');
    }

    if (error) {
      toast.error(error);
    }
  }, [isAuthenticated, error, navigate]);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 shadow-2xl p-4">
      <div className="flex flex-col md:flex-row w-full max-w-4xl bg-white rounded-lg shadow-lg overflow-hidden">
        
        <div className="hidden md:flex md:w-1/2 bg-blue-100 flex-col items-center justify-center">
          <img src="/loginImage.jpg" alt="Left Illustration" className="w-full h-full object-cover" />
        </div>

       
        <div className="w-full md:w-1/2 p-8">
          <h2 className="text-3xl font-semibold text-center text-gray-700 mb-6">Sign in to our platform</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Your Email</label>
              <input
                type="email"
                id="email"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="example@company.com"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Your Password</label>
              <input
                type="password"
                id="password"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Password"
              />
              <div className="flex justify-between mt-2">
                <div className="flex items-center">
                  <input type="checkbox" id="remember-me" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">Remember me</label>
                </div>
                <a href="/Forget-Password" className="text-sm text-blue-600 hover:underline">Forget password?</a>
              </div>
            </div>
            <button
              type="submit"
              className={`w-full py-2 px-4 rounded-md text-white transition ${loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'}`}
              disabled={loading}
            >
              {loading ? <ClipLoader size={20} color="#ffffff" className="inline-block mr-2" /> : 'LogIn'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-md text-gray-700">or</p>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">Not registered? <a href="/SignUp" className="text-blue-600 hover:underline">Create account</a></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
