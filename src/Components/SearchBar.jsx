import React, { useState, useEffect, useRef } from "react";
import AuthService from "../services/authService";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import no_images from "../assets/images/no_img.png";

const SearchBar = () => {
  const [query, setQuery] = useState(""); 
  const [suggestions, setSuggestions] = useState([]); 
  const [loading, setLoading] = useState(false); 
  const [error, setError] = useState(""); 
  const [isFocused, setIsFocused] = useState(false); 
  const searchBarRef = useRef(null); 

  const token = useSelector((state) => state.auth.token);
  
  const fetchSuggestions = async () => {
    if (query.trim() === "") {
      setSuggestions([]); 
      return;
    }
    setLoading(true);
    setError(""); 
    try {
      const response = await AuthService.searchAPi(query, token);
      setSuggestions(response || []);
      setLoading(false);
    } catch (err) {
      setError("Error fetching suggestions. Please try again.");
      setLoading(false);
    }
  };

  
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchSuggestions(); 
    }, 500); 

    return () => clearTimeout(timeoutId); 
  }, [query]);

  
  const handleClickOutside = (event) => {
    if (searchBarRef.current && !searchBarRef.current.contains(event.target)) {
      setIsFocused(false); 
    }
  };

  useEffect(() => {
    
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="w-full flex justify-center" ref={searchBarRef}>
      <div className="flex justify-center items-center flex-col w-[100%] relative">
        <div
          className={`relative transition-all ${
            isFocused ? "w-52 bg-inherit" : "w-32"
          }`}
        >
          <input
            type="text"
            placeholder={isFocused ? "Search News" : "Search.."}
            className={`w-full py-2 pl-10 pr-4 text-gray-700 font-assistence bg-inherit border rounded-md text-sm outline-none transition-all ${
              isFocused ? "border-gray-500" : "border-gray-300"
            }`}
            onFocus={() => setIsFocused(true)}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <div className="absolute inset-y-0 left-0 flex items-center pl-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`w-5 h-5 transition-all ${
                isFocused ? "text-[#D6043C]" : "text-gray-400"
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        {/* Show loading indicator while fetching */}
        {loading && (
          <div className="absolute top-12 left-0 bg-gray-700 text-white p-2 rounded-md w-full">
            Loading...
          </div>
        )}

        {/* Display error message */}
        {error && (
          <div className="absolute top-12 left-0 bg-red-600 text-white p-2 rounded-md w-full">
            {error}
          </div>
        )}

        {/* Suggestions List */}
        {suggestions.length > 0 && isFocused && !loading && !error && (
          <div className="flex flex-col justify-start items-center absolute mt-2 ml-[11rem] top-full bg-gray-300 text-white w-[40rem] max-h-60 overflow-y-auto rounded-lg border border-black z-50 scrollbar-hide shadow-lg">
            {suggestions.map((suggestion) => (
              <div key={suggestion.newsId} className="w-full">
                <Link
                  to={`/detailsPage/${suggestion.newsId}`}
                  className="px-4 py-3 hover:bg-gray-200 cursor-pointer flex flex-row w-full"
                  onClick={() => setIsFocused(false)} 
                >
                  <img
                    src={suggestion.imageUrl || no_images}
                    alt=""
                    className="w-20"
                  />
                  <p className="ml-4 text-black">{suggestion.title}</p>
                </Link>
                <hr className="border-t border-gray-900 w-full" />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchBar;
