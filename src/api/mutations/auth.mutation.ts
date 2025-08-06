import { axiosInstance } from "../../lib/axios";

export const loginFn = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  const response = await axiosInstance.post("api/auth/login", {
    email,
    password,
  });
  return response.data; // expected: { token, user, ... }
};

export const registerFn = async (payload: {
  name: string;
  email: string;
  business_name: string;
  business_type: string;
  role: string;
  phone: string;
  address: string;
  password: string;
}) => {
  const response = await axiosInstance.post("api/auth/register", payload);

  return response.data;
};
