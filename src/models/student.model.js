import mongoose, {Schema} from 'mongoose';
import bycrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
const studentSchema = new Schema({
    rollnumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      validate: {
        validator: function(v) {
          // Validation pattern for roll number - can be customized
          return /^[A-Za-z0-9]+$/.test(v);
        },
        message: props => `${props.value} is not a valid roll number!`
      }
    },
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [50, 'Name cannot exceed 50 characters']
    },
    branch: {
      type: String,
      required: true,
      enum: ['CSE', 'ECE', 'EEE', 'MECH', 'CIVIL', 'IT', 'CSC', 'DS', 'OTHER']
    },
    sem: {
      type: Number,
      required: true,
      min: 1,
      max: 8
    },
    phonenumber: {
      type: String,
      required: true,
      validate: {
        validator: function(v) {
          return /^\d{10}$/.test(v);
        },
        message: props => `${props.value} is not a valid 10-digit phone number!`
      }
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      validate: {
        validator: function(v) {
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
        },
        message: props => `${props.value} is not a valid email address!`
      }
    },
    password: {
      type: String,
      required: true,
      minlength: [8, 'Password must be at least 8 characters']
      // Note: Passwords should be hashed before storing
    },
    refreshtoken: {
      type: String
    }
  }, {
    timestamps: true // This replaces the separate TimeStamps field
  });

studentSchema.pre('save', async function(next){
    if(this.isModified('password')){
        this.password = await bycrypt.hash(this.password, 8);
    }
    next();
})

studentSchema.methods.isPasswordMatch = async function(password){
    return await bycrypt.compare(password, this.password);
}

studentSchema.methods.generateAccessToken = async function(){
    return jwt.sign(
      {id: this._id}, 
      process.env.ACCESS_TOKEN_SECRET, 
      {expiresIn: process.env.ACCESS_TOKEN_LIFE});
}

studentSchema.methods.generateRefreshToken = async function(){
    return jwt.sign(
      {id: this._id}, 
      process.env.REFRESH_TOKEN_SECRET, 
      {expiresIn: process.env.REFRESH_TOKEN_LIFE});
}


export const Student = mongoose.model('Student', studentSchema);