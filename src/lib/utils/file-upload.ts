import { fileValidationSchema } from '~/lib/validations/application';

export interface FileUploadResult {
  success: boolean;
  url?: string;
  fileName?: string;
  fileSize?: number;
  error?: string;
}

// Upload progress callback type
export type UploadProgressCallback = (progress: number) => void;

export interface FileValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * Validates a file according to the application requirements
 */
export function validateFile(file: File): FileValidationResult {
  try {
    fileValidationSchema.parse({
      size: file.size,
      type: file.type,
    });
    return { isValid: true };
  } catch (error) {
    if (error instanceof Error) {
      return { isValid: false, error: error.message };
    }
    return { isValid: false, error: 'Invalid file' };
  }
}

/**
 * Generates a unique filename to prevent conflicts
 */
export function generateUniqueFilename(originalName: string, applicationId?: string): string {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 8);
  const extension = originalName.split('.').pop();
  const baseName = originalName.split('.').slice(0, -1).join('.');
  
  const prefix = applicationId ? `${applicationId}_` : '';
  return `${prefix}${baseName}_${timestamp}_${randomString}.${extension}`;
}

/**
 * Checks if the current environment is development
 */
export function isDevelopment(): boolean {
  return process.env.NODE_ENV === 'development';
}

/**
 * Uploads a file to local storage (development) or Vercel Blob (production)
 */
export async function uploadFile(
  file: File,
  applicationId?: string,
  onProgress?: UploadProgressCallback
): Promise<FileUploadResult> {
  // Validate file first
  const validation = validateFile(file);
  if (!validation.isValid) {
    return { success: false, error: validation.error };
  }

  try {
    if (isDevelopment()) {
      return await uploadToLocalStorage(file, applicationId, onProgress);
    } else {
      return await uploadToVercelBlob(file, applicationId, onProgress);
    }
  } catch (error) {
    console.error('File upload error:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Upload failed' 
    };
  }
}

/**
 * Uploads file to local storage (development environment)
 */
async function uploadToLocalStorage(
  file: File,
  applicationId?: string,
  onProgress?: UploadProgressCallback
): Promise<FileUploadResult> {
  const filename = generateUniqueFilename(file.name, applicationId);
  const uploadDir = applicationId ? `uploads/${applicationId}` : 'uploads';
  const filePath = `/${uploadDir}/${filename}`;

  // Create FormData for the upload
  const formData = new FormData();
  formData.append('file', file);
  formData.append('path', filePath);

  // Simulate progress
  onProgress?.(25);

  // In development, we'll need an API route to handle local file uploads
  const response = await fetch('/api/upload/local', {
    method: 'POST',
    body: formData,
  });

  onProgress?.(75);

  if (!response.ok) {
    throw new Error('Failed to upload to local storage');
  }

  const result = await response.json() as { url: string };
  onProgress?.(100);
  
  return { 
    success: true, 
    url: result.url,
    fileName: filename,
    fileSize: file.size,
  };
}

/**
 * Uploads file to Vercel Blob (production environment)
 */
async function uploadToVercelBlob(
  file: File,
  applicationId?: string,
  onProgress?: UploadProgressCallback
): Promise<FileUploadResult> {
  const filename = generateUniqueFilename(file.name, applicationId);
  
  // Create FormData for Vercel Blob upload
  const formData = new FormData();
  formData.append('file', file);
  formData.append('filename', filename);

  // Simulate progress
  onProgress?.(25);

  // Upload to Vercel Blob via API route
  const response = await fetch('/api/upload/blob', {
    method: 'POST',
    body: formData,
  });

  onProgress?.(75);

  if (!response.ok) {
    throw new Error('Failed to upload to Vercel Blob');
  }

  const result = await response.json() as { url: string };
  onProgress?.(100);
  
  return { 
    success: true, 
    url: result.url,
    fileName: filename,
    fileSize: file.size,
  };
}

/**
 * Uploads multiple files sequentially
 */
export async function uploadMultipleFiles(
  files: FileList | File[],
  applicationId?: string,
  onProgress?: (fileIndex: number, progress: number, fileName: string) => void
): Promise<FileUploadResult[]> {
  const fileArray = Array.from(files);
  const results: FileUploadResult[] = [];
  
  for (let i = 0; i < fileArray.length; i++) {
    const file = fileArray[i]!;
    
    const result = await uploadFile(file, applicationId, (progress) => {
      onProgress?.(i, progress, file.name);
    });
    
    results.push(result);
    
    // If upload fails, stop processing remaining files
    if (!result.success) {
      break;
    }
  }

  return results;
}

/**
 * Deletes a file from storage
 */
export async function deleteFile(url: string): Promise<boolean> {
  try {
    const response = await fetch('/api/upload/delete', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url }),
    });

    return response.ok;
  } catch (error) {
    console.error('File deletion error:', error);
    return false;
  }
}

/**
 * Converts a File object to a data URL for preview purposes
 */
export function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Formats file size in a human-readable format
 */
export function formatFileSize(bytes: number | undefined | null): string {
  if (bytes == null || typeof bytes !== 'number') {
    return '0 B';
  }

  const units = ['B', 'KB', 'MB', 'GB'];
  let size = bytes;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }

  return `${size.toFixed(1)} ${units[unitIndex]}`;
}

/**
 * Gets the file extension from a filename
 */
export function getFileExtension(filename: string): string {
  return filename.split('.').pop()?.toLowerCase() ?? '';
}

/**
 * Checks if a file is an image based on its type
 */
export function isImageFile(file: File): boolean {
  return file.type.startsWith('image/');
}

/**
 * Validates ICAO photo standards (basic checks)
 */
export function validateICAOPhoto(file: File): Promise<FileValidationResult> {
  return new Promise((resolve) => {
    if (!isImageFile(file)) {
      resolve({ isValid: false, error: 'File must be an image' });
      return;
    }

    const img = new Image();
    img.onload = () => {
      // Updated ICAO requirements - more flexible for modern cameras
      const minWidth = 200;
      const minHeight = 200;
      const maxWidth = 4000;  // Increased for high-resolution cameras
      const maxHeight = 4000; // Increased for high-resolution cameras
      const aspectRatioTolerance = 0.3; // More flexible aspect ratio

      if (img.width < minWidth || img.height < minHeight) {
        resolve({ 
          isValid: false, 
          error: `Photo must be at least ${minWidth}x${minHeight} pixels for good quality` 
        });
        return;
      }

      if (img.width > maxWidth || img.height > maxHeight) {
        resolve({ 
          isValid: false, 
          error: `Photo must be no larger than ${maxWidth}x${maxHeight} pixels` 
        });
        return;
      }

      // Check aspect ratio - allow both square (1:1) and portrait (4:5) ratios
      const aspectRatio = img.width / img.height;
      const isSquareish = Math.abs(aspectRatio - 1) <= aspectRatioTolerance; // 1:1 (square)
      const isPortraitish = Math.abs(aspectRatio - 0.8) <= aspectRatioTolerance; // 4:5 (portrait)
      
      if (!isSquareish && !isPortraitish) {
        resolve({ 
          isValid: false, 
          error: 'Photo should be square (1:1) or portrait (4:5) format for passport photos' 
        });
        return;
      }

      resolve({ isValid: true });
    };

    img.onerror = () => {
      resolve({ isValid: false, error: 'Invalid image file' });
    };

    // Convert File to data URL for Image element
    const reader = new FileReader();
    reader.onload = () => {
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}