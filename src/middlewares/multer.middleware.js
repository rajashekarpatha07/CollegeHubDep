import multer from "multer";
import path from "path";
import fs from "fs";
import sharp from "sharp";
import zlib from "zlib";
import os from "os";

// For Railway serverless environment
const isRailway = process.env.RAILWAY_ENVIRONMENT === 'true' || !!process.env.RAILWAY_ENVIRONMENT;

// Choose appropriate storage method based on environment
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Use system temp directory for Railway
        const uploadDir = isRailway 
            ? os.tmpdir() 
            : path.resolve("tmp/my-uploads");
        
        // Create directory if it doesn't exist
        if (!fs.existsSync(uploadDir)) {
            try {
                fs.mkdirSync(uploadDir, { recursive: true });
            } catch (err) {
                console.error("Failed to create upload directory:", err);
            }
        }
        
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname));
    },
});

// File filter for only images and PDFs
const multerUpload = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
    fileFilter: function (req, file, cb) {
        if (file.mimetype.startsWith("image/") || file.mimetype === "application/pdf") {
            cb(null, true);
        } else {
            cb(new Error("Only images and PDFs are allowed!"));
        }
    },
}).fields([
    { name: "notes", maxCount: 1 },
    { name: "questionpaper", maxCount: 1 }
]);

// Wrapper around multer upload that handles errors and cleanup
const upload = (req, res, next) => {
    multerUpload(req, res, function(err) {
        if (err) {
            console.error("Multer upload error:", err);
            return res.status(400).json({
                status: "fail",
                message: err.message || "File upload failed"
            });
        }
        
        // Store uploaded file paths in request for possible cleanup later
        req.uploadedFiles = [];
        
        // Check if files were uploaded and add them to uploadedFiles array
        if (req.files) {
            Object.values(req.files).forEach(fileArray => {
                fileArray.forEach(file => {
                    req.uploadedFiles.push(file.path);
                });
            });
        }
        
        next();
    });
};

// Middleware to clean up files if there's an error
const cleanupOnError = (err, req, res, next) => {
    if (err && req.uploadedFiles && req.uploadedFiles.length > 0) {
        console.log("Cleaning up temporary files due to error");
        req.uploadedFiles.forEach(filePath => {
            if (fs.existsSync(filePath)) {
                try {
                    fs.unlinkSync(filePath);
                    console.log(`Cleaned up temp file: ${filePath}`);
                } catch (unlinkError) {
                    console.error(`Failed to clean up temp file: ${filePath}`, unlinkError);
                }
            }
        });
    }
    next(err);
};

const compressAndSaveImage = async (localFilePath) => {
    const compressedFilePath = localFilePath.replace(path.extname(localFilePath), "-compressed.jpg");
    try {
        await sharp(localFilePath)
            .resize(800) // Resize width to 800px
            .jpeg({ quality: 70 }) // Compress with 70% quality
            .toFile(compressedFilePath);

        // Delete original uncompressed file
        try {
            fs.unlinkSync(localFilePath);
            console.log(`Deleted original file after compression: ${localFilePath}`);
        } catch (error) {
            console.error(`Failed to delete original file after compression: ${localFilePath}`, error);
        }
        
        return compressedFilePath;
    } catch (error) {
        console.error("Error compressing image:", error);
        return localFilePath; // Return original if compression fails
    }
};

// Compress PDF Before Saving
const compressAndSavePDF = (localFilePath) => {
    const compressedFilePath = localFilePath.replace(".pdf", "-compressed.pdf");
    return new Promise((resolve, reject) => {
        const readStream = fs.createReadStream(localFilePath);
        const writeStream = fs.createWriteStream(compressedFilePath);
        const gzip = zlib.createGzip();

        readStream
            .pipe(gzip)
            .pipe(writeStream)
            .on("finish", () => {
                // Delete original uncompressed file
                try {
                    fs.unlinkSync(localFilePath);
                    console.log(`Deleted original PDF after compression: ${localFilePath}`);
                } catch (error) {
                    console.error(`Failed to delete original PDF after compression: ${localFilePath}`, error);
                }
                resolve(compressedFilePath);
            })
            .on("error", (error) => {
                console.error("Error compressing PDF:", error);
                resolve(localFilePath); // Return original if compression fails
            });
    });
};

//Handle Compression Based on File Type
const compressAndSaveFile = async (localFilePath, mimetype) => {
    if (mimetype.startsWith("image/")) {
        return await compressAndSaveImage(localFilePath);
    } else if (mimetype === "application/pdf") {
        return await compressAndSavePDF(localFilePath);
    }
    return localFilePath;
};

export { upload, compressAndSaveFile, cleanupOnError };
