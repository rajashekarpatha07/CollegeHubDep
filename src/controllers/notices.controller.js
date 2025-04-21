import { ApiError } from '../utils/ApiError.js';
import { Notice } from '../models/notices.model.js';
// import { UploadOnCloudinary, DeleteFromCloudinary } from '../utils/Cloudinary.js';
import { asyncHandler } from '../utils/AsyncHanders.js';
import { ApiResponse } from '../utils/ApiResponse.js';

const addNotice = asyncHandler(async (req, res) => {
    try {
        const { title, description, branch,  batchyear} = req.body;
        if ([title, description, branch,  batchyear].some((field) => String(field || '').trim() === '')) {
            throw new ApiError(400, 'All fields are required');
        }
        
        
        const notice = await Notice.create({
            title,
            description,
            branch,
            batchyear,
            postedBy: req.faculty.name,
            
        });
        if (!notice) {
            return new ApiError(res, "Failed to create notice");
        }

        return res
        .status(201)
        .json(new ApiResponse(201, notice, 'Notice created successfully'));
    } catch (error) {
        console.error("Error adding notice:", error);
        return res.status(500).json(new ApiResponse(500, null, "Internal Server Error", error.message));
        
    }
});



export { addNotice };