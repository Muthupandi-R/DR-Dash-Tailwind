import React from 'react';

const SkeletonPieChart = () => {
  return (
    <div className="flex flex-col items-center justify-center w-80 h-[230px]">
      <div className="relative flex items-center justify-center animate-pulse">
        <div className="w-36 h-36 rounded-full bg-gray-200" />
        <div className="absolute w-20 h-20 rounded-full bg-gray-100" />
      </div>
      <div className="mt-4 w-32 h-4 bg-gray-200 rounded animate-pulse" />
      <div className="mt-2 w-24 h-3 bg-gray-100 rounded animate-pulse" />
    </div>
  );
};

export default SkeletonPieChart; 