const jwt = require('jsonwebtoken');
const User = require('../models/user'); // Import the User model

// Middleware to authenticate and fetch user data
const authMe = async (req, res, next) => {
    try {
        // Get token from the cookie or header
        const token = req.cookies.token || req.header('Authorization')?.replace('Bearer ', '');

        // Check if token exists
        if (!token) {
            console.log('No token, authorization denied in authme')
            return res.status(401).json({ message: 'No token, authorization denied' });
        }

        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (!decoded) {
            console.log('No decoded, authorization denied in authme')
            return res.status(401).json({ message: 'No decoded, authorization denied' });
        }
        // Find the user by ID (decoded from token)
        const user = await UserModel.findById(decoded._id).select('-password'); // Exclude password from user data

        // Check if user exists
        if (!user) {
            console.log('No user, authorization denied in authme')
            return res.status(404).json({ message: 'User not found' });
        }

        // Attach user to request object
        req.user = user;
        next(); // Continue to the next middleware or route handler
    } catch (error) {
        console.error('Error in authMe middleware:', error);
        return res.status(500).json({ message: 'Server error' });
    }
};

module.exports = authMe;
