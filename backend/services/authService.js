const User = require('../models/User');
const { generateToken } = require('../utils/generateToken');
const logger = require('../utils/logger');

class AuthService {
  async register({ name, email, password, role, department }) {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      const error = new Error('Email already registered');
      error.statusCode = 409;
      throw error;
    }

    const user = await User.create({ name, email, password, role, department });
    const token = generateToken({ id: user._id, role: user.role });

    logger.info(`New user registered: ${email} (role: ${role})`);
    return { user, token };
  }

  async login({ email, password }) {
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      const error = new Error('Invalid credentials');
      error.statusCode = 401;
      throw error;
    }

    if (!user.isActive) {
      const error = new Error('Account deactivated. Contact administrator.');
      error.statusCode = 401;
      throw error;
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      const error = new Error('Invalid credentials');
      error.statusCode = 401;
      throw error;
    }

    user.lastLogin = new Date();
    await user.save({ validateBeforeSave: false });

    const token = generateToken({ id: user._id, role: user.role });
    logger.info(`User logged in: ${email}`);
    return { user, token };
  }

  async forgotPassword(email) {
    const user = await User.findOne({ email });
    if (!user) {
      // Don't reveal whether email exists
      return { message: 'If that email is registered, a reset link has been sent.' };
    }

    const token = user.generateResetToken();
    await user.save({ validateBeforeSave: false });

    // In production: send email. For MVP, return token
    logger.info(`Password reset token generated for: ${email}`);
    return {
      message: 'Password reset link sent (MOCK). Use the token below for demo.',
      resetToken: token, // Exposed for demo purposes only
    };
  }

  async resetPassword(token, newPassword) {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      const error = new Error('Invalid or expired reset token');
      error.statusCode = 400;
      throw error;
    }

    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    logger.info(`Password reset successfully for: ${user.email}`);
    return { message: 'Password reset successfully. Please login.' };
  }

  async getAllUsers(page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const [users, total] = await Promise.all([
      User.find().skip(skip).limit(limit).sort('-createdAt'),
      User.countDocuments(),
    ]);
    return { users, total };
  }

  async updateUserStatus(userId, isActive) {
    const user = await User.findByIdAndUpdate(userId, { isActive }, { new: true, runValidators: true });
    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }
    return user;
  }

  async updateUserRole(userId, role) {
    const user = await User.findByIdAndUpdate(userId, { role }, { new: true, runValidators: true });
    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }
    return user;
  }
}

module.exports = new AuthService();
