import React, { useEffect, useState } from "react";
import celeimage from "../../assets/images/celeimage.png";
import { useDispatch, useSelector } from "react-redux";
import { openPopup } from "../../Context/authSlice";
import { Link, useNavigate } from "react-router-dom";
import no_image from "../../assets/images/no_img.png";
import { tailChase } from "ldrs";

import survey from "../../assets/images/survey.gif";
import {
  clearNewsByDate,
  fetchNewsByDate
} from "../../Context/newsSlice";
tailChase.register();
const SecondCat = () => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token); 
  const {
    data,
    loading: newsLoading,
    selectedDate
  } = useSelector((state) => state.news || []);
  const navigate = useNavigate();
  const h = localStorage.getItem("token");

  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null); 

  const truncateText = (text, length = 15) => {
    return text && text.length > length
      ? text.substring(0, length) + "..."
      : text;
  };

  const handleNewsClick = (news) => {
    if (h) {
      navigate("/detailspage/" + news.newsId);
    } else {
      dispatch(openPopup()); 
    }
  };

  useEffect(() => {
    // Check if user has visited before
    const hasVisited = localStorage.getItem("hasVisited");
    if (!hasVisited) {
      dispatch(openPopup());
      localStorage.setItem("hasVisited", "true");
    }
  }, [dispatch]);

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

  if ( loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <l-tail-chase size="40" speed="1.75" color="black"></l-tail-chase>
      </div>
    ); 
  }

  if (error) {
    return <div>{error}</div>; 
  }

  return (
    <>
      {newsToDisplay.length > 0 ? (
        <div className="">

          <div className="md:max-w-[62rem]  w-full mt-4 md:mx-6 md:my-6">
            
            {newsToDisplay[26] && (
              <div className="relative w-full sm:w-[95%] lg:w-[60.5rem] ml-2.5 hidden sm:block">
                <Link to={`/detailspage/${newsToDisplay[26].newsId}`}>
                  <div className="relative">
                    {newsToDisplay[26].survey && (
                      <div className="absolute top-1 left-1">
                        <img src={survey} className="text-white bg-black rounded-sm w-8" />
                      </div>
                    )}
                    <img
                      src={newsToDisplay[26].imageUrl || no_image}
                      className="w-full h-[12rem] sm:h-[20rem] md:h-[25rem] object-cover"
                      alt="NO IMAGE"
                    />
                  </div>
                  <div className="mt-2 absolute bottom-4 left-4 text-white bg-black bg-opacity-50 p-2 rounded-md">
                    <p className="font-assistant font-bold text-lg sm:text-3xl">
                      {newsToDisplay[26].title}
                    </p>
                  </div>
                </Link>
              </div>
            )}

            <div className="py-10 w-full  md:mr-0  md:max-3xl ">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-2 ">
                {newsToDisplay.slice(27, 33).map((news, index) => (
                  <div
                    key={index}
                    className={`flex flex-col px-4 w-full gap-4 
                      ${(index + 1) % 3 !== 0 ? "lg:border-r" : ""} 
                      border-black`}

                  >
                    <hr className="py-2 border-t-[1px] border-black" />
                    <div className="relative">
                      {news.survey && (
                        <div className="absolute top-1 left-1">
                          <img src={survey} className="text-white bg-black rounded-sm w-8" />
                        </div>
                      )}
                      <img
                        onClick={() => handleNewsClick(news)}
                        src={news.imageUrl || no_image}
                        alt={news.title}
                        className="w-full h-52 sm:h-44 md:h-52 lg:h-64 object-cover rounded-md hover:scale-105 transition-transform duration-300 cursor-pointer"
                      />

                    </div>
                    <p className="text-sm mt-3 font-assistant font-bold">{news.title}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-5 ml-3 relative w-full sm:w-[95%] lg:w-[60.5rem] hidden sm:block">
              {newsToDisplay[33] && (
                <Link to={`/detailspage/${newsToDisplay[33].newsId}`}>
                  {newsToDisplay[33].survey && (
                    <div className="absolute top-1 left-1">
                      <img src={survey} className="text-white bg-black rounded-sm w-8" />
                    </div>
                  )}
                  <img
                    src={newsToDisplay[33].imageUrl || celeimage}
                    className="w-full h-[15rem] sm:h-[20rem] md:h-[25rem] object-fill"
                    alt="Travel"
                  />
                  <p className="absolute bottom-4 left-4 text-white bg-black bg-opacity-50 p-2 rounded-md">
                    {truncateText(newsToDisplay[33].title, 200)}
                  </p>
                </Link>
              )}
            </div>
          </div>

        </div>
      ) : (
        <div className="">NO NEWS FOUND</div>
      )}
    </>
  );
};

export default SecondCat;