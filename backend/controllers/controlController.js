const Control = require('../models/Control');
const ApiResponse = require('../utils/apiResponse');

/* ─── LIST ─── */
const getControls = async (req, res) => {
  const {
    page = 1, limit = 10,
    status, type, framework, soc2Category,
    owner, search,
    sortBy = 'createdAt', sortOrder = 'desc',
  } = req.query;

  const filter = {};
  if (status) filter.status = status;
  if (type) filter.type = type;
  if (framework) filter.framework = { $in: [framework] };
  if (soc2Category) filter.soc2Category = soc2Category;
  if (owner) filter.owner = owner;
  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: 'i' } },
      { controlId: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
    ];
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const [controls, total] = await Promise.all([
    Control.find(filter)
      .populate('owner', 'name email role department')
      .populate('createdBy', 'name email')
      .populate('linkedRisks', 'title riskLevel status')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ [sortBy]: sortOrder === 'asc' ? 1 : -1 }),
    Control.countDocuments(filter),
  ]);

  return ApiResponse.paginated(res, controls, page, limit, total);
};

/* ─── CREATE ─── */
const createControl = async (req, res) => {
  const control = await Control.create({ ...req.body, createdBy: req.user._id });
  await control.populate('owner', 'name email');
  return ApiResponse.created(res, control, 'Control created successfully');
};

/* ─── GET BY ID ─── */
const getControlById = async (req, res) => {
  const control = await Control.findById(req.params.id)
    .populate('owner', 'name email role department')
    .populate('createdBy', 'name email')
    .populate('linkedRisks', 'title riskLevel status category');

  if (!control) return ApiResponse.error(res, 'Control not found', 404);
  return ApiResponse.success(res, control, 'Control retrieved');
};

/* ─── UPDATE ─── */
const updateControl = async (req, res) => {
  const control = await Control.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  ).populate('owner', 'name email');

  if (!control) return ApiResponse.error(res, 'Control not found', 404);
  return ApiResponse.success(res, control, 'Control updated successfully');
};

/* ─── DELETE ─── */
const deleteControl = async (req, res) => {
  const control = await Control.findByIdAndDelete(req.params.id);
  if (!control) return ApiResponse.error(res, 'Control not found', 404);
  return ApiResponse.success(res, null, 'Control deleted successfully');
};

/* ─── ASSIGN OWNER ─── */
const assignOwner = async (req, res) => {
  const { owner } = req.body;
  if (!owner) return ApiResponse.error(res, 'Owner is required', 400);

  const control = await Control.findByIdAndUpdate(
    req.params.id,
    { owner },
    { new: true }
  ).populate('owner', 'name email role');

  if (!control) return ApiResponse.error(res, 'Control not found', 404);
  return ApiResponse.success(res, control, 'Owner assigned successfully');
};

/* ─── UPDATE STATUS ─── */
const updateStatus = async (req, res) => {
  const { status, nextReviewDate } = req.body;
  if (!status) return ApiResponse.error(res, 'Status is required', 400);

  const updateData = { status };
  if (status === 'implemented') updateData.lastReviewDate = new Date();
  if (nextReviewDate) updateData.nextReviewDate = nextReviewDate;

  const control = await Control.findByIdAndUpdate(
    req.params.id,
    updateData,
    { new: true, runValidators: true }
  ).populate('owner', 'name email');

  if (!control) return ApiResponse.error(res, 'Control not found', 404);
  return ApiResponse.success(res, control, 'Status updated successfully');
};

module.exports = { getControls, createControl, getControlById, updateControl, deleteControl, assignOwner, updateStatus };
