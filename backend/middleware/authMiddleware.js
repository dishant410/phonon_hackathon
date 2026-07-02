const { verifyToken } = require('../utils/generateToken');
const User = require('../models/User');
const ApiResponse = require('../utils/apiResponse');

const protect = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return ApiResponse.error(res, 'Not authorized. No token provided.', 401);
    }

    const decoded = verifyToken(token);
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return ApiResponse.error(res, 'User not found. Token invalid.', 401);
    }

    if (!user.isActive) {
      return ApiResponse.error(res, 'Account is deactivated. Contact administrator.', 401);
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return ApiResponse.error(res, 'Invalid token.', 401);
    }
    if (error.name === 'TokenExpiredError') {
      return ApiResponse.error(res, 'Token expired. Please login again.', 401);
    }
    next(error);
  }
};

module.exports = { protect };
