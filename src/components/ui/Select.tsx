'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

export interface SelectOption {
  value: string | number;
  label: string;
}

interface SelectProps {
  value: string | number;
  onChange: (value: string | number) => void;
  options: SelectOption[];
  placeholder?: string;
  disabled?: boolean;
  error?: boolean;
  className?: string;
  id?: string;
  'aria-invalid'?: boolean;
  'aria-describedby'?: string;
}

export function Select({
  value,
  onChange,
  options,
  placeholder = 'Select an option',
  disabled = false,
  error = false,
  className = '',
  id,
  'aria-invalid': ariaInvalid,
  'aria-describedby': ariaDescribedBy,
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const selectedOption = options.find(option => option.value === value);

  const handleToggle = useCallback(() => {
    if (!disabled) {
      setIsOpen(!isOpen);
      setFocusedIndex(-1);
    }
  }, [disabled, isOpen]);

  const handleSelect = useCallback((selectedValue: string | number) => {
    onChange(selectedValue);
    setIsOpen(false);
    setFocusedIndex(-1);
    triggerRef.current?.focus();
  }, [onChange]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (disabled) return;

    switch (e.key) {
      case 'Enter':
      case ' ':
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
          setFocusedIndex(0);
        } else if (focusedIndex >= 0) {
          handleSelect(options[focusedIndex]!.value);
        }
        break;
      case 'Escape':
        if (isOpen) {
          setIsOpen(false);
          setFocusedIndex(-1);
          triggerRef.current?.focus();
        }
        break;
      case 'ArrowDown':
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
          setFocusedIndex(0);
        } else {
          setFocusedIndex(prev => Math.min(prev + 1, options.length - 1));
        }
        break;
      case 'ArrowUp':
        e.preventDefault();
        if (isOpen) {
          setFocusedIndex(prev => Math.max(prev - 1, 0));
        }
        break;
      case 'Home':
        if (isOpen) {
          e.preventDefault();
          setFocusedIndex(0);
        }
        break;
      case 'End':
        if (isOpen) {
          e.preventDefault();
          setFocusedIndex(options.length - 1);
        }
        break;
    }
  }, [disabled, isOpen, focusedIndex, options, handleSelect]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setFocusedIndex(-1);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      <button
        ref={triggerRef}
        type="button"
        id={id}
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-invalid={ariaInvalid}
        aria-describedby={ariaDescribedBy}
        className={`
          flex w-full items-center justify-between rounded-lg border px-4 py-3 text-left text-base transition-colors
          focus:outline-none focus:ring-2 focus:ring-offset-0
          ${error
            ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
            : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
          }
          ${disabled
            ? 'cursor-not-allowed bg-gray-100 text-gray-500'
            : 'cursor-pointer bg-white hover:border-gray-400'
          }
        `}
      >
        <span className={selectedOption ? 'text-gray-900' : 'text-gray-400'}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDownIcon
          className={`ml-2 h-5 w-5 flex-shrink-0 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : 'rotate-0'
          } ${error ? 'text-red-400' : 'text-gray-400'}`}
        />
      </button>

      {isOpen && (
        <div className="absolute z-10 mt-1 w-full rounded-lg border border-gray-200 bg-white shadow-lg">
          <ul
            role="listbox"
            className="max-h-60 overflow-auto py-1"
            tabIndex={-1}
          >
            {options.map((option, index) => (
              <li key={option.value} role="option" aria-selected={option.value === value}>
                <button
                  type="button"
                  onClick={() => handleSelect(option.value)}
                  className={`
                    block w-full cursor-pointer select-none px-4 py-2 text-left text-sm transition-colors
                    ${index === focusedIndex
                      ? 'bg-blue-50 text-blue-600'
                      : option.value === value
                      ? 'bg-gray-100 text-gray-900'
                      : 'text-gray-900 hover:bg-gray-100'
                    }
                  `}
                  onMouseEnter={() => setFocusedIndex(index)}
                >
                  {option.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}