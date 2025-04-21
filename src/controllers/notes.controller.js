import { ApiError } from '../utils/ApiError.js';
import { Notes } from '../models/notes.model.js';
import { UploadOnCloudinary, DeleteFromCloudinary } from '../utils/Cloudinary.js';
import { asyncHandler } from '../utils/AsyncHanders.js';
import { ApiResponse } from '../utils/ApiResponse.js';

const addNote = asyncHandler(async (req, res) => {
    try {
        const { title, description, subject, branch, sem, unit } = req.body;
        // Checking weather the notes already exists or not
        const existingNote = await Notes.findOne({
            title,
            description,
            subject,
            branch,
            sem,
            unit,
        });

        if (existingNote) {
            return res.status(400).json(
                new ApiResponse(
                    400,
                    null,
                    "A note with these details already exists!"
                )
            );
        }
        
        const notespath = req.files?.notes[0]?.path;

        if (!notespath) {
            return new ApiError(res, "File not provided");
        }

        const notesfileurl = await UploadOnCloudinary(notespath);
        if (!notesfileurl) {
            return new ApiError(res, "File upload failed");
        }

        // Create the note after successful upload
        const note = await Notes.create({
            title,
            description,
            subject,
            branch,
            sem,
            unit,
            fileUrl: notesfileurl.secure_url,
            uploadedBy: req.faculty.name,
        });

        return res.status(201).json(new ApiResponse(201, note, "Note added successfully"));
    } catch (error) {
        console.error("Error adding note:", error);
        return res.status(500).json(new ApiResponse(500, null, "Internal Server Error", error.message));
    }
});

const deleteNotes = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const note = await Notes.findById(id);
    if (!note) {
        return new ApiError(res, "Note not found", 404);
    }

    console.log("Attempting to delete file with URL:", note.fileUrl); // Debug log
    
    const cloudinaryResponse = await DeleteFromCloudinary(note.fileUrl);
    if (!cloudinaryResponse) {
        return new ApiError(res, "Failed to delete file from Cloudinary", 500, {
            fileUrl: note.fileUrl
        });
    }

    await Notes.deleteOne({ _id: id });

    return res
        .status(200)
        .json(new ApiResponse(200, { deletedId: id }, "Note and file deleted successfully"));
});
export { addNote, deleteNotes };
