const Policy = require('../models/Policy');
const ApiResponse = require('../utils/apiResponse');
const path = require('path');
const fs = require('fs');

/* ─── LIST ─── */
const getPolicies = async (req, res) => {
  const {
    page = 1, limit = 10,
    status, category, framework, approvalStatus,
    search, sortBy = 'createdAt', sortOrder = 'desc',
  } = req.query;

  const filter = {};
  if (status) filter.status = status;
  if (category) filter.category = category;
  if (framework) filter.framework = { $in: [framework] };
  if (approvalStatus) filter.approvalStatus = approvalStatus;
  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
    ];
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const [policies, total] = await Promise.all([
    Policy.find(filter)
      .populate('owner', 'name email role')
      .populate('approvedBy', 'name email')
      .populate('createdBy', 'name email')
      .select('-versions') // exclude version history in list view
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ [sortBy]: sortOrder === 'asc' ? 1 : -1 }),
    Policy.countDocuments(filter),
  ]);

  return ApiResponse.paginated(res, policies, page, limit, total);
};

/* ─── CREATE ─── */
const createPolicy = async (req, res) => {
  const policyData = { ...req.body, createdBy: req.user._id };

  if (req.file) {
    policyData.fileName = req.file.originalname;
    policyData.fileUrl = `/uploads/policies/${req.file.filename}`;
    policyData.fileSize = req.file.size;
    policyData.mimeType = req.file.mimetype;
    policyData.currentVersion = '1.0';
    policyData.versions = [{
      version: '1.0',
      fileName: req.file.originalname,
      fileUrl: policyData.fileUrl,
      fileSize: req.file.size,
      mimeType: req.file.mimetype,
      uploadedBy: req.user._id,
      changeLog: 'Initial version',
    }];
  }

  const policy = await Policy.create(policyData);
  await policy.populate('owner', 'name email');
  return ApiResponse.created(res, policy, 'Policy created successfully');
};

/* ─── GET BY ID ─── */
const getPolicyById = async (req, res) => {
  const policy = await Policy.findById(req.params.id)
    .populate('owner', 'name email role department')
    .populate('approvedBy', 'name email')
    .populate('createdBy', 'name email')
    .populate('versions.uploadedBy', 'name email')
    .populate('linkedControls', 'controlId title status');

  if (!policy) return ApiResponse.error(res, 'Policy not found', 404);
  return ApiResponse.success(res, policy, 'Policy retrieved');
};

/* ─── UPDATE ─── */
const updatePolicy = async (req, res) => {
  const policy = await Policy.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  ).populate('owner', 'name email');

  if (!policy) return ApiResponse.error(res, 'Policy not found', 404);
  return ApiResponse.success(res, policy, 'Policy updated successfully');
};

/* ─── DELETE ─── */
const deletePolicy = async (req, res) => {
  const policy = await Policy.findByIdAndDelete(req.params.id);
  if (!policy) return ApiResponse.error(res, 'Policy not found', 404);
  return ApiResponse.success(res, null, 'Policy deleted successfully');
};

/* ─── UPLOAD NEW VERSION ─── */
const uploadNewVersion = async (req, res) => {
  const policy = await Policy.findById(req.params.id);
  if (!policy) return ApiResponse.error(res, 'Policy not found', 404);
  if (!req.file) return ApiResponse.error(res, 'File is required', 400);

  // Increment version
  const parts = policy.currentVersion.split('.');
  const newVersion = `${parts[0]}.${parseInt(parts[1] || 0) + 1}`;

  const fileUrl = `/uploads/policies/${req.file.filename}`;

  await Policy.findByIdAndUpdate(req.params.id, {
    fileName: req.file.originalname,
    fileUrl,
    fileSize: req.file.size,
    mimeType: req.file.mimetype,
    currentVersion: newVersion,
    $push: {
      versions: {
        version: newVersion,
        fileName: req.file.originalname,
        fileUrl,
        fileSize: req.file.size,
        mimeType: req.file.mimetype,
        uploadedBy: req.user._id,
        changeLog: req.body.changeLog || 'Version updated',
      },
    },
  });

  const updated = await Policy.findById(req.params.id).populate('versions.uploadedBy', 'name email');
  return ApiResponse.success(res, updated, `Policy updated to version ${newVersion}`);
};

/* ─── APPROVE / REJECT ─── */
const reviewPolicy = async (req, res) => {
  const { action, rejectionReason } = req.body;
  if (!['approve', 'reject'].includes(action)) {
    return ApiResponse.error(res, 'Action must be approve or reject', 400);
  }

  const updateData = {
    approvalStatus: action === 'approve' ? 'approved' : 'rejected',
    approvedBy: req.user._id,
    approvedAt: new Date(),
  };
  if (action === 'approve') updateData.status = 'active';
  if (action === 'reject' && rejectionReason) updateData.rejectionReason = rejectionReason;

  const policy = await Policy.findByIdAndUpdate(req.params.id, updateData, { new: true })
    .populate('approvedBy', 'name email');

  if (!policy) return ApiResponse.error(res, 'Policy not found', 404);
  return ApiResponse.success(res, policy, `Policy ${action === 'approve' ? 'approved' : 'rejected'} successfully`);
};

/* ─── GET VERSION HISTORY ─── */
const getVersionHistory = async (req, res) => {
  const policy = await Policy.findById(req.params.id)
    .select('title currentVersion versions')
    .populate('versions.uploadedBy', 'name email');

  if (!policy) return ApiResponse.error(res, 'Policy not found', 404);
  return ApiResponse.success(res, policy.versions, 'Version history retrieved');
};

module.exports = {
  getPolicies, createPolicy, getPolicyById, updatePolicy, deletePolicy,
  uploadNewVersion, reviewPolicy, getVersionHistory,
};
