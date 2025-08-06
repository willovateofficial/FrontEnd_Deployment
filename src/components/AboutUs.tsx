import React from "react";
import { FaUtensils, FaRocket, FaCogs } from "react-icons/fa";

const AboutUs: React.FC = () => {
  return (
    <div className="bg-gradient-to-br from-orange-50 to-white min-h-screen py-16 px-6 sm:px-10 lg:px-24 -mt-4 -mb-10">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-orange-600 drop-shadow-sm mb-4">
            About Willovate Resto
          </h1>
          <p className="text-gray-700 text-lg sm:text-xl max-w-4xl mx-auto leading-relaxed">
            The smart way to run your restaurant—simplified, digitized, and
            designed to grow with you.
          </p>
        </div>

        {/* What Is It */}
        <div className="relative bg-white rounded-2xl p-8 sm:p-12 shadow-xl mb-16">
          <div className="absolute top-[-25px] left-6 bg-orange-500 text-white rounded-full p-3 shadow-lg">
            <FaUtensils className="text-xl" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4 mt-3">
            What is Willovate Resto?
          </h2>
          <p className="text-gray-600 leading-relaxed text-base sm:text-lg">
            Willovate Resto is an intuitive restaurant management platform that
            empowers food businesses to digitize operations—menu management, QR
            ordering, order tracking, billing, and customer updates—all from one
            place. Built to be scalable and user-friendly, it fits perfectly
            whether you're running a food truck or a multi-location restaurant
            chain.
          </p>
        </div>

        {/* Features */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-10">
            What Can You Do?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              "Create & manage restaurant profiles",
              "Upload menus with categories & pricing",
              "Enable QR-based digital menu access",
              "Process and track orders seamlessly",
              "View subscription plan status & expiry",
              "Push announcements & offers to diners",
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-md p-6 border-l-4 border-orange-500 hover:scale-105 hover:shadow-lg transition duration-300 ease-in-out"
              >
                <p className="text-gray-800 font-medium text-base sm:text-lg">
                  {feature}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Origin */}
        <div className="relative bg-white rounded-2xl p-8 sm:p-8 shadow-xl mb-16">
          <div className="absolute top-[-25px] left-6 bg-orange-500 text-white rounded-full p-3 shadow-lg">
            <FaRocket className="text-xl" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4 mt-3">
            How It Started
          </h2>
          <p className="text-gray-600 text-base sm:text-lg leading-relaxed">
            Willovate Resto began with a vision to help local restaurants
            digitize effortlessly. After seeing small food businesses struggle
            during the pandemic, our team built a platform that removes the tech
            barrier and gives full control to owners—from menus to customer
            communication—all with simplicity and impact.
          </p>
        </div>

        {/* Vision */}
        <div className="bg-orange-100 rounded-2xl p-10 sm:p-8 text-center shadow-xl">
          <div className="inline-block bg-white text-orange-500 p-3 rounded-full shadow mb-4">
            <FaCogs className="text-2xl" />
          </div>
          <h3 className="text-2xl sm:text-3xl font-bold text-orange-700 mb-3">
            Our Vision
          </h3>
          <p className="text-gray-700 text-base sm:text-lg max-w-3xl mx-auto leading-relaxed">
            To become India's most trusted digital companion for restaurants by
            delivering accessible, powerful, and affordable restaurant tech.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
