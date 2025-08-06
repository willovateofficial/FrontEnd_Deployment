import React, { useEffect, useState } from "react";
import { useCategories } from "../../hooks/useCategory";
import { useNavigate, useLocation } from "react-router-dom";
import defaultImage from "../../assets/Aalu Mutter.jpeg";
import axios from "axios";
import RegisterPage from "./RegisterPage";
import CusLogin from "./CusLogin";
import { motion, AnimatePresence } from "framer-motion";
import { baseUrl } from "../../config"; // Adjust the import path as necessary

const baseURL = baseUrl;

const PopularCategories = () => {
  const navigate = useNavigate();
  const location = useLocation(); // ✅ Access navigation state
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  const businessId = localStorage.getItem("businessId");

  useEffect(() => {
    const fetchCustomerLogo = async () => {
      if (!businessId) return;

      try {
        const res = await axios.get(
          `${baseURL}/api/business/${businessId}`
        );
        const logoUrl = res.data?.logoUrl;
        if (logoUrl) {
          localStorage.setItem("business_logo", logoUrl);
        }
      } catch (err) {
        console.error("Failed to fetch customer logo", err);
      }
    };

    fetchCustomerLogo();

    const role = localStorage.getItem("role");
    const customerToken = localStorage.getItem("customerToken");

    if (
      role !== "owner" &&
      role !== "manager" &&
      role !== "staff" &&
      !customerToken
    ) {
      setShowLogin(true);
    }

    // ✅ If redirected after registration, show login popup
    if (location.state?.showLogin) {
      setShowLogin(true);
      navigate(location.pathname, { replace: true }); // remove showLogin from state
    }

    // ✅ Listen for logout
    const handleCustomerLoggedOut = () => {
      setShowLogin(true);
    };
    const handleOpenLogin = () => setShowLogin(true);

    window.addEventListener("customer-logged-out", handleCustomerLoggedOut);
    window.addEventListener("open-customer-login", handleOpenLogin);

    return () => {
      window.removeEventListener(
        "customer-logged-out",
        handleCustomerLoggedOut
      );
      window.removeEventListener("open-customer-login", handleOpenLogin);
    };
  }, [location, navigate]);

  const { data: categories = [], isLoading } = useCategories(businessId);

  const showTopRightMessage =
    !localStorage.getItem("customerToken") &&
    !["owner", "manager", "staff"].includes(localStorage.getItem("role") || "");

  if (isLoading) return <div className="px-4">Loading...</div>;

  return (
    <section className="px-4 md:px-8 mt-6 relative">
      {showTopRightMessage && (
        <div
          className="fixed top-16 right-2 z-50 bg-blue-100 text-black 
               px-2.5 py-1 rounded shadow-md text-xs 
               sm:text-sm sm:px-3 sm:py-1.5 sm:right-4 sm:top-20">
          You are not logged in. You can refresh the page to login or signup.
        </div>
      )}
      {/* Login Popup */}
      <AnimatePresence>
        {showLogin && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center"
          >
            <CusLogin
              onRegisterClick={() => {
                setShowLogin(false);
                setShowRegister(true);
              }}
              onClose={() => setShowLogin(false)}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Register Popup */}
      <AnimatePresence>
        {showRegister && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center"
          >
            <RegisterPage onClose={() => setShowRegister(false)} />
          </motion.div>
        )}
      </AnimatePresence>

      <h3 className="text-lg md:text-2xl font-semibold mb-4 text-white">
        Popular Categories
      </h3>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-9 mb-8">
        {categories.map((category) => {
          const imgSrc = category.imageUrl || defaultImage;

          return (
            <button
              key={category.name}
              onClick={() =>
                navigate(`/restaurant/${encodeURIComponent(category.name)}`)
              }
              className="bg-white rounded-xl shadow-md w-full flex flex-col overflow-hidden"
            >
              <div className="w-full aspect-[4/3] overflow-hidden">
                <img
                  src={imgSrc}
                  alt={category.name}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                />
              </div>
              <div className="px-2 py-2 flex-1 flex items-center justify-center">
                <span className="text-center text-sm font-semibold text-[#000C2D] leading-tight">
                  {category.name}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
};

export default PopularCategories;
