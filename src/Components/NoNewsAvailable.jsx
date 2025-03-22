import React, { useState, useEffect } from "react";

const NoNewsAvailable = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex justify-center items-center mb-14 bg-white">
      <div
        className={`w-full max-w-md bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-500 ease-in-out transform ${
          isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
        }`}
      >
        <div className="relative p-6">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-500 to-gray-300 opacity-90"></div>
          <div className="relative z-10 flex flex-col items-center text-white">
            <svg
              className="w-24 h-24 mb-4 animate-pulse"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
              />
            </svg>
            <h2 className="text-3xl font-bold mb-2 text-black/75 text-center">
              No News Available for this date...
            </h2>
          </div>
        </div>
        <div className="bg-white px-6 py-4">
          <p className="text-gray-600 text-center">
            Our news feed is temporarily empty for this date. We're working on
            bringing you the latest updates.
          </p>
        </div>
      </div>
    </div>
  );
};


export default NoNewsAvailable;
