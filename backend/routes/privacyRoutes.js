const express = require('express');
const router = express.Router();
const { getObligations, createObligation, getObligationById, updateObligation, deleteObligation } = require('../controllers/privacyController');
const { protect } = require('../middleware/authMiddleware');
const { isAuditorOrAbove, isSecurityManagerOrAbove } = require('../middleware/roleMiddleware');

router.use(protect);

router.route('/')
  .get(isAuditorOrAbove, getObligations)
  .post(isSecurityManagerOrAbove, createObligation);

router.route('/:id')
  .get(isAuditorOrAbove, getObligationById)
  .put(isSecurityManagerOrAbove, updateObligation)
  .delete(isSecurityManagerOrAbove, deleteObligation);

module.exports = router;
