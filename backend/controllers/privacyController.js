const PrivacyObligation = require('../models/PrivacyObligation');
const ApiResponse = require('../utils/apiResponse');

const getObligations = async (req, res) => {
  const { page = 1, limit = 10, status, obligationType } = req.query;
  const filter = {};
  if (status) filter.status = status;
  if (obligationType) filter.obligationType = obligationType;

  const skip = (page - 1) * limit;
  const [obligations, total] = await Promise.all([
    PrivacyObligation.find(filter)
      .populate('responsibleParty', 'name email')
      .populate('createdBy', 'name email')
      .skip(skip)
      .limit(parseInt(limit))
      .sort('-createdAt'),
    PrivacyObligation.countDocuments(filter),
  ]);

  return ApiResponse.paginated(res, obligations, page, limit, total, 'Privacy obligations retrieved');
};

const createObligation = async (req, res) => {
  const obligation = await PrivacyObligation.create({ ...req.body, createdBy: req.user._id });
  return ApiResponse.created(res, obligation, 'Privacy obligation created successfully');
};

const getObligationById = async (req, res) => {
  const obligation = await PrivacyObligation.findById(req.params.id)
    .populate('responsibleParty', 'name email department')
    .populate('createdBy', 'name email');

  if (!obligation) return ApiResponse.error(res, 'Obligation not found', 404);
  return ApiResponse.success(res, obligation, 'Obligation retrieved');
};

const updateObligation = async (req, res) => {
  const updateData = { ...req.body };
  if (req.body.status === 'completed' && !req.body.completedAt) {
    updateData.completedAt = new Date();
  }

  const obligation = await PrivacyObligation.findByIdAndUpdate(req.params.id, updateData, {
    new: true,
    runValidators: true,
  }).populate('responsibleParty', 'name email');

  if (!obligation) return ApiResponse.error(res, 'Obligation not found', 404);
  return ApiResponse.success(res, obligation, 'Obligation updated successfully');
};

const deleteObligation = async (req, res) => {
  const obligation = await PrivacyObligation.findByIdAndDelete(req.params.id);
  if (!obligation) return ApiResponse.error(res, 'Obligation not found', 404);
  return ApiResponse.success(res, null, 'Obligation deleted successfully');
};

module.exports = { getObligations, createObligation, getObligationById, updateObligation, deleteObligation };
