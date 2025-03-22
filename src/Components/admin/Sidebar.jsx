import React from "react";
import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="bg-gray-800 text-white h-screen w-60 flex flex-col">
      <div className="text-2xl font-bold text-center py-4">Admin Panel</div>
      <nav className="flex-grow">
        <ul>
          <li className="p-4 hover:bg-gray-700">
            <Link to="/quiz">Quiz</Link>
          </li>
          <li className="p-4 hover:bg-gray-700">
            <Link to="/news">News</Link>
          </li>
          <li className="p-4 hover:bg-gray-700">
            <Link to="/subscription">Subscription</Link>
          </li>
          <li className="p-4 hover:bg-gray-700">
            <Link to="/contact">Contact</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
