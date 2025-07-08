import React, { useEffect, useState } from "react";
import { InformationCircleIcon, XMarkIcon } from "@heroicons/react/24/outline";

const Toast = ({ message, duration = 5000, onClose }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setVisible(false);
      onClose?.();
    }, duration);

    return () => clearTimeout(timeout);
  }, [duration, onClose]);

  if (!visible) return null;

  return (
    <div className="fixed top-6 right-6 z-50 animate-slideIn">
      <div className="relative">
        {/* Icon */}
        <div className="absolute -top-4 left-2 bg-blue-50 p-2 rounded-full">
          <InformationCircleIcon className="w-6 h-6 text-blue-500" />
        </div>

        {/* Toast Body */}
        <div className="w-80 bg-blue-100 rounded-md flex items-center shadow-lg overflow-hidden">
          {/* Decorative Bubbles */}
          <div className="relative h-20 w-16">
            <div className="absolute w-20 h-20 -bottom-6 -left-12 rounded-full bg-blue-200" />
            <div className="absolute w-12 h-12 -bottom-6 -left-1 rounded-full bg-blue-300/60" />
            <div className="absolute w-3 h-3 -bottom-16 -left-8 rounded-full bg-blue-300/80" />
          </div>

          {/* Message */}
          <div className="px-4 py-2 flex-1">
            <div className="flex justify-between items-center mb-1">
              <h2 className="text-lg font-semibold">Notification</h2>
              <XMarkIcon
                className="w-5 h-5 text-blue-500 cursor-pointer"
                onClick={() => {
                  setVisible(false);
                  onClose?.();
                }}
              />
            </div>
            <p className="text-sm">{message}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Toast;
