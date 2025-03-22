import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { FaChevronDown } from "react-icons/fa";
import AuthService from "../../../services/authService";

const SubscriptionPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [subscribe, setSubscribe] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const getData = async () => {
      try {
        const subscribeData = await AuthService.subscriptionAdminAPi();
        setSubscribe(subscribeData?.subscriptions || []);
        console.log("Subscription Data:", subscribeData?.subscriptions);
      } catch (error) {
        console.error("Error fetching subscription list:", error);
      } finally {
        setLoading(false);
      }
    };

    getData();
  }, [currentPage]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric"
    }).format(date);
  };

  const columns = [
    { 
      name: "#", 
      selector: (row, index) => index + 1, 
      width: "80px",
      hide: "sm"
    },
    { 
      name: "E-Mail", 
      selector: (row) => row.email || "N/A", 
      sortable: true,
      grow: 2
    },
    { 
      name: "Subscription Date", 
      selector: (row) => formatDate(row.created_at) || "N/A", 
      sortable: true,
      hide: "md"
    },
  ];

  const filteredUsers = subscribe.filter((user) =>
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full p-2 sm:p-4 bg-gray-50">
      <div className="flex flex-col sm:flex-row gap-6 items-center mb-4">
        <input
          type="text"
          placeholder="Search by email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border px-4 py-2 rounded w-full sm:w-[70%] mb-2 sm:mb-0"
          aria-label="Search subscriptions"
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
          sortIcon={<FaChevronDown />}
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

export default SubscriptionPage;

