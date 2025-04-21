import mongoose, { Schema } from "mongoose";

const questionPaperSchema = new Schema({
    subject: {
      type: String,
      required: true,
      trim: true
    },
    year: {
      type: String,
      required: true,
      trim: true,
    },
    branch: {
      type: String,
      required: true,
      enum: ['CSE', 'ECE', 'EEE', 'MECH', 'CIVIL', 'IT', 'OTHER', 'CSC']
    },
    sem: {
      type: String,
      required: true,
      min: 1,
      max: 8
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
      trim: true
    }
  }, {
    timestamps: true
  });

export const QuestionPaper = mongoose.model('QuestionPaper', questionPaperSchema);