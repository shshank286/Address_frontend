import React, { useEffect, useState } from "react";
import no_image from "../../assets/images/no_img.png";
import quizimg from "../../assets/images/quizimg.png";
import { openQuizPopup } from "../../Context/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { openPopup } from "../../Context/authSlice";
import { Link, useNavigate } from "react-router-dom";
import QuizRankTable from "../QuizRankTable";
import { tailChase } from "ldrs";
import survey from "../../assets/images/survey.gif";
import {
  clearNewsByDate,
  fetchNewsByDate
} from "../../Context/newsSlice";

tailChase.register();

const FirstCat = () => {
  const [loading, setLoading] = useState(true);

  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token); // Get token from Redux
  const {
    data,
    loading: newsLoading,
    error,
    selectedDate
  } = useSelector((state) => state.news || []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric"
    }).format(date);
  };

  useEffect(() => {
    try {
      if (selectedDate) {
        dispatch(fetchNewsByDate(selectedDate));
      } else {
        dispatch(clearNewsByDate());
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [dispatch, selectedDate]);

  const quiz = () => {
    if (token) {
      dispatch(openQuizPopup());
    } else {
      dispatch(openPopup());
    }
  };

  useEffect(() => {
    const hasVisited = localStorage.getItem("hasVisited");
    if (!hasVisited) {
      dispatch(openPopup());
      localStorage.setItem("hasVisited", "true");
    }

    // fetchNewsData();
  }, []);

  const truncateText = (text, length = 15) => {
    return text && text.length > length
      ? text.substring(0, length) + "..."
      : text;
  };

  const newsToDisplay =
    selectedDate && Array.isArray(data.byDate) && data.byDate.length > 0
      ? data.byDate
      : Array.isArray(data.all) && data.all.length > 0
        ? data.all
        : [];

  return (
    <div>
      {loading ? (
        <div className="flex justify-center items-center h-screen">
          <l-tail-chase size="40" speed="1.75" color="black"></l-tail-chase>
        </div>
      ) : (
        <>
          {newsToDisplay.length > 0 ? (
            <>
              <div className="my-2">
                <hr className="my-0 h-[1.5px] bg-black mx-6" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 md:gap-3 xl:grid-cols-3 gap-4 mt-4">
                <div className="col-span-2">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-2 ">
                    {newsToDisplay.slice(15, 21).map((news, index) => (
                      <div
                        key={index}
                        className={`flex flex-col px-2 sm:px-4 md:px-8 lg:px-8
                          ${(index + 1) % 3 !== 0 ? "xl:border-r-[1px]" : ""} 
                          border-black gap-2 sm:gap-2 md:gap-2 lg:gap-2 xl:gap-0`}

                      >
                        {/* Divider Line */}
                        <hr className="border-t-[1px] border-black" />

                        {/* News Item */}
                        <div className="mt-2">
                          <Link to={`/detailspage/${news.newsId}`}>
                            <div className="relative">
                              {news.survey && (
                                <div className="absolute top-1 left-1">
                                  <img
                                    src={survey}
                                    className="text-white bg-black rounded-sm w-6 sm:w-8"
                                    alt="Survey Icon"
                                  />
                                </div>
                              )}
                              <img
                                src={news.imageUrl || no_image}
                                className="w-full h-48 sm:h-40 md:h-48 lg:h-56 object-cover rounded-md"
                                alt={news.title || "News"}
                              />
                            </div>
                          </Link>
                        </div>

                        {/* Title */}
                        <p className="mt-2 text-xs sm:text-sm font-bold font-assistant">
                          {truncateText(news.title, 35) || "Default Title"}
                        </p>

                        {/* Metadata */}
                        <div className="flex items-center text-[10px] sm:text-xs mt-1">
                          <p className="font-medium font-jost">
                            <b>{truncateText(news.creator, 5) || "SHAN DOE"}</b> |{" "}
                            {formatDate(news.pubDate) || "DEC 12, 2024"}
                          </p>
                        </div>
                      </div>

                    ))}
                  </div>
                </div>
                <div className="col-span-1 mx-auto sm:mx-8">
                  <div className="mt-4">
                    <img
                      onClick={quiz}
                      src={quizimg}
                      className="w-full h-[20rem] sm:h-[25rem] lg:h-[30rem] object-cover rounded-md cursor-pointer"
                      alt="quiz"
                    />
                  </div>
                  <QuizRankTable />
                </div>

                {/* Related News SEction */}
              </div>
              <div className="mt-6 mx-4 sm:mx-6 md:mx-8  lg:mx-10 xl:mx-8 h-auto w-full sm:w-[90%] md:w-[100%]  lg:min-w-10 xl:w-[64%] mb-4 bg-red-200/50 p-4 rounded-md">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <hr className="m-0 bg-gray-600 h-[2px]" />
                  </div>
                  <div className="text-center mx-4">
                    <h3 className="font-bold font-assistant text-lg">Related News</h3>
                  </div>
                  <div className="flex-1">
                    <hr className="m-0 bg-gray-600 h-[2px]" />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                  {newsToDisplay.slice(21, 25).map((news, index) => (
                    <Link to={`/detailspage/${news.newsId}`} key={index}>
                      <div className="flex items-center flex-col md:flex-row sm:flex-row md:items-center w-full mt-2 relative">
                        {news.survey && (
                          <div className="absolute top-1 w-40 left-1">
                            <img
                              src={survey}
                              className="text-white bg-black rounded-sm w-8"
                              alt="Survey Icon"
                            />
                          </div>
                        )}
                        <img
                          src={news.imageUrl || no_image}
                          className="w-full sm:w-1/3 h-36 sm:h-32 object-cover rounded-md"
                          alt="opinion"
                        />
                        <div className="ml-4">
                          <p className="font-bold font-assistant text-sm sm:text-base">
                            {truncateText(news.title, 35)}
                          </p>
                          <div className="mt-2">
                            <p className="text-xs sm:text-sm font-jost font-medium">
                              {news.creator || "NO CREATOR"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>


            </>
          ) : (
            <div>No news found</div>
          )}
        </>
      )}
    </div>
  );
};

export default FirstCat;
