import React, { useEffect, useRef, useState } from "react";
import logo from "../assets/images/logo.png";
import MenuBar from "../Components/MenuBar";
import { Link, useLocation } from "react-router-dom";
import "react-datepicker/dist/react-datepicker.css";
import { useDispatch, useSelector } from "react-redux";
import { openPopup } from "../Context/authSlice";
import SearchBar from "./SearchBar";
import axios from "axios";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";

const Navbar = ({ onDateSelect }) => {
  const [activeItem, setActiveItem] = useState("home"); 

  const toggleSearchBar = () => setShowSearchBar(!showSearchBar);

  const [showSearchBar, setShowSearchBar] = useState(false);
  const [weatherData, setWeatherData] = useState(null);
  const datePickerRef = useRef(null);

  const dispatch = useDispatch();

  const handleClick = (item) => {
    setActiveItem(item);
  };

  const [isChildOpen, setIsChildOpen] = useState(false);

  // Toggle ChildComponent visibility
  const toggleChild = () => {
    setIsChildOpen(!isChildOpen);
  };
  const profilePicture = useSelector(
    (state) => state.auth?.profilePicture
  );

  const fname = useSelector((state) => state.auth.name);


  const firstLetter = (fname || "").substring(0, 1);

  const isToken =
    localStorage.getItem("token") === "null"
      ? null
      : localStorage.getItem("token");

  // Get current date
  const [today, setToday] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);

  const getFormattedDate = () => {
    return selectedDate.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  };
  const handleDateSelect = (date) => {

    if (date) {
      setSelectedDate(date);

      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");

      const formattedDate = `${year}-${month}-${day}`;

      onDateSelect(formattedDate);
      setIsDatePickerVisible(false);
    }
  };

  const toggleDatePicker = () => {
    setIsDatePickerVisible((prev) => !prev); 
  };

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const lat = localStorage.getItem("latitude");
        const long = localStorage.getItem("longitude");
        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?lat=${lat || 12.9630208
          }&lon=${long || 77.7191424}&appid=ed222663fbd11dffb5c672e3e086c265`
        );

        setWeatherData(response.data);
      } catch (error) {
        console.error("Error fetching weather data:", error);
      }
    };

    fetchWeather();
  }, [dispatch, today]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        datePickerRef.current &&
        !datePickerRef.current.contains(event.target)
      ) {
        setIsDatePickerVisible(false); 
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const { main, weather, wind, sys, dt, name } = weatherData || {};

  if (!weatherData) {
    return <div>Loading...</div>;
  }
  const currentTemp = main.temp - 273.15;

  const loginPopup = (formType = "login") => {
    dispatch(openPopup(formType));
  };

  return (
    <header className="bg-[#E6E5E1] border-b shadow-md mb-[4rem] w-full">
      {/* Top Section */}
      <div className="flex justify-center items-center px-4  text-sm text-gray-600">
        <div className="">
          <h2 className="text-[#3a3636] font-kaushan font-medium text-xs sm:text-lg flex items-end justify-end mr-[3rem] sm:mr-[4.6rem] ">
            Your Voice, Your Power
          </h2>
          <img src={logo} className="md:h-5 xl:h-11" alt="" />
        </div>
      </div>

      {/* Logo and Navbar */}
      <div className="grid grid-cols-1 md:grid-cols-[20%,65%,15%] items-center gap-4 px-11 py-1">
        {/* Branding */}
        <div className="">
          <div className="flex items-center w-[30rem]">
            <button className="mr-4 text-md text-gray-700" onClick={toggleChild}>
              ☰ Explore
            </button>

            <div className="flex items-center  space-x-4">
              <button
                onClick={toggleSearchBar}
                className="flex bg-transparent px-2 py-1 items-center space-x-2 rounded-lg text-md"
              >
                {/* <CiSearch /> <span>Search</span> */}
                <SearchBar />
              </button>
            </div>
          </div>
          <span className="inline-flex items-center w-[22rem] mb-2">
            {/* Date Input */}
            <div className="relative mt-2">
              {/* Display selected date, toggle date picker on click */}
              <p
                onClick={toggleDatePicker}
                className="cursor-pointer text-[15px] font-poppins font-medium text-gray-700 transition-colors duration-300"
              >
                {getFormattedDate()}
              </p>

              {/* Conditionally render the DayPicker only when isDatePickerVisible is true */}
              {isDatePickerVisible && (
                <div
                  ref={datePickerRef}
                  className="absolute z-50 bg-white border rounded mt-2 shadow-xl w-[20rem] p-4"
                >
                  <DayPicker
                    mode="single"
                    selected={selectedDate}
                    onDayClick={
                      handleDateSelect
                    }
                    disabled={{ after: today }}
                    modifiers={{
                      today: today
                    }}
                    className="text-sm font-semibold text-black outline-none"
                  />
                </div>
              )}
            </div>
            &nbsp; <div className="mt-1">&nbsp; |</div>
            <p
              onChange={() => {
                setShowInput(true);
              }}
              className="text-sm mt-2 text-[15px] text-gray-700 font-poppins font-medium ml-3"
            >
              {name} {currentTemp.toFixed(1)}°C
            </p>
          </span>
        </div>
        {/* Navigation Links */}
        <nav className="mt-4 lg:mt-0  md:flex justify-center hidden mr-[5.4rem] relative p-4 z-40">
          <ul className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4 text-gray-700 text-sm">
            <Link
              to="/"
              className={`hover:text-black cursor-pointer font-poppins font-medium ${activeItem === "home" ? "border-b-2 border-[#D6043C]" : ""}`}
              onClick={() => handleClick("home")}
            >
              HOME
            </Link>
            <Link
              to="politics"
              className={`hover:text-black cursor-pointer font-poppins font-medium ${activeItem === "politics" ? "border-b-2 border-red-500" : ""}`}
              onClick={() => handleClick("politics")}
            >
              POLITICS
            </Link>
            <Link
              to="national"
              className={`hover:text-black cursor-pointer font-poppins font-medium ${activeItem === "national" ? "border-b-2 border-red-500" : ""}`}
              onClick={() => handleClick("national")}
            >
              NATIONAL
            </Link>
            <Link
              to="international"
              className={`hover:text-black cursor-pointer font-poppins font-medium ${activeItem === "international" ? "border-b-2 border-red-500" : ""}`}
              onClick={() => handleClick("international")}
            >
              INTERNATIONAL
            </Link>
            <Link
              to="business"
              className={`hover:text-black cursor-pointer font-poppins font-medium ${activeItem === "business" ? "border-b-2 border-red-500" : ""}`}
              onClick={() => handleClick("business")}
            >
              BUSINESS
            </Link>
            <Link
              to="worldnews"
              className={`hover:text-black cursor-pointer font-poppins font-medium ${activeItem === "worldNews" ? "border-b-2 border-red-500" : ""}`}
              onClick={() => handleClick("worldNews")}
            >
              WORLD NEWS
            </Link>
          </ul>
        </nav>



        {/* Buttons */}
        {!isToken ? (
          <div className="mt-4 md:mt-0 flex flex-col gap-2 sm:flex-row md:gap-2">
            <button
              onClick={() => loginPopup("register")}
              className="text-sm px-5 py-1 bg-black text-white hover:bg-gray-800"
            >
              SIGN UP
            </button>
            <button
              onClick={() => loginPopup("login")}
              className="text-sm px-5 py-1 border border-black hover:bg-gray-200"
            >
              LOGIN
            </button>
          </div>
        ) : (
          <div className={`hidden md:block`}>
            <Link to="profile">
              <div
                className="cursor-pointer flex flex-col items-center"
              >
                {!profilePicture ? (
                   <div className="w-12 h-12 bg-yellow-400 rounded-full overflow-hidden border-2 border-white shadow-md flex items-center justify-center">
                  <p className=" text-black rounded-full uppercase flex items-center justify-center text-2xl font-bold font-poppins">
                  {(firstLetter || "").substring(0, 1)}
                </p>
                </div>
                ) : (
                  <img
                    src={profilePicture}
                    className="h-12 w-12 rounded-full"
                    alt="User Profile"
                  />
                )}
                <p
                  className={`text-gray-700 ${activeItem === "profile" ? "text-gray-900" : ""
                    }`}
                >
                  Profile
                </p>
              </div>
            </Link>
          </div>

        )}
      </div>

      {/* SidebarMenu */}
      {isChildOpen && <MenuBar onClose={toggleChild} />}
    </header>
  );
};

export default Navbar;
