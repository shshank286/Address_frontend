// export const data = {
//   labels: ["January", "February", "March", "April", "May", "June", "July"],
//   datasets: [
//     {
//       label: "Sales 2023",
//       data: [65, 59, 80, 81, 56, 55, 40],
//       backgroundColor: "rgba(75, 192, 192, 0.5)", // Color of the bars
//       borderColor: "rgb(75, 192, 192)", // Border color of bars
//       borderWidth: 2, // Thickness of the border
//       borderRadius: 5, // Rounded corners for the bars
//       barPercentage: 0.9, // Controls the width of the bars
//     },
//     {
//       label: "Sales 2024",
//       data: [28, 48, 40, 19, 86, 27, 90],
//       backgroundColor: "rgba(255, 99, 132, 0.5)", // Color for the second dataset
//       borderColor: "rgb(255, 99, 132)",
//       borderWidth: 2,
//       borderRadius: 5,
//       barPercentage: 0.9,
//     },
//   ],
// };
export const data = {
  labels: ["Option1", "Option2", "Option3"],
  datasets: [
    {
      label: "Male",
      data: [1, 1, 0],
      backgroundColor: "rgba(75, 192, 192, 0.5)",
      borderColor: "rgb(75, 192, 192)",
      borderWidth: 2,
      borderRadius: 5,
      barPercentage: 0.9,
    },
    {
      label: "Female",
      data: [0, 1, 0],
      backgroundColor: "rgba(255, 99, 132, 0.5)",
      borderColor: "rgb(255, 99, 132)",
      borderWidth: 2,
      borderRadius: 5,
      barPercentage: 0.9,
    },
  ],
};

export const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "top",
      align: "center",
      labels: {
        font: {
          size: 12,
        },
        color: "#000",
      },
    },
    title: {
      display: true,
      text: "Bar Graph",
      font: {
        size: 20,
      },
      color: "#333",
    },
    tooltip: {
      enabled: true, // Enable tooltips
      mode: "index", // Display tooltip for both datasets when hovering
      intersect: false,
      callbacks: {
        label: function (tooltipItem) {
          return ` ₹${tooltipItem.formattedValue}`; // Show the data with a dollar sign
        },
      },
    },
  },
  scales: {
    x: {
      grid: {
        display: true, // Show grid lines on the X-axis
        color: "rgba(200, 200, 200, 0.5)", // Light gray grid lines
        lineWidth: 1, // Thickness of the X-axis grid lines
        borderDash: [8, 4], // Dashed lines (8px dash, 4px gap)
        borderDashOffset: 0, // Start the dash pattern at the beginning
        drawOnChartArea: true, // Draw grid lines across the chart (default)
        drawTicks: true, // Display ticks on the grid lines
        tickColor: "#333", // Color of the ticks on the grid
        borderColor: "rgba(0, 0, 0, 0.1)", // Border of the grid lines at the edges
        borderWidth: 2, // Thickness of the border grid lines
      },
      title: {
        display: true,
        text: "Survey Options",
        font: {
          size: 20,
        },
        color: "#666",
      },
    },
    y: {
      beginAtZero: true, // Start Y-axis from zero
      grid: {
        display: true, // Show grid lines on the Y-axis
        color: "rgba(200, 200, 200, 0.3)", // Blue-tinted grid lines with transparency
        lineWidth: 1, // Thickness of the Y-axis grid lines
        borderDash: [4, 2], // Dashed lines (4px dash, 2px gap)
        borderDashOffset: 0,
        drawBorder: true, // Draw a border around the Y-axis
        drawOnChartArea: true, // Grid lines span the entire chart area
        drawTicks: true, // Show small ticks on the Y-axis
        tickColor: "#333", // Color of the ticks on the Y-axis
        borderColor: "rgba(0, 0, 0, 0.2)", // Border of the Y-axis
        borderWidth: 2, // Thickness of the border on the Y-axis
      },
      title: {
        display: true,
        text: "Survey Opinion",
        font: {
          size: 20,
        },
        color: "#666",
      },
    },
  },
};
