import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/AsyncHanders.js";
import  { Faculty } from "../models/faculty.model.js";
import emailUtils from "../utils/Email.js";
const { sendWelcomeEmail, sendLoginWelcomeEmail } = emailUtils;

const generateTokenandAccesstoken = async (facultyId) => {
    try {
        const faculty = await Faculty.findById(facultyId);
        const accessToken = await faculty.generateAccessToken();
        const refreshToken = await faculty.generateRefreshToken();

        faculty.refreshtoken = refreshToken;
        await faculty.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };
    } catch (error) {
        throw new ApiError(500, 'Token generation failed', error?.message);
    }
};

const registerFaculty = asyncHandler(async (req, res) => {
    const { name, branch, phoneNumber, email, password } = req.body;

    if([name, branch,phoneNumber, email, password].some((field)=>{
        field?.trim() === ''
    })) {
        throw new ApiError(400, 'All fields are required');
    }

    const existingFaculty = await Faculty.findOne({ email });
    if(existingFaculty) {
        throw new ApiError(400, 'Faculy already exists');
    }

    const faculty = await Faculty.create({
        name, branch,phoneNumber, email, password
    });

    sendWelcomeEmail(email, name, 'faculty');


    const createdFaculty = await Faculty.findById(faculty._id).select('-password -refreshtoken');


    if(!faculty) {
        throw new ApiError(500, 'faculty not created');
    }

    return res
        .status(201)
        .json(new ApiResponse(201, createdFaculty, 'Faculty created successfully'));
});

const LoginFaculty = asyncHandler(async (req, res) => {
    const { email , password } = req.body;
    if(!email || !password) {
        throw new ApiError(400, 'email and password are required to Login');
    }
    
    const faculty = await Faculty.findOne({ email })
    if(!faculty) {
        throw new ApiError(400, 'The faculty Doesn\'t exist register first');
    }

    const isPassowrdMatch = await faculty.isPassowordMatch(password);
    if(!isPassowrdMatch) {
        throw new ApiError(400, 'Invalid password');
    }

    const { accessToken, refreshToken } = await generateTokenandAccesstoken(faculty._id);
    const Loggedfaculty = await Faculty.findById(faculty._id).select('-password -refreshtoken -accesstoken');
    sendLoginWelcomeEmail(faculty.email, faculty.name, 'faculty');

    const options = {
        httpOnly: true,
        secure:true
    }

    return res
        .status(200)
        .cookie('refreshToken', refreshToken, options)
        .cookie('accessToken', accessToken, options)
        .json(new ApiResponse(200, { refreshToken, Loggedfaculty }, 'Faculty Logged in successfully'));
});

const LogoutFaculty = asyncHandler(async (req, res) => {
    const { refreshToken } = req.cookies;
    if(!refreshToken) {
        throw new ApiError(400, 'No refresh token found');
    }

    const faculty = await Faculty.findOne({ refreshtoken: refreshToken });
    if(!faculty) {
        throw new ApiError(400, 'Invalid refresh token');
    }

    faculty.refreshtoken = null;
    await faculty.save({ validateBeforeSave: false });

    return res
        .status(200)
        .clearCookie('refreshToken')
        .clearCookie('accessToken')
        .json(new ApiResponse(200, null, 'Faculty Logged out successfully'));
});
export { registerFaculty, LoginFaculty, LogoutFaculty };
