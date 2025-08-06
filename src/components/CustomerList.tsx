import React, { useEffect, useState } from "react";
import axios from "axios";
import { baseUrl } from "../config";
import {
  FiSearch,
  FiUsers,
  FiCalendar,
  FiDollarSign,
  FiShoppingBag,
  FiStar,
} from "react-icons/fi";
import { motion } from "framer-motion";

interface Customer {
  id: number;
  name: string;
  mobile: string;
  email: string;
  createdAt: string;
  totalOrders: number;
  totalMoneySpent: number;
  points: number;
}

const CustomerList: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("newest");

  useEffect(() => {
    const fetchCustomers = async () => {
      const token = localStorage.getItem("authToken");
      if (!token) {
        setError("Authorization token missing");
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get(`${baseUrl}/api/customers/customer`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCustomers(res.data);
      } catch (err: any) {
        console.error("Fetch error:", err);
        setError(err.response?.data?.error || "Failed to fetch customers");
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  const filteredCustomers = customers
    .filter((cust) => {
      const term = searchTerm.toLowerCase();
      return (
        cust.name.toLowerCase().includes(term) ||
        cust.email.toLowerCase().includes(term) ||
        cust.mobile.includes(term)
      );
    })
    .sort((a, b) => {
      return sortOrder === "newest"
        ? new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        : new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    });

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  return (
    <div className="min-h-screen bg-white p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 text-center"
        >
          <div className="flex justify-center items-center mb-3">
            <div className="w-12 h-1 bg-orange-400 mr-2 rounded-full"></div>
            <FiUsers className="text-orange-500 text-2xl" />
            <div className="w-12 h-1 bg-orange-400 ml-2 rounded-full"></div>
          </div>
          <h1 className="text-4xl font-bold text-gray-800">
            <span className="text-orange-600">Customer</span> List
          </h1>
          <p className="mt-2 text-gray-600">
            Manage all your restaurant customers
          </p>
        </motion.div>

        {/* Stats Cards Grid - Replacing the single stats card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4"
        >
          {/* Total Customers Card */}
          <div className="bg-gradient-to-br from-orange-400 to-orange-300 text-white rounded-xl p-4 shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium opacity-90">
                  Total Customers
                </p>
                <p className="text-2xl font-bold">{customers.length}</p>
              </div>
              <div className="p-2 bg-white bg-opacity-40 rounded-full">
                <FiUsers className="text-xl text-orange-600" />
              </div>
            </div>
          </div>

          {/* Total Orders Card */}
          <div className="bg-gradient-to-br from-amber-400 to-amber-300 text-white rounded-xl p-4 shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium opacity-90">Total Orders</p>
                <p className="text-2xl font-bold">
                  {customers.reduce((sum, cust) => sum + cust.totalOrders, 0)}
                </p>
              </div>
              <div className="p-2 bg-white bg-opacity-40 rounded-full">
                <FiShoppingBag className="text-xl text-orange-600" />
              </div>
            </div>
          </div>

          {/* Total Revenue Card */}
          <div className="bg-gradient-to-br from-orange-400 to-red-300 text-white rounded-xl p-4 shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium opacity-90">Total Revenue</p>
                <p className="text-2xl font-bold">
                  ₹
                  {customers
                    .reduce((sum, cust) => sum + cust.totalMoneySpent, 0)
                    .toFixed(2)}
                </p>
              </div>
              <div className="p-2 bg-white bg-opacity-40 rounded-full">
                <FiDollarSign className="text-xl text-orange-600" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Search & Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white p-4 rounded-xl shadow-sm mb-4"
        >
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <FiSearch className="absolute left-3 top-3 text-orange-400" />
              <input
                type="text"
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-orange-200 focus:ring-2 focus:ring-orange-400 focus:border-orange-400"
                placeholder="Search by name, email, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select
              className="px-4 py-2 rounded-lg border border-orange-200 focus:ring-2 focus:ring-orange-400 focus:border-orange-400"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              title="Order"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>
        </motion.div>

        {/* Table (All Original Columns) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl border border-orange-600 shadow-sm overflow-hidden"
        >
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-pulse flex justify-center">
                <div className="h-10 w-10 bg-orange-100 rounded-full"></div>
              </div>
              <p className="mt-3 text-orange-600">Loading customers...</p>
            </div>
          ) : error ? (
            <div className="p-8 text-center text-red-500">{error}</div>
          ) : filteredCustomers.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <FiUsers className="mx-auto text-4xl text-orange-200 mb-3" />
              <p>No customers found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-orange-500">
                <thead className="bg-orange-400">
                  <tr>
                    <th className="px-6 py-3 text-center text-sm font-bold text-white uppercase tracking-wider">
                      No.
                    </th>
                    <th className="px-6 py-3 text-center text-sm font-bold text-white uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-center text-sm font-bold text-white uppercase tracking-wider">
                      Mobile
                    </th>
                    <th className="px-6 py-3 text-center text-sm font-bold text-white uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-center text-sm font-bold text-white uppercase tracking-wider">
                      <FiCalendar className="inline mr-1 mb-1" /> Joined
                    </th>
                    <th className="px-6 py-3 text-center text-sm font-bold text-white uppercase tracking-wider">
                      <FiShoppingBag className="inline mr-1 mb-1" /> Orders
                    </th>
                    <th className="px-6 py-3 text-center text-sm font-bold text-white uppercase tracking-wider">
                      Spent (₹)
                    </th>
                    <th className="px-6 py-3 text-center text-sm font-bold text-white uppercase tracking-wider">
                      <FiStar className="inline mr-1 mb-1" /> Points
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-orange-50">
                  {filteredCustomers.map((customer, index) => (
                    <tr
                      key={customer.id}
                      className="hover:bg-orange-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-center">
                        {index + 1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">
                        {customer.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">
                        {customer.mobile}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">
                        {customer.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                        {formatDate(customer.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium text-center">
                        {customer.totalOrders}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium text-center">
                        ₹{customer.totalMoneySpent.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-orange-600 font-medium text-center">
                        {customer.points}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default CustomerList;
