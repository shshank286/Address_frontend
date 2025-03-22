const ChartComponent = () => {
  const chartData = [
    {
      title: "Chart 1",
      percentage: 45,
      color: "#10b981",
      legend: [
        { label: "Green Value", color: "#10b981" },
        { label: "Blue Value", color: "#3b82f6" },
        { label: "Yellow Value", color: "#facc15" },
        { label: "Orange Value", color: "#f97316" },
      ],
    },
    {
      title: "Chart 2",
      percentage: 70,
      color: "#ef4444",
      legend: [
        { label: "Red Value", color: "#ef4444" },
        { label: "Blue Value", color: "#3b82f6" },
        { label: "Yellow Value", color: "#facc15" },
        { label: "Green Value", color: "#10b981" },
      ],
    },
  ];

  return (
    <div className="bg-gray-100 flex flex-col items-center p-8">
      {/* Chart Row */}
      <div className="flex flex-col sm:flex-row justify-center space-y-8 sm:space-y-0 sm:space-x-16">
        {chartData.map((data, idx) => (
          <div key={idx} className="text-center">
            {/* Pie Chart */}
            <div className="relative w-32 h-32 sm:w-40 sm:h-40">
              <svg viewBox="0 0 36 36" className="w-full h-full">
                <circle
                  cx="18"
                  cy="18"
                  r="15.915"
                  fill="transparent"
                  stroke="#d2d3d4"
                  strokeWidth="2"
                />
                <circle
                  cx="18"
                  cy="18"
                  r="15.915"
                  fill="transparent"
                  stroke={data.color}
                  strokeWidth="2"
                  strokeDasharray={`${data.percentage} ${100 - data.percentage}`}
                  strokeDashoffset="25"
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-lg font-bold">
                {data.percentage}%
              </span>
            </div>
            {/* Status Legend */}
            <p className="mt-4 font-semibold">{data.title}</p>
            <ul className="mt-2 text-sm">
              {data.legend.map((item, idx) => (
                <li key={idx} className="flex items-center space-x-2">
                  <span
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  ></span>
                  <span>{item.label}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChartComponent;
