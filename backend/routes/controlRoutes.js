const express = require('express');
const router = express.Router();
const {
  getControls, createControl, getControlById, updateControl,
  deleteControl, assignOwner, updateStatus,
} = require('../controllers/controlController');
const { protect } = require('../middleware/authMiddleware');
const { isSecurityManagerOrAbove } = require('../middleware/roleMiddleware');
const { validate } = require('../middleware/validationMiddleware');
const { createControlValidation, updateControlValidation } = require('../validators/controlValidator');

router.use(protect);

router.route('/')
  .get(getControls)
  .post(isSecurityManagerOrAbove, validate(createControlValidation), createControl);

router.route('/:id')
  .get(getControlById)
  .put(isSecurityManagerOrAbove, validate(updateControlValidation), updateControl)
  .delete(isSecurityManagerOrAbove, deleteControl);

router.patch('/:id/owner', isSecurityManagerOrAbove, assignOwner);
router.patch('/:id/status', isSecurityManagerOrAbove, updateStatus);

module.exports = router;
