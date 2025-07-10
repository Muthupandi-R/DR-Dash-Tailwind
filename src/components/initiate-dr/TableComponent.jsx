import React, { useState } from 'react'
import { getOrderStatus } from "../../lib/helpers/index"
import DEFAULT_IMG from '../../assets/azure-function-app.png'

const getInitial = (name) => name && name.length > 0 ? name[0].toUpperCase() : '?';

const TableComponent = ({ data = [], borderColor, thColor }) => {
  const [hoveredIdx, setHoveredIdx] = useState(null);
  return (
    <div className={`overflow-x-auto rounded-lg shadow-md bg-white border ${borderColor}`}>
      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          <tr className={thColor}>
            <th className="p-3 border-b text-left font-semibold">
              <input type="checkbox" disabled className="accent-primary-500" />
            </th>
            <th className="p-3 border-b text-left font-semibold">Resource Name</th>
            <th className="p-3 border-b text-left font-semibold">Location</th>
            <th className="p-3 border-b text-left font-semibold">Status</th>
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={4} className="p-4 text-center text-gray-400">No data available</td>
            </tr>
          ) : (
            data.map((row, idx) => {
              const showTippy = row.resourceName && row.resourceName.length > 8;
              return (
                <tr
                  key={row.id}
                  className={`transition-colors duration-200 ${
                    idx % 2 === 0 ? "bg-gray-50" : "bg-white"
                  } hover:bg-primary-50 group`}
                >
                  <td className="p-3 border-b align-middle">
                    <input
                      type="checkbox"
                      className="accent-primary-500 focus:ring-2 focus:ring-primary-400 rounded border-gray-300"
                    />
                  </td>
                  <td className="p-3 border-b align-middle font-medium text-gray-800 group-hover:text-indigo-700 flex items-center gap-2">
                    {/* Show initial if no image, else show image */}
                    {DEFAULT_IMG ? (
                      <img src={DEFAULT_IMG} alt="Resource" className="w-7 h-7 rounded-full object-cover border border-gray-300" style={{ pointerEvents: 'none' }} />
                    ) : (
                      <span className="w-7 h-7 flex items-center justify-center rounded-full bg-primary-200 text-primary-700 font-bold border border-gray-300">
                        {getInitial(row.resourceName)}
                      </span>
                    )}
                    <span className="relative max-w-[7rem] flex items-center">
                      <span
                        className="truncate cursor-pointer"
                        onMouseEnter={() => setHoveredIdx(showTippy ? idx : null)}
                        onMouseLeave={() => setHoveredIdx(null)}
                      >
                        {row.resourceName}
                      </span>
                      {showTippy && hoveredIdx === idx && (
                        <div className="absolute left-1/2 -translate-x-1/2 -top-8 z-30 px-3 py-1 rounded bg-gray-900 text-white text-xs font-medium shadow-lg whitespace-nowrap pointer-events-none animate-fade-in">
                          {row.resourceName}
                          <div className="absolute left-1/2 top-full -translate-x-1/2 w-0 h-0 border-l-6 border-r-6 border-t-6 border-l-transparent border-r-transparent border-t-gray-900"></div>
                        </div>
                      )}
                    </span>
                  </td>
                  <td className="p-3 border-b align-middle text-gray-600 group-hover:text-primary-700">
                    {row.location}
                  </td>
                  <td className="p-3 border-b align-middle">
                    {getOrderStatus(row.status)}
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
      {/* Tooltip animation */}
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translate(-50%, -120%); }
          to { opacity: 1; transform: translate(-50%, -100%); }
        }
        .animate-fade-in {
          animation: fade-in 0.18s ease;
        }
      `}</style>
    </div>
  )
}

export default TableComponent;