const express = require('express');
const router = express.Router();
const {
  getRisks, createRisk, getRiskById, updateRisk, deleteRisk,
  addComment, getComments, getTimeline,
} = require('../controllers/riskController');
const { protect } = require('../middleware/authMiddleware');
const { isSecurityManagerOrAbove } = require('../middleware/roleMiddleware');
const { validate } = require('../middleware/validationMiddleware');
const { createRiskValidation, updateRiskValidation } = require('../validators/riskValidator');

router.use(protect);

router.route('/')
  .get(getRisks)
  .post(isSecurityManagerOrAbove, validate(createRiskValidation), createRisk);

router.route('/:id')
  .get(getRiskById)
  .put(isSecurityManagerOrAbove, validate(updateRiskValidation), updateRisk)
  .delete(isSecurityManagerOrAbove, deleteRisk);

router.get('/:id/comments', getComments);
router.post('/:id/comments', addComment);
router.get('/:id/timeline', getTimeline);

module.exports = router;
