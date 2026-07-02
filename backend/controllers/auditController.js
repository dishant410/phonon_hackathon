const AuditEvidence = require('../models/AuditEvidence');
const ApiResponse = require('../utils/apiResponse');
const path = require('path');

const getEvidence = async (req, res) => {
  const { page = 1, limit = 10, control, reviewStatus } = req.query;
  const filter = {};
  if (control) filter.control = control;
  if (reviewStatus) filter.reviewStatus = reviewStatus;

  const skip = (page - 1) * limit;
  const [evidence, total] = await Promise.all([
    AuditEvidence.find(filter)
      .populate('control', 'controlId title')
      .populate('uploadedBy', 'name email')
      .populate('reviewedBy', 'name email')
      .skip(skip)
      .limit(parseInt(limit))
      .sort('-createdAt'),
    AuditEvidence.countDocuments(filter),
  ]);

  return ApiResponse.paginated(res, evidence, page, limit, total, 'Audit evidence retrieved');
};

const uploadEvidence = async (req, res) => {
  const evidenceData = {
    ...req.body,
    uploadedBy: req.user._id,
  };

  if (req.file) {
    evidenceData.fileName = req.file.originalname;
    evidenceData.fileUrl = `/uploads/evidence/${req.file.filename}`;
    evidenceData.fileSize = req.file.size;
    evidenceData.mimeType = req.file.mimetype;
  }

  const evidence = await AuditEvidence.create(evidenceData);
  await evidence.populate('control', 'controlId title');
  return ApiResponse.created(res, evidence, 'Evidence uploaded successfully');
};

const getEvidenceById = async (req, res) => {
  const evidence = await AuditEvidence.findById(req.params.id)
    .populate('control', 'controlId title description')
    .populate('uploadedBy', 'name email')
    .populate('reviewedBy', 'name email');

  if (!evidence) return ApiResponse.error(res, 'Evidence not found', 404);
  return ApiResponse.success(res, evidence, 'Evidence retrieved');
};

const reviewEvidence = async (req, res) => {
  const { reviewStatus, reviewComments } = req.body;
  if (!['approved', 'rejected'].includes(reviewStatus)) {
    return ApiResponse.error(res, 'Review status must be approved or rejected', 400);
  }

  const evidence = await AuditEvidence.findByIdAndUpdate(
    req.params.id,
    {
      reviewStatus,
      reviewComments,
      reviewedBy: req.user._id,
      reviewedAt: new Date(),
    },
    { new: true }
  ).populate('uploadedBy', 'name email');

  if (!evidence) return ApiResponse.error(res, 'Evidence not found', 404);
  return ApiResponse.success(res, evidence, `Evidence ${reviewStatus} successfully`);
};

const deleteEvidence = async (req, res) => {
  const evidence = await AuditEvidence.findByIdAndDelete(req.params.id);
  if (!evidence) return ApiResponse.error(res, 'Evidence not found', 404);
  return ApiResponse.success(res, null, 'Evidence deleted successfully');
};

module.exports = { getEvidence, uploadEvidence, getEvidenceById, reviewEvidence, deleteEvidence };
