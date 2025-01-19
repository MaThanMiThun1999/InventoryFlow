// middlewares/adminMiddleware.js
const jwt = require("jsonwebtoken");
const userModel = require("../models/user.model");
const { JWT_SECRET } = require("../config/envConfig");
exports.isAdmin = async (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Unauthorized - No token provided" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await userModel.findById(decoded.userID);

    if (!user || user.role !== "admin") {
      console.log(user);
      console.log("user role", user.role);
      return res.status(403).json({ message: "Access denied - Admins only" });
    }

    req.userID = user._id;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized - Invalid token" });
  }
};
