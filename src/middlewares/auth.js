import { Faculty } from "../models/faculty.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/AsyncHanders.js";
import { Student } from "../models/student.model.js";
import jwt from "jsonwebtoken";

export const verifyStudent = asyncHandler(async (req, res, next) => {
    try {
        const Token = req.cookies?.accessToken || req.header('Authorization')?.replace('Bearer ', '');
        if(!Token) {
            if (req.headers['accept']?.includes('application/json')) {
                throw new ApiError(401, 'Unauthorized, please login');
            } else {
                return res.redirect('/StudentLogin');
            }
        }
        
        const DecodedToken = jwt.verify(Token, process.env.ACCESS_TOKEN_SECRET);
        const student = await Student.findById(DecodedToken?.id).select('-password -refreshtoken');
        
        if(!student) {
            if (req.headers['accept']?.includes('application/json')) {
                throw new ApiError(401, 'Invalid token or student not found');
            } else {
                return res.redirect('/StudentLogin');
            }
        }
        
        req.student = student;
        next();

    } catch (error) {
        if (req.headers['accept']?.includes('application/json')) {
            throw new ApiError(401, error?.message || 'Authentication failed');
        } else {
            return res.redirect('/StudentLogin');
        }
    }
});

export const verifyFaculty = asyncHandler(async (req, res, next) => {
    try {
        const Token = req.cookies?.accessToken || req.header('Authorization')?.replace('Bearer ', '');
        if(!Token) {
            throw new ApiError(401, 'Unauthorized');
        }

        const DecodedToken = jwt.verify(Token, process.env.ACCESS_TOKEN_SECRET);
        const faculty = await Faculty.findById(DecodedToken?.id).select('-password -refreshtoken');
        if(!faculty) {
            throw new ApiError(401, 'Unauthorized');
        }
        req.faculty = faculty;

        next();
    } catch (error) {
        throw new ApiError(401,error?.message, 'Unauthorized');   
    }
});