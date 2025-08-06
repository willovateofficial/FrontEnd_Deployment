import axios from "axios";
import { baseUrl } from "../config";

export interface DashboardData {
  orders: { date: string; count: number }[];
  totalIncome: number;
  totalOrders: number;
  topDishes: { name: string; orders: number }[];
}

export const fetchDashboardData = async (
  month: string,
  dateRange: string,
  day?: number
): Promise<DashboardData> => {
  const businessId = localStorage.getItem("businessId");

  if (!businessId) throw new Error("Missing businessId in localStorage");

  const response = await axios.get(`${baseUrl}/api/dashboard`, {
    params: { businessId, month, dateRange, day },
  });

  const data = response.data;

  return {
    orders: data.orders ?? [],
    totalIncome: data.totalIncome ?? 0,
    totalOrders: data.totalOrders ?? 0,
    topDishes: data.topDishes ?? [],
  };
};
