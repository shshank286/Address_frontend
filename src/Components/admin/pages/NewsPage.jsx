import React, { useEffect, useState } from "react";
import { BsChevronLeft, BsChevronRight } from "react-icons/bs";
import { FiArrowRight } from "react-icons/fi";
import no_image from "../../../assets/images/no_img.png";
import AuthService from "../../../services/authService";
import { tailChase } from "ldrs";
import { getNewsByCategory } from "../../../services/newsService";
import { fetchNewsByDate, clearNewsByDate } from "../../../Context/newsSlice"
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

const CalendarDate = ({ selectedDate, onDateChange }) => {
  const [currentDate, setCurrentDate] = useState(selectedDate || new Date());
  const today = new Date();

  const handleDateChange = (newDate) => {
    const localDate = new Date(newDate);
    const formattedDate = `${localDate.getFullYear()}-${(localDate.getMonth() + 1).toString().padStart(2, '0')}-${localDate.getDate().toString().padStart(2, '0')}`;

    if (newDate <= today) {
      onDateChange(newDate);
      setCurrentDate(newDate); // Update the current date state
    }
  };

  const handleMonthChange = (direction) => {
    setCurrentDate((prevDate) => {
      const newDate = new Date(prevDate);
      newDate.setMonth(newDate.getMonth() + direction);
      return newDate;
    });
  };

  return (
    <div className="w-full bg-white rounded-sm shadow p-4">
      <Calendar
        value={currentDate}
        onChange={handleDateChange}
        maxDate={new Date()}  // Disable future dates
        tileClassName={({ date, view }) => {
          if (view === "month" && date > today) {
            return "text-gray-300 cursor-not-allowed"; // Disable future dates visually
          }
          if (selectedDate?.toDateString() === date.toDateString()) {
            return "bg-red-500 text-white";
          }
        }}
      />
    </div>
  );
};

const NewsPage = () => {
  const [newsArticles, setNewsArticles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [newsType, setNewsType] = useState("date"); // "date" or "category"
  const articlesPerPage = 12;

  const dispatch = useDispatch();

  const { data, loading: newsLoading } = useSelector((state) => state.news || []);

  const [selectedDate, setSelectedDate] = useState(new Date());

  const truncateText = (text, length = 15) => {
    return text && text.length > length
      ? text.substring(0, length) + "..."
      : text;
  };

  const getCategory = async () => {
    try {
      const cat = await AuthService.categoriesApi();
      setCategories(cat);
    } catch (error) {
      console.error("Category not found", error);
    }
  };

  const fetchNewsByCategory = async (categoryName, page = 1, date) => {
    try {
      setLoading(true);
      const cateoryDate = localStorage.getItem("selectedDateAdmin")
      const newsData = await getNewsByCategory(categoryName, page, articlesPerPage, cateoryDate);
      setNewsArticles(newsData.news || []);
      setTotalPages(newsData.totalPages || 0);
    } catch (error) {
      console.error("Failed to fetch news by category:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDateWiseNews = async (date) => {
    try {
      setLoading(true);
      const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1)
        .toString()
        .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;

      dispatch(fetchNewsByDate(formattedDate));

    } catch (error) {
      console.error("Error fetching date-wise news:", error);
    } finally {
      setLoading(false);
    }
  };
  const [activeCategory, setActiveCategory] = useState(null);

  const handleCategoryClick = (categoryName) => {
    setSelectedCategory(categoryName);
    setNewsType("category"); // Switch to category view
    setCurrentPage(1);// Reset to the first page when a new category is selected
    fetchNewsByCategory(categoryName, 1,);
    setActiveCategory(categoryName);
  };


  // Switch back to date-wise view
  const handleDateChange = (date) => {
    setSelectedDate(date);
    setNewsType("date");
    fetchDateWiseNews(date);

    const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
    localStorage.setItem("selectedDateAdmin", formattedDate);
  };

  useEffect(() => {
    getCategory();
    fetchDateWiseNews(selectedDate);
  }, [selectedDate]);


  //count totalPages in categories or date-wise news

  useEffect(() => {
    const newsToDisplay = newsType === "date" ? data.byDate || [] : newsArticles;
    setTotalPages(Math.ceil(newsToDisplay.length / articlesPerPage));
  }, [data, newsArticles, newsType]);


  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };



  const generatePaginationNumbers = () => {
    const delta = 2;
    const range = [];
    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      range.unshift("...");
    }
    if (currentPage + delta < totalPages - 1) {
      range.push("...");
    }

    range.unshift(1);
    if (totalPages !== 1) {
      range.push(totalPages);
    }

    return range;
  };

  const newsToDisplay = newsType === "date" ? data.byDate || [] : newsArticles;

  const filteredNews = newsToDisplay.filter((article) =>
    article.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const paginatedNews = filteredNews.slice(
    (currentPage - 1) * articlesPerPage,
    currentPage * articlesPerPage
  );

  return (
    <div className="p-6 bg-gray-50">
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search news by title..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="w-[90%] md:w-[70%] p-2 border border-gray-300 rounded-md"
        />
        <button className="bg-[#D6043C] text-white px-6 mt-1 py-2 ml-6 rounded">Search</button>
      </div>
      <div className="grid grid-cols-10 gap-8">
        <div className="col-span-10 md:col-span-7 order-1">
          <h2 className="text-2xl font-semibold mb-4">
            {newsType === "date" ? "Daily News" : "Category News"}
          </h2>
          {loading ? (
            <div className="flex justify-center items-center h-screen">
              <l-tail-chase size="40" speed="1.75" color="black"></l-tail-chase>
            </div>
          ) : paginatedNews.length > 0 ? (
            <>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {paginatedNews.map((article, index) => (
                  <div
                    key={index}
                    className="p-4 border border-gray-300 shadow-sm rounded-md bg-white hover:bg-gray-50"
                  >
                    <Link to={`/admin-dashboard/detailspage/${article.newsId}`}>
                      <div className="w-full mb-2">
                        <img className="h-[10rem] w-[15rem]" src={article.imageUrl || no_image} alt="" />
                      </div>
                      <h3 className="text-sm font-assistant font-bold">{truncateText(article.title, 30)}</h3>
                      <p className="mt-2 text-[14px] font-opensans">{truncateText(article.description, 70)}</p>
                    </Link>

                  </div>

                ))}

              </div>
              {totalPages > 0 && (
                <div className="flex justify-center items-center mt-8 mb-8">
                  <nav className="inline-flex rounded-md shadow">
                    <button
                      onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="px-3 py-2 rounded-l-md border border-gray-300 bg-white hover:bg-gray-300 text-sm font-medium text-black/75 disabled:bg-gray-100 disabled:text-gray-400"
                    >
                      Previous
                    </button>
                    {generatePaginationNumbers().map((number, index) => (
                      <button
                        key={index}
                        onClick={() =>
                          typeof number === "number" && setCurrentPage(number)
                        }
                        className={`px-3 py-2 border border-gray-300 text-sm font-medium ${number === currentPage
                          ? "bg-gray-300 text-black "
                          : "bg-white text-gray-500 hover:bg-gray-50"
                          } ${typeof number !== "number" ? "cursor-default" : ""}`}
                      >
                        {number}
                      </button>
                    ))}
                    <button
                      onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="px-3 py-2 rounded-r-md border border-gray-300 bg-white hover:bg-gray-300 text-sm font-medium text-black/75 disabled:bg-gray-100 disabled:text-gray-400"
                    >
                      Next
                    </button>
                  </nav>
                </div>
              )}
            </>
          ) : (
            <div className="flex justify-center items-center h-72">
              <p className="text-gray-500 text-lg">No news available for this category or Date. </p>

            </div>
          )}
        </div>
        <div className="col-span-10 md:col-span-3 space-y-6 order-2">
          <div>
            <h2 className="text-lg font-bold mb-4">Categories</h2>
            <div className="flex flex-wrap gap-[6px]">
              {categories?.map((category, index) => {
                const oddBgColor = "bg-[#e6e6e5] text-black";
                const evenBgColor = "bg-[#D6043C] text-white";
                // Apply active background color when the category is clicked
                const isActive = activeCategory === category.name;
                const appliedColor = isActive
                  ? "border border-gray-500 bg-black/85 text-white" // Active category color (can be customized)
                  : index % 2 === 0
                    ? evenBgColor
                    : oddBgColor;

                return (
                  <button
                    key={index}
                    onClick={() => handleCategoryClick(category.name)}
                    className={`flex items-center px-3 py-1 rounded-full text-xs font-medium ${appliedColor}`}
                  >
                    {category.name} <FiArrowRight className="ml-2" />
                  </button>
                );
              })}
            </div>
          </div>
          <CalendarDate selectedDate={selectedDate} onDateChange={handleDateChange} />
        </div>
      </div>
    </div>
  );
};


export default NewsPage;
