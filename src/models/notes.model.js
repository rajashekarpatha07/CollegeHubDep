import mongoose, { Schema } from "mongoose";
const notesSchema = new Schema({
    subject: {
      type: String,
      required: true,
      trim: true
    },
    branch: {
      type: String,
      required: true,
      enum: ['CSE', 'ECE', 'EEE', 'MECH', 'CIVIL', 'IT', 'CSC', 'OTHER']
    },
    sem: {
      type: Number,
      required: true,
      min: 1,
      max: 8
    },
    unit: {
      type: Number,
      required: true,
    },
    fileUrl: {
      type: String,
      required: true,
      validate: {
        validator: function(url) {
          // Accept both ImageKit URLs (https://ik.imagekit.io) and local paths (/uploads/...)
          return url && (url.startsWith('http') || url.startsWith('/uploads/'));
        },
        message: 'Invalid file URL - must be a valid HTTP URL or local path'
      }
    },
    fileId: {
      type: String,
      // Not required as legacy records might not have it
    },
    isLocalStorage: {
      type: Boolean,
      default: false
    },
    uploadedBy: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      trim: true
    }
  }, {
    timestamps: true
  });

export const Notes = mongoose.model('Notes', notesSchema);