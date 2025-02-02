import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-hot-toast'; 
import { forgetPassword, clearErrors, clearSuccess } from '../redux/Slices/PasswordSlice';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const dispatch = useDispatch();
    const { isLoading, forgetSuccess, forgetError } = useSelector((state) => state.password);

    const handleRecoverPassword = (e) => {
        e.preventDefault();
        
        dispatch(forgetPassword(email));
    };

    useEffect(() => {
        if (forgetSuccess) {
            toast.success('Recovery email sent!');
            dispatch(clearSuccess()); 
        }

        if (forgetError) {
            toast.error(forgetError);
            dispatch(clearErrors()); 
        }
    }, [forgetSuccess, forgetError, dispatch]);

    return (
        <div className="flex justify-center items-center h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                <h1 className="text-3xl font-semibold mb-6">Forgot your password?</h1>
                <p className="text-gray-500 mb-6">
                    Don't fret! Just type in your email and we will send you a link to reset your password!
                </p>
                <form onSubmit={handleRecoverPassword} className="space-y-4">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Your Email</label>
                        <input
                            type="email"
                            id="email"
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="example@company.com"
                        />
                    </div>
                    <button
                        type="submit"
                        className={`w-full py-2 px-4 ${isLoading ? 'bg-gray-400' : 'bg-black'} text-white rounded-md hover:bg-gray-800 transition`}
                        disabled={isLoading} 
                    >
                        {isLoading ? 'Sending...' : 'Recover Password'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ForgotPassword;
