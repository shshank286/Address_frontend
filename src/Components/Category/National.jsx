import React, { useEffect, useState } from "react";
import { getNewsByCountry } from "../../services/newsService";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import no_image from '../../assets/images/no_img.png'
import { FaAngleRight } from "react-icons/fa6";
import survey from "../../assets/images/survey.gif";

function National() {
  const { categoryName } = useParams();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 10;

  const fetchNewsByCategory = async (page = 1) => {
    try {
      setLoading(true);
      const newsData = await getNewsByCountry(page, pageSize);
      setArticles(newsData.news || []);
      setTotalPages(newsData.totalPages || 0);
    } catch (error) {
      console.error("Failed to fetch news by category:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNewsByCategory(currentPage);
  }, [categoryName, currentPage]);

  const truncateText = (text, length = 50) => {
    return text && text.length > length
      ? text.substring(0, length) + "..."
      : text;
  };

  // New function to generate pagination numbers
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

  return (
    <>
      {loading ? (
        <div className="flex justify-center items-center h-screen">
          <l-tail-chase size="40" speed="1.75" color="black"></l-tail-chase>
        </div>
      ) : (
        <>
          <div className="bg-[#E6E5E1] mt-[-3.7rem] p-2 ">
            {articles.map((article, index) => (
              <div className="md:col-span-2 mt-4 ml-4 mr-4" key={index}>
                <Link
                  className="flex flex-col md:flex-row items-start"
                  to={`/detailspage/${article.newsId}`}
                >
                  <div className="w-full md:w-[15rem] relative">

                    {article.survey && (
                      <div className="absolute top-1 left-1">
                        <img src={survey} className="text-white bg-black rounded-sm w-8" />
                      </div>
                    )}
                    <img
                      src={article.imageUrl || no_image}
                      alt={article.title}
                      className="h-[10rem] w-full md:w-[15rem] rounded-md hover:scale-105 transition-transform duration-300 cursor-pointer object-cover"
                    />
                  </div>
                  <div className="mt-4 md:mt-0 md:ml-4 flex flex-col justify-between w-full md:w-3/6">
                    <div className="text-xs text-gray-500 uppercase">
                      {article.categories}
                    </div>
                    <p className="text-sm sm:text-base font-semibold mt-2">
                      {article.title}
                    </p>
                    <div className="flex items-center mt-3">
                      <p className="text-xs sm:text-sm">
                        {article.pubDate.split(" ")[0] || "Mar 10, 2022"}
                      </p>
                    </div>
                    <p className="mt-3 text-sm text-gray-700">
                      {truncateText(article.description, 160)}
                    </p>
                  </div>
                </Link>
                <hr className="border-t mt-3 border-gray-400 w-3/4" />
              </div>
            ))}
          </div>

          {/* Updated Pagination */}
          {totalPages > 0 && (
            <div className="flex justify-center items-center mt-8 mb-8">
              <nav className="inline-flex gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-2 rounded-l-full border border-gray-300 bg-white hover:bg-gray-300 text-sm font-medium text-black/75 disabled:bg-gray-100 disabled:text-gray-400"
                >
                  <FaAngleRight className="rotate-180" />
                </button>
                {generatePaginationNumbers().map((number, index) => (
                  <button
                    key={index}
                    onClick={() => typeof number === 'number' && setCurrentPage(number)}
                    className={`px-3 py-2 rounded-md border border-gray-300 text-sm font-medium ${number === currentPage
                      ? 'bg-[#E6E5E1] text-black '
                      : 'bg-white text-gray-500 hover:bg-gray-50'
                      } ${typeof number !== 'number' ? 'cursor-default' : ''}`}
                  >
                    {number}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-2 rounded-r-full border border-gray-300 bg-white hover:bg-gray-300 text-sm font-medium text-black/75 disabled:bg-gray-100 disabled:text-gray-400"
                >
                  <FaAngleRight />
                </button>
              </nav>
            </div>
          )}

          {totalPages === 0 && (
            <div className="flex justify-center items-center mt-8 mb-8">
              <p>No news found for Category: {categoryName}</p>
            </div>
          )}
        </>
      )}
    </>
  );
}

export default National;
