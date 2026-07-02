const mongoose = require('mongoose');
const { PRIVACY_OBLIGATION_TYPES } = require('../config/constants');

const privacyObligationSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    description: {
      type: String,
      maxlength: [3000, 'Description cannot exceed 3000 characters'],
    },
    obligationType: {
      type: String,
      enum: PRIVACY_OBLIGATION_TYPES,
      required: [true, 'Obligation type is required'],
    },
    dpdpSection: {
      type: String,
      trim: true,
      // Reference to DPDP Act section e.g. "Section 4", "Section 7"
    },
    status: {
      type: String,
      enum: ['pending', 'in_progress', 'completed', 'overdue', 'not_applicable'],
      default: 'pending',
    },
    responsibleParty: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    dueDate: {
      type: Date,
    },
    completedAt: Date,
    dataSubjectCategory: {
      type: String,
      enum: ['customer', 'employee', 'vendor', 'public', 'other'],
    },
    dataCategories: [String],
    retentionPeriod: String,
    crossBorderTransfer: {
      type: Boolean,
      default: false,
    },
    transferCountries: [String],
    notes: String,
    evidenceLinks: [String],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

// Auto set status to overdue based on dueDate
privacyObligationSchema.pre('find', function () {
  this.where({ dueDate: { $lt: new Date() }, status: { $nin: ['completed', 'not_applicable'] } }).updateMany(
    { status: 'overdue' }
  );
});

module.exports = mongoose.model('PrivacyObligation', privacyObligationSchema);
