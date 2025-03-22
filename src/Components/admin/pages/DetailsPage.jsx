import React, { useEffect, useState } from "react";
import { GrFacebookOption } from "react-icons/gr";
import no_image from "../../../assets/images/no_img.png";

import { useParams } from "react-router-dom";
import { getNewsById } from "../../../services/newsService";

const DetailsPage = () => {
  const { newsId } = useParams();

  const [news, setnews] = useState(null);
  const [loading, setLoading] = useState(true);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric"
    }).format(date);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getNewsById(newsId);

        setnews(data);
      } catch (error) {
        // toast.error(error?.response?.data);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    return () => { };
  }, [newsId]);

  return (
    <>
      {loading ? (
        <div className="flex justify-center items-center h-screen">
          <l-tail-chase size="40" speed="1.75" color="black"></l-tail-chase>
        </div>
      ) : (
        <>
          {news ? (
            <div className="bg-gray-00 mt-[-3rem] p-5  min-h-screen">
              <div className="border-b border-black mb-1"></div>
              <div className="border-b border-black"></div>
              <div className="">
                {/* Heading Section */}
                <div className="mb-0 sm:mb-0 mt-5 pl-5  sm:w-[100%] pt-5 text-sm ">
                  <h1 className="sm:text-3xl font-bold mb-2 text-lg font-assistant">
                    {news?.title}
                  </h1>
                 
                  <div className="flex flex-wrap items-center text-gray-900 text-xs w-full mb-0 sm:mb-3">
                    <p className="mr-2">
                      {news.creator?.length > 0 ? (
                        <>
                          {...news.creator}
                          <span className="mx-2">|</span>
                        </>
                      ) : (
                        ""
                      )}
                    </p>

                    <p className="mr-2 font-assistant text-gray-900">{formatDate(news.created_at)}</p>
                    <span className="mx-2">|</span>
                    <p className="mr-2 font-assistant text-gray-900">
                      Updated: {formatDate(news.updated_at)}
                    </p>
                    <span className="mx-2 ">|</span>
                    <p className="mr-2 font-assistant text-gray-900">{news.commentCount} Comments</p>
                  </div>
                </div>

                {/* Three Columns Section */}
                <div className="flex flex-col lg:flex-row ml-[-1rem]  gap-0 sm:gap-3 mb-8 p-6 ">
                  {/* Share Icons */}

                 

                  {/* Main Image */}
                  <div className="lg:w-[100%] w-full">
                    <img
                      src={news.imageUrl || no_image}
                      alt="Article hero"
                      className="w-full h-[25rem] object-cover mb-4"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = no_image;
                      }}
                    />
                  </div>

                
                </div>

                {/* Article Content Section */}
                <div className="text-gray-800  mt-[-1.5rem] font-opensans leading-8 sm:w-[100%] w-full px-[1rem] text-justify mb-4">
                  <p>{news.content}</p>
                </div>

              
              </div>
            </div>
          ) : (
            <div>
              <h6>News not found</h6>
            </div>
          )}
        </>
      )}
    </>
  );
};

export default DetailsPage;
