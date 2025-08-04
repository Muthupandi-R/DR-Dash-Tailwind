import React from 'react'
import { useState } from 'react';

const SearchBar = ({setSearchFilter}) => {
  const [searchText, setSearchText] = useState("");
  const [isHovered, setIsHovered] = useState(false);
  const handleSearch = () => {
    setSearchFilter(searchText); // updates parent state
  };
  const handleChange = (e) => {
    const value = e.target.value;
    setSearchText(value);
  
    if (value.trim() === "") {
      setSearchFilter(""); // 🔄 Clear search filter when input is empty
    }  };

  return (
    <div
    className="group relative flex items-center transition-all duration-300 ease-in-out"
    onMouseEnter={() => setIsHovered(true)}
    onMouseLeave={() => setIsHovered(false)}
  >
    <input
      value={searchText}
      onChange={handleChange}
      className={`transition-all duration-300 ease-in-out border border-primary-300 rounded-md bg-primary-50  text-sm px-3 py-2 shadow-sm focus:outline-none focus:border-primary-600 ${
        isHovered || searchText
          ? "w-64 opacity-100 mr-2"
          : "w-0 opacity-0 overflow-hidden"
      }`}
      placeholder="Search Resource Names and Projects..."
    />

    <button
      className="bg-primary text-white text-sm px-3 py-2 rounded-md flex items-center gap-2 hover:bg-primary-700 transition-all duration-300"
      onClick={handleSearch}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="currentColor"
        viewBox="0 0 24 24"
        className="w-4 h-4"
      >
        <path
          fillRule="evenodd"
          d="M10.5 3.75a6.75 6.75 0 1 0 0 13.5 6.75 6.75 0 0 0 0-13.5ZM2.25 10.5a8.25 8.25 0 1 1 14.59 5.28l4.69 4.69a.75.75 0 1 1-1.06 1.06l-4.69-4.69A8.25 8.25 0 0 1 2.25 10.5Z"
          clipRule="evenodd"
        />
      </svg>
      <span className={`${isHovered || searchText ? "inline" : "hidden"} transition-all duration-300`}>
        Search
      </span>
    </button>
  </div>
);
}

export default SearchBar