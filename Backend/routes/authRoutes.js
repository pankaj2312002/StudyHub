
const express = require('express');
const { SignUp, login, logout, verifyOtp, resendOtp } = require('../controllers/authController');
const { forgetPassword, resetPassword} = require('../controllers/ResetPassController')
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/signup', SignUp);
router.post('/login', login);
router.post('/logout', authMiddleware, logout)
router.post('/verify-otp', verifyOtp);
router.post('/resend-otp', resendOtp);

router.post('/forgot-password', forgetPassword);
router.post('/reset-password/:userId/:token', resetPassword);
  

module.exports = router;