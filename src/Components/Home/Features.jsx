import React, { useEffect, useState } from "react";
import { tailChase } from "ldrs";
import AuthService from "../../services/authService";
import no_image from "../../assets/images/no_img.png";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

import survey from "../../assets/images/survey.gif";
import {
  clearNewsByDate,
  fetchNewsByDate
} from "../../Context/newsSlice";

tailChase.register();

const Features = () => {
  const [features, setFeatures] = useState([]);
  const [loading, setLoading] = useState(true);
  const {
    data,
    selectedDate
  } = useSelector((state) => state.news || []);
  const token = useSelector((state) => state.auth.token);
  // Fetching features data

  const dispatch = useDispatch();
  const fetchFeatures = async () => {
    try {
      const response = await AuthService.newsData(59, 1, token); // Assuming you have an API endpoint for features
      setFeatures(response.news || []);
    } catch (error) {
      console.error("Failed to fetch features:", error);
    } finally {
      setLoading(false);
    }
  };

  const truncateText = (text, length = 50) => {
    return text && text.length > length
      ? text.substring(0, length) + "..."
      : text;
  };

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
          <div className="mb-[-0.3rem]">
            <div className="w-full lg:w-8/12 mt-2 sm:w-full md:w-full">
              {/* Loading Spinner */}
              {loading ? (
                <div className="flex justify-center items-center h-96">
                  <l-tail-chase size="40" speed="1.75" color="black"></l-tail-chase>
                </div>
              ) : (
                <div className="w-full  py-10 px-2 lg:px-8">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {newsToDisplay.slice(44, 50).map((news, index) => (
                      <div
                        key={index}
                        className={`relative flex flex-col w-full px-3 ${
                          (index + 1) % 3 !== 0 ? "lg:border-r-[1.5px]" : ""
                        } border-black/65`}
                      >
                        <hr className="py-2 border-t border-black/65" />
                        <Link to={`detailspage/${news.newsId}`}>
                          {news.survey && (
                            <div className="absolute top-3 left-4">
                              <img
                                src={survey}
                                alt="Survey Icon"
                                className="text-white bg-black rounded-sm w-8"
                              />
                            </div>
                          )}
        
                          <img
                            src={news.imageUrl || no_image}
                            alt={news.title}
                            className="w-full h-40 sm:max-w-full lg:h-48 lg:min-w-60 object-cover rounded-md hover:scale-105 transition-transform duration-300 cursor-pointer"
                          />
                        </Link>
                        <p className="text-sm mt-3 font-assistant font-bold">
                          {truncateText(news.title, 80)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        );
};

export default Features;
