import React, { useEffect } from "react";

const CustomSelect = ({
  label,
  options,
  value,
  onChange,
  disabled = false,
}) => {
  useEffect(() => {
    if (!value && options.length > 0) {
      if (label === "Source Region") {
        onChange(options[0]?.value);
      } else if (label === "Target Region") {
        onChange(options[1]?.value);
      }
    }
  }, [label, options, value, onChange]);
  return (
    <div className="w-full">
      <label className="block text-sm text-gray-700 mb-2">{label}</label>
      <div className="relative">
        <select
          className="appearance-none w-full px-4 py-2 text-sm bg-gradient-to-r from-blue-50 via-white to-purple-50 border border-gray-200 rounded-xl shadow-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-primary-400 disabled:opacity-50 transition-all duration-200 hover:shadow-lg hover:border-primary-300"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}   
        >
          <option value="">Select {label}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {/* Down Arrow Icon */}
        <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
          <svg
            className="h-4 w-4 text-gray-400"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default CustomSelect;
