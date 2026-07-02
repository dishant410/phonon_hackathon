const { body } = require('express-validator');
const { RISK_CATEGORIES, FRAMEWORKS } = require('../config/constants');

const createRiskValidation = [
  body('title').trim().notEmpty().withMessage('Title is required').isLength({ max: 200 }).withMessage('Title too long'),
  body('description').trim().notEmpty().withMessage('Description is required').isLength({ max: 2000 }),
  body('category').notEmpty().withMessage('Category is required').isIn(RISK_CATEGORIES).withMessage('Invalid category'),
  body('likelihood').notEmpty().withMessage('Likelihood is required').isInt({ min: 1, max: 4 }).withMessage('Likelihood must be 1-4'),
  body('impact').notEmpty().withMessage('Impact is required').isInt({ min: 1, max: 4 }).withMessage('Impact must be 1-4'),
  body('owner').notEmpty().withMessage('Owner is required').isMongoId().withMessage('Invalid owner ID'),
  body('framework').optional().isArray(),
  body('status').optional().isIn(['open', 'in_progress', 'mitigated', 'accepted', 'closed']),
];

const updateRiskValidation = [
  body('title').optional().trim().isLength({ max: 200 }),
  body('description').optional().trim().isLength({ max: 2000 }),
  body('category').optional().isIn(RISK_CATEGORIES),
  body('likelihood').optional().isInt({ min: 1, max: 4 }),
  body('impact').optional().isInt({ min: 1, max: 4 }),
  body('owner').optional().isMongoId(),
  body('status').optional().isIn(['open', 'in_progress', 'mitigated', 'accepted', 'closed']),
];

module.exports = { createRiskValidation, updateRiskValidation };
