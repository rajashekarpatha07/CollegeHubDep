import mongoose, {Schema} from 'mongoose';
const noticeSchema = new Schema({
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true,
      trim: true
    },
    sem: {
      type: Number,
      required: false, // Making this optional if notice is for all semesters
      min: 1,
      max: 8
    },
    branch: {
      type: String,
      required: false, // Making this optional if notice is for all branches
      enum: ['CSE', 'ECE', 'EEE', 'MECH', 'CIVIL', 'IT', 'OTHER', 'ALL','CSC']
    },
    
    batchyear: {
      type: Number,
      required: true,
      enum: [23, 24, 25, 26]
    },
    postedBy: {
      type: String,
      required: true,
      trim: true
    },
    expiresAt: {
      type: Date,
      default: function() {
        const date = new Date();
        date.setMonth(date.getMonth() + 8);
        return date;
      }
    }
  }, {
    timestamps: true
  });
export const Notice = mongoose.model('Notice', noticeSchema);