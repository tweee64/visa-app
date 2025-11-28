'use client';

import React from 'react';

interface LoadingOverlayProps {
  isVisible: boolean;
  message?: string;
  children?: React.ReactNode;
}

export function LoadingOverlay({ isVisible, message = 'Loading...', children }: LoadingOverlayProps) {
  if (!isVisible) return <>{children}</>;

  return (
    <div className="relative">
      {children}
      <div className="absolute inset-0 z-50 flex items-center justify-center bg-white bg-opacity-75 backdrop-blur-sm">
        <div className="flex flex-col items-center gap-4 rounded-lg bg-white p-6 shadow-lg">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />
          <p className="text-sm font-medium text-gray-700">{message}</p>
        </div>
      </div>
    </div>
  );
}

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function Spinner({ size = 'md', className = '' }: SpinnerProps) {
  const sizeClasses = {
    sm: 'h-4 w-4 border-2',
    md: 'h-6 w-6 border-2',
    lg: 'h-8 w-8 border-4',
  };

  return (
    <div
      className={`animate-spin rounded-full border-gray-200 border-t-blue-600 ${sizeClasses[size]} ${className}`}
    />
  );
}

interface LoadingButtonProps {
  isLoading: boolean;
  children: React.ReactNode;
  loadingText?: string;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  type?: 'button' | 'submit';
}

export function LoadingButton({
  isLoading,
  children,
  loadingText,
  className = '',
  onClick,
  disabled,
  type = 'button',
}: LoadingButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isLoading || disabled}
      className={`inline-flex items-center justify-center gap-2 ${className} ${
        isLoading || disabled ? 'cursor-not-allowed opacity-50' : ''
      }`}
    >
      {isLoading && <Spinner size="sm" />}
      <span>{isLoading && loadingText ? loadingText : children}</span>
    </button>
  );
}