const mongoose = require('mongoose');
const { CONTROL_STATUS, CONTROL_TYPES, FRAMEWORKS } = require('../config/constants');

const controlSchema = new mongoose.Schema(
  {
    controlId: {
      type: String,
      required: [true, 'Control ID is required'],
      unique: true,
      trim: true,
      uppercase: true,
    },
    title: {
      type: String,
      required: [true, 'Control title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    type: {
      type: String,
      enum: CONTROL_TYPES,
      required: [true, 'Control type is required'],
    },
    status: {
      type: String,
      enum: Object.values(CONTROL_STATUS),
      default: CONTROL_STATUS.PLANNED,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    linkedRisks: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Risk',
      },
    ],
    framework: {
      type: [String],
      enum: FRAMEWORKS,
      default: ['SOC2'],
    },
    soc2Category: {
      type: String,
      enum: ['CC1', 'CC2', 'CC3', 'CC4', 'CC5', 'CC6', 'CC7', 'CC8', 'CC9', 'A1', 'C1', 'PI1', 'P1', 'P2', 'P3', 'P4', 'P5', 'P6', 'P7', 'P8'],
    },
    testingProcedure: String,
    lastReviewDate: Date,
    nextReviewDate: Date,
    evidenceRequired: {
      type: Boolean,
      default: true,
    },
    tags: [String],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Control', controlSchema);
