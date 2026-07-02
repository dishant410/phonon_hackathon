const express = require('express');
const router = express.Router();
const { register, login, logout, getMe, forgotPassword, resetPassword, getAllUsers, updateUserStatus, updateUserRole } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const { isAdmin } = require('../middleware/roleMiddleware');
const { validate } = require('../middleware/validationMiddleware');
const { registerValidation, loginValidation, forgotPasswordValidation, resetPasswordValidation } = require('../validators/authValidator');

router.post('/register', validate(registerValidation), register);
router.post('/login', validate(loginValidation), login);
router.post('/logout', protect, logout);
router.get('/me', protect, getMe);
router.post('/forgot-password', validate(forgotPasswordValidation), forgotPassword);
router.post('/reset-password', validate(resetPasswordValidation), resetPassword);

// Admin routes
router.get('/users', protect, isAdmin, getAllUsers);
router.patch('/users/:id/status', protect, isAdmin, updateUserStatus);
router.patch('/users/:id/role', protect, isAdmin, updateUserRole);

module.exports = router;
