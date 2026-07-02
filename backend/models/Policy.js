const mongoose = require('mongoose');

const policyVersionSchema = new mongoose.Schema({
  version: { type: String, required: true },
  fileName: String,
  fileUrl: String,
  fileSize: Number,
  mimeType: String,
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  uploadedAt: { type: Date, default: Date.now },
  changeLog: String,
});

const policySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Policy title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    description: {
      type: String,
      maxlength: [3000, 'Description cannot exceed 3000 characters'],
    },
    category: {
      type: String,
      enum: ['security', 'privacy', 'compliance', 'operational', 'hr', 'it', 'governance', 'other'],
      required: [true, 'Category is required'],
    },
    framework: {
      type: [String],
      enum: ['SOC2', 'DPDP', 'ISO27001', 'GDPR'],
      default: ['SOC2'],
    },
    status: {
      type: String,
      enum: ['draft', 'review', 'approved', 'active', 'deprecated', 'expired'],
      default: 'draft',
    },
    approvalStatus: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    approvedAt: Date,
    rejectionReason: String,
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    effectiveDate: Date,
    expiryDate: Date,
    reviewDate: Date,
    currentVersion: { type: String, default: '1.0' },
    versions: [policyVersionSchema],
    // Latest file shortcut
    fileName: String,
    fileUrl: String,
    fileSize: Number,
    mimeType: String,
    tags: [String],
    linkedControls: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Control' }],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Policy', policySchema);
