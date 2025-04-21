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
        validator: url => /^https?:\/\/.+/.test(url),
        message: 'Invalid file URL'
      }
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