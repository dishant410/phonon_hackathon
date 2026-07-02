const express = require('express');
const router = express.Router();
const { getEvidence, uploadEvidence, getEvidenceById, reviewEvidence, deleteEvidence } = require('../controllers/auditController');
const { protect } = require('../middleware/authMiddleware');
const { isAuditorOrAbove, isSecurityManagerOrAbove } = require('../middleware/roleMiddleware');
const upload = require('../services/fileService');

router.use(protect);

router.route('/')
  .get(getEvidence)
  .post(isAuditorOrAbove, upload.single('file'), uploadEvidence);

router.route('/:id')
  .get(getEvidenceById)
  .delete(isSecurityManagerOrAbove, deleteEvidence);

router.put('/:id/review', isSecurityManagerOrAbove, reviewEvidence);

module.exports = router;
