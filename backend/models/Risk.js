const mongoose = require('mongoose');
const { RISK_STATUS, RISK_CATEGORIES, FRAMEWORKS } = require('../config/constants');

const riskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Risk title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: RISK_CATEGORIES,
    },
    likelihood: {
      type: Number,
      required: true,
      min: 1,
      max: 4,
      // 1=Low, 2=Medium, 3=High, 4=Critical
    },
    impact: {
      type: Number,
      required: true,
      min: 1,
      max: 4,
    },
    riskScore: {
      type: Number,
      // Computed: likelihood * impact
    },
    riskLevel: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'],
    },
    status: {
      type: String,
      enum: Object.values(RISK_STATUS),
      default: RISK_STATUS.OPEN,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Risk owner is required'],
    },
    mitigationPlan: {
      type: String,
      maxlength: [2000, 'Mitigation plan cannot exceed 2000 characters'],
    },
    framework: {
      type: [String],
      enum: FRAMEWORKS,
      default: ['SOC2'],
    },
    linkedControls: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Control',
      },
    ],
    dueDate: Date,
    tags: [String],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    lastReviewedAt: Date,
    lastReviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

// Auto-compute risk score and level
riskSchema.pre('save', function (next) {
  this.riskScore = this.likelihood * this.impact;
  if (this.riskScore <= 2) this.riskLevel = 'low';
  else if (this.riskScore <= 6) this.riskLevel = 'medium';
  else if (this.riskScore <= 12) this.riskLevel = 'high';
  else this.riskLevel = 'critical';
  next();
});

module.exports = mongoose.model('Risk', riskSchema);
