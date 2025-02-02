require('dotenv').config();
const nodemailer = require('nodemailer');

const sendEmail = async ({ to, subject, htmlContent }) => {
    try {
        const transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            service: 'Gmail',
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS,
            },
        });

        const mailOptions = {
            from: process.env.MAIL_USER,
            to,
            subject,
            html: htmlContent,
        };

        const info = await transporter.sendMail(mailOptions);

        return {
            success: true,
            message: 'Email sent successfully'
        };
    } catch (error) {

        return { 
            success: false, 
            message: 'Email sending failed',
            error: error.message };
    }
};


const sendOtpEmail = async (email, otp) => {
    const htmlContent = `
    <div style="text-align: center; font-family: Arial, sans-serif; padding: 20px; max-width: 500px; margin: auto; border: 1px solid #e0e0e0; border-radius: 8px; background-color: #f9f9f9;">
      <h2 style="color: #333;">OTP Verification</h2>
      <p>Your OTP code is:</p>
      <div style="font-size: 24px; font-weight: bold; color: #007bff;">${otp}</div>
      <p>This code is valid for <strong>1 Minute</strong>.</p>
    </div>
  `;

    const response = await sendEmail({
        to: email,
        subject: '🔒 Your OTP Verification Code',
        htmlContent,
    });

    if (!response.success) {
        throw new Error(`Failed to send OTP email: ${response.message}`);
    }

    return response;
};



const sendPasswordResetEmail = async (email, resetLink) => {
    const htmlContent = `
    <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd; border-radius: 5px; background-color: #f9f9f9;">
      <h2 style="color: #333;">Forgot Your Password?</h2>
      <p style="color: #555;">Don't worry! Just click the button below to reset your password:</p>
      <a href="${resetLink}" style="display: inline-block; padding: 10px 20px; margin: 20px 0; border: none; border-radius: 5px; background-color: #007BFF; color: #fff; text-decoration: none; font-weight: bold;">Reset Password</a>
      <p style="color: #555;">If you did not request this, please ignore this email.</p>
      <p style="color: #555;">Thank you!</p>
    </div>
  `;

    const response = await sendEmail({
        to: email,
        subject: '🔒 Reset Your Password',
        htmlContent,
    });

    if (!response.success) {
        throw new Error(`Failed to send password reset email: ${response.message}`);
    }

    return response;
};

module.exports = {
    sendOtpEmail,
    sendPasswordResetEmail,
    sendEmail,
};
