# Uploads Directory

This directory stores uploaded files during development.

## Structure
- `/uploads/` - Root upload directory
- `/uploads/{applicationId}/` - Application-specific files

## Security Notes
- Only image files (.jpg, .jpeg, .png) are allowed
- Maximum file size: 5MB
- Files are validated before storage
- Unique filenames prevent conflicts

## Production
In production, files are stored in Vercel Blob storage instead of this local directory.