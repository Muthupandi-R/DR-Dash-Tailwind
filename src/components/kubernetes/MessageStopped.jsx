import React from "react";

const MessageStopped = () => {
  return (
    <div className="bg-gradient-to-br from-white via-red-50/30 to-pink-50/50 rounded-3xl border border-gray-200/60 shadow-xl shadow-red-500/10 overflow-hidden backdrop-blur-sm">
      {/* Main content with warning message */}
      <div className="p-8 text-center">
        <div className="max-w-md mx-auto">
          {/* Warning Icon */}
          <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <svg
              className="w-10 h-10 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>

          {/* Message */}
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            No Resources Available
          </h3>
          <p className="text-gray-600 mb-6 leading-relaxed text-xs">
            There are no resources currently running on this cluster because the
            cluster is stopped. Restart the cluster to view resources.
          </p>

          {/* Status Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-full text-sm font-medium mb-6">
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            Power State: Stopped
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500 to-pink-600 text-white font-medium text-sm rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Restart Cluster
            </button>
            <button className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-gray-500 to-gray-600 text-white font-medium text-sm rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Learn More
            </button>
          </div>

          {/* Additional Info */}
          <div className="mt-8 p-4 bg-gray-50/80 rounded-xl border border-gray-200/40">
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <svg
                className="w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>
                Cluster resources will become available once restarted
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageStopped;
