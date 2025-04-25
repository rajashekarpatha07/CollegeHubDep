import fs from "fs";
import path from "path";
import { UploadToImageKit, DeleteFromImageKit } from "./imagekit.js";

/**
 * Handles file storage using ImageKit with local fallback
 * @param {string} tempFilePath - Path to the temporary uploaded file
 * @param {string} fileType - Type of file ('notes', 'questionpaper', etc.)
 * @returns {Promise<{url: string, fileId: string, isLocalStorage: boolean}>} - Upload result
 */
export const storeFile = async (tempFilePath, fileType = "file") => {
  if (!tempFilePath || !fs.existsSync(tempFilePath)) {
    console.error(`Invalid or missing file path: ${tempFilePath}`);
    return null;
  }

  console.log(`Processing file upload: ${tempFilePath}`);
  
  try {
    // Try ImageKit first
    const imagekitResponse = await UploadToImageKit(tempFilePath);
    
    if (imagekitResponse && imagekitResponse.url) {
      console.log(`✅ File uploaded to ImageKit: ${imagekitResponse.url}`);
      
      // UploadToImageKit already deletes the temp file, but let's make double sure
      if (fs.existsSync(tempFilePath)) {
        try {
          fs.unlinkSync(tempFilePath);
          console.log(`✅ Additional cleanup of temporary file: ${tempFilePath}`);
        } catch (error) {
          console.warn(`Warning: Could not delete temp file: ${tempFilePath}`, error);
        }
      }
      
      return {
        url: imagekitResponse.url,
        fileId: imagekitResponse.fileId,
        isLocalStorage: false
      };
    }
    
    // Fallback to local storage if ImageKit fails
    console.log("ImageKit upload failed, using local storage instead");
    const result = await storeFileLocally(tempFilePath, fileType);
    return result;
  } catch (error) {
    console.error("File storage error:", error);
    // Attempt local storage as final fallback
    try {
      return await storeFileLocally(tempFilePath, fileType);
    } catch (fallbackError) {
      console.error("Both ImageKit and local storage failed:", fallbackError);
      
      // Clean up temp file in case of complete failure
      if (fs.existsSync(tempFilePath)) {
        try {
          fs.unlinkSync(tempFilePath);
          console.log(`Cleaned up temp file after failed upload: ${tempFilePath}`);
        } catch (unlinkError) {
          console.warn(`Warning: Could not delete temp file: ${tempFilePath}`, unlinkError);
        }
      }
      
      return null;
    }
  }
};

/**
 * Stores a file locally
 * @param {string} tempFilePath - Path to the temporary uploaded file
 * @param {string} fileType - Type of file ('notes', 'questionpaper', etc.)
 * @returns {Promise<{url: string, fileId: string, isLocalStorage: boolean}>} - Upload result
 */
const storeFileLocally = async (tempFilePath, fileType) => {
  try {
    // Create upload directory if it doesn't exist
    const uploadDir = path.join(process.cwd(), "public", "uploads", fileType);
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    // Generate unique filename
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const fileExt = path.extname(tempFilePath);
    const fileName = `${uniqueSuffix}${fileExt}`;
    
    const destinationPath = path.join(uploadDir, fileName);
    
    // Copy the file from temp location to public folder
    fs.copyFileSync(tempFilePath, destinationPath);
    
    // Delete temp file
    try {
      fs.unlinkSync(tempFilePath);
      console.log(`✅ Deleted temp file: ${tempFilePath}`);
    } catch (err) {
      console.warn(`Warning: Could not delete temp file: ${tempFilePath}`, err);
    }
    
    // Return URL suitable for use in the application
    const publicUrl = `/uploads/${fileType}/${fileName}`;
    console.log(`✅ File stored at: ${destinationPath}`);
    console.log(`Uploaded file URL: ${publicUrl} (using local storage)`);
    
    return {
      url: publicUrl,
      fileId: fileName, // Use filename as fileId for local files
      isLocalStorage: true
    };
  } catch (error) {
    console.error("Local file storage error:", error);
    throw error;
  }
};

/**
 * Deletes a file (from ImageKit or local storage)
 * @param {string} fileUrl - The URL of the file to delete
 * @param {string} fileId - The file ID (for ImageKit files)
 * @param {boolean} isLocalStorage - Whether the file is stored locally
 * @returns {Promise<boolean>} - Success status
 */
export const deleteFile = async (fileUrl, fileId, isLocalStorage = false) => {
  try {
    if (isLocalStorage) {
      return await deleteLocalFile(fileUrl);
    } else if (fileId) {
      const result = await DeleteFromImageKit(fileId);
      return !!result;
    } else if (fileUrl) {
      // Try to extract fileId from URL and delete it
      const urlParts = fileUrl.split('/');
      const possibleFileId = urlParts[urlParts.length - 1];
      const result = await DeleteFromImageKit(possibleFileId);
      return !!result;
    }
    return false;
  } catch (error) {
    console.error("File deletion error:", error);
    return false;
  }
};

/**
 * Deletes a locally stored file
 * @param {string} fileUrl - The URL of the file to delete
 * @returns {Promise<boolean>} - Success status
 */
const deleteLocalFile = async (fileUrl) => {
  try {
    if (!fileUrl || !fileUrl.startsWith('/uploads/')) {
      return false;
    }
    
    const relativePath = fileUrl.substring(1); // Remove leading slash
    const filePath = path.join(process.cwd(), "public", relativePath);
    
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log(`✅ Deleted local file: ${filePath}`);
      return true;
    }
    return false;
  } catch (error) {
    console.error("Local file deletion error:", error);
    return false;
  }
}; 