const jwt = require('jsonwebtoken');
const User = require('../models/User');

async function protect(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        message: 'Authentication required. Please log in.',
      });
    }

    const token = authHeader.split(' ')[1];

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({
        message: 'Server authentication is not configured.',
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({
        message: 'User account not found.',
      });
    }

    req.user = {
      id: user._id.toString(),
      role: user.role,
    };

    next();
  } catch (error) {
    if (
      error.name === 'JsonWebTokenError' ||
      error.name === 'TokenExpiredError'
    ) {
      return res.status(401).json({
        message: 'Invalid or expired token. Please log in again.',
      });
    }

    console.error('Authentication error:', error.message);

    return res.status(500).json({
      message: 'Authentication failed.',
    });
  }
}

function workerOnly(req, res, next) {
  if (req.user.role !== 'worker') {
    return res.status(403).json({
      message: 'Only workers can perform this action.',
    });
  }
  next();
}

module.exports = { protect, workerOnly };