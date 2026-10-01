const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const ApiError = require('../utils/ApiError');
const User = require('../models/User');

// Reads the JWT from the http-only cookie (or Authorization header as a fallback
// for API clients that can't use cookies) and attaches the admin user to req.
const protect = asyncHandler(async (req, res, next) => {
  let token = req.cookies?.[process.env.COOKIE_NAME || 'portfolio_admin_token'];

  if (!token && req.headers.authorization?.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    throw new ApiError(401, 'Not authorized. Please log in.');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) throw new ApiError(401, 'Account no longer exists.');
    req.user = user;
    next();
  } catch (err) {
    throw new ApiError(401, 'Session expired or invalid. Please log in again.');
  }
});

const requireAdmin = (req, res, next) => {
  if (req.user?.role !== 'admin') {
    throw new ApiError(403, 'Admin access required.');
  }
  next();
};

module.exports = { protect, requireAdmin };
