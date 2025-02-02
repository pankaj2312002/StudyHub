// index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react'; 
import { Store, persistor } from './redux/Store'; 
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import SignUp from './Pages/SignUp';
import Login from './Pages/Login';
import AddNotes from './Pages/AddNotes';
import OtpVerification from './Pages/OtpVerification';
import ForgetPassword from './Pages/ForgetPassword';
import ResetPassword from './Pages/ResetPassword';
import Settings from './Pages/Settings';

import { Toaster } from 'react-hot-toast';


const router = createBrowserRouter([
  {
    path: '/',
    element: <App />
  },
  {
    path: '/Login',
    element: <Login />
  },
  {
    path: '/SignUp',
    element: <SignUp />
  },
  {
    path: '/AddNotes',
    element: <AddNotes />
  },
  {
    path: '/OtpVerification',
    element: <OtpVerification/>
  },
  {
    path: '/Forget-Password',
    element: <ForgetPassword/>
  },
  {
    path: '/reset-password/:userId/:token',
    element: <ResetPassword/>
  },
  {
    path: '/Settings',
    element: <Settings/>
  }
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={Store}>
      <PersistGate loading={null} persistor={persistor}>
      <Toaster />
        <RouterProvider router={router} />
      </PersistGate>
    </Provider>
  </React.StrictMode>
);
