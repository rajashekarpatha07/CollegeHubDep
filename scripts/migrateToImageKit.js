/**
 * Migration script to transition files from either UploadThing or local storage to ImageKit
 * 
 * Usage: 
 * 1. Make sure ImageKit credentials are set in .env
 * 2. Run with Node: node -r dotenv/config scripts/migrateToImageKit.js
 */

import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { Notes } from '../src/models/notes.model.js';
import { QuestionPaper } from '../src/models/questionpaper.model.js';
import { UploadToImageKit } from '../src/utils/imagekit.js';

// Connect to MongoDB
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

// Download a file from URL to temp location
const downloadFile = async (url) => {
  try {
    // For local files
    if (url.startsWith('/uploads/')) {
      const filePath = path.join(process.cwd(), 'public', url);
      if (fs.existsSync(filePath)) {
        // Create a temp copy
        const tempDir = path.join(process.cwd(), 'tmp', 'migration');
        if (!fs.existsSync(tempDir)) {
          fs.mkdirSync(tempDir, { recursive: true });
        }
        const fileName = path.basename(url);
        const tempPath = path.join(tempDir, fileName);
        fs.copyFileSync(filePath, tempPath);
        return tempPath;
      }
    }
    
    // For remote files
    if (url.startsWith('http')) {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`Failed to fetch ${url}`);
      
      const tempDir = path.join(process.cwd(), 'tmp', 'migration');
      if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir, { recursive: true });
      }
      
      const fileName = url.split('/').pop();
      const tempPath = path.join(tempDir, fileName);
      
      const blob = await response.blob();
      const arrayBuffer = await blob.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      
      fs.writeFileSync(tempPath, buffer);
      return tempPath;
    }
    
    throw new Error(`Unsupported URL format: ${url}`);
  } catch (error) {
    console.error(`Error downloading file ${url}:`, error);
    return null;
  }
};

// Migrate a single document
const migrateDocument = async (doc, modelName) => {
  try {
    if (!doc.fileUrl) {
      console.log(`Skipping ${modelName} ${doc._id}: No fileUrl`);
      return false;
    }
    
    // Skip if already on ImageKit
    if (doc.fileUrl.includes('ik.imagekit.io')) {
      console.log(`Skipping ${modelName} ${doc._id}: Already on ImageKit`);
      return false;
    }
    
    console.log(`Migrating ${modelName} ${doc._id} - URL: ${doc.fileUrl}`);
    
    // Download the file
    const localPath = await downloadFile(doc.fileUrl);
    if (!localPath) {
      console.error(`Failed to download file for ${modelName} ${doc._id}`);
      return false;
    }
    
    // Upload to ImageKit
    const uploadResult = await UploadToImageKit(localPath);
    if (!uploadResult || !uploadResult.url) {
      console.error(`Failed to upload to ImageKit for ${modelName} ${doc._id}`);
      // Clean up temp file
      if (fs.existsSync(localPath)) {
        fs.unlinkSync(localPath);
      }
      return false;
    }
    
    // Update the document
    const model = modelName === 'Notes' ? Notes : QuestionPaper;
    await model.findByIdAndUpdate(doc._id, {
      fileUrl: uploadResult.url,
      fileId: uploadResult.fileId,
      isLocalStorage: false
    });
    
    console.log(`✅ Successfully migrated ${modelName} ${doc._id} to ImageKit`);
    return true;
  } catch (error) {
    console.error(`Error migrating ${modelName} ${doc._id}:`, error);
    return false;
  }
};

// Main migration function
const migrateToImageKit = async () => {
  console.log('Starting migration to ImageKit...');
  
  // Connect to database
  await connectDB();
  
  // Get all documents
  const notes = await Notes.find({});
  const questionPapers = await QuestionPaper.find({});
  
  console.log(`Found ${notes.length} notes and ${questionPapers.length} question papers to process`);
  
  // Migrate notes
  let successCount = 0;
  let failCount = 0;
  
  for (const note of notes) {
    const success = await migrateDocument(note, 'Notes');
    if (success) successCount++;
    else failCount++;
  }
  
  // Migrate question papers
  for (const qp of questionPapers) {
    const success = await migrateDocument(qp, 'QuestionPaper');
    if (success) successCount++;
    else failCount++;
  }
  
  console.log('\nMigration Summary:');
  console.log(`Total documents processed: ${notes.length + questionPapers.length}`);
  console.log(`Successfully migrated: ${successCount}`);
  console.log(`Failed to migrate: ${failCount}`);
  
  // Clean up temp directory
  const tempDir = path.join(process.cwd(), 'tmp', 'migration');
  if (fs.existsSync(tempDir)) {
    fs.rmSync(tempDir, { recursive: true, force: true });
    console.log('Cleaned up temporary files');
  }
  
  // Disconnect from database
  await mongoose.disconnect();
  console.log('Migration completed');
  process.exit(0);
};

// Run the migration
migrateToImageKit().catch(error => {
  console.error('Migration failed:', error);
  process.exit(1);
}); 