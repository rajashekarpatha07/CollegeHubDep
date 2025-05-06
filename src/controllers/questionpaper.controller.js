import { ApiError } from '../utils/ApiError.js';
import { QuestionPaper } from '../models/questionpaper.model.js';
import { storeFile, deleteFile } from '../utils/FileStorage.js';
import { asyncHandler } from '../utils/AsyncHanders.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import fs from 'fs';

/**
 * Utility function to clean up temporary files
 */
const cleanupTempFile = (filePath) => {
    if (filePath && fs.existsSync(filePath)) {
        try {
            fs.unlinkSync(filePath);
            console.log(`✅ Manually cleaned up temp file: ${filePath}`);
        } catch (error) {
            console.error(`Failed to manually clean up temp file: ${filePath}`, error);
        }
    }
};

const addQuestionPaper = asyncHandler(async (req, res) => {
    const questionpaperpath = req.files?.questionpaper?.[0]?.path;
    
    try {
        const { subject, year, branch, sem } = req.body;
        
        // Validate required fields
        if (!subject || !year || !branch || !sem) {
            if (questionpaperpath) cleanupTempFile(questionpaperpath);
            return res.status(400).json(
                new ApiResponse(400, null, "All required fields must be provided")
            );
        }
        
        if (!questionpaperpath) {
            return res.status(400).json(
                new ApiResponse(400, null, "Question paper file is required")
            );
        }
        
        console.log("Attempting to upload file:", questionpaperpath);
        
        // Upload file using our utility (ImageKit with local fallback)
        const fileUploadResult = await storeFile(questionpaperpath, "questionpapers");
        
        if (!fileUploadResult || !fileUploadResult.url) {
            // The storeFile function should handle cleanup, but let's double-check
            if (fs.existsSync(questionpaperpath)) cleanupTempFile(questionpaperpath);
            
            return res.status(500).json(
                new ApiResponse(500, null, "File upload failed")
            );
        }

        console.log("Uploaded file details:", {
            url: fileUploadResult.url,
            isLocalStorage: fileUploadResult.isLocalStorage
        });

        const newQuestionPaper = await QuestionPaper.create({
            subject,
            year,
            branch,
            sem: parseInt(sem, 10), // Ensure it's stored as a number
            fileUrl: fileUploadResult.url,
            fileId: fileUploadResult.fileId,
            isLocalStorage: fileUploadResult.isLocalStorage,
            uploadedBy: req.faculty.name,
        });

        // Check if the request is from a browser or API
        if (req.headers['accept'] && req.headers['accept'].includes('text/html')) {
            return res.redirect('/upload-question-papers?success=Question paper uploaded successfully');
        }

        return res
            .status(201)
            .json(new ApiResponse(201, newQuestionPaper, "Question Paper added successfully"));
    } catch (error) {
        console.error("Error adding question paper:", error);
        
        // Clean up the temporary file if it exists
        if (questionpaperpath) cleanupTempFile(questionpaperpath);
        
        return res.status(500).json(
            new ApiResponse(500, null, "Internal Server Error: " + error.message)
        );
    }
});

const deleteQuestionPaper = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json(
                new ApiResponse(400, null, "Question Paper ID is required")
            );
        }

        const questionPaper = await QuestionPaper.findById(id);
        if (!questionPaper) {
            return res.status(404).json(
                new ApiResponse(404, null, "Question Paper not found")
            );
        }

        console.log("Attempting to delete file:", {
            url: questionPaper.fileUrl,
            fileId: questionPaper.fileId,
            isLocalStorage: questionPaper.isLocalStorage
        });
        
        // Only attempt to delete the file if fileUrl exists
        if (questionPaper.fileUrl) {
            const deleteResult = await deleteFile(
                questionPaper.fileUrl, 
                questionPaper.fileId, 
                questionPaper.isLocalStorage
            );
            
            if (!deleteResult) {
                console.warn(`Warning: Failed to delete file: ${questionPaper.fileUrl}`);
                // Continue with question paper deletion even if file deletion fails
            } else {
                console.log("File deleted successfully");
            }
        }

        // Delete the question paper from the database
        await QuestionPaper.findByIdAndDelete(id);

        // Check if the request is from a browser or API
        if (req.headers['accept'] && req.headers['accept'].includes('text/html')) {
            return res.redirect('/manage-question-papers?success=Question paper deleted successfully');
        }

        return res
            .status(200)
            .json(new ApiResponse(200, { deletedId: id }, "Question Paper deleted successfully"));
    } catch (error) {
        console.error("Error deleting question paper:", error);
        return res.status(500).json(
            new ApiResponse(500, null, "Internal Server Error: " + error.message)
        );
    }
});

const getAllQuestionPapers = asyncHandler(async (req, res) => {
    try {
        const questionPapers = await QuestionPaper.find().sort({ createdAt: -1 });
        
        // Check if request is from web browser or API client
        if (req.headers['accept'] && req.headers['accept'].includes('text/html')) {
            return res.render('manage-question-papers', {
                faculty: req.faculty,
                questionPapers: questionPapers,
                success: req.query.success || null,
                error: req.query.error || null
            });
        }
        
        return res.status(200).json(
            new ApiResponse(200, questionPapers, "Question papers fetched successfully")
        );
    } catch (error) {
        console.error("Error fetching question papers:", error);
        
        if (req.headers['accept'] && req.headers['accept'].includes('text/html')) {
            return res.render('manage-question-papers', {
                faculty: req.faculty,
                questionPapers: [],
                error: "Failed to fetch question papers: " + error.message
            });
        }
        
        return res.status(500).json(
            new ApiResponse(500, null, "Failed to fetch question papers: " + error.message)
        );
    }
});

export { addQuestionPaper, deleteQuestionPaper, getAllQuestionPapers };
