import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import { IoEye } from "react-icons/io5";
import AuthService from "../../../services/authService";

const UserTable = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [surveyCounts, setSurveyCounts] = useState({});

  useEffect(() => {
    const fetchUsers = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("No token provided");
        setLoading(false);
        return;
      }

      try {
        const response = await AuthService.getAllUsers();
        const userList = response.users;
        
        const counts = await Promise.all(
          userList.map(async (user) => {
            try {
              const surveyResponse = await AuthService.getSurveyByUserId(user.id);
              return { id: user.id, surveyCount: surveyResponse.resultCount || 0 };
            } catch {
              return { id: user.id, surveyCount: 0 };
            }
          })
        );

        const surveyCountMap = counts.reduce((acc, item) => {
          acc[item.id] = item.surveyCount;
          return acc;
        }, {});

        setUsers(userList);
        setSurveyCounts(surveyCountMap);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleToggle = async (userId, active) => {
    const updatedUsers = users.map(user =>
      user.id === userId ? { ...user, isActive: !user.isActive } : user
    );
    setUsers(updatedUsers);

    try {
      const response = await AuthService.updateUserStatus(userId, active);

      if (!response.ok) {
        throw new Error("Failed to update user status");
      }
    } catch (err) {
      console.error("Error updating user status:", err);
    }
  };

  const filteredUsers = users.filter((user) =>
    user.firstname.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.lastname.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.phonenumber.includes(searchTerm)
  );

  const columns = [
    { 
      name: "Id", 
      selector: (row, index) => index + 1,
      width: "50px",
      hide: "sm"
    },
    { 
      name: "Full Name", 
      selector: (row) => `${row.firstname} ${row.lastname}`, 
      sortable: true,
      grow: 2
    },
    { 
      name: "E-Mail", 
      selector: (row) => row.email, 
      sortable: true,
      hide: "md"
    },
    { 
      name: "Phone Number", 
      selector: (row) => row.phonenumber, 
      sortable: true,
      hide: "sm"
    },
    { 
      name: "Date of Birth", 
      selector: (row) => row.dateofbirth, 
      sortable: true,
      hide: "md"
    },
    { 
      name: "Active", 
      cell: (row) => (
        <div className="flex justify-center">
          <label className="inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={row.isActive}
              onChange={() => handleToggle(row.id, row.isActive)}
              className="hidden"
            />
            <span className={`w-10 h-5 bg-gray-200 rounded-full relative transition-all duration-300 ${row.isActive ? 'bg-green-500' : 'bg-gray-400'}`}>
              <span className={`absolute w-4 h-4 bg-white rounded-full shadow-md transition-all duration-300 ${row.isActive ? 'transform translate-x-5' : 'transform translate-x-0'}`}></span>
            </span>
          </label>
        </div>
      ), 
      ignoreRowClick: true, 
      allowOverflow: true, 
      button: true,
      width: "100px"
    },
    {
      name: "Actions",
      cell: (row) => (
        <button
          className="text-white bg-[#D6043C] px-2 py-1 rounded"
          onClick={() => setSelectedUser(row)}
        >
          <IoEye />
        </button>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      width: "100px"
    },
  ];

  return (
    <div className="container mx-auto p-2 sm:p-4">
      <div className="flex flex-col sm:flex-row gap-6 items-center mb-4">
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border px-4 py-2 rounded w-full sm:w-[70%] mb-2 sm:mb-0"
        />
        <button className="bg-[#D6043C] text-white px-6 py-2 rounded w-full sm:w-auto">Search</button>
      </div>
      <div className="overflow-x-auto">
        <DataTable
          columns={columns}
          data={filteredUsers}
          pagination
          paginationPerPage={10}
          paginationDefaultPage={currentPage}
          onChangePage={(page) => setCurrentPage(page)}
          highlightOnHover
          pointerOnHover
          responsive
          progressPending={loading}
          progressComponent={<div className="text-center my-4">Loading...</div>}
        />
      </div>

      {selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4">
          <div className="bg-white rounded-lg p-4 sm:p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-poppins mb-4">User Details</h2>
            <p className="mb-2"><strong>Full Name:</strong> {`${selectedUser.firstname} ${selectedUser.lastname}`}</p>
            <p className="mb-2"><strong>Email:</strong> {selectedUser.email}</p>
            <p className="mb-2"><strong>Phone Number:</strong> {selectedUser.phonenumber}</p>
            <p className="mb-2"><strong>Date of Birth:</strong> {selectedUser.dateofbirth}</p>
            <p className="mb-2"><strong>Gender:</strong> {selectedUser.gender}</p>
            <p className="mb-2"><strong>Active:</strong> {selectedUser.isActive ? "Yes" : "No"}</p>
            <p className="mb-2"><strong>Total Quiz Score:</strong> {selectedUser.totalScore}</p>
            <p className="mb-2"><strong>Total Survey Given:</strong> {surveyCounts[selectedUser.id] || "Loading..."}</p>
            <div className="flex justify-end mt-4">
              <button
                className="bg-[#D6043C] text-white px-4 py-2 rounded"
                onClick={() => setSelectedUser(null)}
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserTable;

