import mongoose, { Schema }from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


const facultySchema = new Schema({
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [50, 'Name cannot exceed 50 characters']
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
    phoneNumber: {
      type: String,
      required: true,
      validate: {
        validator: function(v) {
          return /^\d{10}$/.test(v);
        },
        message: props => `${props.value} is not a valid 10-digit phone number!`
      }
    },
    branch: {
      type: String,
      required: true,
      enum: ['CSE', 'ECE', 'EEE', 'MECH', 'CIVIL', 'IT', 'CSC','OTHER']
    },
    password: {
      type: String,
      required: true,
      minlength: [8, 'Password must be at least 8 characters']
    },
    refreshtoken: {
      type: String
  },
  }, {
    timestamps: true
  });

facultySchema.pre('save', async function(next){
    if(this.isModified('password')){
        this.password = await bcrypt.hash(this.password, 8);
    }
    next();
});

facultySchema.methods.isPassowordMatch = async function(password){
    return await bcrypt.compare(password, this.password);
}

facultySchema.methods.generateAccessToken = async function(){
    return jwt.sign(
      {id: this._id}, 
      process.env.ACCESS_TOKEN_SECRET, 
      {expiresIn: process.env.ACCESS_TOKEN_LIFE});
}

facultySchema.methods.generateRefreshToken = async function(){
    return jwt.sign(
      {id: this._id}, 
      process.env.REFRESH_TOKEN_SECRET, 
      {expiresIn: process.env.REFRESH_TOKEN_LIFE});
}


export const Faculty = mongoose.model('Faculty', facultySchema);