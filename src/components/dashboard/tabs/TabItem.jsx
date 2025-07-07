import React, { useState } from "react";
import { FaChevronDown, FaFilter } from "react-icons/fa";

const TabItem = ({ expression, data, activeTab, setActiveTab }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [filterInput, setFilterInput] = useState(""); // used for searching
  const [selectedItems, setSelectedItems] = useState([]);

  const isActive = activeTab === expression;

  console.log(isActive, "isActive");

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
    setSelectedItems((prev) =>
      prev.includes(label) ? prev.filter((v) => v !== label) : [...prev, label]
    );
  };

  return (
    <div>
      <div
        className={`flex items-center gap-2 border-b-2 pb-1 cursor-pointer
        ${
          isActive
            ? "border-primary hover:border-primary"
            : "border-transparent hover:border-black"
        }`}
        onClick={handleTabClick}
      >
        <h3
          className={`font-normal ${
            isActive ||
            filteredOptions.some((opt) => selectedItems.includes(opt.label))
              ? "text-primary font-bold"
              : ""
          }`}
        >
          {expression}
        </h3>

        <span
          className={`bg-gray-200 rounded-xl text-xs px-2 font-light
          ${isActive ? "bg-primary text-white" : ""}`}
        >
          {data.length}
        </span>

        <FaChevronDown
          className={`text-xs transition-transform ${
            isDropdownOpen ? "rotate-180" : ""
          }`}
        />
      </div>

      {isActive && isDropdownOpen && (
        <div className="absolute mt-2 bg-white shadow-lg rounded-md w-56 z-10 p-2">
          {/* Filter + selected values display */}
          <div className="flex items-center gap-2 mb-2 border rounded px-2 py-1">
            <FaFilter className="text-gray-500 text-sm" />
            <input
              type="text"
              className="w-full text-sm outline-none"
              placeholder="Filter options..."
              value={selectedItems.join(", ")}
              onChange={(e) => setFilterInput(e.target.value)}
            />
          </div>

          {/* Options */}
          <div className="max-h-40 overflow-y-auto text-sm">
            {filteredOptions.length === 0 ? (
              <div className="px-2 py-1 text-gray-500">No match</div>
            ) : (
              filteredOptions.map((opt, idx) => (
                <label
                  key={idx}
                  className="flex items-center px-2 py-1 hover:bg-gray-100 cursor-pointer gap-2"
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
