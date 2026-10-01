const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const ApiError = require('../utils/ApiError');

const cookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000,
});

// POST /api/auth/login
// Note: there is deliberately no register endpoint. The single admin account
// is created by `npm run seed` from ADMIN_EMAIL / ADMIN_PASSWORD in .env.
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email: email?.toLowerCase() }).select('+password');

  if (!user || !(await user.comparePassword(password))) {
    throw new ApiError(401, 'Invalid email or password.');
  }

  const token = generateToken(user._id);
  res
    .cookie(process.env.COOKIE_NAME || 'portfolio_admin_token', token, cookieOptions())
    .json({
      success: true,
      data: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
});

const logout = asyncHandler(async (req, res) => {
  res.clearCookie(process.env.COOKIE_NAME || 'portfolio_admin_token', cookieOptions());
  res.json({ success: true, message: 'Logged out.' });
});

const me = asyncHandler(async (req, res) => {
  res.json({
    success: true,
    data: { id: req.user._id, name: req.user.name, email: req.user.email, role: req.user.role },
  });
});

module.exports = { login, logout, me };
