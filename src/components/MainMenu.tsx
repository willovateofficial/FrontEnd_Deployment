import React from "react";
import { useNavigate } from "react-router-dom";
import {
  FaClipboardList,
  FaQrcode,
  FaUtensils,
  FaUsers,
  FaTags,
  FaBoxes,
  FaStore,
  FaTachometerAlt,
  FaPlusCircle,
} from "react-icons/fa";
import { motion } from "framer-motion";
import Navbar from "./Navbar";

const features = [
  {
    name: "Dashboard",
    icon: <FaTachometerAlt />,
    path: "/dashboard",
    color: "bg-gradient-to-r from-orange-500 to-amber-500",
    desc: "Real-time business analytics",
  },
  {
    name: "Restaurant Setup",
    icon: <FaPlusCircle />,
    path: "/create-resto",
    color: "bg-gradient-to-r from-amber-500 to-yellow-500",
    desc: "Configure your restaurant profile",
  },
  {
    name: "Order Management",
    icon: <FaClipboardList />,
    path: "/order-list",
    color: "bg-gradient-to-r from-red-500 to-orange-500",
    desc: "Process and track customer orders",
  },
  {
    name: "Digital Menu",
    icon: <FaQrcode />,
    path: "/barcode",
    color: "bg-gradient-to-r from-orange-600 to-red-500",
    desc: "Create and manage QR code menus",
  },
  {
    name: "Menu Configuration",
    icon: <FaUtensils />,
    path: "/admin-menu-list",
    color: "bg-gradient-to-r from-yellow-500 to-amber-500",
    desc: "Setup your food items and categories",
  },
  {
    name: "Customer Database",
    icon: <FaUsers />,
    path: "/customer-list",
    color: "bg-gradient-to-r from-amber-600 to-orange-500",
    desc: "Manage your customer information",
  },
  {
    name: "Promotions",
    icon: <FaTags />,
    path: "/add-coupon",
    color: "bg-gradient-to-r from-orange-500 to-pink-500",
    desc: "Create discount offers and coupons",
  },
  {
    name: "Inventory",
    icon: <FaBoxes />,
    path: "/inventory",
    color: "bg-gradient-to-r from-amber-400 to-orange-500",
    desc: "Track stock and manage supplies",
  },
  {
    name: "Restaurant Profile",
    icon: <FaStore />,
    path: "/restaurant",
    color: "bg-gradient-to-r from-orange-500 to-red-400",
    desc: "Manage your restaurant details",
  },
];

const MainMenu = () => {
  const navigate = useNavigate();

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-white p-4 md:p-6 flex flex-col items-center -mt-4 -mb-10">
        {/* Hero Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-6xl text-center mb-8"
        >
          <div className="inline-flex items-center justify-center px-4 py-2 mb-1 rounded-full bg-white shadow-xs border border-orange-100">
            <span className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent text-lg font-medium">
              RESTAURANT MANAGEMENT
            </span>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            All the tools you need to manage your restaurant efficiently
          </p>
        </motion.div>

        {/* Main Features Grid */}
        <div className="w-full max-w-7xl">
          <div className="bg-white rounded-xl shadow-sm p-4 border border-orange-200">
            <h3 className="text-3xl font-semibold text-gray-900 mb-3 pl-2 border-l-4 border-orange-500">
              Management Tools
            </h3>

            {/* Feature Groups - Side by Side on desktop, stacked on mobile */}
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Operations Group - Left Side */}
              <div className="flex-1">
                <h4 className="text-2xl font-medium text-gray-700 mb-2 pl-2 text-orange-600">
                  Operations
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {features.slice(0, 6).map((feature, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ y: -3 }}
                      onClick={() => navigate(feature.path)}
                      className={`flex items-center p-5 rounded-lg cursor-pointer bg-gradient-to-r from-orange-100 to-amber-200 hover:from-orange-100 hover:to-amber-400 transition-colors border-l-3 ${
                        feature.color.split(" ")[0]
                      } border-opacity-70 h-24`}
                    >
                      <div
                        className={`w-12 h-12 rounded-lg ${feature.color} text-white flex items-center justify-center mr-4 text-lg`}
                      >
                        {feature.icon}
                      </div>
                      <div>
                        <h5 className="font-semibold text-gray-900 text-xl">
                          {feature.name}
                        </h5>
                        <p className="text-sm text-gray-600 mt-1">
                          {feature.desc}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Configuration Group - Right Side */}
              <div className="flex-1">
                <h4 className="text-2xl font-medium text-gray-700 mb-2 pl-2 text-orange-600">
                  Configuration
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {features.slice(6).map((feature, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ y: -3 }}
                      onClick={() => navigate(feature.path)}
                      className={`flex items-center p-5 rounded-lg cursor-pointer bg-gradient-to-r from-orange-100 to-amber-200 hover:from-orange-100 hover:to-amber-400 transition-colors border-l-3 ${
                        feature.color.split(" ")[0]
                      } border-opacity-70 h-24`}
                    >
                      <div
                        className={`w-12 h-12 rounded-lg ${feature.color} text-white flex items-center justify-center mr-4 text-lg`}
                      >
                        {feature.icon}
                      </div>
                      <div>
                        <h5 className="font-semibold text-gray-900 text-xl">
                          {feature.name}
                        </h5>
                        <p className="text-sm text-gray-600 mt-1">
                          {feature.desc}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MainMenu;
