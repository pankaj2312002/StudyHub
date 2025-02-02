const jwt = require('jsonwebtoken');
const UserModel = require('../models/user');

const authMiddleware = async (req, res, next) => {
  console.log("req.body =>", req.body)
  try {
    // Extract token from the request (body, cookies, or Authorization header)
    const token = req.body.token || req.cookies.token || req.header("Authorization")?.replace("Bearer ", "");
    

    console.log("body.token =>",req.body.token)
    console.log("cookies.token =>",req.cookies.token)
    console.log("req.header =>",req.header("Authorization")?.replace("Bearer ", ""))
    
    if (!token) {
      console.log("No token provided, present in authmiddleware");
      return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    // Verify token and decode it
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded || !decoded._id) {
      console.log("Token decoded but no user ID found");
      return res.status(401).json({ msg: 'Invalid token, no user ID' });
    }

    // Find the user by the decoded token's id
    const user = await UserModel.findById(decoded._id).select('-password');

    if (!user) {
      console.log("User not found in the database");
      return res.status(401).json({ msg: 'Authorization denied, user not found' });
    }

    // Assign the user object to the request for later use in the route
    req.user = user;

    console.log("Authenticated user:", req.user);

    // Proceed to the next middleware or route
    next();

  } catch (err) {
    console.error("Error in auth middleware:", err);
    return res.status(401).json({ msg: 'Token is not valid or expired' });
  }
};

module.exports = authMiddleware;
