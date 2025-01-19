const jwt = require('jsonwebtoken');
const userModel = require('../models/user.model'); // Import your User model
const { JWT_SECRET } = require('../config/envConfig');

const authMiddleware = async (req, res, next) => {
  const token = req.cookies.token;
  console.log('token: ', token);
  console.log('Request Headers:', req.headers); //Log the entire headers object
  console.log('Request Cookies:', req.cookies); // Log the cookies object
  console.log('token from cookies: ', token);

  if (!token) {
    console.log('Token not found in cookies');
  }

  if (!token) {
    return res
      .status(401)
      .json({ message: 'Please login, To continue', success: false });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log('decoded: ', decoded);

    if (!decoded || typeof decoded !== 'object') {
      console.log('decoded: ', decoded);
      return res
        .status(401)
        .json({ message: 'Unauthorized - Invalid token', success: false });
    }

    // Fetch the user from the database
    const user = await userModel.findById(decoded.userID);

    if (!user) {
      return res
        .status(401)
        .json({ message: 'Unauthorized - User not found', success: false });
    }

    // Set the user object on req.user
    req.user = user;
    req.userID = decoded.userID; // You might still need this
    next();
  } catch (error) {
    console.log(`Error verifying token: ${error.message}`);
    return res
      .status(401)
      .json({ message: 'Unauthorized - Invalid token', success: false });
  }
};

module.exports = authMiddleware;
