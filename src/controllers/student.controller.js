import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/AsyncHanders.js";
import  { Student } from "../models/student.model.js";
import { Notes } from "../models/notes.model.js";
import { QuestionPaper } from "../models/questionpaper.model.js";
import { Notice } from "../models/notices.model.js";
import emailUtils from "../utils/Email.js";
const { sendWelcomeEmail, sendLoginWelcomeEmail } = emailUtils;

const generateTokenandAccesstoken = async (studentId) => {
    try {
        const student = await Student.findById(studentId);
        const accessToken = await student.generateAccessToken();
        const refreshToken = await student.generateRefreshToken();

        student.refreshtoken = refreshToken;
        await student.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };
    } catch (error) {
        throw new ApiError(500, 'Token generation failed');
    }
};

export const showRegisterPage = (req, res) => {
    res.render('StudentRegister'); 
  };
  
const registerStudent = asyncHandler(async (req, res) => {
    const { rollnumber, name, branch, sem, phonenumber, email, password } = req.body;

    if([rollnumber, name, branch, sem, phonenumber, email, password].some((field)=>{
        field?.trim() === ''
    })) {
        throw new ApiError(400, 'All fields are required');
    }

    const existingStudent = await Student.findOne({ rollnumber });
    if(existingStudent) {
        throw new ApiError(400, 'Student already exists');
    }

    const student = await Student.create({
        rollnumber, name, branch, sem, phonenumber, email, password
    });

    sendWelcomeEmail(email, name, 'student');

    const createdStudent = await Student.findById(student._id).select('-password -refreshtoken');


    if(!student) {
        throw new ApiError(500, 'Student not created');
    }

    return res
        .status(201)
        .json(new ApiResponse(201, createdStudent, 'Student created successfully'));
});

export const showLoginPage = (req, res) => {
    res.render('StudentLogin'); 
  };

const studentLogin = asyncHandler(async (req, res) => {
    const { rollnumber , password } = req.body;
    if(!rollnumber || !password) {
        throw new ApiError(400, 'Rollnumber and password are required to Login');
    }
    
    const student = await Student.findOne({ rollnumber })
    if(!student) {
        throw new ApiError(400, 'The student doesn\'t exist, please register first');
    }

    const isPasswordMatch = await student.isPasswordMatch(password);
    if(!isPasswordMatch) {
        throw new ApiError(400, 'Invalid password');
    }

    const { accessToken, refreshToken } = await generateTokenandAccesstoken(student._id);
    const Loggedstudent = await Student.findById(student._id).select('-password -refreshtoken -accesstoken');
    sendLoginWelcomeEmail(student.email, student.name, 'student');

    const options = {
        httpOnly: true,
        secure:true
    }

    return res
        .status(200)
        .cookie('refreshToken', refreshToken, options)
        .cookie('accessToken', accessToken, options)
        .json(new ApiResponse(200, { refreshToken, Loggedstudent, message: 'Login successful! Welcome back!' }, 'Student Logged in successfully'));
});

const studentLogout = asyncHandler(async (req, res) => {
    await Student.findOneAndUpdate(
        req.student._id,
        {
            $set: { refreshtoken: null}
        },
        {
            new: true
        }
    )
    const optiones = {
        httpOnly: true,
        secure: true
    }
    return res
        .status(200)
        .clearCookie('refreshToken', optiones)
        .clearCookie('accessToken', optiones)
        .json(new ApiResponse(200, {}, 'Student Logged out successfully'));

});

const getnotes = asyncHandler(async (req, res) => {
    const { subject, branch, sem, unit} = req.query;

    const query = {}

    if(subject) {
        query.subject = subject;
    }
    if(branch) {
        query.branch = branch;
    }       
    if(sem) {
        query.sem = sem;
    }
    if(unit) {
        query.unit = unit;
    }

    const notes = await Notes.find(query)
    if(!notes || notes.length === 0) {
        throw new ApiError(404, 'No notes found');
    }
    res
    .status(200)
    .json(new ApiResponse(200, notes, 'Notes fetched successfully'));

});

const getquestionpapers = asyncHandler(async (req, res) => {
    const { subject, branch, sem, year } = req.query;

    const query = {}

    if(subject) {
        query.subject = subject;npm 
    }
    if(branch) {
        query.branch = branch;
    }       
    if(sem) {
        query.sem = sem;
    }
    if(year) {
        query.year = year;
    }

    const questionpapers = await QuestionPaper.find(query)
    if(!questionpapers || questionpapers.length === 0) {
        throw new ApiError(404, 'No question papers found');
    }
    res
    .status(200)
    .json(new ApiResponse(200, questionpapers, 'Question papers fetched successfully'));

});

const getNotices = asyncHandler(async (req, res) => {
    const { sem, branch, targetType } = req.query;

    // Extract the first two digits of roll number to determine batch year
    const batchYear = req.student.rollnumber.substring(0, 2);

    const query = {
        batchyear: batchYear, // Match with the batch year of the student
    };

    if (sem) query.sem = sem;
    if (branch) query.branch = branch;
    if (targetType) query.targetType = targetType;

    // Fetch notices based on query
    const notices = await Notice.find(query);

    if (!notices || notices.length === 0) {
        throw new ApiError(404, "No notices found for your batch");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, notices, "Notices fetched successfully"));
});

export const showDashboard = asyncHandler(async (req, res) => {
    // Get student data from the token
    const student = req.student;
    
    // Render the dashboard with student data
    res.render('dashboard', { student });
});

export { registerStudent, studentLogin, studentLogout, getnotes, getquestionpapers, getNotices };