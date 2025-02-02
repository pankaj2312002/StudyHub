

const UserModel = require('../models/user'); 
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs'); 
const { JWT_SECRET, MAIL_USER, MAIL_PASS} = process.env;
const {sendPasswordResetEmail} = require('../utilityFiles/emailFunction')

// Function to send email
// const sendEmail = async (to, subject, resetLink) => {
//     const transporter = nodemailer.createTransport({
//         service: 'gmail', 
//         auth: {
//             user: MAIL_USER,
//             pass: MAIL_PASS,
//         },
//     });

   
//     const htmlContent = `
//         <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd; border-radius: 5px; background-color: #f9f9f9;">
//             <h2 style="color: #333;">Forgot Your Password?</h2>
//             <p style="color: #555;">Don't worry! Just click the button below to reset your password:</p>
//             <a href="${resetLink}" style="display: inline-block; padding: 10px 20px; margin: 20px 0; border: none; border-radius: 5px; background-color: #007BFF; color: #fff; text-decoration: none; font-weight: bold;">Reset Password</a>
//             <p style="color: #555;">If you did not request this, please ignore this email.</p>
//             <p style="color: #555;">Thank you!</p>
//         </div>
//     `;

//     const mailOptions = {
//         from: MAIL_USER,
//         to,
//         subject,
//         html: htmlContent, 
//     };

//     return transporter.sendMail(mailOptions);
// };

// Forget password controller
const forgetPassword = async (req, res) => {
    const { email } = req.body;
    

    try {
        // Verify user exists
        const user = await UserModel.findOne({ email });
        if (!user) {
            
            return res.status(404).json({ error: 'User not found' });
        }

        // Create JWT token
        const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '5m' });
      

        // Create reset password link
        const resetLink = `http://localhost:3000/reset-password/${user._id}/${token}`;
        

        // Send email with reset link
        await sendPasswordResetEmail(email, resetLink);
        

        return res.status(200).json({ message: 'Reset password link sent to your email' });
    } catch (error) {
        
        return res.status(500).json({ error: 'An error occurred. Please try again later.' });
    }
};

// Reset password controller
const resetPassword = async (req, res) => {
    const { token, userId } = req.params; 
    const { password } = req.body; 
   

    try {
        // Verify the token
        const decoded = jwt.verify(token, JWT_SECRET);
        if (decoded.id !== userId) {
            
            return res.status(403).json({ error: 'Invalid token or user ID' });
        }

        // Validate the new password
        if (!password) {
           
            return res.status(400).json({ error: 'Password not received' });
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(password, 10);
       

        // Update the user's password in the database
        await UserModel.findByIdAndUpdate(decoded.id, { password: hashedPassword });
       

        return res.status(200).json({ message: 'Password has been reset successfully' });
    } catch (error) {
        
        return res.status(500).json({ error: 'An error occurred. Please try again later.' });
    }
};


module.exports = { forgetPassword, resetPassword };
