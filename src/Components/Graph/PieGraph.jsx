import React, { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJs, Tooltip, Legend, Title, ArcElement } from "chart.js";
import { data, options } from "../../data/DummyPieData.js";
import { appData } from "../../helper/Constant.js";
import axios from "axios";

ChartJs.register(Tooltip, Legend, Title, ArcElement);

const PieGraph = (props) => {
  const [chartData, setChartData] = useState({
    labels: [""],
    datasets: [
      {
        label: "",
        data: [],
        backgroundColor: [""],
        borderColor: [""],
        borderWidth: "",
      },
    ],
  });
  const userData = JSON.parse(localStorage.getItem("userData"));
  const { news, activeChart, selectedValue } = props.data;

  const getChartData = async (newsId, type, graph) => {
    try {
      const response = await axios.post(
        `${appData.BASE_ULR}/survey/chart`,
        {
          newsId,
          type,
          graph,
        },
        {
          headers: {
            Authorization: `Bearer ${userData.token}`,
          },
        }
      );
      if (response.status == 200) {
        if (response.data.status) {
          setChartData(response.data.chartData);
        }
      }
    } catch (error) {
      console.error("Error:", error.response.data);
    }
  };

  useEffect(() => {
    if (userData == null) {
      navigate("/Login");
    } else {
      getChartData(news.newsId, selectedValue, activeChart);
    }
  }, [news, activeChart, selectedValue]);

  return (
    <div className="chart-container">
      <div className="chart-child d-flex justify-content-center">
        {chartData.labels[0] != "" && (
          <Pie options={options} data={chartData} />
        )}
      </div>
    </div>
  );
};

export default PieGraph;
