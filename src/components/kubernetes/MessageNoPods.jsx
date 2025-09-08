import React from 'react'

const MessageNoPods = () => {
  return (
    <div className="p-10 text-center">
          <div className="max-w-md mx-auto">
            <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 13h6m-3-3v6m9-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h4 className="text-base font-semibold text-gray-900 mb-1">
              No Pods Found
            </h4>
            <p className="text-sm text-gray-600">
              This namespace currently has no running pods.
            </p>
          </div>
        </div>
  )
}

export default MessageNoPods