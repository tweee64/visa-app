'use client';

import { useState, useRef, useEffect } from 'react';
import { searchCountries, type Country } from '~/lib/constants/countries';

export interface CountrySelectorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
  required?: boolean;
  id?: string;
  className?: string;
}

export function CountrySelector({
  value,
  onChange,
  placeholder = 'Select a country',
  error,
  required = false,
  id,
  className = '',
}: CountrySelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCountries, setFilteredCountries] = useState<Country[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Update filtered countries when search term changes
  useEffect(() => {
    setFilteredCountries(searchCountries(searchTerm));
  }, [searchTerm]);

  // Find selected country when value changes
  useEffect(() => {
    if (value) {
      const countries = searchCountries('');
      const country = countries.find(c => c.code === value || c.name === value);
      setSelectedCountry(country ?? null);
      if (country) {
        setSearchTerm('');
      }
    } else {
      setSelectedCountry(null);
    }
  }, [value]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const term = event.target.value;
    setSearchTerm(term);
    setIsOpen(true);
    
    // Clear selection if user is typing
    if (selectedCountry && term !== selectedCountry.name) {
      setSelectedCountry(null);
      onChange('');
    }
  };

  const handleCountrySelect = (country: Country) => {
    setSelectedCountry(country);
    onChange(country.code);
    setIsOpen(false);
    setSearchTerm('');
    inputRef.current?.blur();
  };

  const handleInputFocus = () => {
    setIsOpen(true);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      setIsOpen(false);
      setSearchTerm('');
      inputRef.current?.blur();
    } else if (event.key === 'ArrowDown') {
      event.preventDefault();
      setIsOpen(true);
    }
  };

  const displayValue = selectedCountry?.name ?? searchTerm;

  return (
    <div className="relative" ref={dropdownRef}>
      <div className="relative">
        <input
          ref={inputRef}
          id={id}
          type="text"
          value={displayValue}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          required={required}
          autoComplete="country"
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-controls={`${id}-listbox`}
          role="combobox"
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
        
        {/* Dropdown arrow */}
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <svg
            className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${
              isOpen ? 'rotate-180' : ''
            }`}
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
              clipRule="evenodd"
            />
          </svg>
        </div>

        {/* Selected country flag */}
        {selectedCountry && !searchTerm && (
          <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
            <span className="text-lg mr-2" aria-hidden="true">
              {selectedCountry.flag}
            </span>
          </div>
        )}
      </div>

      {/* Dropdown menu */}
      {isOpen && (
        <div className="absolute z-10 mt-1 w-full max-h-60 overflow-auto rounded-lg border border-gray-300 bg-white shadow-lg">
          <ul id={`${id}-listbox`} role="listbox" className="py-1">
            {filteredCountries.length > 0 ? (
              filteredCountries.map((country) => (
                <li key={country.code} role="option" aria-selected={country.code === value}>
                  <button
                    type="button"
                    onClick={() => handleCountrySelect(country)}
                    className="w-full flex items-center px-4 py-2 text-left text-base hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
                  >
                    <span className="text-lg mr-3" aria-hidden="true">
                      {country.flag}
                    </span>
                    <span className="flex-1">{country.name}</span>
                    <span className="text-sm text-gray-500 ml-2">
                      {country.code}
                    </span>
                  </button>
                </li>
              ))
            ) : (
              <li className="px-4 py-2 text-gray-500 text-base">
                No countries found
              </li>
            )}
          </ul>
        </div>
      )}

      {error && (
        <p id={`${id}-error`} className="mt-1 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}