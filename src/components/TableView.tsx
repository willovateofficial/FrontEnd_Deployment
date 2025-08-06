import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { motion } from "framer-motion";
import "react-toastify/dist/ReactToastify.css";
import { FiRefreshCw } from "react-icons/fi";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";

interface Table {
  id: number;
  tableNumber: number;
  status: "Booked" | "Available";
}

const TableView: React.FC = () => {
  const [tables, setTables] = useState<Table[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const baseUrl = process.env.REACT_APP_BASE_URL || "http://localhost:3000";
  const businessId = localStorage.getItem("businessId");

  const fetchTables = async () => {
    if (!businessId) {
      toast.error("Business ID not found");
      return;
    }

    try {
      if (!refreshing) setLoading(true);
      const res = await fetch(`${baseUrl}/api/tables/${businessId}`);
      const data = await res.json();
      if (data?.tables) {
        setTables(data.tables);
      } else {
        toast.error("Unexpected response format");
      }
    } catch (error) {
      console.error("Fetch tables error:", error);
      toast.error("Failed to fetch tables");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchTables();
    const interval = setInterval(fetchTables, 10000); // Auto-refresh every 10s
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 -mt-4 -mb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-8 gap-4">
        {/* Heading + Mobile Icon */}
        <div className="flex items-center gap-9">
          <div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-orange-900">
              Table Management
            </h2>
            <p className="text-gray-500 text-sm mt-1 hidden sm:block">
              Manage your restaurant tables and booking status easily.
            </p>
          </div>

          {/* Mobile Only Refresh Icon */}
          <button
            title="Refresh tables"
            onClick={() => {
              setRefreshing(true);
              fetchTables();
            }}
            className="sm:hidden flex items-center justify-center w-9 h-9 rounded-full bg-orange-500 hover:bg-orange-600 text-white shadow-md transition"
          >
            <FiRefreshCw
              className={`${refreshing ? "animate-spin" : ""} text-lg`}
            />
          </button>
        </div>

        {/* Desktop Refresh Button */}
        <button
          onClick={() => {
            setRefreshing(true);
            fetchTables();
          }}
          className="hidden sm:flex items-center gap-2 px-5 py-2 text-sm font-medium text-white bg-gradient-to-r from-orange-500 to-orange-600 rounded-full hover:from-orange-600 hover:to-orange-700 transition-all shadow-md"
        >
          <FiRefreshCw className={`${refreshing ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {/* Table Grid */}
      {/* Table Grid */}
      {loading ? (
        <div className="text-gray-600 text-center mt-12">Loading tables...</div>
      ) : tables.length === 0 ? (
        <div className="text-gray-400 text-center mt-16 text-lg font-medium">
          📭 No tables found. Please generate tables first.
        </div>
      ) : (
        <motion.div
          className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.05,
              },
            },
          }}
        >
          {tables.map((table) => (
            <motion.div
              key={table.id}
              className={`p-6 rounded-2xl shadow-lg text-center transition-all duration-300 hover:scale-105 hover:shadow-2xl ${
                table.status === "Booked"
                  ? "bg-gradient-to-br from-red-50 to-red-100 border border-red-300"
                  : "bg-gradient-to-br from-green-50 to-green-100 border border-green-300"
              }`}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
            >
              <div
                className={`w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center shadow ${
                  table.status === "Booked" ? "bg-red-200" : "bg-green-200"
                }`}
              >
                {table.status === "Booked" ? (
                  <FaTimesCircle className="text-red-600 text-2xl" />
                ) : (
                  <FaCheckCircle className="text-green-600 text-2xl" />
                )}
              </div>
              <div className="text-xl font-semibold text-gray-800">
                Table {table.tableNumber}
              </div>
              <div
                className={`mt-1 font-medium ${
                  table.status === "Booked" ? "text-red-600" : "text-green-600"
                }`}
              >
                {table.status}
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      <ToastContainer position="top-center" />
    </div>
  );
};

export default TableView;
