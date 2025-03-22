import React, { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";
import { Bar } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";
import {
  getSurveyBarChartAge,
  getSurveyBarChartGender,
  getSurveyBarChartOccupation
} from "../../services/surveyService";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const BarChart = ({ surveyId, selectedFilter, barLoading, setBarLoading }) => {
  const [chartData, setChartData] = useState(null);

  const optionColors = {
    0: "rgba(223,110,59,0.7)",
    1: "rgba(248,190,26,0.7)",
    2: "rgba(11,164,67,0.7)",
    3: "rgba(53,143,246,0.7)"
  };

  const fetchSurveyResult = async () => {
    try {
      setBarLoading(true);
      let response, labels, datasets;

      if (selectedFilter === "Age") {
        response = await getSurveyBarChartAge(surveyId);
        labels = Object.keys(response.statistics);
        datasets = createDatasets(response, labels);
        
      } else if (selectedFilter === "Gender") {

        response = await getSurveyBarChartGender(surveyId);
        labels = Object.keys(response.statistics);
        datasets = createDatasets(response, labels);

      } else if (selectedFilter === "Occupation") {
        response = await getSurveyBarChartOccupation(surveyId);
        labels = Object.keys(response.statistics).map((label) =>
          label.split("  ")
        );
        datasets = createDatasets(response, Object.keys(response.statistics));
      }

      setChartData({ labels, datasets });
    } catch (error) {
      console.error("Error fetching survey:", error);
    } finally {
      setBarLoading(false);
    }
  };

  const createDatasets = (response, labels) => {
    return [0, 1, 2, 3].map((option) => ({
      label: `Option ${option + 1}`,
      data: labels.map(
        (group) =>
          response.statistics[group]?.options[option]?.count || 0
      ),
      datalabels: {
        align: "start",
        anchor: "end",
        backgroundColor: () =>
          optionColors[option].replace(/[\d.]+\)$/g, "0.9)"),
        color: "#fff",
        borderRadius: 4,
        padding: {
          top: 4,
          bottom: 4,
          left: 6,
          right: 6
        },
        formatter: (_, context) => {
          const group = labels[context.dataIndex];
          const percentageString =
            response.statistics[group]?.options[option]?.percentage || "0%";
          return `${Math.round(
            parseFloat(percentageString.replace("%", ""))
          )}%`;
        }
      },
      backgroundColor: optionColors[option],
      borderColor: optionColors[option],
      borderWidth: 1,
      minBarLength: 30
    }));
  };

  useEffect(() => {
    fetchSurveyResult();
  }, [surveyId, selectedFilter]);

  const getOptions = () => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: true, position: "right" },
      datalabels: {
        color: "#fff",
        font: { size: 10 },
        formatter: (value, context) =>
          context.dataset.datalabels.formatter(value, context)
      }
    },
    scales: {
      x: {
        stacked: false,
        barThickness: 30 // Consistent bar width
      },
      y: {
        beginAtZero: true,
        ticks: {
          padding: 20,
          callback: (val) => (val === 0 ? "0" : `${val}`)
        }
      }
    }
  });

  return (
    <>
      {barLoading || !chartData ? (
        <div className="flex justify-center items-center h-screen">
          <l-tail-chase size="40" speed="1.75" color="black"></l-tail-chase>
        </div>
      ) : (
        <div className="w-full h-[400px] overflow-x-auto">
          <Bar
            data={chartData}
            options={getOptions()}
            plugins={[ChartDataLabels]}
          />
        </div>
      )}
    </>
  );
};

export default BarChart;