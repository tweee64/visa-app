'use client';

import { forwardRef } from 'react';

export interface DatePickerProps {
  value: Date | null;
  onChange: (date: Date | null) => void;
  placeholder?: string;
  error?: string;
  required?: boolean;
  minDate?: Date;
  maxDate?: Date;
  id?: string;
  className?: string;
}

export const DatePicker = forwardRef<HTMLInputElement, DatePickerProps>(
  ({ 
    value, 
    onChange, 
    placeholder, 
    error, 
    required = false, 
    minDate, 
    maxDate,
    id,
    className = '',
  }, ref) => {
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const dateValue = event.target.value;
      if (dateValue) {
        onChange(new Date(dateValue));
      } else {
        onChange(null);
      }
    };

    const formatDateForInput = (date: Date | null): string => {
      if (!date || !(date instanceof Date) || isNaN(date.getTime())) return '';
      
      // Format date as YYYY-MM-DD for HTML date input
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');
      
      return `${year}-${month}-${day}`;
    };

    const formatDateForDisplay = (date: Date): string => {
      if (!(date instanceof Date) || isNaN(date.getTime())) {
        return '';
      }
      return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      }).format(date);
    };

    return (
      <div className="space-y-1">
        <div className="relative">
          <input
            ref={ref}
            id={id}
            type="date"
            value={formatDateForInput(value)}
            onChange={handleChange}
            min={minDate ? formatDateForInput(minDate) : undefined}
            max={maxDate ? formatDateForInput(maxDate) : undefined}
            placeholder={placeholder}
            required={required}
            aria-invalid={!!error}
            aria-describedby={error ? `${id}-error` : undefined}
            className={`
              block w-full rounded-lg border px-4 py-3 text-base transition-colors
              placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-0
              disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500
              ${error 
                ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
              }
              ${className}
            `}
          />
          
          {/* Show formatted date as overlay when date is selected */}
          {value && (
            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
              <span className="sr-only">
                Selected date: {formatDateForDisplay(value)}
              </span>
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
);

DatePicker.displayName = 'DatePicker';