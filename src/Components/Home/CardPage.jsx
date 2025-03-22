import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import image from "../../assets/images/image.png";
import { FaCaretRight } from "react-icons/fa";
import surveygif from "../../assets/images/survey.gif";
import { SiLimesurvey } from "react-icons/si";
import { useDispatch, useSelector } from "react-redux";
import no_image from "../../assets/images/no_img.png";

import { openPopup } from "../../Context/authSlice";
import img from "../../assets/images/img.jpg";
import axios from "axios";
import AuthService from "../../services/authService";
import survey from "../../assets/images/survey.gif";
import {
  fetchNews,
  clearNewsByDate,
  fetchNewsByDate
} from "../../Context/newsSlice";

import { tailChase } from "ldrs";
import NoNewsAvailable from "../NoNewsAvailable";
import { getNewsByCategory } from "../../services/newsService";

tailChase.register();

const CardPage = ({ setIsPopupOpen }) => {
  const [newsData, setNewsData] = useState([]);
  const [categoryNews, setCategoryNews] = useState([]);
  const token = localStorage.getItem("token");
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const newsDatas = useSelector((state) => state.news.news) || [];
  const {
    data,
    loading: newsLoading,
    error,
    selectedDate
  } = useSelector((state) => state.news || []);

  // Fetch date-wise news when date is selected


  //TOP NEWS CATEGORY API
  const getTopNews = async () => {
    try {
      setLoading(true);
      const response = await getNewsByCategory('top', 1, 50, selectedDate);
      setCategoryNews(response.news || []);
    } catch (error) {
      console.error("Failed to fetch news data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleNewsClick = (news) => {
    if (token) {
      console.log("NewsID:" + news.newsID);

      navigate("/detailspage/" + news.newsId);
    } else {
      dispatch(openPopup());
    }
  };
  const scrollContainerRef = useRef(null);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -200, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 200, behavior: "smooth" });
    }
  };

  const truncateText = (text, length = 15) => {
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

  }, []);

  const newsToDisplay =
    selectedDate && Array.isArray(data.byDate) && data.byDate.length > 0
      ? data.byDate
      : Array.isArray(data.all) && data.all.length > 0
        ? data.all
        : [];

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

  return (
    <div className="overflow-x-hidden">
      { loading ? (
        <div className="flex justify-center items-center h-screen">
          <l-tail-chase size="40" speed="1.75" color="black"></l-tail-chase>
        </div>
      ) : (
        <>
          {newsToDisplay.length > 0 ? (
            <>
              <div className="relative m-0 p-0 mb-5">
                {/* Left Scroll Button */}
                <button
                  onClick={scrollLeft}
                  className="absolute left-0 top-[40%] ml-1  h-8 w-8 transform -translate-y-1/2 z-10 bg-gray-600  text-white rounded-full p-2 shadow-md rotate-180"
                >
                  <FaCaretRight />
                </button>

                <div
                  className="flex ml-4 mr-4 sm:gap-4 overflow-x-auto scrollbar-hide"
                  ref={scrollContainerRef}
                  style={{ scrollBehavior: "smooth" }}
                >
                  {newsToDisplay?.length > 0 ? (

                    newsToDisplay
                      .filter(news => news.categories && news.categories.includes('top'))
                      .slice(0, 12)
                      .map((news, index) => (
                        <div
                          key={index}
                          className="flex flex-col items-center flex-none w-[12rem] mr-4 cursor-pointer relative"
                          onClick={() => handleNewsClick(news)}
                        >
                          <div className="relative">
                            {/* Conditional Icon */}
                            {news.survey && (
                              <div className="absolute top-1 left-1">
                                <img src={survey} className="text-white bg-black rounded-sm w-8" />
                              </div>
                            )}

                            {/* Image */}
                            <img
                              src={news.imageUrl || no_image} 
                              className="h-36 w-[12rem] object-cover rounded-md"
                              alt="" 
                            />
                          </div>

                          <h4 className="text-xs font-bold font-assistant text-gray-700 mt-2">
                            {truncateText(news.title || "Untitled", 40)}
                          </h4>
                        </div>
                      ))
                  ) : (
                    <p className="text-center text-gray-500">
                      No news data available.
                    </p>
                  )}

                </div>

                {/* Right Scroll Button */}
                <button
                  onClick={scrollRight}
                  className="absolute right-0 top-[40%] mr-1 transform -translate-y-1/2 z-10 bg-gray-500 h-8 w-8 text-white rounded-full p-2 shadow-md"
                >
                  <FaCaretRight />
                </button>
              </div>

              {/* Highlighted News Section */}
              <hr className="my-0 h-[2px] bg-black ml-6 mr-6" />
              <div className="flex flex-wrap md:flex-nowrap gap-4 my-6 mx-8">
                {/* Left Section */}
                {newsToDisplay.filter(news => news.categories && news.categories.includes('top')).length >= 13 ? (
                  <>
                    {newsToDisplay
                      .filter(news => news.categories && news.categories.includes('top'))
                      .slice(12, 13)
                      .map((news, index) => (
                        <div key={index} className="w-full md:w-5/12 relative">
                          <Link to={`/detailspage/${news.newsId}`}>
                            <img
                              src={news.imageUrl || no_image}
                              alt="Highlighted News"
                              className="w-full h-48 md:h-[28rem] object-cover rounded-lg"
                            />
                            <p className="absolute bottom-4 left-4 text-white font-bold font-assistant bg-black bg-opacity-50 p-2 rounded-md">
                              {truncateText(news.title, 70)}
                            </p>
                          </Link>
                        </div>
                      ))}
                  </>
                ) : (
                  <>No data available</>
                )}

                <div className="border-b ml-2 md:border-r-[1px] md:border-r-black/65 md:border-b-0 border-gray-300"></div>
                {/* Right Section */}
                <div className="w-full md:w-7/12">
                  <div className="flex">
                    {/* NEWS */}
                    <div className="w-1/2 p-2">
                      <div className="flex flex-col gap-4 border-gray-300">
                        {newsToDisplay
                          .filter(news => news.categories && news.categories.includes('top')) 
                          .slice(14, 15) 
                          .map((news, index) => (
                            <div key={index} className="relative">
                              <Link to={`/detailspage/${news.newsId}`}>
                                {/* Image */}
                                <div className={index === 1 ? 'border-t border-gray-300' : ''}>
                                  <img
                                    src={news.imageUrl || no_image}
                                    className="h-[13.1rem] md:w-[35rem] object-cover rounded-md"
                                    alt="News"
                                  />
                                </div>
                                <div className="h-0 md:border-b-[1px] md:border-r-black/65 border-black/65 mt-2"></div>

                                {/* Conditional Icon */}
                                {news.survey ? (
                                  <div className="absolute top-1 left-1">
                                    <img src={survey} className="text-white bg-black rounded-sm w-8" />
                                  </div>
                                ) : null}

                                <p className="absolute bottom-4 left-4 text-white font-bold font-assistant bg-black bg-opacity-50 p-2 rounded-md">
                                  {truncateText(news.title, 40)}
                                </p>
                              </Link>
                            </div>
                          ))}
                      </div>
                      <div className="flex flex-col gap-4 border-gray-300">
                        {newsToDisplay
                          .filter(news => news.categories && news.categories.includes('top'))
                          .slice(13, 14)
                          .map((news, index) => (
                            <div key={index} className="relative">
                              <Link to={`/detailspage/${news.newsId}`}>
                                {/* Image */}
                                <div className={index === 1 ? 'border-t border-gray-300' : ''}>
                                  <img
                                    src={news.imageUrl || no_image}
                                    className="h-[13.1rem] md:w-[35rem] object-cover rounded-md mt-2"
                                    alt="News"
                                  />
                                </div>

                                {/* Conditional Icon */}
                                {news.survey ? (
                                  <div className="absolute top-1 left-1 mt-2">
                                    <img src={survey} className="text-white bg-black rounded-sm w-8" />
                                  </div>
                                ) : null}

                                <p className="absolute bottom-4 left-4 text-white font-bold font-assistant bg-black bg-opacity-50 p-2 rounded-md">
                                  {truncateText(news.title, 40)}
                                </p>
                              </Link>
                            </div>
                          ))}
                      </div>


                    </div>
                    <div className="border-b md:border-r-[1px] md:border-r-black/65 md:border-b-0 border-gray-300"></div>

                    {/* ADV */}

                    <div className="w-1/2 p-2">
                      <div className="flex flex-col gap-4 border-gray-300">
                        {newsToDisplay.slice(3, 4).map((news, index) => (
                          <div className="relative border-b md:border-b-0 border-gray-300">
                            <div className="w-full flex items-center justify-center font-bold font-assistant text-3xl md:text-5xl text-white h-[13rem] object-cover rounded-lg bg-black">
                              ADV
                            </div>
                            <div className="h-0 md:border-b-[1px] md:border-r-black/65 border-gray-900 mt-2"></div>
                          </div>
                        ))}
                      </div>
                      <div className="flex flex-col gap-4 border-gray-300">
                        {newsToDisplay.slice(3, 4).map((news, index) => (
                          <div className="relative border-b md:border-b-0 border-gray-300">
                            <div className="w-full flex items-center justify-center mt-2 font-bold font-assistant text-3xl md:text-5xl text-white h-[13rem] object-cover rounded-lg bg-black">
                              ADV
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="">NO NEWS FOUND</div>
          )}
        </>
      )}
    </div>
  );
};

export default CardPage;
