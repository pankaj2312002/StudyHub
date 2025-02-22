

const UserModel = require('../models/user'); 
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs'); 
const { JWT_SECRET} = process.env;
const {sendPasswordResetEmail} = require('../utilityFiles/emailFunction')



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
        const resetLink = `https://study-hub-red.vercel.app/reset-password/${user._id}/${token}`;
        

        // Send email with reset link
        await sendPasswordResetEmail(email, resetLink);
        

        return res.status(200).json({ message: 'Reset password link sent to your email' });
    } catch (error) {
        
        return res.status(500).json({ error: 'An error occurred. Please try again later.' });
    }
};

// forgetPassword controller toh bas frontend ko ek link send karne ka kaam karega 
// us link per click karne aur password fill karne ke baad resetPassword ke pass ayegi request 

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