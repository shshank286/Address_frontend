import React, { useEffect, useState } from "react";
import QuizUi from "./QuizUi";
import Comment from "./Comment";
import fec1 from "../../assets/images/fec1.png";
import fec4 from "../../assets/images/fec4.png";
import { GrFacebookOption } from "react-icons/gr";
import no_image from "../../assets/images/no_img.png";
import {
  FaXTwitter,
  FaWhatsapp,
  FaPinterestP
} from "react-icons/fa6";
import { useParams } from "react-router-dom";
import { getNewsById } from "../../services/newsService";

const DetailsPage = () => {
  const { newsId } = useParams();

  const [news, setnews] = useState(null);
  const [loading, setLoading] = useState(true);


  const shareOnFacebook = () => {
    const baseUrl = `${window.location.origin}/detailspage`;
    const pageUrl = `${baseUrl}/${news?.newsId || newsId}`;
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}`;

    window.open(facebookUrl, "_blank", "noopener,noreferrer");
  };

  const shareOnTwitter = () => {
    // Dynamically get the base URL from the current location
    const baseUrl = `${window.location.origin}/detailspage`;
    const text = `Check this out: ${news?.title || "Exciting News!"}`;
    const pageUrl = `${baseUrl}/${news?.newsId || newsId}`;
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      text
    )}&url=${encodeURIComponent(pageUrl)}`;

    // Open the Twitter share URL in a new window
    window.open(twitterUrl, "_blank", "width=600,height=400");
  };


  const shareOnPinterest = () => {
    const baseUrl = `${window.location.origin}/detailspage`;
    const pageUrl = `${baseUrl}/${news?.newsId || newsId}`;
    const imageUrl = news?.imageUrl || no_image;
    const pinterestUrl = `https://www.pinterest.com/pin/create/button/?url=${encodeURIComponent(pageUrl)}&media=${encodeURIComponent(imageUrl)}&description=${encodeURIComponent(
      news?.title || "Check out this news!"
    )}`;
    window.open(pinterestUrl, "_blank", "width=600,height=400");
  };

  const shareOnWhatsapp = () => {
    const baseUrl = `${window.location.origin}/detailspage`; 
    const pageUrl = `${baseUrl}/${news?.newsId || newsId}`; 
    const text = `Check this out: ${news?.title || "Exciting news!"}`; 
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(
      `${text}\n${pageUrl}` 
    )}`;

    // Opens the WhatsApp share window
    window.open(whatsappUrl, "_blank", "width=600,height=400");
  };

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
            <div className="bg-[#E6E5E1] mt-[-3.9rem]  min-h-screen">
              <div className="border-b border-black mb-1"></div>
              <div className="border-b border-black"></div>
              <div className="">
                {/* Heading Section */}
                <div className="mb-0 sm:mb-0 m-[2rem] sm:ml-[4.9rem] w-[90%] mr-[2rem]  sm:w-[74%] pt-5 text-sm ">
                  <h1 className="text-[1.8rem] sm:text-3xl font-assistant font-bold mb-2 text-lg">
                    {news?.title}
                  </h1>
                  {/* Author & Meta Info */}
                  <div className="flex flex-wrap items-center text-gray-900 text-xs w-full mb-0 sm:mb-3">
                    <p className="mr-2">
                      {news.creator?.length > 0 ? (
                        <>
                          {news.creator}
                          <span className="mx-2">|</span>
                        </>
                      ) : (
                        ""
                      )}
                    </p>

                    <p className="mr-2 text-gray-900">{formatDate(news.created_at)}</p>
                    <span className="mx-2">|</span>
                    <p className="mr-2 text-gray-900">
                      Updated: {formatDate(news.updated_at)}
                    </p>
                    <span className="mx-2 ">|</span>
                    <p className="mr-2 text-gray-900">{news.commentCount} Comments</p>
                  </div>
                </div>


                {/* Three Columns Section */}
                <div className="flex flex-col lg:flex-row md:ml-[-1rem]  gap-0 sm:gap-3 mb-8 p-2 md:p-6 ">
                  {/* Share Icons */}

                  <div className="w-full flex flex-col md:flex-row sm:flex-row justify-center items-center lg:w-[4%] lg:items-center lg:flex-col xl:flex-col">
                    <h2 className="text-sm font-semibold mb-4 hidden lg:block text-center ml-3">
                      Share
                    </h2>

                    <div className="flex gap-3 mt-5 flex-row md:flex-row lg:flex-col items-center p-4 rounded-lg">
                      <div
                        className="bg-[#f1f0f0] h-9 w-9 flex items-center justify-center rounded-full border shadow-lg cursor-pointer"
                        onClick={shareOnFacebook}
                      >
                        <GrFacebookOption className="text-[#1877F2] text-lg" />
                      </div>
                      <div
                        className="bg-[#f1f0f0] h-9 w-9 flex items-center justify-center rounded-full border shadow-lg cursor-pointer"
                        onClick={shareOnTwitter}
                      >
                        <FaXTwitter className="text-[#1DA1F2] text-lg" />
                      </div>
                      <div
                        onClick={shareOnPinterest}
                        className="bg-[#f1f0f0] h-9 w-9 flex items-center justify-center rounded-full border shadow-lg cursor-pointer"
                      >
                        <FaPinterestP className="text-[#E60023] text-lg" />
                      </div>
                      <div
                        className="bg-[#f1f0f0] h-9 w-9 flex items-center justify-center rounded-full border shadow-lg cursor-pointer"
                        onClick={shareOnWhatsapp}
                      >
                        <FaWhatsapp className="text-[#25D366] text-lg" />
                      </div>
                    </div>
                  </div>


                  {/* Main Image */}
                  <div className="lg:w-[80%] w-full">
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

                  {/* Related News */}
                  <div className="w-full flex flex-col gap-9 lg:w-[20%] lg:flex lg:block hidden">
                    <div className="flex flex-col items-start ">
                      <img
                        src={fec1}
                        alt=""
                        className="h-[9rem] object-cover"
                      />
                      <h4 className="text-ellipsis text-[.8rem] text-start text-gray-500 font-poppins font-medium w-[80%]">
                        Recovered 1950s Dating Guide Advises Women…
                      </h4>
                    </div>
                    <div className="flex flex-col items-start ">
                      <img
                        src={fec4}
                        alt=""
                        className="h-[9rem] object-cover"
                      />
                      <h4 className="text-ellipsis text-[.8rem] text-start text-gray-500 font-poppins font-medium w-[80%]">
                        France: Oil Refinery Blockades By Striking…
                      </h4>
                    </div>
                  </div>
                </div>



                {/* Article Content Section */}
                <div className="text-gray-800 mt-[-2rem] space-y-4 font-poppins leading-8 sm:w-full px-4 sm:px-[5rem] text-justify mb-4">
                  <p>{news.content}</p>
                </div>

                <div className="border-b border-black"></div>
                <div className="border-b border-black mt-[2px]"></div>


                {/* Additional Components */}
                {news?.survey && <><QuizUi surveyId={news.survey.surveyId} newsId={newsId} />
                  <div className="border-b border-black">
                  </div><div className="border-b border-black mt-[2px]"></div></>
                }


                <Comment />
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
