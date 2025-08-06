import axios from "axios";

export const fetchOrdersData = async (month?: string) => {
  const res = await axios.get("/api/orders", {
    params: { month },
  });
  return res.data;
};

export const fetchCustomersData = async () => {
  const res = await axios.get("/api/customers");
  return res.data;
};

export const fetchRatings = async () => {
  const res = await axios.get("/api/ratings");
  return res.data;
};

export const fetchTopMenuItems = async () => {
  const res = await axios.get("/api/top-dishes");
  return res.data;
};
