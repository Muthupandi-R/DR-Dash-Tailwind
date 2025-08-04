import React, { useState, useRef, useEffect } from "react";
import { FiChevronLeft, FiChevronRight, FiChevronDown } from "react-icons/fi";

function Pagination({ onNext, onPrev, currentPage, totalPages, pageSize, onPageSizeChange }) {
  // Array of available page size options
  const pageSizeOptions = [5, 10, 15, 20, 25];
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState('bottom'); // 'top' or 'bottom'
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Determine dropdown position based on available space
  useEffect(() => {
    if (isDropdownOpen && dropdownRef.current) {
      const rect = dropdownRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const spaceBelow = viewportHeight - rect.bottom;
      const spaceAbove = rect.top;
      const dropdownHeight = pageSizeOptions.length * 40; // Approximate height per option
      
      setDropdownPosition(spaceBelow < dropdownHeight && spaceAbove > spaceBelow ? 'top' : 'bottom');
    }
  }, [isDropdownOpen, pageSizeOptions.length]);

  const handlePageSizeChange = (size) => {
    onPageSizeChange(size);
    setIsDropdownOpen(false);
  };

  return (
    <div className="flex items-center justify-between w-full">
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-600">Show:</span>
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="px-2 py-1 text-sm border bg-primary-50 border-primary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent flex items-center gap-1 min-w-[60px] justify-between"
          >
            <span>{pageSize}</span>
            <FiChevronDown className={`w-4 h-4 transition-transform duration-200 ${isDropdownOpen ? (dropdownPosition === 'top' ? 'rotate-180' : 'rotate-0') : ''}`} />
          </button>
          
          {isDropdownOpen && (
            <ul className={`absolute left-0 bg-white border border-primary-300 rounded-md shadow-lg z-10 min-w-[60px] ${
              dropdownPosition === 'top' 
                ? 'bottom-full mb-1' 
                : 'top-full mt-1'
            }`}>
              {pageSizeOptions.map((size) => (
                <li key={size}>
                  <button
                    onClick={() => handlePageSizeChange(size)}
                    className={`w-full px-3 py-2 text-xs text-left hover:bg-primary-50 transition-colors duration-150 ${
                      size === pageSize ? 'bg-primary-100 text-primary-700 font-medium' : 'text-gray-700'
                    }`}
                  >
                    {size}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
        <span className="text-sm text-gray-600">entries</span>
      </div>
      
      <div className="flex space-x-3 text-xs">
      <button
          disabled={currentPage === 0}
          onClick={() => {
            if (currentPage > 0) {
              onPrev();
            }
          }}
          className={`flex items-center justify-center w-20 h-9 rounded-lg border transition-all duration-200 ${
            currentPage === 0
              ? 'border-gray-500 text-gray-500 cursor-not-allowed'
              : 'border-primary-800 text-primary-50 bg-primary-700 hover:border-primary-800 hover:bg-primary-50 hover:text-gray-800'
          }`}
          title="First page"
        >
          Previous
          <FiChevronLeft className="w-4 h-4" />
        </button>
        <button
          disabled={currentPage + 1 >= totalPages}
          onClick={onNext}
          className={`flex items-center justify-center w-20 h-9 rounded-lg border transition-all duration-200 ${
            currentPage + 1 >= totalPages
            ? 'border-gray-500 text-gray-500 cursor-not-allowed'
            : 'border-primary-800 text-primary-50 bg-primary-700 hover:border-primary-800 hover:bg-primary-50 hover:text-gray-800'
          }`}
          title="Next page"
          >
            Next
           <FiChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

export default Pagination;
