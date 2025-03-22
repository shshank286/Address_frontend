import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { getSurveyById, postSurveyById } from "../../services/surveyService";
import BarChart from "./BarChart";
import PieChart from "./PieChart";
import { getProfile } from "../../services/authService";
import { toast } from "react-toastify";

const QuizUi = ({ surveyId, newsId }) => {
  const navigate = useNavigate();
  const [survey, setSurvey] = useState(null);
  const [loading, setLoading] = useState(true);
  const [barLoading, setBarLoading] = useState(true);

  const [isFilterDropdownOpen, setFilterDropdownOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("Age");
  const [chartType, setChartType] = useState("bar");

  const filters = ["Age", "Gender", "Occupation"];
  const filterDropdownRef = useRef(null); // Ref for the filter dropdown

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  useEffect(() => {
    fetchSurveyResult();
    return () => { };
  }, [surveyId]);

  const fetchSurveyResult = async () => {
    try {
      setLoading(true);
      const data = await getSurveyById(surveyId);
      setSurvey(data);
    } catch (error) {
      console.error("Error fetching survey:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePostSurvey = async (surveyId, selectedOption) => {
    try {
      setLoading(true);
      const response = await getProfile();

      const { Occupation, dateOfBirth } = response.profile;
      if (Occupation == null || Occupation == "") {
        toast.error("Occupation is mandatory. Please update your profile.");

        navigate("/profile", {
          state: {
            from: "news",
            newsId: newsId
          },
        });
        scrollToTop();

        return;
      }
      if (dateOfBirth == null || dateOfBirth == "") {
        toast.error("Date Of Birth is mandatory. Please update your profile.");

        navigate("/profile", {
          state: {
            from: "news",
            newsId: newsId
          },
        });
        scrollToTop();

        return;
      }
      await postSurveyById(surveyId, selectedOption);
      fetchSurveyResult();
    } catch (error) {
      console.error("Error posting survey:", error);
    } finally {
      setLoading(false);
    }
  };

  // Close the dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterDropdownRef.current && !filterDropdownRef.current.contains(event.target)) {
        setFilterDropdownOpen(false); // Close dropdown
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      {loading ? (
        <div className="flex justify-center items-center h-screen">
          <l-tail-chase size="40" speed="1.75" color="black"></l-tail-chase>
        </div>
      ) : (
        <div className="flex flex-col items-center min-h-screen bg-gray-200 ml-4 sm:ml-0 ">
          <div className="w-full px-4 sm:px-8 lg:px-16 py-1  bg-[#e6e6e5]">
            <div className="w-full">
              <h2 className="text-2xl font-medium mt-3 ml-3 md:ml-6">Poll Question</h2>
              {/* Quiz Section */}
              <div className="rounded-lg mb-8 p-4 sm:p-6 mt-2 ">
                <h1 className="text-xl sm:text-2xl w-full md:w-2/3 mb-6 font-assistant font-bold text-left">
                  {survey.survey.surveyTitle}
                </h1>

                {/* Options */}
                <div className="space-y-4 text-left w-full sm:w-1/2">
                  {survey.survey.surveyOptions.map((option, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <span className="h-5 mb-5 text-lg">{index + 1}.</span>
                      {survey.isSurveyGiven ? (
                        <></>
                      ) : (
                        <>
                          <input
                            type="radio"
                            name="surveyOption"
                            className="w-5 h-5 mb-3 accent-pink-500"
                            onChange={() => handlePostSurvey(surveyId, index)}
                          />
                        </>
                      )}

                      <div className="flex-1">
                        <div className="flex justify-between">
                          <span className="text-sm sm:text-base">{option}</span>
                          <span className="text-xs sm:text-sm text-gray-500">
                            {survey.isSurveyGiven && (
                              <>{survey.results[index].percentage}%</>
                            )}
                          </span>
                        </div>
                        <div className="w-full h-2 bg-gray-200 rounded-full mt-2">
                          {survey.isSurveyGiven && (
                            <>
                              <div
                                className="h-2 bg-[#D6043C] rounded-full"
                                style={{
                                  width: `${survey.results[index].percentage}%`,
                                }}
                              ></div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-b border-black w-[110%] ml-[-4rem]"></div>
              <div className="border-b border-black mt-[2px] w-[110%] ml-[-4rem]"></div>

              {/* Statistics Section */}
              <div className="p-4 sm:p-6  bg-[#e6e6e5]">

                <h3 className="text-sm sm:text-lg font-semibold mb-6 text-left">
                  Survey Statistics
                </h3>

                {/* Chart Filters */}
                <div className="flex flex-col sm:flex-row gap-4 mb-6 text-left relative">
                  {/* Filter Dropdown */}
                  <div className="relative" ref={filterDropdownRef}>
                    <button
                      className="px-4 py-2 bg-gray-300 text-black rounded-md w-full sm:w-auto flex justify-between items-center"
                      onClick={() =>
                        setFilterDropdownOpen(!isFilterDropdownOpen)
                      }
                      style={{ textTransform: 'uppercase' }}
                    >
                      {selectedFilter}
                      <span className="ml-2">&#9660;</span>
                    </button>
                    {isFilterDropdownOpen && (
                      <div className="absolute bg-white border rounded-md shadow-lg mt-2 z-10 w-full sm:w-auto">
                        <ul className="py-2">
                          {filters.map((filter, index) => (
                            <li
                              key={index}
                              className={`px-4 py-2 hover:bg-gray-100 cursor-pointer ${selectedFilter === filter ? "bg-gray-200" : ""
                                }`}
                              onClick={() => {
                                setBarLoading(true);
                                setSelectedFilter(filter);
                                setFilterDropdownOpen(false);
                              }}
                              style={{ textTransform: 'uppercase' }}
                            >
                              {filter}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* Chart Type Buttons */}

                  <div className=" w-full flex justify-end gap-5">
                    <button
                      className={`px-4 py-2 ${chartType === "bar"
                        ? "bg-[#D6043C] text-white"
                        : "bg-gray-300 text-black"
                        } rounded-md w-full sm:w-auto`}
                      onClick={() => setChartType("bar")}
                    >
                      BAR CHART
                    </button>
                    <button
                      className={`px-4 py-2 ${chartType === "pie"
                        ? "bg-[#D6043C] text-white"
                        : "bg-gray-300 text-black"
                        } rounded-md w-full sm:w-auto`}
                      onClick={() => setChartType("pie")}
                    >
                      PIE CHART
                    </button>
                  </div>
                </div>

                {/* Chart Placeholder */}
                {chartType === "bar" && (

                  <div className="w-full overflow-x-auto mb-4">
                    <div className="md:w-[100%] w-full bg-[#se6e6e5] rounded-lg flex items-center">
                      <BarChart
                        surveyId={surveyId}
                        selectedFilter={selectedFilter}
                        barLoading={barLoading}
                        setBarLoading={setBarLoading}
                      />
                    </div>
                  </div>
                )}
                {chartType === "pie" && (
                  <div className="w-full overflow-x-auto mb-4">
                    <div className="md:w-[70%] bg-gray-100 rounded-lg flex items-center">
                      <PieChart
                        surveyId={surveyId}
                        selectedFilter={selectedFilter}
                        barLoading={barLoading}
                        setBarLoading={setBarLoading}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default QuizUi;
