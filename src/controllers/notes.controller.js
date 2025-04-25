import { ApiError } from '../utils/ApiError.js';
import { Notes } from '../models/notes.model.js';
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

const addNote = asyncHandler(async (req, res) => {
    const notespath = req.files?.notes?.[0]?.path;
    
    try {
        const { title, description, subject, branch, sem, unit } = req.body;
        
        // Validate required fields
        if (!title || !subject || !branch || !sem || !unit) {
            if (notespath) cleanupTempFile(notespath);
            return res.status(400).json(
                new ApiResponse(400, null, "All required fields must be provided")
            );
        }
        
        // Check whether the notes already exists or not
        const existingNote = await Notes.findOne({
            title,
            subject,
            branch,
            sem,
            unit,
        });

        if (existingNote) {
            if (notespath) cleanupTempFile(notespath);
            return res.status(400).json(
                new ApiResponse(
                    400,
                    null,
                    "A note with these details already exists!"
                )
            );
        }

        if (!notespath) {
            return res.status(400).json(
                new ApiResponse(400, null, "Note file is required")
            );
        }

        console.log("Attempting to upload file:", notespath);
        
        // Upload file using our utility (ImageKit with local fallback)
        const fileUploadResult = await storeFile(notespath, "notes");
        
        if (!fileUploadResult || !fileUploadResult.url) {
            // The storeFile function should handle cleanup, but let's double-check
            if (fs.existsSync(notespath)) cleanupTempFile(notespath);
            
            return res.status(500).json(
                new ApiResponse(500, null, "File upload failed")
            );
        }

        console.log("Uploaded file details:", {
            url: fileUploadResult.url,
            isLocalStorage: fileUploadResult.isLocalStorage
        });

        // Create the note after successful upload
        const note = await Notes.create({
            title,
            description,
            subject,
            branch,
            sem,
            unit,
            fileUrl: fileUploadResult.url,
            fileId: fileUploadResult.fileId,
            isLocalStorage: fileUploadResult.isLocalStorage,
            uploadedBy: req.faculty.name,
        });

        return res.status(201).json(new ApiResponse(201, note, "Note added successfully"));
    } catch (error) {
        console.error("Error adding note:", error);
        
        // Clean up the temporary file if it exists
        if (notespath) cleanupTempFile(notespath);
        
        return res.status(500).json(new ApiResponse(500, null, "Internal Server Error: " + error.message));
    }
});

const deleteNotes = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json(
                new ApiResponse(400, null, "Note ID is required")
            );
        }

        const note = await Notes.findById(id);
        if (!note) {
            return res.status(404).json(
                new ApiResponse(404, null, "Note not found")
            );
        }

        console.log("Attempting to delete file:", {
            url: note.fileUrl,
            fileId: note.fileId,
            isLocalStorage: note.isLocalStorage
        });
        
        // Only attempt to delete the file if fileUrl exists
        if (note.fileUrl) {
            const deleteResult = await deleteFile(note.fileUrl, note.fileId, note.isLocalStorage);
            if (!deleteResult) {
                console.warn(`Warning: Failed to delete file: ${note.fileUrl}`);
                // Continue with note deletion even if file deletion fails
            } else {
                console.log("File deleted successfully");
            }
        }

        // Delete the note from the database
        await Notes.deleteOne({ _id: id });

        return res
            .status(200)
            .json(new ApiResponse(200, { deletedId: id }, "Note deleted successfully"));
    } catch (error) {
        console.error("Error deleting note:", error);
        return res.status(500).json(
            new ApiResponse(500, null, "Internal Server Error: " + error.message)
        );
    }
});

export { addNote, deleteNotes };
