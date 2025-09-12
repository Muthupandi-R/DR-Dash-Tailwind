import React from "react";
import { FaArrowLeft } from "react-icons/fa";
import { getLabel } from "../../services/apiService";

const stepLabels = ["Capacity", "Initiate DR", "Deployments", "Verified"];

const DrHeader = ({
  projectName,
  sourceRegion,
  targetRegion,
  onBack,
  onInitiateDr,
  hideStepper,
  selectedCloud,
}) => {
  const step = 2; // static for now, can be made dynamic if needed
  return (
    <>
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
        </div>
      </div>
      {hideStepper && (
        <div className="flex items-center justify-between mt-5 bg-white shadow rounded p-4 mb-4">
          {/* Stepper */}
          <div className="flex items-end gap-0">
            {stepLabels.map((label, idx) => {
              let circle, circleClass, labelClass, connectorClass;
              const borderClass = "border-2 border-dotted border-gray-300";
              if (idx === 0) {
                circle = (
                  <span
                    className={`flex items-center justify-center w-8 h-8 rounded-full bg-green-500 text-white ${borderClass}`}
                    style={{ boxSizing: "border-box" }}
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </span>
                );
                circleClass = "";
                labelClass =
                  "text-xs mt-2 text-center text-green-600 font-semibold";
              } else if (idx === 1) {
                circle = (
                  <span
                    className={`flex items-center justify-center w-8 h-8 rounded-full bg-primary-600 text-white font-bold text-lg border-4 border-primary-200 animate-pulse ${borderClass}`}
                    style={{ boxSizing: "border-box" }}
                  >
                    {idx + 1}
                  </span>
                );
                circleClass = "";
                labelClass =
                  "text-xs mt-2 text-center text-primary-600 font-semibold";
              } else {
                circle = (
                  <span
                    className={`flex items-center justify-center w-8 h-8 rounded-full bg-gray-300 text-white font-bold text-lg opacity-50 border-2 border-dotted border-gray-300`}
                    style={{ boxSizing: "border-box" }}
                  >
                    {idx + 1}
                  </span>
                );
                circleClass = "";
                labelClass =
                  "text-xs mt-2 text-center text-gray-400 font-semibold opacity-50";
              }
              if (idx < stepLabels.length - 1) {
                connectorClass =
                  idx < step - 1
                    ? "bg-green-500"
                    : idx === step - 1
                    ? "bg-primary-400"
                    : "bg-gray-200 opacity-50";
              }
              return (
                <React.Fragment key={label}>
                  <div className="flex flex-col items-center justify-center">
                    <div className={circleClass}>{circle}</div>
                    <div className={labelClass} style={{ width: "5.5rem" }}>
                      {label}
                    </div>
                  </div>
                  {idx < stepLabels.length - 1 && (
                    <div
                      className={`flex items-center`}
                      style={{ height: "2.5rem" }}
                    >
                      <div
                        className={`h-1 w-10 rounded ${connectorClass}`}
                      ></div>
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>
          {/* Initiate DR Button */}
          <button
            className="bg-gradient-to-r from-green-500 via-green-600 to-green-700 text-white text-xs px-6 py-2 rounded-2xl font-semibold shadow hover:scale-105 transition-transform duration-200 focus:outline-none flex items-center gap-2 cursor-pointer"
            onClick={onInitiateDr}
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
