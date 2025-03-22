import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { openPopup, token } from "../../Context/authSlice";
import { tailChase } from "ldrs";
import circlebg from "../../assets/images/circlebg.png";
import no_image from "../../assets/images/no_img.png";
import { Link } from "react-router-dom";

import survey from "../../assets/images/survey.gif";
import {
  clearNewsByDate,
  fetchNewsByDate
} from "../../Context/newsSlice";

tailChase.register();

const LatestArticles = () => {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  const token = localStorage.getItem("token");
  const {
    data,
    loading: newsLoading,
    selectedDate
  } = useSelector((state) => state.news || []);

  const truncateText = (text, length = 50) => {
    return text && text.length > length
      ? text.substring(0, length) + "..."
      : text;
  };

  useEffect(() => {
    const hasVisited = localStorage.getItem("hasVisited");
    if (!hasVisited) {
      dispatch(openPopup());
      localStorage.setItem("hasVisited", "true");
    }
  }, [dispatch, token]);

  useEffect(() => {
    try {
      if (selectedDate) {
        dispatch(fetchNewsByDate(selectedDate));
      } else {
        dispatch(clearNewsByDate());
      }
    } catch (error) {
      log.error(error);
    } finally {
      setLoading(false);
    }
  }, [dispatch, selectedDate]);

  const newsToDisplay =
    selectedDate && Array.isArray(data.byDate) && data.byDate.length > 0
      ? data.byDate
      : Array.isArray(data.all) && data.all.length > 0
        ? data.all
        : [];

  return (
    <>
      {newsToDisplay.length >= 36 ? (
        <div className=" mx-6 my-6 w-[60.5rem] ">
          <div className="flex items-center mt-5 ">

          </div>
          <div className="md:w-[60rem] md:ml-3  mt-10">
            {newsLoading || loading ? (
              <div className="flex justify-center items-center h-96">
                <l-tail-chase
                  size="40"
                  speed="1.75"
                  color="black"
                ></l-tail-chase>
              </div>
            ) : (
              <div className="gap-4 w-full">
                {/* Main Featured Article */}

                <div className="grid grid-cols-1 lg:grid-cols-10 gap-8 mt-4">
                  {/* Main Articles Section */}
                  <div className="lg:col-span-7 w-full  gap-2">
                    {newsToDisplay.slice(34, 36).map((article, index) => (
                      <Link
                        to={`/detailspage/${article.newsId}`}
                        key={index}
                        className="flex flex-col md:flex-row items-start bg-inherit"
                      >
                        {/* Image Section */}
                        <div className="w-3/4 relative">

                          {article.survey && (
                            <div className="absolute top-1 left-1">
                              <img src={survey} className="text-white bg-black rounded-sm  w-8" />
                            </div>
                          )}
                          {/* Image Section */}
                          <img
                            src={article.imageUrl || no_image}
                            alt={article.title}
                            className="h-[10rem] w-[20rem] rounded-md hover:scale-105 transition-transform duration-300 cursor-pointer object-cover" // Fixed image alignment
                          />
                        </div>
                        {/* Content Section */}
                        <div className="mt-2 md:mt-0 md:ml-2 flex flex-col justify-between w-full border-l border-gray-900 p-2">
                          <div className="text-xs uppercase text-gray-500 font-poppins">
                            {article.categories || "Uncategorized"}
                          </div>
                          <p className="text-md font-assistant font-bold mt-1">
                            {truncateText(article.title, 60)}
                          </p>
                          <div className="flex items-center mt-2">
                            <p className="text-sm">
                              {article.pubDate?.split(" ")[0] || "Mar 10, 2022"}
                            </p>
                          </div>
                          <p className="mt-3 text-sm text-gray-700 font-opensans">
                            {truncateText(article.description, 80)}
                          </p>
                          <div className="mt-2 border-t-2 border-gray-900 pt-2"></div>
                        </div>
                      </Link>
                    ))}
                    <div className="">
                      {newsToDisplay[36] && (
                        <div className="relative mt-5">
                          <Link to={`/detailspage/${newsToDisplay[36].newsId}`}>
                            <div className="relative">

                              {newsToDisplay[36].survey && (
                                <div className="absolute top-1 left-1">
                                  <img src={survey} className="text-white bg-black rounded-sm  w-8" />
                                </div>
                              )}

                              <img
                                src={newsToDisplay[36].imageUrl || no_image}
                                className=" md:w-[62rem] md:h-[22rem]  object-cover"
                                alt="Travel"
                              />
                              <div className="mt-2"></div>
                            </div>
                            <div className="mt-2 p-2">
                              <p className="absolute bottom-8 left-4 text-white bg-black bg-opacity-50 font-bold font-assistant text-sm sm:text-lg">
                                {truncateText(newsToDisplay[36].title, 90)}
                              </p>
                            </div>
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Top Rated Articles Section */}
                  <div className="lg:col-span-3 w-full">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3 bg-inherit w-full mt-[-2.5rem]">
                      <hr className="col-span-full bg-black h-[2.5px]" />
                      <div className="col-span-full text-sm font-semibold text-gray-600 border-b-2 border-black pb-2">
                        TOP RATED
                      </div>
                      {newsToDisplay.slice(37, 40).map((article, index) => (
                        <Link
                          to={`/detailspage/${article.newsId}`}
                          key={index}
                          className="bg-inherit p-4 rounded-md flex flex-col"
                        >
                          <div className="relative">
                            {/* Image Section */}
                            {article.survey && (
                              <div className="absolute top-1 left-1">
                                <img
                                  src={survey}
                                  className="text-white bg-black rounded-sm w-8"
                                  alt="Survey"
                                />
                              </div>
                            )}
                            <img
                              src={article.imageUrl || no_image}
                              alt="Top Rated"
                              className="w-full h-48 md:h-40  object-cover rounded-md"
                            />
                          </div>
                          <div className="flex items-center mt-2 space-x-2">
                            <img
                              src={circlebg}
                              alt="Rating Icon"
                              className="w-3"
                            />
                            <p className="text-sm font-assistant font-bold">
                              {truncateText(article.title, 60)}
                            </p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>

                </div>

                {/* Additional Articles */}
                <div className="">

                  {newsToDisplay.slice(40, 44).map((article, index) => (
                    <div className="w-full mt-1" key={index}>
                      <Link to={`/detailspage/${article.newsId}`}>
                        <div className="flex flex-col gap-2 md:flex-row items-start mb-5">
                          {/* Image Section */}
                          <div className="w-[21.5rem] md:w-[15rem] relative flex-shrink-0">
                            {article.survey && (
                              <div className="absolute top-1 left-1">
                                <img
                                  src={survey}
                                  className="text-white bg-black rounded-sm w-6 sm:w-8"
                                  alt="Survey Icon"
                                />
                              </div>
                            )}
                            <img
                              src={article.imageUrl || no_image}
                              alt={article.title}
                              className="w-full md:w-[15rem] h-[10rem] rounded-md hover:scale-105 transition-transform duration-300 cursor-pointer object-cover"
                            />
                          </div>

                          {/* Content Section */}
                          <div className="mt-4 md:mt-0 md:ml-4 flex flex-col justify-between w-full">
                            {/* Categories Section */}
                            <div className="text-xs text-gray-500 uppercase">
                              {article.categories || "Category"}
                            </div>

                            {/* Title Section */}
                            <p className="text-base sm:text-lg md:text-xl font-assistant font-bold mt-2">
                              {truncateText(article.title, 70)}
                            </p>

                            {/* Publication Date */}
                            <div className="flex items-center mt-3">
                              <p className="text-sm sm:text-base text-gray-600">
                                {article.pubDate?.split(" ")[0] || "Mar 10, 2022"}
                              </p>
                            </div>

                            {/* Description Section */}
                            <p
                              className="mt-3  text-sm sm:text-base md:text-sm lg:text-base xl:text-xs font-opensans font-semibold text-gray-700 leading-relaxed"
                            >
                              {truncateText(article.description, 110) || "Description"}
                            </p>
                          </div>

                        </div>

                        <hr className="mt-4 md:w-full xl:w-[97.8%] lg:w-full w-[40%] border-gray-900" />
                      </Link>
                    </div>
                  ))}
                </div>


              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="">NO NEWS FOUND</div>
      )}
    </>
  );
};

export default LatestArticles;
