import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { CheckCircle, CircleDotDashed, Circle, ServerCog } from "lucide-react";

const ResourceProgress = ({ row, rotate }) => {
  const [showStatusCard, setShowStatusCard] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0 });
  const iconRef = useRef(null);

  // const statusData = {
  //   id: "9128414d-9552-469c-8fda-816c4505106d",
  //   provider: "AWS",
  //   resourceId: "drd-instance-2",
  //   resourceType: "EC2",
  //   status: "PENDING",
  //   message: "Queued",
  //   createdAt: "2025-09-09T16:57:27Z",
  //   updatedAt: "2025-09-09T16:57:27Z",
  //   steps: [
  //     { id: "1", name: "VPC", status: "PENDING", message: "Pending" },
  //     { id: "2", name: "Subnet", status: "PENDING", message: "Pending" },
  //     {
  //       id: "3",
  //       name: "Create security group",
  //       status: "COMPLETED",
  //       message: "Pending",
  //     },
  //     {
  //       id: "4",
  //       name: "Internet gateway",
  //       status: "COMPLETED",
  //       message: "Pending",
  //     },
  //   ],
  // };

  const handleClick = () => {
    if (iconRef.current) {
      const rect = iconRef.current.getBoundingClientRect();
      console.log(rect, "rect");

      setPos({
        top: rect.top + window.scrollY - 290,
        left: rect.left + window.scrollX - 100,
      });
      setShowStatusCard(!showStatusCard);
    }
  };

  useEffect(() => {
    const handleOutside = (e) => {
      if (iconRef.current && !iconRef.current.contains(e.target)) {
        setShowStatusCard(false);
      }
    };
    if (showStatusCard) {
      document.addEventListener("click", handleOutside);
    }
    return () => document.removeEventListener("click", handleOutside);
  }, [showStatusCard]);

  return (
    <>
      {/* 👁 Progress Icon with dotted circle */}
      <button
        ref={iconRef}
        onClick={handleClick}
        className="relative w-7 h-7 flex items-center justify-center cursor-pointer"
      >
        {/* Dotted animated circle */}
        {/* <span className="absolute inset-0 rounded-full border-2 border-dotted border-primary-500 animate-spin-slow"></span> */}

        {/* Information icon */}
        <ServerCog
          className={`w-4 h-4 text-yellow-600 relative z-10 ${
            rotate ? "animate-spin-slow" : ""
          }`}
        />
      </button>

      {/* 🔹 Status Card */}
      {showStatusCard &&
        createPortal(
          <div
            className="absolute z-50 bg-primary-50 border-2 border-primary-400 p-4 rounded-xl shadow-lg text-sm w-60 h-70 animate-fade-in overflow-y-auto"
            style={{
              top: pos.top,
              left: pos.left,
            }}
          >
            <div>
              {/* Header */}
              <h3 className="text-base font-semibold mb-2 text-sm text-gray-800">
                {row?.type}{" "}
                <span className="text-gray-500">
                  ({row?.provider || "AWS"})
                </span>
              </h3>

              {/* Status */}
              <p className="text-gray-600 text-xs mb-3">
                Status:{" "}
                <span className="font-semibold text-gray-900">
                  {row?.progressStatus}
                </span>{" "}
                – {row?.progressMessage}
              </p>

              {/* Steps with vertical line */}
              <div className="relative pl-6">
                <ul className="space-y-3">
                  {row?.steps
                    ?.slice() // copy to avoid mutating
                    .sort((a, b) => a.orderId - b.orderId) // ✅ sort by orderId
                    .map((step, idx, arr) => {
                      const isCompleted = step.status === "SUCCEEDED";
                      const isPending = step.status === "PENDING";
                      const isRunning = step.status === "RUNNING";
                      return (
                        <li
                          key={step.id}
                          className="relative flex items-start gap-3"
                        >
                          {/* Connector line */}
                          {idx !== arr.length - 1 && (
                            <div
                              className={`absolute -left-4 top-5 w-0.5 h-full 
                  ${isCompleted ? "bg-green-500" : "bg-gray-200"}`}
                            ></div>
                          )}

                          {/* Icon */}
                          <span
                            className={`absolute -left-6 ${
                              idx !== 0 ? "mt-1" : ""
                            }`}
                          >
                            {isCompleted ? (
                              <CheckCircle className="text-green-500 w-5 h-5" />
                            ) : isPending ? (
                              <CircleDotDashed className="text-gray-500 w-5 h-5 animate-spin" />
                            ) : isRunning ? (
                              <CircleDotDashed className="text-primary-500 w-5 h-5 animate-spin" />
                            ):(
                              <Circle className="text-gray-400 w-5 h-5" />
                            )}
                          </span>

                          {/* Step Name + Status */}
                          <div className="flex-1 text-xs">
                            <p className="text-gray-800 font-medium">
                              {step.name}
                            </p>
                            <p className="text-xs text-gray-500 capitalize">
                              {step.status}
                            </p>
                          </div>
                        </li>
                      );
                    })}
                </ul>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
};

export default ResourceProgress;
