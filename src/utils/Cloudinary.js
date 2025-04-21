import { v2 as Cloudinary } from 'cloudinary';
import fs from 'fs';

// Detect if running on Vercel
const isVercel = process.env.VERCEL === 'true' || process.env.VERCEL === '1';

Cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const UploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null;

        const response = await Cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto",
        });

        // Delete the local file after successful upload
        fs.unlink(localFilePath, (err) => {
            if (err) {
                console.error("Error deleting local file:", err);
            }
        });

        return response;
    } catch (error) {
        // Delete local file if the upload fails
        if (fs.existsSync(localFilePath)) {
            fs.unlinkSync(localFilePath);
        }
        console.error("Cloudinary upload error:", error);
        return null;
    }
};

const DeleteFromCloudinary = async (fileUrl) => {
    try {
        if (!fileUrl) {
            throw new Error("File URL is required.");
        }

        // Extract public_id correctly
        const urlParts = fileUrl.split('/');
        const fileNameWithExt = urlParts.pop(); 
        const publicId = fileNameWithExt.split(".")[0]; 

        console.log("Extracted publicId:", publicId); // Debug log

        const result = await Cloudinary.uploader.destroy(publicId, {
            resource_type: "image"  // Matches the upload type
        });

        console.log("Cloudinary deletion result:", result); // Debug log

        if (result.result !== "ok") {
            throw new Error(`Failed to delete file from Cloudinary: ${result.result}`);
        }

        return result;
    } catch (error) {
        console.error("Error deleting file from Cloudinary:", error);
        return null;
    }
};

export { UploadOnCloudinary, DeleteFromCloudinary};