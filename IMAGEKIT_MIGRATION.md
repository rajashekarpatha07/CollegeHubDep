# Migration from UploadThing to ImageKit

This document outlines the changes made to migrate the file storage system from UploadThing to ImageKit for better reliability and performance.

## Overview

The College Hub application now uses ImageKit.io as the primary file storage solution for notes, question papers, and other documents. This provides several benefits:

- Faster file delivery via global CDN
- Automatic image optimization
- Better reliability
- Simple API with good documentation
- Fallback to local storage when ImageKit is unavailable

## Changes Made

1. **New Utilities**:
   - `src/utils/imagekit.js`: Main ImageKit integration
   - `src/utils/FileStorage.js`: Combined storage utility with ImageKit and local fallback

2. **Model Updates**:
   - Added `fileId` field to store ImageKit file IDs
   - Added `isLocalStorage` flag to track storage method
   - Updated URL validation to accept both ImageKit URLs and local paths

3. **Controller Updates**:
   - Modified `notes.controller.js` and `questionpaper.controller.js` to use the new storage system
   - Improved error handling and logging

4. **Migration**:
   - Added `scripts/migrateToImageKit.js` to help migrate existing files to ImageKit

## Configuration

1. Ensure you have the ImageKit credentials in your `.env` file:

```
IMAGEKIT_PUBLIC_KEY=your_public_key
IMAGEKIT_PRIVATE_KEY=your_private_key
IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your_account
```

2. Install the required dependencies:

```bash
npm install imagekit
```

## Migration Process

To migrate existing files to ImageKit:

1. Ensure your ImageKit credentials are set in `.env`
2. Run the migration script:

```bash
node -r dotenv/config scripts/migrateToImageKit.js
```

The script will:
- Download existing files (from UploadThing or local storage)
- Upload them to ImageKit
- Update the database records with new URLs and file IDs
- Clean up temporary files

## Local Fallback

If the ImageKit upload fails for any reason, the system will automatically fall back to storing files locally in the `public/uploads/` directory. This ensures the application remains functional even if there are issues with the external service.

## Development vs. Production

The system works the same way in both development and production environments:

- In both environments, files are first attempted to be uploaded to ImageKit
- If that fails, files are stored locally in the `public/uploads/` directory

## Reverting to Previous Storage

If issues are encountered with ImageKit, you can revert to the previous storage method by:

1. Modifying the controllers to use the previous upload utility
2. Running a reverse migration script (not provided) 