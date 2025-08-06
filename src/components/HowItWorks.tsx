import React from "react";
import { motion } from "framer-motion";
import { FaChartLine, FaUsers, FaClock } from "react-icons/fa";
import {
  RiRestaurantFill,
  RiSmartphoneLine,
  RiBankCardLine,
} from "react-icons/ri";
import { useNavigate } from "react-router-dom";

const steps = [
  {
    icon: <RiRestaurantFill className="text-2xl" />,
    title: "Place QR Code",
    description:
      "Display your restaurant's QR code for seamless customer access",
    stats: "95% customer scan rate",
  },
  {
    icon: <RiSmartphoneLine className="text-2xl" />,
    title: "Scan & Order",
    description: "Customers browse menu and order directly from their devices",
    stats: "40% faster ordering",
  },
  {
    icon: <RiBankCardLine className="text-2xl" />,
    title: "Instant Payment",
    description: "Secure, instant payments with real-time order confirmation",
    stats: "99.9% payment success",
  },
];

const benefits = [
  {
    icon: <FaChartLine className="text-xl" />,
    title: "Real-time Analytics",
    description: "Track orders, revenue, and customer preferences in real-time",
  },
  {
    icon: <FaUsers className="text-xl" />,
    title: "Customer Engagement",
    description:
      "Build loyalty with personalized offers and feedback collection",
  },
  {
    icon: <FaClock className="text-xl" />,
    title: "Time Savings",
    description: "Reduce staff workload by 30% with automated ordering",
  },
];

const HowItWorks = () => {
  const navigate = useNavigate();
  return (
    <section className="relative py-20 px-6 sm:px-12 bg-gradient-to-b from-white to-amber-50 overflow-hidden -mt-4 -mb-10">
      {/* Animated background elements */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.1 }}
        transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
        className="absolute top-0 left-0 w-full h-full pointer-events-none"
      >
        <div className="absolute top-20 left-10 w-40 h-40 rounded-full bg-amber-300 blur-[100px]"></div>
        <div className="absolute bottom-10 right-20 w-60 h-60 rounded-full bg-orange-300 blur-[120px]"></div>
      </motion.div>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="relative max-w-4xl mx-auto text-center mb-16"
      >
        <motion.span
          whileHover={{ scale: 1.05 }}
          className="inline-block px-4 py-1 mb-4 text-xs font-semibold tracking-wider text-amber-700 uppercase bg-amber-100 rounded-full"
        >
          Digital Transformation
        </motion.span>
        <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
          <span className="bg-gradient-to-r from-amber-500 to-orange-600 bg-clip-text text-transparent">
            Revolutionize Your Service
          </span>
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Our cutting-edge platform combines simplicity with powerful features
          to elevate both customer experience and operational efficiency
        </p>
      </motion.div>

      {/* Process Steps - Circular Design */}
      <div className="relative max-w-6xl mx-auto mb-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              viewport={{ once: true }}
              className="flex flex-col items-center"
            >
              {/* Animated circle */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="relative w-48 h-48 mb-6 rounded-full bg-white shadow-lg border-8 border-amber-50 flex items-center justify-center"
              >
                {/* Gradient circle */}
                <div
                  className={`absolute inset-0 rounded-full opacity-20 bg-gradient-to-br ${
                    index === 0
                      ? "from-amber-300 to-amber-400"
                      : index === 1
                      ? "from-orange-300 to-orange-400"
                      : "from-red-300 to-red-400"
                  }`}
                ></div>

                {/* Icon */}
                <div
                  className={`w-20 h-20 rounded-full flex items-center justify-center ${
                    index === 0
                      ? "bg-amber-100 text-amber-600"
                      : index === 1
                      ? "bg-orange-100 text-orange-600"
                      : "bg-red-100 text-red-600"
                  }`}
                >
                  {step.icon}
                </div>

                {/* Step number */}
                <div
                  className={`absolute -top-4 -right-4 w-12 h-12 rounded-full flex items-center justify-center text-white font-bold shadow-md ${
                    index === 0
                      ? "bg-amber-500"
                      : index === 1
                      ? "bg-orange-500"
                      : "bg-red-500"
                  }`}
                >
                  {index + 1}
                </div>
              </motion.div>

              {/* Content */}
              <div className="text-center">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {step.title}
                </h3>
                <p className="text-gray-600 mb-3">{step.description}</p>
                <span
                  className={`text-sm font-medium ${
                    index === 0
                      ? "text-amber-600"
                      : index === 1
                      ? "text-orange-600"
                      : "text-red-600"
                  }`}
                >
                  {step.stats}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Benefits Section - Card Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="relative max-w-6xl mx-auto bg-white rounded-3xl p-8 sm:p-12 shadow-sm border border-gray-100"
      >
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold text-gray-900 mb-4">
            Key Business Benefits
          </h3>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover how our solution drives measurable results for your
            restaurant
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
              className="bg-gradient-to-b from-white to-gray-50 p-6 rounded-xl border border-gray-200 hover:border-amber-300 transition-all"
            >
              <div
                className={`w-12 h-12 mb-4 rounded-lg flex items-center justify-center ${
                  index === 0
                    ? "bg-amber-100 text-amber-600"
                    : index === 1
                    ? "bg-orange-100 text-orange-600"
                    : "bg-red-100 text-red-600"
                }`}
              >
                {benefit.icon}
              </div>
              <h4 className="text-lg font-bold text-gray-900 mb-2">
                {benefit.title}
              </h4>
              <p className="text-gray-600">{benefit.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Animated CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/plan-section")}
            className="px-8 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all"
          >
            Get Started Now
          </motion.button>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HowItWorks;
