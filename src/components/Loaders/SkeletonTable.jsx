import React from 'react'

const SkeletonTable = ({ rows = 5, columns = 4 }) => {
  return (
    <div className="animate-pulse divide-y divide-gray-200">
      {Array.from({ length: rows }).map((_, rowIdx) => (
        <div key={rowIdx} className="flex">
          {Array.from({ length: columns }).map((_, colIdx) => (
            <div
              key={colIdx}
              className="h-5 flex-1 bg-gray-200 rounded m-2"
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export default SkeletonTable