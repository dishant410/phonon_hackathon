const ApiResponse = require('../utils/apiResponse');

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return ApiResponse.error(res, 'Authentication required.', 401);
    }

    if (!roles.includes(req.user.role)) {
      return ApiResponse.error(
        res,
        `Access denied. Required role(s): ${roles.join(', ')}. Your role: ${req.user.role}`,
        403
      );
    }

    next();
  };
};

// Convenience role checks
const isAdmin = authorize('admin');
const isSecurityManagerOrAbove = authorize('admin', 'security_manager');
const isAuditorOrAbove = authorize('admin', 'security_manager', 'auditor');

module.exports = { authorize, isAdmin, isSecurityManagerOrAbove, isAuditorOrAbove };
