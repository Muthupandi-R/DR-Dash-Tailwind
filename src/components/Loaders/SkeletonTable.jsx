import React from "react";

const SkeletonTable = ({ rows = 4, columns = 4 }) => {
  return (
    <div className="overflow-x-auto rounded-lg shadow-md bg-white border border-gray-200 animate-pulse">
      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          <tr className="bg-gray-100">
            {/* Checkbox */}
            <th className="p-3 text-left font-semibold text-xs">
              <div className="w-4 h-4 bg-gray-200 rounded" />
            </th>
            {/* Other headers */}
            {[...Array(columns - 1)].map((_, colIdx) => (
              <th key={colIdx} className="p-3 text-left font-semibold text-xs">
                <div className="h-3 w-20 bg-gray-200 rounded" />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {[...Array(rows)].map((_, rowIdx) => (
            <tr
              key={rowIdx}
              className={rowIdx % 2 === 0 ? "bg-gray-50" : "bg-white"}
            >
              {/* Checkbox cell */}
              <td className="p-3 align-middle text-xs">
                <div className="w-4 h-4 bg-gray-200 rounded" />
              </td>

              {/* First column: avatar + text */}
              <td className="p-1 align-middle text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-gray-200" />
                  <div className="h-3 w-20 bg-gray-200 rounded" />
                </div>
              </td>

              {/* Remaining columns */}
              {[...Array(columns - 2)].map((_, colIdx) => (
                <td key={colIdx} className="p-3 align-middle text-xs">
                  <div className="h-3 w-16 bg-gray-200 rounded" />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SkeletonTable;
