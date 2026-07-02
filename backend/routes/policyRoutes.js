const express = require('express');
const router = express.Router();
const {
  getPolicies, createPolicy, getPolicyById, updatePolicy, deletePolicy,
  uploadNewVersion, reviewPolicy, getVersionHistory,
} = require('../controllers/policyController');
const { protect } = require('../middleware/authMiddleware');
const { isSecurityManagerOrAbove } = require('../middleware/roleMiddleware');
const upload = require('../services/fileService');

// Multer config for policies dir
const policyUpload = require('multer')({
  storage: require('multer').diskStorage({
    destination: (req, file, cb) => {
      const path = require('path');
      const fs = require('fs');
      const dir = path.join(__dirname, '../uploads/policies');
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      cb(null, dir);
    },
    filename: (req, file, cb) => {
      const ext = require('path').extname(file.originalname);
      cb(null, `policy-${Date.now()}-${Math.round(Math.random() * 1e6)}${ext}`);
    },
  }),
  limits: { fileSize: 10 * 1024 * 1024 },
});

router.use(protect);

router.route('/')
  .get(getPolicies)
  .post(isSecurityManagerOrAbove, policyUpload.single('file'), createPolicy);

router.route('/:id')
  .get(getPolicyById)
  .put(isSecurityManagerOrAbove, updatePolicy)
  .delete(isSecurityManagerOrAbove, deletePolicy);

router.post('/:id/version', isSecurityManagerOrAbove, policyUpload.single('file'), uploadNewVersion);
router.post('/:id/review', isSecurityManagerOrAbove, reviewPolicy);
router.get('/:id/history', getVersionHistory);

module.exports = router;
