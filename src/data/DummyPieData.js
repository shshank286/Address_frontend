export const data = {
  labels: ["Male", "Female"],
  datasets: [
    {
      label: "Gender Distribution",
      data: [2, 1],
      backgroundColor: ["rgba(75, 192, 192, 0.6)", "rgba(255, 99, 132, 0.6)"],
      borderColor: ["rgba(75, 192, 192, 1)", "rgba(255, 99, 132, 1)"],
      borderWidth: 1,
    },
  ],
};

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top",
      align: "center", // Align the legend to the right
    },
    tooltip: {
      mode: "nearest", // Tooltip mode, can be changed to 'index', 'dataset', etc.
      callbacks: {
        label: function (context) {
          // Customize the tooltip label
          const label = context.label || "";
          const value = context.raw || 0;
          return ` ${label}: ${value}`;
        },
      },
    },
    title: {
      display: true,
      text: "Pie Chart",
      font: {
        size: 20,
      },
      color: "#000",
    },
  },
};
