'use client';

import { useState, useRef } from 'react';
import { 
  validateFile, 
  validateICAOPhoto,
  fileToDataUrl, 
  formatFileSize
} from '~/lib/utils/file-upload';

export interface FileUploadProps {
  label: string;
  accept: string;
  maxSize: number;
  onFileSelect: (file: File | null) => void;
  currentFile?: File | null;
  error?: string;
  required?: boolean;
  id?: string;
  className?: string;
  isPhotoValidation?: boolean;
}

export function FileUpload({
  label,
  accept,
  maxSize,
  onFileSelect,
  currentFile,
  error,
  required = false,
  id,
  className = '',
  isPhotoValidation = false,
}: FileUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (file: File | null) => {
    if (!file) {
      onFileSelect(null);
      setPreviewUrl(null);
      return;
    }

    setIsValidating(true);

    try {
      // Basic file validation
      const basicValidation = validateFile(file);
      if (!basicValidation.isValid) {
        throw new Error(basicValidation.error);
      }

      // ICAO photo validation if needed
      if (isPhotoValidation) {
        const photoValidation = await validateICAOPhoto(file);
        if (!photoValidation.isValid) {
          throw new Error(photoValidation.error);
        }
      }

      // Generate preview for image files
      if (file.type.startsWith('image/')) {
        const dataUrl = await fileToDataUrl(file);
        setPreviewUrl(dataUrl);
      } else {
        setPreviewUrl(null);
      }

      onFileSelect(file);
    } catch (error) {
      console.error('File validation error:', error);
      onFileSelect(null);
      setPreviewUrl(null);
      // Error will be handled by parent component
    } finally {
      setIsValidating(false);
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    void handleFileSelect(file);
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(event.dataTransfer.files);
    const file = files[0] ?? null;
    void handleFileSelect(file);
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (event: React.DragEvent) => {
    event.preventDefault();
    // Only set drag over to false if we're leaving the drop zone itself
    if (!event.currentTarget.contains(event.relatedTarget as Node)) {
      setIsDragOver(false);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemove = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onFileSelect(null);
    setPreviewUrl(null);
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {/* File drop zone */}
      <div
        onClick={handleClick}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`
          relative cursor-pointer rounded-lg border-2 border-dashed p-6 text-center transition-colors
          ${isDragOver 
            ? 'border-blue-400 bg-blue-50' 
            : error 
              ? 'border-red-300 bg-red-50' 
              : 'border-gray-300 bg-gray-50 hover:border-blue-400 hover:bg-blue-50'
          }
        `}
        role="button"
        tabIndex={0}
        aria-label={`Upload ${label}`}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleClick();
          }
        }}
      >
        <input
          ref={fileInputRef}
          id={id}
          type="file"
          accept={accept}
          onChange={handleInputChange}
          required={required}
          className="sr-only"
          aria-describedby={error ? `${id}-error` : undefined}
        />

        {isValidating ? (
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-2" />
            <p className="text-sm text-gray-600">Validating file...</p>
          </div>
        ) : currentFile && currentFile instanceof File ? (
          <div className="flex flex-col items-center space-y-3">
            {previewUrl ? (
              <div className="relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={previewUrl}
                  alt="File preview"
                  className="h-24 w-24 rounded-lg object-cover border-2 border-gray-200"
                />
              </div>
            ) : (
              <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-blue-100">
                <svg
                  className="h-6 w-6 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
            )}
            
            <div className="text-center">
              <p className="text-sm font-medium text-gray-900">
                {currentFile?.name ?? 'Unknown file'}
              </p>
              <p className="text-xs text-gray-500">
                {formatFileSize(currentFile?.size)}
              </p>
            </div>
            
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleRemove();
              }}
              className="text-sm text-red-600 hover:text-red-700 font-medium"
            >
              Remove
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-2">
            <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-gray-200">
              <svg
                className="h-6 w-6 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
            </div>
            
            <div className="text-center">
              <p className="text-base font-medium text-gray-900">
                {label}
              </p>
              <p className="text-sm text-gray-600">
                Drag and drop your file here, or{' '}
                <span className="text-blue-600 font-medium">browse</span>
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Max size: {formatFileSize(maxSize)}
              </p>
              <p className="text-xs text-gray-500">
                Accepted formats: {accept.split(',').join(', ')}
              </p>
              {isPhotoValidation && (
                <p className="text-xs text-gray-500 mt-1">
                  Must meet ICAO passport photo standards
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      {error && (
        <p id={`${id}-error`} className="text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}