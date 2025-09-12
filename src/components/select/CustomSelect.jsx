import React, { useState, useEffect, useRef } from "react";
import { FiChevronDown } from "react-icons/fi";
import { getLabel } from "../../services/apiService";
import { Info } from 'lucide-react';

const CustomSelect = ({
  label,
  options,
  value,
  onChange,
  disabled = false,
  selectedCloud,
  required = true,
  infoText 
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState("bottom");
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);

  // Handle auto-selection for Source/Target Region
  useEffect(() => {
    if (!value && options.length > 0) {
      if (label === "Source Region") {
        onChange(options[0]?.value);
      } else if (label === "Target Region" && options.length > 1) {
        onChange(options[1]?.value);
      }
    }
  }, [label, options, value, onChange]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        !buttonRef.current.contains(event.target)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Adjust dropdown position based on space
  useEffect(() => {
    if (isDropdownOpen && dropdownRef.current) {
      const rect = dropdownRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const spaceBelow = viewportHeight - rect.bottom;
      const spaceAbove = rect.top;
      const dropdownHeight = options.length * 40;

      setDropdownPosition(
        spaceBelow < dropdownHeight && spaceAbove > spaceBelow
          ? "top"
          : "bottom"
      );
    }
  }, [isDropdownOpen, options]);

  return (
    <div className="w-full">
      <label className="block text-sm text-gray-600 mb-2 flex items-center gap-1">
        {label} 
        {required && <span className="text-red-500">*</span>}

        {/* Info icon with tooltip */}
        {infoText && (
          <div className="relative group">
            <Info className="w-4 h-4 text-yellow-500 cursor-pointer" />
            <div className="absolute left-1 bottom-full mb-2 w-64 bg-yellow-200 border border-yellow-300 rounded-xl shadow-lg p-2 text-xs text-yellow-900 opacity-0 font-semibold group-hover:opacity-100 pointer-events-none transition-all duration-300 transform -translate-x-1/2 scale-95 group-hover:scale-100 z-20 text-center">
              {infoText}
                  <div className="absolute left-1/2 -bottom-2 -translate-x-1/2 w-3 h-3 bg-yellow-200 border-r border-b border-yellow-300 rotate-45"></div>
            </div>
        
          </div>
        )}
      </label>
      <div className="relative" ref={dropdownRef}>
        <button
          ref={buttonRef}
          disabled={disabled || options.length === 0}
          onClick={() => setIsDropdownOpen((prev) => !prev)}
          className={`w-full px-4 py-2 text-sm border rounded-xl shadow-md text-gray-700 bg-gradient-to-r from-blue-50 via-white to-purple-50 
    focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-primary-400 disabled:opacity-50 
    transition-all duration-200 hover:shadow-lg flex justify-between items-center
    ${
      options.length === 0 ? "border-blue-400 animate-pulse" : "border-gray-200"
    }`}
        >
          {options.length === 0 ? (
            <span className="flex items-center gap-2 text-sm text-gray-500">
              <svg
                className="animate-spin h-4 w-4 text-primary-500"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8z"
                ></path>
              </svg>
              Fetching all Projects...
            </span>
          ) : (
            <span>
              {value
                ? options.find((opt) => opt.value === value)?.label
                : `Select ${label}`}
            </span>
          )}

          {/* Chevron Icon */}
          <FiChevronDown
            className={`ml-2 transition-transform duration-200 ${
              isDropdownOpen && dropdownPosition === "top" ? "rotate-180" : ""
            }`}
          />
        </button>

        {isDropdownOpen && options.length > 0 && (
          <ul
            className={`absolute left-0 w-full z-10 bg-white border border-primary-300 rounded-md shadow-lg mt-1 max-h-60 overflow-auto ${
              dropdownPosition === "top" ? "bottom-full mb-1" : "top-full"
            }`}
          >
            <li key="">
              <button
                onClick={() => {
                  onChange("");
                  setIsDropdownOpen(false);
                }}
                className={`w-full px-3 py-2 text-sm text-left hover:bg-primary-50 ${
                  value === "" ? "bg-primary-100 text-primary-700" : ""
                }`}
              >
                Select {label}
              </button>
            </li>
            {options.map((option) => (
              <li key={option.value}>
                <button
                  onClick={() => {
                    onChange(option.value);
                    setIsDropdownOpen(false);
                  }}
                  disabled={label !== getLabel(selectedCloud) && option.value !== value}
                  className={`w-full px-3 py-2 text-sm text-left transition-colors duration-150 ${
                    option.value === value
                      ? "bg-primary-100 text-primary-700 font-medium "
                      : "text-gray-700 hover:bg-primary-50 "
                  } ${
                    label !== getLabel(selectedCloud) && option.value !== value
                      ? "opacity-50 cursor-not-allowed"
                      : "cursor-pointer"
                  }`}
                >
                  {option.label}
                </button>   
              </li>  
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default CustomSelect;
