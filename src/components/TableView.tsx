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
    <div className="p-6 min-h-screen bg-gradient-to-br from-orange-50 to-white -mt-4 -mb-10">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-extrabold text-orange-600 drop-shadow-sm">
          Table Overview
        </h2>
        <button
          onClick={() => {
            setRefreshing(true);
            fetchTables();
          }}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-orange-600 bg-orange-100 rounded-full hover:bg-orange-200 transition border border-orange-300 shadow"
        >
          <FiRefreshCw className={refreshing ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {loading ? (
        <div className="text-gray-600 text-center mt-12">Loading tables...</div>
      ) : tables.length === 0 ? (
        <div className="text-gray-500 text-center mt-12">No tables found.</div>
      ) : (
        <motion.div
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6"
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
              className={`relative p-6 rounded-2xl shadow-xl text-center font-bold text-lg border-2 transition-all duration-300 hover:scale-105 backdrop-blur-md ${
                table.status === "Booked"
                  ? "bg-red-50 border-red-400 text-red-700"
                  : "bg-green-50 border-green-400 text-green-700"
              }`}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
            >
              <div className="flex justify-center mb-2 text-2xl">
                {table.status === "Booked" ? (
                  <FaTimesCircle className="text-red-500" />
                ) : (
                  <FaCheckCircle className="text-green-500" />
                )}
              </div>
              <div>Table {table.tableNumber}</div>
              <div className="text-sm mt-2 font-medium opacity-80">
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
