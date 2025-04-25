import ImageKit from "imagekit";
import fs from "fs";

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

export const UploadToImageKit = async (localFilePath) => {
  try {
    if (!fs.existsSync(localFilePath)) throw new Error("File not found");

    const fileBuffer = fs.readFileSync(localFilePath);
    const fileName = `file_${Date.now()}`;

    const response = await imagekit.upload({
      file: fileBuffer,
      fileName: fileName,
      useUniqueFileName: true,
      folder: "/college_hub",
    });

    // Use synchronous deletion to ensure file is removed immediately
    try {
      fs.unlinkSync(localFilePath);
      console.log(`✅ Temporary file deleted after upload: ${localFilePath}`);
    } catch (unlinkError) {
      console.error(`Failed to delete temporary file: ${localFilePath}`, unlinkError);
    }

    return response; // includes url, fileId, etc.
  } catch (err) {
    if (fs.existsSync(localFilePath)) {
      try {
        fs.unlinkSync(localFilePath);
        console.log(`Cleaned up temporary file after upload error: ${localFilePath}`);
      } catch (unlinkError) {
        console.error(`Failed to clean up temporary file: ${localFilePath}`, unlinkError);
      }
    }
    console.error("ImageKit upload error:", err.message);
    return null;
  }
};

export const DeleteFromImageKit = async (fileId) => {
  try {
    if (!fileId) throw new Error("fileId is required");

    const result = await imagekit.deleteFile(fileId);
    console.log(`✅ Successfully deleted file from ImageKit: ${fileId}`);
    return result;
  } catch (err) {
    console.error(`ImageKit delete error for fileId ${fileId}:`, err.message);
    return null;
  }
};
