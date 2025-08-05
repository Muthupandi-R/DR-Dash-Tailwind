import React from "react";
import { useState } from "react";
import { FaFilter, FaSearch } from "react-icons/fa";

const SearchBar = ({ setSearchFilter }) => {
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
    } else {
      setSearchFilter(searchText); // updates parent state
    }
  };

  return (
    <div
      className="group relative flex items-center transition-all duration-300 ease-in-out"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <input
        value={searchText}
        onChange={handleChange}
        onClick={handleSearch}
        className={`transition-all duration-300 ease-in-out border border-primary-300 rounded-md bg-primary-50  text-xs px-3 py-2 shadow-sm focus:outline-none focus:border-primary-600 ${
          isHovered || searchText
            ? "w-64 opacity-100 mr-2"
            : "w-0 opacity-0 overflow-hidden"
        }`}
        placeholder="Search Resource Names and Projects..."
      />

      <button
        className="bg-primary text-white text-sm px-3 py-2.5 rounded-md flex items-center gap-2 hover:bg-primary-700 transition-all duration-300"
        onClick={handleSearch}
      >
        <span
          className={`${
            isHovered || searchText ? "hidden" : "inline"
          } transition-all duration-300`}
        >
          <FaSearch className="size-3.5" />
        </span>
        <span
          className={`${
            isHovered || searchText ? "" : "hidden"
          }  transition-all duration-300`}
        >
          <FaFilter className="size-3.5" />
        </span>
      </button>
    </div>
  );
};

export default SearchBar;
