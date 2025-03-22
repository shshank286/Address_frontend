import React, { useState, useEffect } from "react";
import WhiteLogo from "../assets/images/whitelogo.png";
import SocialMediaBtn from "./SocialMediaBtn";
import AuthService from "../services/authService";
import no_image from "../assets/images/no_img.png";
import { Link } from "react-router-dom";
import {
  clearNewsByDate,
  fetchNewsByDate
} from "../Context/newsSlice";
import { useDispatch, useSelector } from "react-redux";

const Footer = () => {
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState([]);

  const dispatch = useDispatch();

  // Simulate an API call or data fetching process
  const token = localStorage.getItem("token");
  const getNews = async () => {
    try {
      const response = await AuthService.newsData(50, 1, token);
      setPosts(response.news || []);

      setLoading(false); 
    } catch (error) {
      console.error("Failed to", error);
    }
  };
  const {
    data,
    loading: newsLoading,
    selectedDate
  } = useSelector((state) => state.news || []);

  useEffect(() => {
    try {
      if (selectedDate) {

        dispatch(fetchNewsByDate(selectedDate));
       
      } else {
        dispatch(clearNewsByDate());
      }
    } catch (error) {
      console.error("Failed to fetch news", error);
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

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric"
    }).format(date);
  };

  return (
    <footer className="bg-[#7A7A7A] text-gray-300">
      <div className="">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-12 mb-4 py-4">
          {/* About Us Section */}
          <div className="flex flex-col">
            <h2 className="text-white text-lg font-jost font-bold mb-3">ABOUT US</h2>
            <hr className="mb-10 w-[48%] h-[5px] border-0 border-b-[1px]" />
            <div className="flex items-center mb-4">
              <img src={WhiteLogo} className="h-6" alt="Logo" />
            </div>
            <p className="text-xs text-white mb-4 w-64">
              Your source for lifestyle news. This demo is crafted specifically
              to exhibit the use of the theme as a lifestyle site. Visit our
              main page for more demos.
            </p>
            <p className="text-gray-100 text-sm mb-4">
              We're accepting new partnerships right now.
            </p>
            <p className="text-sm text-white mb-2">
              <strong>Email Us :</strong>{" "}
              <a
                href="mailto:samachaar.ai01@gmail.com"
                className="text-white font-poppins"
              >
                samachaar.ai01@gmail.com
              </a>
            </p>
            <p className="text-sm text-white mb-4 hidden">
              <strong>Contact :</strong>{" "}
              <a href="tel:+1234567890" className="text-white font-poppins">
                +1-234-567-890
              </a>
            </p>
            <div className="flex space-x-4">
              <SocialMediaBtn />
            </div>
          </div>

          {/* Most Popular Section */}
          <div className="flex flex-col">
            <h2 className="text-white text-lg font-jost font-bold mb-4">
              MOST POPULAR
            </h2>
            <div className="space-y-6">
              {loading ? (
                <div className="text-center text-white text-xs">Loading...</div>
              ) : (
                newsToDisplay?.slice(0, 3).map((post) => (
                  <div key={post.id}>
                    <hr className="mb-5 w-[65%] border-0 border-b-[1px]" />
                    <Link
                      to={`/detailspage/${post.newsId}`}
                      onClick={scrollToTop}
                    >
                      <div className="flex items-center">
                        <img
                          src={post.imageUrl || no_image}
                          alt={`Post ${post.id}`}
                          className="w-20 h-[68px] object-cover mr-4"
                        />
                        <div>
                          <h3 className="text-xs w-[60%] mb-3 text-gray-200 font-assistant font-bold">
                            {post.title}
                          </h3>
                          <p className="text-xs text-gray-100">
                            {formatDate(post.pubDate)}
                          </p>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="flex flex-col">
            <h2 className="text-white text-lg font-jost font-bold mb-4">
              MOST POPULAR
            </h2>
            <div className="space-y-6">
              {loading ? (
                <div className="text-center text-white text-xs">Loading...</div>
              ) : (
                newsToDisplay?.slice(4, 7).map((post) => (
                  <div key={post.id}>
                    <hr className="mb-5 w-[65%] border-0 border-b-[1px]" />
                    <Link
                      to={`/detailspage/${post.newsId}`}
                      onClick={scrollToTop}
                    >
                      <div className="flex items-center">
                        <img
                          src={post.imageUrl || no_image}
                          alt={`Post ${post.id}`}
                          className="w-20 h-[68px] object-cover mr-4"
                        />
                        <div>
                          <h3 className="text-xs w-[60%] mb-3 text-gray-200 font-assistant font-bold ">
                            {post.title}
                          </h3>
                          <p className="text-xs text-gray-100">
                            {formatDate(post.pubDate)}
                          </p>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
        {/* Footer Bottom Section #484545 */}
        <div className="bg-[#484545] py-4 pb-5 flex justify-center items-center ">
          <div className=" text-center text-white text-sm border-t border-gray-700">
            © 2024 Samachaar.ai Designed by Labbayk Technologies.
            <a href="/privacy-policy" className="text-white hover:underline pl-2">  Privacy Policy</a>  |
            <a href="/faq" className="text-white hover:underline pl-2"> FAQ  </a>  |
            <a href="/terms-and-conditions" className="text-white hover:underline pl-2"> Terms and Conditions </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
