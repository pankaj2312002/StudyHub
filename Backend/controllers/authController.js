const UserModel = require('../models/user');
const NoteModel = require('../models/notes');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
require('dotenv').config();
const {sendOtpEmail} = require('../utilityFiles/emailFunction')

// Utility function to send OTP via email
// const sendOtpEmail = async (email, otp) => {
//   try {
//     const transporter = nodemailer.createTransport({
//       host: process.env.MAIL_HOST,
//       service: 'Gmail',
//       auth: {
//         user: process.env.MAIL_USER,
//         pass: process.env.MAIL_PASS,
//       },
//     });

//     const mailOptions = {
//       from: process.env.MAIL_USER,
//       to: email,
//       subject: '🔒 Your OTP Verification Code',
//       html: `
//         <div style="text-align: center; font-family: Arial, sans-serif; padding: 20px; max-width: 500px; margin: auto; border: 1px solid #e0e0e0; border-radius: 8px; background-color: #f9f9f9;">
//           <h2 style="color: #333;">OTP Verification</h2>
//           <p>Your OTP code is:</p>
//           <div style="font-size: 24px; font-weight: bold; color: #007bff;">${otp}</div>
//           <p>This code is valid for <strong>1 Minute</strong>.</p>
//         </div>
//       `,
//     };
//     await transporter.sendMail(mailOptions);
    
//   } catch (err) {
    
//     throw new Error('OTP sending failed');
//   }
// };

// Utility function to find a user and handle common cases
const findUser = async (email) => {
  try {
    return await UserModel.findOne({ email });
  } catch (err) {
    
    throw new Error('User lookup failed');
  }
};

//  function for generating OTP and expiry
const generateOtp = () => {
  const otp = crypto.randomInt(100000, 999999).toString();
  const otpExpiry = new Date(Date.now() + 60 * 1000);
  return { otp, otpExpiry };
};

// Sign up user with OTP 
exports.SignUp = async (req, res) => {
  const { username, email, password, year, branch } = req.body;

  try {
    let user = await findUser(email);

    if (user) {
      if (user.status === 'pending') {
        const { otp, otpExpiry } = generateOtp();
        user.otp = otp;
        user.otpExpiry = otpExpiry;
        await user.save();
        await sendOtpEmail(email, otp);
        return res.status(200).json({
          success: true,
          message: 'User already exists in the signup process, OTP resent. Please check your email.',
          email: email
        });
      }
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const { otp, otpExpiry } = generateOtp();

    user = new UserModel({
      username,
      email,
      password: hashedPassword,
      year,
      branch,
      otp,
      otpExpiry,
      status: 'pending',
    });
    await user.save();
    await sendOtpEmail(email, otp);

    res.status(201).json({
      success: true,
      message: 'Signup successful, check your email for OTP',
      email: email,
    });
  } catch (err) {
   
    res.status(500).json({ success: false, message: 'User signup failed' });
  }
};

// Verify OTP
exports.verifyOtp = async (req, res) => {
  const { email, otp } = req.body;
  
  try {
    const user = await findUser(email);
    if (!user || user.status !== 'pending') {
      return res.status(400).json({ success: false, message: 'Invalid request' });
    }

    if (user.otp !== otp || user.otpExpiry < Date.now()) {
      return res.status(400).json({ success: false, message: 'Invalid OTP. Try with a new OTP.' });
    }

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpiry = undefined;
    user.status = 'verified';
    await user.save();

    const { password, ...userData } = user.toObject();
    const token = jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.cookie('token', token, { httpOnly: true, maxAge: 3600000 })
      .status(200).json({ success: true, message: 'OTP verified, account activated', User: userData });
  } catch (err) {
    console.error('OTP verification failed:', err.message);
    res.status(500).json({ success: false, message: 'OTP verification failed' });
  }
};

// Resend OTP
exports.resendOtp = async (req, res) => {
  const { email } = req.body;
  console.log(`Resend OTP request for: ${email}`);
  try {
    const user = await findUser(email);
    if (!user) {
      return res.status(400).json({ success: false, message: 'User not found' });
    }

    if (user.status !== 'pending' && user.status !== 'inactive') {
      return res.status(400).json({ success: false, message: 'Cannot resend OTP, user is not eligible' });
    }

    

    const { otp, otpExpiry } = generateOtp();
    user.otp = otp;
    user.otpExpiry = otpExpiry;
    user.status = 'pending';
    await user.save();

    await sendOtpEmail(email, otp);
    res.status(200).json({ success: true, message: 'OTP resent, please check your email' });
  } catch (err) {
    console.error('Resend OTP error:', err.message);
    res.status(500).json({ success: false, message: 'Failed to resend OTP' });
  }
};

// Log in user
exports.login = async (req, res) => {
  const { email, password } = req.body;
  console.log(`Login attempt for: ${email}`);
  try {
    const user = await findUser(email);
    if (!user || user.status !== 'verified') {
      return res.status(400).json({ success: false, message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Invalid email or password' });
    }

    const { password: _, ...userData } = user.toObject();
    const token = jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: '1h' });

    const notes = await NoteModel.find({ uploadedBy: user._id });
    userData.notes = notes;

    res.cookie('token', token, { httpOnly: true, maxAge: 3600000 })
      .status(200).json({ 
        success: true, 
        message: 'Login successful',
        User: userData
       });
  } catch (err) {
    console.error('Login error:', err.message);
    res.status(500).json({ success: false, message: 'Login failed' });
  }
};

// Log out user
exports.logout = (req, res) => {
  console.log('Logout request');
  res.clearCookie('token').status(200).json({ message: 'Logout successful' });
};
