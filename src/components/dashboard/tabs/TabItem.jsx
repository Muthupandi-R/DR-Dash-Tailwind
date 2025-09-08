//tableItem.jsx
import React, { useState, useRef, useEffect } from "react";
import { FaChevronDown, FaFilter } from "react-icons/fa";

const TabItem = ({ expression, data, activeTab, setActiveTab, setSelectedFilters }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [filterInput, setFilterInput] = useState(""); // used for searching
  const [selectedItems, setSelectedItems] = useState([]);

  const dropdownRef = useRef(null);

  const isActive = activeTab === expression;

  const handleTabClick = () => {
    if (activeTab === expression) {
      setIsDropdownOpen((prev) => !prev);
    } else {
      setActiveTab(expression);
      setIsDropdownOpen(true);
    }
  };

  const options = data.map((item) => {
    const key = Object.keys(item).find((k) => k !== "count");
    return { label: item[key], count: item.count };
  });

  const filteredOptions = options.filter((opt) =>
    opt.label.toLowerCase().includes(filterInput.toLowerCase())
  );

  const handleSelect = (label) => {
    const updatedSelectedItems = selectedItems.includes(label)
      ? selectedItems.filter((v) => v !== label)
      : [...selectedItems, label];
  
    setSelectedItems(updatedSelectedItems);
  
    const key = expression.toLowerCase();
    setSelectedFilters((prev) => {
      const updatedFilters = { ...prev };
      if (updatedSelectedItems.length === 0) {
        delete updatedFilters[key];
      } else {
        updatedFilters[key] = updatedSelectedItems.join(","); // ✅ convert array to comma-separated string
      }
      return updatedFilters;
    });
  };
  
  

  // Close dropdown on outside click
  useEffect(() => {
    if (!isDropdownOpen) return;
    function handleClickOutside(event) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  return (
    <div ref={dropdownRef}>
      <div
        className={`flex items-center gap-2 border-b-2 pb-1 cursor-pointer
        ${
          isActive
            ? "border-primary hover:border-primary"
            : "border-transparent hover:border-primary"
        }`}
        onClick={handleTabClick}
      >
        <h3
          className={`font-normal ${
            isActive ||
            filteredOptions.some((opt) => selectedItems.includes(opt.label))
              ? "text-primary-900 font-semibold"
              : "text-primary-800 font-bold"
          }`}
        >
          {expression}
          
        </h3>

        <span
          className={`bg-gray-200 rounded-xl text-xs px-2 font-light
          ${isActive ? "bg-primary text-white" : "bg-primary-100 text-primary-900"}`}
        >
          {data.length}
        </span>

        <FaChevronDown
          className={`text-xs text-primary-900 transition-transform ${
            isDropdownOpen ? "rotate-180" : ""
          }`}
        />
          {selectedItems.length > 0 && (
            <span className="relative flex bottom-1 w-2 h-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-primary-800 opacity-75 animate-ping"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-600"></span>
            </span>
          )}
      </div>

      {isActive && isDropdownOpen && (
        <div className="absolute mt-2 bg-primary-50 shadow-lg rounded-md w-56 z-10 p-2">
          {/* Filter + selected values display */}
          <div className="flex items-center gap-2 mb-2 border rounded px-2 py-1">
            <FaFilter className="text-gray-500 text-sm" />
            <input
              type="text"
              className="w-full text-sm outline-none bg-primary-50 text-black"
              placeholder="Filter options..."
              value={selectedItems?.join(", ") || filterInput}
              onChange={(e) => setFilterInput(e.target.value)}
            />
          </div>

          {/* Options */}
          <div className="max-h-40 overflow-y-auto text-xs">
            {filteredOptions.length === 0 ? (
              <div className="px-2 py-1 text-gray-500">No match</div>
            ) : (
              filteredOptions.map((opt, idx) => (
                <label
                  key={idx}
                  className="flex items-center px-2 py-1 hover:bg-primary-100 cursor-pointer gap-2"
                >
                  <input
                    type="checkbox"
                    checked={selectedItems.includes(opt.label)}
                    onChange={() => handleSelect(opt.label)}
                  />
                  <span>
                    {opt.label} ({opt.count})
                  </span>
                </label>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TabItem;
