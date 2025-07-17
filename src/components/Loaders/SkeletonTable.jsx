import React from 'react';

const SkeletonTable = () => (
  <div className="overflow-x-auto rounded-lg shadow-md bg-white border border-gray-200 animate-pulse">
    <table className="min-w-full divide-y divide-gray-200">
      <thead>
        <tr className="bg-gray-100">
          <th className="p-3 text-left font-semibold text-xs">
            <div className="w-4 h-4 bg-gray-200 rounded" />
          </th>
          <th className="p-3 text-left font-semibold text-xs">
            <div className="h-3 w-24 bg-gray-200 rounded" />
          </th>
          <th className="p-3 text-left font-semibold text-xs">
            <div className="h-3 w-16 bg-gray-200 rounded" />
          </th>
          <th className="p-3 text-left font-semibold text-xs">
            <div className="h-3 w-14 bg-gray-200 rounded" />
          </th>
        </tr>
      </thead>
      <tbody>
        {[...Array(4)].map((_, idx) => (
          <tr key={idx} className={idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
            <td className="p-3 align-middle text-xs">
              <div className="w-4 h-4 bg-gray-200 rounded" />
            </td>
            <td className="p-1 align-middle text-xs">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-gray-200" />
                <div className="h-3 w-20 bg-gray-200 rounded" />
              </div>
            </td>
            <td className="p-3 align-middle text-xs">
              <div className="h-3 w-14 bg-gray-200 rounded" />
            </td>
            <td className="p-3 align-middle text-xs">
              <div className="h-3 w-12 bg-gray-200 rounded" />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default SkeletonTable;