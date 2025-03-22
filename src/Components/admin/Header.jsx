import React from "react";

const Header = () => {
  return (
    <div className="p-4 flex justify-between items-center bg-white border-b">
      <h1 className="text-2xl font-semibold">Quiz Winner List</h1>
      <div className="relative">
        <input
          type="text"
          placeholder="Search for Name, Email, or anything"
          className="border px-4 py-2 rounded-lg w-96"
        />
        <button className="absolute right-0 top-0 px-4 py-2 bg-red-500 text-white rounded-r-lg">
          Search
        </button>
      </div>
    </div>
  );
};

export default Header;
