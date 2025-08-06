import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import HeroBanner from "./HeroBanner";
import PopularCategories from "./PopularCategories";
import homeBannerImg from "../../assets/restrobg.png"; // Ensure this path is correct and image is high-res

const Home = () => {
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const businessId = params.get("businessId");
    const table = params.get("table");

    if (businessId && table) {
      const info = `${businessId}/table-${table}`;
      sessionStorage.setItem("restaurantInfo", info);
      console.log("✅ restaurantInfo set to:", info);
    }
  }, [location.search]);

  return (
    <div className="relative min-h-screen -mt-4 -mb-10">
      <div className="absolute inset-0 z-0">
        <img
          src={homeBannerImg}
          alt="Background"
          className="w-full h-full object-cover"
        />
        {/* Increased opacity slightly for better text contrast */}
        <div className="absolute inset-0 bg-black opacity-60"></div>
      </div>

      <div className="relative z-10 space-y-8 p-4 md:p-6">
        <HeroBanner />
        <PopularCategories />
      </div>
    </div>
  );
};

export default Home;