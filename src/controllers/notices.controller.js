import { ApiError } from '../utils/ApiError.js';
import { Notice } from '../models/notices.model.js';
// import { UploadOnCloudinary, DeleteFromCloudinary } from '../utils/Cloudinary.js';
import { asyncHandler } from '../utils/AsyncHanders.js';
import { ApiResponse } from '../utils/ApiResponse.js';

const addNotice = asyncHandler(async (req, res) => {
    try {
        const { title, description, branch, batchyear, sem } = req.body;
        if ([title, description, branch, batchyear].some((field) => String(field || '').trim() === '')) {
            throw new ApiError(400, 'All fields are required');
        }
        
        const notice = await Notice.create({
            title,
            description,
            branch,
            batchyear: parseInt(batchyear, 10),
            sem: sem ? parseInt(sem, 10) : undefined,
            postedBy: req.faculty.name,
        });
        
        if (!notice) {
            return new ApiError(res, "Failed to create notice");
        }

        // Check if the request is from a browser or API
        if (req.headers['accept'] && req.headers['accept'].includes('text/html')) {
            return res.redirect('/upload-notices?success=Notice posted successfully');
        }

        return res
            .status(201)
            .json(new ApiResponse(201, notice, 'Notice created successfully'));
    } catch (error) {
        console.error("Error adding notice:", error);
        
        if (req.headers['accept'] && req.headers['accept'].includes('text/html')) {
            return res.redirect('/upload-notices?error=' + encodeURIComponent(error.message || "Failed to post notice"));
        }
        
        return res.status(500).json(new ApiResponse(500, null, "Internal Server Error", error.message));
    }
});

const deleteNotice = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json(
                new ApiResponse(400, null, "Notice ID is required")
            );
        }

        const notice = await Notice.findById(id);
        if (!notice) {
            return res.status(404).json(
                new ApiResponse(404, null, "Notice not found")
            );
        }

        // Delete the notice from the database
        await Notice.findByIdAndDelete(id);

        // Check if the request is from a browser or API
        if (req.headers['accept'] && req.headers['accept'].includes('text/html')) {
            return res.redirect('/manage-notices?success=Notice deleted successfully');
        }

        return res
            .status(200)
            .json(new ApiResponse(200, { deletedId: id }, "Notice deleted successfully"));
    } catch (error) {
        console.error("Error deleting notice:", error);
        
        if (req.headers['accept'] && req.headers['accept'].includes('text/html')) {
            return res.redirect('/manage-notices?error=' + encodeURIComponent(error.message || "Failed to delete notice"));
        }
        
        return res.status(500).json(
            new ApiResponse(500, null, "Internal Server Error: " + error.message)
        );
    }
});

const getAllNotices = asyncHandler(async (req, res) => {
    try {
        const notices = await Notice.find().sort({ createdAt: -1 });
        
        // Check if request is from web browser or API client
        if (req.headers['accept'] && req.headers['accept'].includes('text/html')) {
            return res.render('manage-notices', {
                faculty: req.faculty,
                notices: notices,
                success: req.query.success || null,
                error: req.query.error || null
            });
        }
        
        return res.status(200).json(
            new ApiResponse(200, notices, "Notices fetched successfully")
        );
    } catch (error) {
        console.error("Error fetching notices:", error);
        
        if (req.headers['accept'] && req.headers['accept'].includes('text/html')) {
            return res.render('manage-notices', {
                faculty: req.faculty,
                notices: [],
                error: "Failed to fetch notices: " + error.message
            });
        }
        
        return res.status(500).json(
            new ApiResponse(500, null, "Failed to fetch notices: " + error.message)
        );
    }
});

export { addNotice, deleteNotice, getAllNotices };