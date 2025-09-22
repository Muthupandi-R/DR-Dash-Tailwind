import React from "react";

const CardSkeleton = () => {
  return (
    <div className="w-50 animate-pulse bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl p-4 shadow">
        <div className="flex justify-between">
            <div>
      <div className="h-4 w-24 bg-gray-300 rounded mb-3"></div>
      <div className="h-6 w-16 bg-gray-400 rounded mb-4"></div>
      </div>
      <div className="w-10 h-10 bg-gray-300 rounded-lg"></div>
      </div>
    </div>
  );
};

export default CardSkeleton;    
