import React from "react";

const ProgressBar = ({ value }) => {
  return (
    <div className="relative">
      <div className="bg-gray-200 rounded-full h-5 shadow-inner overflow-hidden">
        <div
          className="bg-green-600 h-5 rounded-full transition-all duration-500 animate-pulse"
          style={{ width: `${value}%` }}
        ></div>
      </div>
      <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-[10px] font-semibold text-white drop-shadow pointer-events-none select-none">
        {value}%
      </span>
    </div>
  );
};

export default ProgressBar;
