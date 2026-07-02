const express = require('express');
const router = express.Router();
const { getStats, getRiskMatrix, getComplianceScore } = require('../controllers/dashboardController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/stats', getStats);
router.get('/risk-matrix', getRiskMatrix);
router.get('/compliance-score', getComplianceScore);

module.exports = router;
