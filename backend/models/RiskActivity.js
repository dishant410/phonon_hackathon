const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  text: { type: String, required: true, maxlength: 1000 },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
});

const timelineEventSchema = new mongoose.Schema({
  event: { type: String, required: true },
  description: String,
  performedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
});

// Extend the existing Risk model with comments & timeline
// This is a separate enrichment model to avoid changing the existing Risk schema
const riskActivitySchema = new mongoose.Schema(
  {
    risk: { type: mongoose.Schema.Types.ObjectId, ref: 'Risk', required: true, unique: true },
    comments: [commentSchema],
    timeline: [timelineEventSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model('RiskActivity', riskActivitySchema);
