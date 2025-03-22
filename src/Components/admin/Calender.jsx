import React from "react";

const Calendar = () => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">January 2023</h3>
      <div className="grid grid-cols-7 text-center text-gray-700">
        <span>Su</span>
        <span>Mo</span>
        <span>Tu</span>
        <span>We</span>
        <span>Th</span>
        <span>Fr</span>
        <span>Sa</span>
        {/* Days of the month */}
        {Array(31)
          .fill()
          .map((_, i) => (
            <div
              key={i}
              className={`p-2 ${i === 6 ? "bg-red-500 text-white rounded-full" : ""}`}
            >
              {i + 1}
            </div>
          ))}
      </div>
    </div>
  );
};

export default Calendar;
