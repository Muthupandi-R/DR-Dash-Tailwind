import React, { useState, useRef } from "react";
import ReactDOM from "react-dom";
import { getOrderStatus } from "../../services/apiService";
import DEFAULT_IMG from "../../assets/Icons/azure/functionapp.png";
import { InformationCircleIcon } from "@heroicons/react/24/outline";
import { getIcon } from "../../utils/iconMap";
import { FiMapPin } from "react-icons/fi";
import ProgressBar from "./../progressbar/ProgressBar";
// Portal utility for tooltips
const Portal = ({ children }) => {
  if (typeof document === "undefined") return null;
  return ReactDOM.createPortal(children, document.body);
};

const TableComponent = ({
  data = [],
  borderColor,
  thColor,
  showCheckbox = true,
  selectedCloud,
  onSelectResource,
  progressData,
  selectedRows,
  setSelectedRows,
}) => {
  const [hoveredIdx, setHoveredIdx] = useState(null);
  const [infoTippyIdx, setInfoTippyIdx] = useState(null);
  const [tippyPos, setTippyPos] = useState({ left: 0, top: 0 });
  const infoIconRefs = useRef([]);

  const isPlaceholder = (row) => {
    if (row.status === undefined || row.status === null || row.status === "")
      return true;
    return false;
  };

  const handleCheckboxChange = (row) => {
    let updated = [];
    const exists = selectedRows.some((r) => r.id === row.id);

    if (exists) {
      updated = selectedRows.filter((r) => r.id !== row.id);
    } else {
      updated = [...selectedRows, row]; // Store entire row
    }

    setSelectedRows(updated); // Update in parent
    onSelectResource(updated); // Notify parent
  };

  return (
    <div className={`shadow-md bg-white border ${borderColor}`}>
      <table>
        <thead>
          <tr className={thColor}>
            <th className="p-3  text-left font-semibold text-xs w-[3rem]">
              {showCheckbox ? (
                <input
                  type="checkbox"
                  disabled
                  className="accent-primary-500"
                />
              ) : (
                <div className="w-4 h-4"></div>
              )}
            </th>
            <th className="p-3  text-left font-semibold text-xs w-[15rem]">
              Resource Name
            </th>
            <th className="p-3  text-left font-semibold text-xs w-[12rem]">
              Location
            </th>
            <th className="p-3  text-left font-semibold text-xs w-[14rem]">
              Status
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => {
            const showTippy =
              row?.resourceName && row?.resourceName?.length > 8;
            const showInfoIcon = !showCheckbox && isPlaceholder(row);
            return (
              <tr
                key={row?.id}
                className={`h-12 transition-colors duration-200 ${
                  idx % 2 === 0 ? "bg-gray-50" : "bg-white"
                } hover:bg-primary-50 group text-xs`}
              >
                <td className="p-3  align-middle text-xs w-[3rem]">
                  {showCheckbox ? (
                    <input
                      type="checkbox"
                      checked={selectedRows.some((r) => r.id === row.id)}
                      onChange={() => handleCheckboxChange(row)}
                      className="accent-primary-500 focus:ring-2 focus:ring-primary-400 rounded border-gray-300"
                    />
                  ) : (
                    <div className="w-4 h-4"></div>
                  )}
                </td>
                <td className="p-1  align-middle font-medium text-gray-800 group-hover:text-indigo-700  text-xs w-[15rem]">
                  {/* Show initial if no image, else show image */}
                  <div className="relative flex items-center gap-2 ">
                    {(() => {
                      const icon = getIcon(selectedCloud, row?.type);
                      if (icon) {
                        return (
                          <img
                            src={icon}
                            alt={row?.type}
                            className="w-7 h-7 rounded-md object-cover"
                          />
                        );
                      } else {
                        return (
                          <img
                            src={DEFAULT_IMG}
                            alt="Resource"
                            className="w-7 h-7 rounded-full object-cover"
                          />
                        );
                      }
                    })()}
                    <span className="relative max-w-[7rem] flex items-center">
                      <span
                        className="truncate cursor-pointer"
                        onMouseEnter={() =>
                          setHoveredIdx(showTippy ? idx : null)
                        }
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
                  </div>
                </td>
                <td className="p-3 align-middle text-gray-600 group-hover:text-primary-700 text-xs w-[12rem]">
                  <div className="flex gap-1 items-center">
                    <FiMapPin className="text-primary-600" />
                    {row?.location || "Unknown"}
                  </div>
                </td>
                <td className="p-3  align-middle text-xs w-[14rem] relative">
                  {progressData?.[row.id] !== undefined ? (
                    <>
                      <ProgressBar value={progressData[row.id]} />
                      {/* Horizontal animated line */}
                      {showCheckbox && (
                        <div className="absolute top-1/2 left-full h-3 w-9 ml-1 bg-gray-200 overflow-hidden flex items-center">
                          {/* Moving gradient line */}
                          <div className="w-full h-[4px] bg-[linear-gradient(to_right,rgba(59,130,246,1)_0%,rgba(59,130,246,0)_100%)] bg-[length:12px_2px] animate-[moveDots_1s_linear_infinite]"></div>

                          {/* Animated folder icon */}
                          <div className="absolute top-1/2 -translate-y-1/2 animate-[moveFolder_2s_linear_infinite]">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="w-5 h-5 text-yellow-400"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414a2 2 0 00-.586-1.414l-3.414-3.414A2 2 0 0010.586 2H6zM11 3.5L15.5 8H12a1 1 0 01-1-1V3.5z" />
                            </svg>
                          </div>
                        </div>
                      )}
                    </>
                  ) : showInfoIcon ? (
                    <span
                      className="relative"
                      ref={(el) => (infoIconRefs.current[idx] = el)}
                      onMouseEnter={(e) => {
                        setInfoTippyIdx(idx);
                        if (infoIconRefs.current[idx]) {
                          const rect =
                            infoIconRefs.current[idx].getBoundingClientRect();
                          setTippyPos({
                            left: rect.left + rect.width / 2,
                            top: rect.top,
                          });
                        }
                      }}
                      onMouseLeave={() => setInfoTippyIdx(null)}
                    >
                      <InformationCircleIcon className="w-6 h-6 text-yellow-500 cursor-pointer" />
                      {infoTippyIdx === idx && (
                        <Portal>
                          <div
                            className="z-50 px-4 py-2 rounded bg-yellow-200 text-yellow-900 text-xs font-semibold shadow-lg whitespace-nowrap animate-fade-in border border-yellow-300"
                            style={{
                              position: "fixed",
                              left: tippyPos.left,
                              top: tippyPos.top - 54, // 44px above the icon
                              transform: "translateX(-50%)",
                              pointerEvents: "none",
                              maxWidth: "400px",
                              minWidth: "180px",
                              textAlign: "center",
                            }}
                          >
                            Once you complete the failover <br />
                            the resource will create
                            <div className="absolute left-1/2 top-full -translate-x-1/2 w-0 h-0 border-l-6 border-r-6 border-t-6 border-l-transparent border-r-transparent border-t-yellow-200"></div>
                          </div>
                        </Portal>
                      )}
                    </span>
                  ) : (
                    getOrderStatus(row?.status)
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default TableComponent;
