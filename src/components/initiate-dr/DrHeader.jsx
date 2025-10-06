import React from "react";
import { FaArrowLeft } from "react-icons/fa";
import { getLabel } from "../../services/apiService";

const DrHeader = ({
  projectName,
  sourceRegion,
  targetRegion,
  onBack,
  onInitiateDr,
  hideStepper,
  selectedCloud,
  totalFailovered,
  selectedRows,
  suffix
}) => {
  console.log(selectedRows, "selectedRows");
  const hasData =
    totalFailovered &&
    (totalFailovered.resourcesTotal ||
      totalFailovered.resourcesCompleted ||
      totalFailovered.resourcesRunning ||
      totalFailovered.resourcesFailed);

  return (
    <>
      <div className="flex items-center gap-4 mb-5 justify-between">
        <div className="flex items-center gap-4">
          {onBack && (
            <button
              className="animate-shake mr-2 flex items-center justify-center w-8 h-8 rounded-full bg-primary-50 text-primary-600 shadow hover:bg-primary-100 hover:text-primary-800 transition-all duration-200 focus:outline-none border border-primary-100 cursor-pointer"
              onClick={onBack}
              title="Back"
            >
              <FaArrowLeft className="w-4 h-4" />
            </button>
          )}
          <div className="flex flex-wrap gap-2">
            <span className="flex items-center gap-1 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-medium shadow-sm border border-blue-100">
              <span className="font-semibold">{getLabel(selectedCloud)}:</span>{" "}
              {projectName}
            </span>
            <span className="flex items-center gap-1 bg-green-50 text-green-700 px-3 py-1 rounded-full text-xs font-medium shadow-sm border border-green-100">
              <span className="font-semibold">Source:</span> {sourceRegion}
            </span>
            <span className="flex items-center gap-1 bg-purple-50 text-purple-700 px-3 py-1 rounded-full text-xs font-medium shadow-sm border border-purple-100">
              <span className="font-semibold">Target:</span> {targetRegion}
            </span>
            <span className="flex items-center gap-1 bg-purple-50 text-purple-700 px-3 py-1 rounded-full text-xs font-medium shadow-sm border border-purple-100">
              <span className="font-semibold">Suffix:</span> {suffix}
            </span>
          </div>
        </div>

        {/* Show button here if no data */}
        {!hasData && hideStepper && (
          <button
            className={`bg-gradient-to-r from-green-500 via-green-600 to-green-700 text-white text-xs px-6 py-2 rounded-2xl font-semibold shadow hover:scale-105 transition-transform duration-200 focus:outline-none flex items-center gap-2
             ${selectedRows.length === 0 ? "opacity-50 cursor-not-allowed" : ""}`}
            onClick={onInitiateDr}
            disabled={selectedRows.length === 0}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 12l5 5L20 7"
              />
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 19V5" />
            </svg>
            Initiate DR
          </button>
        )}
      </div>

      {/* Show cards + button only when data exists */}
      {hideStepper && hasData && (
        <div className="flex items-center justify-between mt-5 bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 shadow rounded p-4 mb-4">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            {/* Total Resources */}
            <div className="w-50 bg-gradient-to-r from-primary-400 to-indigo-400 rounded-xl p-4 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-primary-100 text-sm">Total Failovered</p>
                  <p className="text-2xl font-bold">
                    {totalFailovered?.resourcesTotal || 0}
                  </p>
                </div>
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Completed Resources */}
            <div className=" w-50 bg-gradient-to-r from-emerald-400 to-green-400 rounded-xl p-4 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-emerald-100 text-sm">Success</p>
                  <p className="text-2xl font-bold">
                    {totalFailovered?.resourcesCompleted || 0}
                  </p>
                </div>
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Running Resources */}
            <div className=" w-50 bg-gradient-to-r from-amber-400 to-orange-400 rounded-xl p-4 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-amber-100 text-sm">Running</p>
                  <p className="text-2xl font-bold">
                    {totalFailovered?.resourcesRunning || 0}
                  </p>
                </div>
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Failed Resources */}
            <div className=" w-50 bg-gradient-to-r from-rose-400 to-red-400 rounded-xl p-4 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-rose-100 text-sm">Failed</p>
                  <p className="text-2xl font-bold">
                    {totalFailovered?.resourcesFailed || 0}
                  </p>
                </div>
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Initiate DR Button */}
          <button
             className={`bg-gradient-to-r from-green-500 via-green-600 to-green-700 text-white text-xs px-6 py-2 rounded-2xl font-semibold shadow hover:scale-105 transition-transform duration-200 focus:outline-none flex items-center gap-2
    ${selectedRows.length === 0 ? "opacity-50 cursor-not-allowed" : ""}`}
            onClick={onInitiateDr}
            disabled={selectedRows.length === 0}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 12l5 5L20 7"
              />
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 19V5" />
            </svg>
            Initiate DR
          </button>
        </div>
      )}
    </>
  );
};

export default DrHeader;
