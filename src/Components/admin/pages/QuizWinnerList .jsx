import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import AuthService from "../../../services/authService";

const QuizWinnerList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [quiz, setQuiz] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const getData = async () => {
      try {
        const quizData = await AuthService.quizRankListAPI(currentPage, 10, token);
        setQuiz(quizData?.users || []);
        console.log("Quiz Data:", quizData?.users);
      } catch (error) {
        console.error("Error fetching quiz list:", error);
      } finally {
        setLoading(false);
      }
    };

    getData();
  }, [currentPage, token]);

  const columns = [
    { 
      name: "Rank", 
      selector: (row, index) => index + 1, 
      width: "80px",
      hide: "sm"
    },
    { 
      name: "Full Name", 
      selector: (row) => `${row.firstname || ""} ${row.lastname || "N/A"}`, 
      sortable: true,
      grow: 2
    },
    { 
      name: "E-Mail", 
      selector: (row) => row.email || "N/A", 
      sortable: true,
      hide: "md"
    },
    { 
      name: "Phone Number", 
      selector: (row) => row.phonenumber || "N/A", 
      sortable: true,
      hide: "lg"
    },
    { 
      name: "Total Score", 
      selector: (row) => row.totalScore, 
      sortable: true
    },
  ];

  const filteredUsers = quiz.filter((user) => {
    const fullName = `${user.firstname || ""} ${user.lastname || ""}`.toLowerCase();
    return (
      fullName.includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phonenumber?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="w-full p-2 sm:p-4 bg-gray-50">
      <div className="flex flex-col sm:flex-row gap-6 items-center mb-4">
        <input
          type="text"
          placeholder="Search by name, email, or phone"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border px-4 py-2 rounded w-full sm:w-[70%] mb-2 sm:mb-0"
        />
        <button className="bg-[#D6043C] text-white px-6 py-2 rounded w-full sm:w-auto">
          Search
        </button>
      </div>

      <div className="overflow-x-auto">
        <DataTable
          columns={columns}
          data={filteredUsers}
          progressPending={isLoading}
          pagination
          paginationPerPage={10}
          paginationDefaultPage={currentPage}
          onChangePage={(page) => setCurrentPage(page)}
          highlightOnHover
          pointerOnHover
          responsive
          conditionalRowStyles={[
            {
              when: (row, index) => index % 2 === 0,
              style: { backgroundColor: "#f9f9f9", color: "#000" },
            },
            {
              when: (row, index) => index % 2 !== 0,
              style: { backgroundColor: "#ffffff", color: "#000" },
            },
          ]}
          progressComponent={
            <div className="text-center my-4">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#D6043C]"></div>
            </div>
          }
        />
      </div>
    </div>
  );
};

export default QuizWinnerList;

