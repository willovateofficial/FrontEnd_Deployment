import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { fetchDashboardData } from "../data/dashboardData";

interface DashboardData {
  orders: { date: string; count: number }[];
  topDishes: { name: string; orders: number }[];
  totalIncome: number;
  totalOrders: number;
}

const getInitialMonth = () =>
  localStorage.getItem("dashboardMonth") || "January";

const getInitialDate = () => localStorage.getItem("dashboardDate") || "01 - 10";

const Dashboard = () => {
  const [selectedMonth, setSelectedMonth] = useState(getInitialMonth);
  const [selectedDate, setSelectedDate] = useState(getInitialDate);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [dashboard, setDashboard] = useState<DashboardData>({
    orders: [],
    topDishes: [],
    totalIncome: 0,
    totalOrders: 0,
  });

  const monthOptions = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const dateRanges = ["01 - 10", "11 - 20", "21 - 31"];

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const dayNumber = selectedDay
          ? new Date(selectedDay).getDate()
          : undefined;
        const data = await fetchDashboardData(
          selectedMonth,
          selectedDate,
          dayNumber
        );
        setDashboard(data);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedMonth, selectedDate, selectedDay]);

  // Save filters to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("dashboardMonth", selectedMonth);
    localStorage.setItem("dashboardDate", selectedDate);
  }, [selectedMonth, selectedDate]);

  if (loading) {
    return <div className="p-6 text-center text-gray-600">Loading...</div>;
  }

  return (
    <div className="p-4 bg-white min-h-[calc(100vh-4rem)] overflow-y-auto relative">
      <h2 className="text-4xl font-bold text-gray-900 text-center md:text-left mb-6">
        Dashboard
      </h2>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center sm:justify-start mb-6">
        <select
          className="border border-gray-300 rounded-md px-4 py-2 text-sm bg-white shadow-sm"
          value={selectedMonth}
          onChange={(e) => {
            setSelectedMonth(e.target.value);
            setSelectedDay(null);
          }}
          aria-label="Select month"
        >
          {monthOptions.map((month) => (
            <option key={month}>{month}</option>
          ))}
        </select>

        <select
          className="border border-gray-300 rounded-md px-4 py-2 text-sm bg-white shadow-sm"
          value={selectedDate}
          onChange={(e) => {
            setSelectedDate(e.target.value);
            setSelectedDay(null);
          }}
          aria-label="Select date range"
        >
          {dateRanges.map((range) => (
            <option key={range}>{range}</option>
          ))}
        </select>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left Section */}
        <div className="xl:col-span-2 flex flex-col gap-6">
          {/* Orders Chart */}
          <div className="bg-white p-5 rounded-lg shadow h-[300px]">
            <h3 className="text-base font-semibold mb-3 text-gray-700">
              📈 Orders Overview
            </h3>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dashboard.orders}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" fontSize={10} />
                <YAxis fontSize={10} />
                <Tooltip />
                <Bar
                  dataKey="count"
                  fill="#6366F1"
                  barSize={20}
                  onClick={(data) => setSelectedDay(data.date)}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-lg shadow text-indigo-800 bg-indigo-100 text-sm">
              <h4 className="font-medium">Total Sales</h4>
              <p className="font-semibold">₹ {dashboard.totalIncome}</p>
            </div>
            <div className="p-4 rounded-lg shadow text-yellow-800 bg-yellow-100 text-sm">
              <h4 className="font-medium">Total Orders</h4>
              <p className="font-semibold">{dashboard.totalOrders}</p>
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex flex-col gap-6">
          <div className="bg-white p-5 rounded-lg shadow">
            <h3 className="text-base font-semibold mb-3 text-gray-700">
              🍽️ Top 5 Dishes
            </h3>
            <ul className="space-y-2 text-sm">
              {dashboard.topDishes?.map((dish, index) => (
                <li
                  key={index}
                  className="flex justify-between items-center bg-gray-50 px-3 py-2 rounded-md hover:bg-gray-100 transition"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-indigo-600">
                      {index + 1}
                    </span>
                    <span className="text-gray-800">{dish.name}</span>
                  </div>
                  <span className="text-gray-500">{dish.orders} Orders</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
