import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  FaMobileAlt,
  FaQrcode,
  FaChartLine,
  FaPalette,
  FaCreditCard,
  FaLaptop,
  FaArrowRight,
  FaArrowLeft,
  FaCheck,
  FaLightbulb,
  FaShieldAlt,
  FaClock,
} from "react-icons/fa";
import BookDemoPopup from "./BookDemoPopup"; // Import the reusable popup component

const WhyChooseUs = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [showContactPopup, setShowContactPopup] = useState(false);

  const features = [
    {
      icon: <FaMobileAlt className="text-3xl" />,
      title: "One Click App",
      description:
        "Instant access with zero setup required for your staff and customers",
      benefits: [
        "70% faster onboarding",
        "No technical skills needed",
        "Works on any smartphone",
      ],
      stats: "95% adoption rate",
      color: "from-amber-500 to-amber-600",
    },
    {
      icon: <FaQrcode className="text-3xl" />,
      title: "QR Solution",
      description:
        "Contactless menu access that customers love and intuitively understand",
      benefits: [
        "25% faster table turnover",
        "Reduces menu printing costs",
        "Easy to update menus",
      ],
      stats: "3.8/5 customer rating",
      color: "from-orange-500 to-orange-600",
    },
    {
      icon: <FaChartLine className="text-3xl" />,
      title: "Dashboard Tracking",
      description:
        "Real-time analytics that help you make data-driven decisions instantly",
      benefits: [
        "Track sales in real-time",
        "Identify popular menu items",
        "Monitor staff performance",
      ],
      stats: "40% better decisions",
      color: "from-red-500 to-red-600",
    },
    {
      icon: <FaPalette className="text-3xl" />,
      title: "Custom Branding",
      description:
        "Fully personalized experience that matches your restaurant's unique identity",
      benefits: [
        "Your logo and colors",
        "Custom menu layouts",
        "Personalized notifications",
      ],
      stats: "2x brand recognition",
      color: "from-amber-400 to-amber-500",
    },
    {
      icon: <FaCreditCard className="text-3xl" />,
      title: "Payment Integration",
      description:
        "Secure, multi-platform payments that customers trust and prefer",
      benefits: [
        "All major payment methods",
        "Instant transaction records",
        "Fraud protection",
      ],
      stats: "99.9% success rate",
      color: "from-orange-400 to-orange-500",
    },
    {
      icon: <FaLaptop className="text-3xl" />,
      title: "Multi-Device Access",
      description:
        "Manage your restaurant from any device, anywhere with full control",
      benefits: [
        "Desktop, tablet & mobile",
        "Real-time sync across devices",
        "Role-based access control",
      ],
      stats: "100% accessibility",
      color: "from-red-400 to-red-500",
    },
  ];

  const nextFeature = () => {
    setActiveIndex((prev) => (prev === features.length - 1 ? 0 : prev + 1));
  };

  const prevFeature = () => {
    setActiveIndex((prev) => (prev === 0 ? features.length - 1 : prev - 1));
  };

  return (
    <section className="relative bg-white py-16 px-6 sm:px-12 lg:px-20 overflow-hidden">
      {/* Section Header */}
      <div className="max-w-6xl mx-auto text-center mb-12">
        <div className="inline-flex items-center px-4 py-2 mb-4 rounded-full bg-amber-50 border border-amber-100">
          <span className="bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent text-sm font-medium">
            THE WILLOVATERESTO EDGE
          </span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
          <span className="bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 bg-clip-text text-transparent">
            Why Top Restaurants Choose Us
          </span>
        </h2>
        <p className="text-gray-600 max-w-3xl mx-auto">
          Comprehensive solutions that streamline operations while enhancing
          customer experience
        </p>
      </div>

      {/* Interactive Feature Showcase */}
      <div className="max-w-5xl mx-auto relative h-[400px] mb-12">
        {/* Main Feature Display */}
        <motion.div
          key={activeIndex}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.5 }}
          className={`absolute inset-0 rounded-xl overflow-hidden bg-gradient-to-br ${features[activeIndex].color} text-white`}
        >
          <div className="absolute inset-0 flex flex-col lg:flex-row p-6">
            {/* Icon/Content Area */}
            <div className="w-full lg:w-1/2 h-1/2 lg:h-full flex flex-col justify-center p-4 lg:p-8">
              <div className="flex items-center mb-4">
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 mr-4">
                  {features[activeIndex].icon}
                </div>
                <h3 className="text-xl md:text-2xl font-bold">
                  {features[activeIndex].title}
                </h3>
              </div>
              <p className="mb-4 opacity-90">
                {features[activeIndex].description}
              </p>
              <div className="bg-white/20 px-3 py-2 rounded-lg inline-block text-sm">
                <span className="font-semibold">Key Stat:</span>{" "}
                {features[activeIndex].stats}
              </div>
            </div>

            {/* Benefits List */}
            <div className="w-full lg:w-1/2 h-1/2 lg:h-full flex flex-col justify-center p-4 lg:p-8">
              <h4 className="font-semibold mb-3 flex items-center">
                <FaLightbulb className="mr-2" /> Key Benefits
              </h4>
              <ul className="space-y-2">
                {features[activeIndex].benefits.map((benefit, i) => (
                  <li key={i} className="flex items-start">
                    <FaCheck className="mt-1 mr-2 text-white/80 flex-shrink-0" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>

        {/* Navigation Controls */}
        <button
          onClick={prevFeature}
          className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center hover:bg-gray-100 transition-colors"
          title="Previous Feature"
        >
          <FaArrowLeft className="text-gray-700 text-sm" />
        </button>
        <button
          onClick={nextFeature}
          className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center hover:bg-gray-100 transition-colors"
          title="Next Feature"
        >
          <FaArrowRight className="text-gray-700 text-sm" />
        </button>

        {/* Feature Indicators */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {features.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`w-2 h-2 rounded-full ${
                activeIndex === index ? "bg-white" : "bg-white/50"
              } transition-colors`}
              title="Switch to feature"
            />
          ))}
        </div>
      </div>

      {/* Additional Value Props */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <motion.div
          whileHover={{ y: -5 }}
          className="bg-gray-50 p-6 rounded-xl border border-gray-200"
        >
          <div className="flex items-center mb-3">
            <div className="bg-amber-100 p-2 rounded-lg mr-3">
              <FaClock className="text-amber-600" />
            </div>
            <h3 className="font-bold text-gray-900">Time Savings</h3>
          </div>
          <p className="text-gray-600 text-sm">
            Reduce staff workload by 30% with automated ordering and payment
            processes
          </p>
        </motion.div>

        <motion.div
          whileHover={{ y: -5 }}
          className="bg-gray-50 p-6 rounded-xl border border-gray-200"
        >
          <div className="flex items-center mb-3">
            <div className="bg-orange-100 p-2 rounded-lg mr-3">
              <FaShieldAlt className="text-orange-600" />
            </div>
            <h3 className="font-bold text-gray-900">Enterprise Security</h3>
          </div>
          <p className="text-gray-600 text-sm">
            Bank-level encryption protects all transactions and customer data
          </p>
        </motion.div>

        <motion.div
          whileHover={{ y: -5 }}
          className="bg-gray-50 p-6 rounded-xl border border-gray-200"
        >
          <div className="flex items-center mb-3">
            <div className="bg-red-100 p-2 rounded-lg mr-3">
              <FaLightbulb className="text-red-600" />
            </div>
            <h3 className="font-bold text-gray-900">Continuous Innovation</h3>
          </div>
          <p className="text-gray-600 text-sm">
            Regular updates with new features based on customer feedback
          </p>
        </motion.div>
      </div>

      {/* Testimonial + CTA */}
      <div className="max-w-6xl mx-auto bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-8 md:p-10 border border-amber-100">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-1/2">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 rounded-full bg-amber-500 flex items-center justify-center text-white font-bold mr-3">
                "
              </div>
              <h3 className="font-bold text-gray-900">What Our Clients Say</h3>
            </div>
            <p className="text-gray-700 italic mb-4">
              "WillovateResto transformed our operations completely. Our table
              turnover increased by 25% and customer complaints dropped to zero.
              The dashboard gives me real-time insights I never had before."
            </p>
            <div className="text-sm">
              <p className="font-semibold">Rajesh Mehta</p>
              <p className="text-gray-600">Owner, Spice Garden Restaurant</p>
            </div>
          </div>

          <div className="md:w-1/2 flex flex-col justify-center">
            <h3 className="font-bold text-gray-900 mb-3">
              Ready to Experience the Difference?
            </h3>
            <p className="text-gray-600 mb-5">
              Join 500+ restaurants revolutionizing their service with our
              platform
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                className="bg-gradient-to-r from-amber-500 to-orange-600 text-white font-medium py-2 px-6 rounded-lg shadow hover:shadow-md transition-all"
                onClick={() => setShowContactPopup(true)}
              >
                Request Demo
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Reusable Popup */}
      <BookDemoPopup
        isOpen={showContactPopup}
        onClose={() => setShowContactPopup(false)}
      />
    </section>
  );
};

export default WhyChooseUs;
