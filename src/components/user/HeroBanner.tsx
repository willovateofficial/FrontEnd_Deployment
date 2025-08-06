import React, { useEffect, useState } from "react";
import axios from "axios";
import { baseUrl } from "../../config";

const baseURL = baseUrl;
const API_URL = `${baseURL}/api/business`;

const HeroBanner = () => {
  const [business, setBusiness] = useState<any>(null);

  useEffect(() => {
    const fetchBusiness = async () => {
      const id = localStorage.getItem("businessId"); // Make sure key matches your storage
      if (id) {
        try {
          const res = await axios.get(`${API_URL}/${id}`);
          setBusiness(res.data);
        } catch (error) {
          console.error("Error fetching banner data:", error);
        }
      }
    };

    fetchBusiness();
  }, []);

  // Get fallback from localStorage for name and tagline
  const fallbackName = localStorage.getItem("business_name") || "";
  const fallbackTagline = localStorage.getItem("business_tagline") || "";

  return (
    <div
      className="text-white rounded-xl p-4 mx-4 mt-4 md:mt-6 md:mx-8 md:p-6 opacity-70 shadow-lg flex flex-col items-center justify-center text-center"
      style={{ backgroundColor: "black", backdropFilter: "blur(10px)" }}
    >
      <h2 className="text-white text-xl md:text-5xl font-bold leading-snug items-center justify-center text-center">
        {business?.name || fallbackName}
        <br />
      </h2>

      <p className="text-sm md:text-base mt-2">
        {business?.tagline || fallbackTagline}
      </p>
    </div>
  );
};

export default HeroBanner;
