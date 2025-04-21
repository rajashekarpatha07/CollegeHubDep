import { ApiError } from '../utils/ApiError.js';
import { QuestionPaper } from '../models/questionpaper.model.js';
import { UploadOnCloudinary, DeleteFromCloudinary } from '../utils/Cloudinary.js';
import { asyncHandler } from '../utils/AsyncHanders.js';
import { ApiResponse } from '../utils/ApiResponse.js';


const addQuestionPaper = asyncHandler(async (req, res) => {
    try {
        const { subject, year, branch, sem } = req.body;
        
        const questionpaperpath = req.files?.questionpaper?.[0]?.path;
        
        if (!questionpaperpath) {
            throw new ApiError(400, "File not provided");
        }
        
        const questionpaperurl = await UploadOnCloudinary(questionpaperpath);
        
        if (!questionpaperurl) {
            throw new ApiError(500, "File upload failed");
        }

        const newQuestionPaper = await QuestionPaper.create({
            subject,
            year,
            branch,
            sem,
            fileUrl: questionpaperurl.secure_url,
            uploadedBy: req.faculty.name,
        });

        return res
        .status(201)
        .json(new ApiResponse(201, newQuestionPaper, "Question Paper added successfully"));
    } catch (error) {
        return res.status(500).json(new ApiResponse(500, null, "Internal Server Error", error.message));
    }
});

const deleteQuestionPaper = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params;

        const questionPaper = await QuestionPaper.findById(id);
        if (!questionPaper) {
            return res.status(404).json(new ApiResponse(404, null, "Question Paper not found"));
        }

        const cloudinaryResponse = await DeleteFromCloudinary(questionPaper.fileUrl);
        if (!cloudinaryResponse) {
           return new ApiError(500, "File deletion failed", {
            fileUrl: questionPaper.fileUrl,
           });
        }

        await QuestionPaper.findByIdAndDelete(id);

        return res.status(200).json(new ApiResponse(200, {deletedId: id}, "Question Paper deleted successfully"));
        

    } catch (error) {
        throw new ApiError(500, "Internal Server Error", error.message);
    }
});

export { addQuestionPaper, deleteQuestionPaper };
