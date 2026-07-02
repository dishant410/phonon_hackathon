const { body } = require('express-validator');
const { CONTROL_TYPES, CONTROL_STATUS, FRAMEWORKS } = require('../config/constants');

const createControlValidation = [
  body('controlId').trim().notEmpty().withMessage('Control ID is required').isLength({ max: 20 }),
  body('title').trim().notEmpty().withMessage('Title is required').isLength({ max: 200 }),
  body('description').trim().notEmpty().withMessage('Description is required').isLength({ max: 2000 }),
  body('type').notEmpty().withMessage('Control type is required').isIn(CONTROL_TYPES).withMessage('Invalid type'),
  body('status').optional().isIn(Object.values(CONTROL_STATUS)),
  body('owner').optional().isMongoId(),
  body('framework').optional().isArray(),
];

const updateControlValidation = [
  body('title').optional().trim().isLength({ max: 200 }),
  body('description').optional().trim().isLength({ max: 2000 }),
  body('type').optional().isIn(CONTROL_TYPES),
  body('status').optional().isIn(Object.values(CONTROL_STATUS)),
  body('owner').optional().isMongoId(),
];

module.exports = { createControlValidation, updateControlValidation };
