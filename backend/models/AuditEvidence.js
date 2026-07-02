const mongoose = require('mongoose');
const { REVIEW_STATUS } = require('../config/constants');

const auditEvidenceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Evidence title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    description: {
      type: String,
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    control: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Control',
      required: [true, 'Associated control is required'],
    },
    evidenceType: {
      type: String,
      enum: ['document', 'screenshot', 'log', 'report', 'certificate', 'policy', 'procedure', 'other'],
      required: [true, 'Evidence type is required'],
    },
    fileName: String,
    fileUrl: String,
    fileSize: Number,
    mimeType: String,
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    reviewStatus: {
      type: String,
      enum: Object.values(REVIEW_STATUS),
      default: REVIEW_STATUS.PENDING,
    },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    reviewedAt: Date,
    reviewComments: String,
    validFrom: Date,
    validUntil: Date,
    period: {
      type: String,
      trim: true,
    },
    tags: [String],
  },
  { timestamps: true }
);

module.exports = mongoose.model('AuditEvidence', auditEvidenceSchema);
