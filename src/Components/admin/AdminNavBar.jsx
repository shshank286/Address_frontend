import React from "react";

const AdminNavBar = () => {
    
  return (
    <div className="bg-gray-50 shadow-md px-6 py-4 flex justify-between items-center">
      <h1 className="text-xl font-bold">Admin Dashboard</h1>
      <button className="bg-red-500 text-white px-4 py-2 rounded">Logout</button>
    </div>
  );
};

export default AdminNavBar;
