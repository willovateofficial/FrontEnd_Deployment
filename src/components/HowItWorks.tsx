import React from "react";
import handscanner from "../assets/hand-scanner.png";
import placeorder from "../assets/PlaceOrdeer.png";
import receivepayment from "../assets/receive-payment.png";
import { motion } from "framer-motion";
import {
  FaQrcode,
  FaMobileAlt,
  FaMoneyBillWave,
  FaChartLine,
  FaUsers,
  FaClock,
} from "react-icons/fa";

const steps = [
  {
    image: handscanner,
    icon: <FaQrcode className="text-3xl text-amber-600" />,
    title: "Place QR Code",
    description:
      "Display your restaurant's QR code for seamless customer access",
    color: "from-amber-500 to-amber-600",
    stats: "95% customer scan rate",
  },
  {
    image: placeorder,
    icon: <FaMobileAlt className="text-3xl text-orange-500" />,
    title: "Scan & Order",
    description: "Customers browse menu and order directly from their devices",
    color: "from-orange-500 to-orange-600",
    stats: "40% faster ordering",
  },
  {
    image: receivepayment,
    icon: <FaMoneyBillWave className="text-3xl text-red-500" />,
    title: "Instant Payment",
    description: "Secure, instant payments with real-time order confirmation",
    color: "from-red-500 to-red-600",
    stats: "99.9% payment success",
  },
];

const benefits = [
  {
    icon: <FaChartLine className="text-2xl text-amber-600" />,
    title: "Real-time Analytics",
    description: "Track orders, revenue, and customer preferences in real-time",
  },
  {
    icon: <FaUsers className="text-2xl text-orange-500" />,
    title: "Customer Engagement",
    description:
      "Build loyalty with personalized offers and feedback collection",
  },
  {
    icon: <FaClock className="text-2xl text-red-500" />,
    title: "Time Savings",
    description: "Reduce staff workload by 30% with automated ordering",
  },
];

const HowItWorks = () => {
  return (
    <section
      id="how-it-works"
      className="relative py-24 px-6 sm:px-12 lg:px-24 bg-gradient-to-b from-white to-gray-50 overflow-hidden -mt-4 -mb-10 "
    >
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden z-0">
        <div className="absolute top-0 left-0 w-1/2 h-full bg-gradient-to-r from-amber-50/10 to-transparent"></div>
        <div className="absolute -bottom-40 -right-40 w-80 h-80 rounded-full bg-gradient-to-r from-orange-100/20 to-amber-100/20 blur-[100px]"></div>
      </div>

      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="relative z-10 max-w-7xl mx-auto mb-16 text-center"
      >
        <div className="inline-flex items-center justify-center px-4 py-2 mb-6 rounded-full bg-white/90 backdrop-blur-sm border border-amber-100 shadow-xs">
          <span className="bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent text-sm font-medium tracking-wider">
            DIGITAL TRANSFORMATION
          </span>
          <div className="ml-3 w-2 h-2 rounded-full bg-amber-500 animate-pulse"></div>
        </div>
        <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
          <span className="bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 bg-clip-text text-transparent">
            Revolutionize Your Service
          </span>
        </h2>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Our cutting-edge platform combines simplicity with powerful features
          to elevate both customer experience and operational efficiency
        </p>
      </motion.div>

      {/* Steps Grid */}
      <div className="relative z-10 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
        {steps.map((step, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.6,
              delay: index * 0.15,
            }}
            viewport={{ once: true, margin: "-100px" }}
            className="group relative bg-white rounded-2xl p-8 shadow-sm hover:shadow-md border border-gray-100 transition-all"
          >
            {/* Animated number indicator */}
            <motion.div
              whileHover={{ scale: 1.1 }}
              className={`absolute -top-5 left-1/2 transform -translate-x-1/2 w-10 h-10 rounded-full bg-gradient-to-br ${step.color} text-white font-bold flex items-center justify-center shadow-lg z-20`}
            >
              {index + 1}
            </motion.div>

            {/* Icon with gradient border */}
            <div
              className={`w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br ${step.color} p-1`}
            >
              <div className="w-full h-full bg-white rounded-xl flex items-center justify-center">
                {step.icon}
              </div>
            </div>

            {/* Content */}
            <div className="text-center">
              <h3 className="text-xl font-bold mb-3 text-gray-900 group-hover:text-amber-600 transition-colors">
                {step.title}
              </h3>
              <p className="text-gray-600 mb-4">{step.description}</p>
              <div className="text-sm font-medium text-amber-600 mb-6">
                {step.stats}
              </div>

              {/* Animated image */}
              <motion.div
                whileHover={{ scale: 1.03 }}
                className="w-full h-40 bg-gray-50 rounded-xl overflow-hidden border border-gray-200"
              >
                <img
                  src={step.image}
                  alt={step.title}
                  className="w-full h-full object-contain p-4"
                />
              </motion.div>
            </div>

            {/* Connecting line (except last item) */}
            {index < steps.length - 1 && (
              <div className="hidden md:block absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2 w-16 h-1 bg-gradient-to-r from-amber-100 to-orange-100"></div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Benefits Section */}
      <div className="relative z-10 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-3xl p-8 md:p-12 border border-amber-100"
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 -mb-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -5 }}
                className="bg-white p-6 rounded-xl shadow-xs border border-gray-100"
              >
                <div className="w-12 h-12 mb-4 rounded-lg bg-amber-50 flex items-center justify-center">
                  {benefit.icon}
                </div>
                <h4 className="text-lg font-bold text-gray-900 mb-2">
                  {benefit.title}
                </h4>
                <p className="text-gray-600">{benefit.description}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            viewport={{ once: true }}
            className="text-center mt-12"
            onClick={() =>
              document
                .getElementById("plan-section")
                ?.scrollIntoView({ behavior: "smooth" })
            }
          ></motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorks;
