const { validationResult } = require('express-validator');
const ApiResponse = require('../utils/apiResponse');

const validate = (validations) => {
  return async (req, res, next) => {
    // Run all validations
    for (const validation of validations) {
      const result = await validation.run(req);
      if (!result.isEmpty()) break;
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const formattedErrors = errors.array().map((err) => ({
        field: err.path,
        message: err.msg,
        value: err.value,
      }));
      return ApiResponse.error(res, 'Validation failed', 422, formattedErrors);
    }

    next();
  };
};

module.exports = { validate };
