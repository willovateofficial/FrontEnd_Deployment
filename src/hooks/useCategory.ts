import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { baseUrl } from "../config";

const baseURL = baseUrl;

export type CategoryCard = {
  id: number;
  name: string;
  imageUrl?: string;
  businessId: string;
};

export const useCategories = (businessId: string | null) => {
  return useQuery<CategoryCard[]>({
    queryKey: ["categories", businessId],
    queryFn: async () => {
      const token = localStorage.getItem("authToken");
      const response = await axios.get(
        `${baseURL}/api/categories?businessId=${businessId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    },
    enabled: !!businessId, // only fetch if businessId is present
  });
};
