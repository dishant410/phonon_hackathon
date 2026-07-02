const authService = require('../services/authService');
const ApiResponse = require('../utils/apiResponse');

const register = async (req, res) => {
  const result = await authService.register(req.body);
  return ApiResponse.created(res, result, 'Registration successful');
};

const login = async (req, res) => {
  const result = await authService.login(req.body);
  return ApiResponse.success(res, result, 'Login successful');
};

const logout = async (req, res) => {
  // JWT is stateless – client clears the token
  return ApiResponse.success(res, null, 'Logged out successfully');
};

const getMe = async (req, res) => {
  return ApiResponse.success(res, req.user, 'User profile retrieved');
};

const forgotPassword = async (req, res) => {
  const result = await authService.forgotPassword(req.body.email);
  return ApiResponse.success(res, result, result.message);
};

const resetPassword = async (req, res) => {
  const result = await authService.resetPassword(req.body.token, req.body.password);
  return ApiResponse.success(res, null, result.message);
};

// Admin endpoints
const getAllUsers = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const result = await authService.getAllUsers(page, limit);
  return ApiResponse.paginated(res, result.users, page, limit, result.total, 'Users retrieved');
};

const updateUserStatus = async (req, res) => {
  const user = await authService.updateUserStatus(req.params.id, req.body.isActive);
  return ApiResponse.success(res, user, 'User status updated');
};

const updateUserRole = async (req, res) => {
  const user = await authService.updateUserRole(req.params.id, req.body.role);
  return ApiResponse.success(res, user, 'User role updated');
};

module.exports = { register, login, logout, getMe, forgotPassword, resetPassword, getAllUsers, updateUserStatus, updateUserRole };
