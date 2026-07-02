const Risk = require('../models/Risk');
const RiskActivity = require('../models/RiskActivity');
const ApiResponse = require('../utils/apiResponse');

/* ─── LIST (paginated, filtered, searched) ─── */
const getRisks = async (req, res) => {
  const {
    page = 1, limit = 10,
    status, category, framework, riskLevel,
    priority, owner, department,
    search, sortBy = 'createdAt', sortOrder = 'desc',
  } = req.query;

  const filter = {};
  if (status) filter.status = status;
  if (category) filter.category = category;
  if (framework) filter.framework = { $in: [framework] };
  if (riskLevel) filter.riskLevel = riskLevel;
  if (priority) filter.priority = priority;
  if (owner) filter.owner = owner;
  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
    ];
  }

  const sortDir = sortOrder === 'asc' ? 1 : -1;
  const skip = (parseInt(page) - 1) * parseInt(limit);

  const [risks, total] = await Promise.all([
    Risk.find(filter)
      .populate('owner', 'name email role department')
      .populate('createdBy', 'name email')
      .populate('linkedControls', 'controlId title status')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ [sortBy]: sortDir }),
    Risk.countDocuments(filter),
  ]);

  return ApiResponse.paginated(res, risks, page, limit, total);
};

/* ─── CREATE ─── */
const createRisk = async (req, res) => {
  const risk = await Risk.create({ ...req.body, createdBy: req.user._id });
  await risk.populate('owner', 'name email');

  // Create activity tracker
  await RiskActivity.create({
    risk: risk._id,
    timeline: [{
      event: 'Risk Created',
      description: `Risk "${risk.title}" was created`,
      performedBy: req.user._id,
    }],
  });

  return ApiResponse.created(res, risk, 'Risk created successfully');
};

/* ─── GET BY ID ─── */
const getRiskById = async (req, res) => {
  const [risk, activity] = await Promise.all([
    Risk.findById(req.params.id)
      .populate('owner', 'name email role department')
      .populate('createdBy', 'name email')
      .populate('lastReviewedBy', 'name email')
      .populate('linkedControls', 'controlId title status type'),
    RiskActivity.findOne({ risk: req.params.id })
      .populate('comments.author', 'name email role')
      .populate('timeline.performedBy', 'name email'),
  ]);

  if (!risk) return ApiResponse.error(res, 'Risk not found', 404);
  return ApiResponse.success(res, { ...risk.toJSON(), activity }, 'Risk retrieved');
};

/* ─── UPDATE ─── */
const updateRisk = async (req, res) => {
  const before = await Risk.findById(req.params.id);
  if (!before) return ApiResponse.error(res, 'Risk not found', 404);

  const risk = await Risk.findByIdAndUpdate(
    req.params.id,
    { ...req.body, lastReviewedAt: new Date(), lastReviewedBy: req.user._id },
    { new: true, runValidators: true }
  ).populate('owner', 'name email');

  // Log timeline
  const changes = [];
  if (req.body.status && req.body.status !== before.status)
    changes.push(`Status changed from "${before.status}" to "${req.body.status}"`);
  if (req.body.riskLevel && req.body.riskLevel !== before.riskLevel)
    changes.push(`Risk level changed to "${req.body.riskLevel}"`);

  await RiskActivity.findOneAndUpdate(
    { risk: risk._id },
    {
      $push: {
        timeline: {
          event: 'Risk Updated',
          description: changes.length ? changes.join('; ') : 'Risk details updated',
          performedBy: req.user._id,
        },
      },
    },
    { upsert: true }
  );

  return ApiResponse.success(res, risk, 'Risk updated successfully');
};

/* ─── DELETE ─── */
const deleteRisk = async (req, res) => {
  const risk = await Risk.findByIdAndDelete(req.params.id);
  if (!risk) return ApiResponse.error(res, 'Risk not found', 404);
  await RiskActivity.findOneAndDelete({ risk: req.params.id });
  return ApiResponse.success(res, null, 'Risk deleted successfully');
};

/* ─── ADD COMMENT ─── */
const addComment = async (req, res) => {
  const { text } = req.body;
  if (!text) return ApiResponse.error(res, 'Comment text is required', 400);

  const activity = await RiskActivity.findOneAndUpdate(
    { risk: req.params.id },
    { $push: { comments: { text, author: req.user._id } } },
    { new: true, upsert: true }
  ).populate('comments.author', 'name email role');

  return ApiResponse.success(res, activity.comments, 'Comment added');
};

/* ─── GET COMMENTS ─── */
const getComments = async (req, res) => {
  const activity = await RiskActivity.findOne({ risk: req.params.id })
    .populate('comments.author', 'name email role');
  return ApiResponse.success(res, activity?.comments || [], 'Comments retrieved');
};

/* ─── GET TIMELINE ─── */
const getTimeline = async (req, res) => {
  const activity = await RiskActivity.findOne({ risk: req.params.id })
    .populate('timeline.performedBy', 'name email');
  return ApiResponse.success(res, activity?.timeline || [], 'Timeline retrieved');
};

module.exports = { getRisks, createRisk, getRiskById, updateRisk, deleteRisk, addComment, getComments, getTimeline };
