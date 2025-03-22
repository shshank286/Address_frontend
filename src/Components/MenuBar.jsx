import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom"; 
import logo from "../assets/images/whitelogo.png";
import { IoMdClose } from "react-icons/io";
import SubscribeBox from "./SubscribeBox";
import AuthService from "../services/authService"; 
import Weather from "./Weather";
import { FaSpinner } from "react-icons/fa"; 

const SidebarMenu = ({ onClose }) => {
  const [categories, setCategories] = useState([]); 
  const [loading, setLoading] = useState(true); 
  const sidebarRef = useRef(null); 

  
  const getCategory = async () => {
    try {
      const cat = await AuthService.categoriesApi(); 
      setCategories(cat); 
    } catch (error) {
      console.error("Category not found", error);
    } finally {
      setLoading(false); 
    }
  };

  // Close the sidebar when clicking outside
  const handleClickOutside = (event) => {
    if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
      onClose(); 
    }
  };

  useEffect(() => {
    getCategory();
    
    document.addEventListener("mousedown", handleClickOutside);

    return () => {

      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []); 

  return (
    <div
      ref={sidebarRef} 
      className="fixed top-0 left-0 h-full bg-[#515151] text-white w-[17rem] z-40 shadow-lg transition-transform transform translate-x-0"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 bg-[#515151] border-b border-gray-900">
        <h1 className="text-xl font-bold tracking-wide">
          <img src={logo} alt="Logo" className="mr-9" />
        </h1>
        <button
          className="text-3xl text-white focus:outline-none"
          onClick={onClose}
        >
          <IoMdClose />
        </button>
      </div>

      {/* Scrollable Content */}
      <div className="overflow-y-auto h-full scrollbar-hide">
        <Weather />

        <div className="">
          <Link to='/'>
          <h2
              onClick={onClose} className=" ml-6 mt-2 border-b border-gray-500 mr-6 md:hidden block font-poppins pb-2 uppercase font-medium >">home</h2>
          </Link>
        </div>
        <div className="">
          <Link to='/politics'>
            <h2
              onClick={onClose} className=" ml-6 mt-2 border-b border-gray-500 mr-6 md:hidden block font-poppins pb-2 uppercase font-medium >">Politics</h2>
          </Link>
        </div>
        <div className="">
          <Link to='/national'>
            <h2
              onClick={onClose} className=" ml-6 mt-2 border-b border-gray-500 mr-6 md:hidden block font-poppins pb-2 uppercase font-medium >">National</h2>
          </Link>
        </div>
        <div className="">
          <Link to='/international'>
            <h2
              onClick={onClose} className=" ml-6 mt-2 border-b border-gray-500 mr-6 md:hidden block font-poppins pb-2 uppercase font-medium >">International</h2>
          </Link>
        </div>
        
        <div className="">
          <Link to='/worldnews'>
            <h2
              onClick={onClose} className=" ml-6 mt-2 border-b border-gray-500 mr-6 md:hidden block font-poppins pb-2 uppercase font-medium >">World News</h2>
          </Link>
        </div>
        <div className="">
          <Link to='/profile'>
            <h2
              onClick={onClose} className=" ml-6 mt-2 border-b border-gray-500 mr-6 md:hidden  font-poppins pb-2 uppercase font-medium block" >Profile</h2>
          </Link>
        </div>


        {/* Navigation Links */}
        <nav className="px-6 py-4">
          <ul className="space-y-4 text-xs font-bold font-jost">
            {loading ? (
              <div className="flex justify-center items-center">
                <FaSpinner className="animate-spin text-white" size={30} />
              </div>
            ) : (
              categories?.map((item) => (
                <li
                  key={item.categoryId}
                  onClick={onClose}
                  className="hover:text-black cursor-pointer border-b border-gray-500 pb-2"
                >
                  {/* Create links dynamically based on categoryId */}
                  <Link
                    to={`/category/${item.name}`}
                    className="font-poppins text-[1rem] uppercase font-medium"
                  >
                    {item.name}
                  </Link>
                </li>
              ))
            )}
          </ul>
        </nav>

        {/* Subscribe Box */}
        <div className="px-6 py-6">
          <SubscribeBox />
        </div>
      </div>
    </div>
  );
};

export default SidebarMenu;
