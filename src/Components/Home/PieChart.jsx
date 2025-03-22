import React, { useState, useEffect } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, Tooltip, Legend, ArcElement, Title } from "chart.js";
import {
  getSurveyPieChartAge,
  getSurveyBarChartOccupation,
  getSurveyPieChartGender
} from "../../services/surveyService";

ChartJS.register(ArcElement, Tooltip, Legend, Title);

const PieChart = ({ surveyId, selectedFilter, barLoading, setBarLoading }) => {
  const [chartData, setChartData] = useState(null);

  // const shortenLabels = {
  //   "Government / Public Sector": "Gov/Pub Sector",
  //   "Private Sector / Corporate": "Private Sector",
  //   "Self-Employed / Freelancers / Entrepreneurs": "Self-Employed",
  //   "Agriculture / Labor / Skilled Trades": "Skilled Trades",
  //   "Education / Healthcare / Services": "Education/Healthcare"
  // };

  const fetchPieChartData = async () => {
    setBarLoading(true);
    try {
      let response;

      if (selectedFilter === "Age") {
        response = await getSurveyPieChartAge(surveyId);
        const { pieChartData } = response;

        setChartData({
          labels: pieChartData.map((item) => item.ageGroup),
          datasets: [
            {
              data: pieChartData.map((item) => parseFloat(item.percentage)),
              backgroundColor: [
                "rgba(223,110,59,0.7)",
                "rgba(248,190,26,0.7)",
                "rgba(11,164,67,0.7)",
                "rgba(53,143,246,0.7)",
                "#9966FF",
                "#FF9F40"
              ],
              hoverBackgroundColor: [
                "rgb(223,110,59)",
                "rgb(248,190,26)",
                "rgb(11,164,67)",
                "rgb(53,143,246)",
                "#9966FF",
                "#FF9F40"
              ]
            }
          ]
        });
      } else if (selectedFilter === "Occupation") {
        try {
          response = await getSurveyBarChartOccupation(surveyId);
          const { statistics } = response;

          const labels = Object.keys(statistics);
          const dataValues = labels.map((key) => statistics[key].totalUsers);

          const backgroundColors = [
            "rgba(223,110,59,0.7)", 
            "rgba(248,190,26,0.7)", 
            "rgba(11,164,67,0.7)",  
            "rgba(53,143,246,0.7)", 
            "#9966FF"               
          ];
          const hoverBackgroundColors = [
            "rgb(223,110,59)",
            "rgb(248,190,26)",
            "rgb(11,164,67)",
            "rgb(53,143,246)",
            "#9966FF"
          ];

          const totalResponses = dataValues.reduce((acc, count) => acc + count, 0);

          if (totalResponses === 0) {
            setChartData({
              labels,
              datasets: [
                {
                  data: dataValues,
                  backgroundColor: backgroundColors,
                  hoverBackgroundColor: hoverBackgroundColors
                }
              ]
            });
          } else {
            setChartData({
              labels,
              datasets: [
                {
                  data: dataValues.map(
                    (count) => ((count / totalResponses) * 100).toFixed(2)
                  ),
                  backgroundColor: backgroundColors,
                  hoverBackgroundColor: hoverBackgroundColors
                }
              ]
            });
          }
        } catch (error) {
          console.error("Error fetching occupation data:", error);
          throw new Error("Error fetching occupation data.");
        }
      } else if (selectedFilter === "Gender") {
        try {
          response = await getSurveyPieChartGender(surveyId);
          const { pieChartData, totalResponses } = response;

          const labels = pieChartData.map((data) => data.genderGroup);
          const dataValues = pieChartData.map((data) => data.totalUsers);

          const backgroundColors = [
            "rgba(223,110,59,0.7)", 
            "rgba(248,190,26,0.7)",
            "rgba(11,164,67,0.7)"   
          ];
          const hoverBackgroundColors = [
            "rgb(223,110,59)",
            "rgb(248,190,26)",
            "rgb(11,164,67)"
          ];

          if (totalResponses === 0) {
            setChartData({
              labels,
              datasets: [
                {
                  data: dataValues,
                  backgroundColor: backgroundColors,
                  hoverBackgroundColor: hoverBackgroundColors
                }
              ]
            });
          } else {
            setChartData({
              labels,
              datasets: [
                {
                  data: dataValues.map((count) => ((count / totalResponses) * 100).toFixed(2)),
                  backgroundColor: backgroundColors,
                  hoverBackgroundColor: hoverBackgroundColors
                }
              ]
            });
          }
        } catch (error) {
          console.error("Error fetching gender data:", error);
        }
      }

    } catch (error) {
      console.error("Error fetching pie chart data:", error);
    } finally {
      setBarLoading(false);
    }
  };

  useEffect(() => {
    fetchPieChartData();
  }, [surveyId, selectedFilter]);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: "right",
        labels: {
          font: {
            size: 12
          }
        }
      }
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[200px] w-full">
      {barLoading || !chartData ? (
        <div className="flex justify-center items-center h-screen">
          <l-tail-chase size="40" speed="1.75" color="black"></l-tail-chase>
        </div>
      ) : (
        <div className="w-full flex justify-center items-center">
          <div
            className="flex justify-center items-center"
            style={{
              width: selectedFilter === "Occupation" ? "800px" : "100%",
              height: selectedFilter === "Occupation" ? "800px" : "600px",
            }}
          >
            <Pie data={chartData} options={options} />
          </div>
        </div>
      )}
    </div>
  );
};

export default PieChart;
