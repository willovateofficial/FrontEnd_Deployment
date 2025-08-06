import React from "react";
import { motion } from "framer-motion";
import {
  FaClock,
  FaQrcode,
  FaChartLine,
  FaUtensils,
  FaMoneyBillWave,
  FaMobileAlt,
} from "react-icons/fa";
import { FiAward } from "react-icons/fi";
import { Link } from "react-router-dom";

const RestaurantBenefits = () => {
  // Timeline Data
  const processSteps = [
    {
      title: "Digital Ordering",
      description: "Guests browse your menu digitally via QR codes",
      icon: <FaQrcode className="text-amber-500" />,
      stat: "80% faster ordering",
    },
    {
      title: "Kitchen Sync",
      description: "Orders reach kitchen in real-time",
      icon: <FaUtensils className="text-orange-500" />,
      stat: "0 communication errors",
    },
    {
      title: "Automated Billing",
      description: "Seamless payment integration",
      icon: <FaMoneyBillWave className="text-red-500" />,
      stat: "2.5x faster checkout",
    },
    {
      title: "Customer Insights",
      description: "Data-driven menu optimization",
      icon: <FaChartLine className="text-amber-600" />,
      stat: "22% higher spend",
    },
  ];

  // Comparison Data
  const comparisonData = {
    before: [
      "15+ min wait times",
      "8-12% order errors",
      "Limited customer data",
      "Manual inventory tracking",
    ],
    after: [
      "Under 5 min service time",
      "Near-zero order errors",
      "Rich customer analytics",
      "Automated inventory",
    ],
  };

  // Magazine Feature Data
  const magazineFeatures = [
    {
      title: "Dynamic Pricing",
      description:
        "Automatically adjust specials based on inventory and demand",
      borderColor: "border-amber-500",
    },
    {
      title: "Loyalty Integration",
      description: "Seamless rewards program increases repeat visits by 40%",
      borderColor: "border-orange-500",
    },
    {
      title: "Kitchen Display",
      description: "Prioritize orders automatically during rush hours",
      borderColor: "border-red-500",
    },
  ];

  return (
    <div className="bg-white overflow-hidden">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-amber-50 to-orange-50 pt-28 pb-20">
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <div className="absolute top-20 -left-20 w-64 h-64 rounded-full bg-amber-300 blur-[100px]"></div>
          <div className="absolute bottom-10 -right-20 w-72 h-72 rounded-full bg-orange-300 blur-[120px]"></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <span className="inline-block px-4 py-1.5 mb-5 text-xs font-medium tracking-wider text-amber-700 bg-amber-100 rounded-full">
              RESTAURANT REVOLUTION
            </span>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-5 leading-tight">
              <span className="bg-gradient-to-r from-amber-500 to-orange-600 bg-clip-text text-transparent">
                The Future of Dining Experience
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Transform your restaurant operations with our all-in-one digital
              platform trusted by 500+ establishments worldwide
            </p>
          </motion.div>

          {/* Timeline Process */}
          <div className="mt-24">
            <div className="hidden md:flex justify-between relative">
              <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-amber-200 to-transparent z-0"></div>

              {processSteps.map((step, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: i * 0.15 }}
                  viewport={{ once: true }}
                  className="relative z-10 text-center w-64"
                >
                  <div className="mx-auto mb-6 w-20 h-20 rounded-full bg-white border-2 border-amber-100 flex items-center justify-center shadow-sm hover:shadow-md transition-all">
                    <div className="text-2xl">{step.icon}</div>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 mb-3">{step.description}</p>
                  <span className="inline-block px-3 py-1 text-sm font-medium rounded-full bg-amber-100 text-amber-800">
                    {step.stat}
                  </span>
                </motion.div>
              ))}
            </div>

            {/* Mobile Timeline */}
            <div className="md:hidden space-y-12 mt-12">
              {processSteps.map((step, i) => (
                <div key={i} className="flex items-start gap-6">
                  <div className="flex-shrink-0 mt-1 w-12 h-12 rounded-full bg-white border-2 border-amber-100 flex items-center justify-center shadow-xs">
                    <div className="text-xl">{step.icon}</div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {step.title}
                    </h3>
                    <p className="text-gray-600 mb-2">{step.description}</p>
                    <span className="inline-block px-2 py-0.5 text-xs font-medium rounded-full bg-amber-100 text-amber-800">
                      {step.stat}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Traditional vs. <span className="text-amber-600">Digital</span>{" "}
              Experience
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              See the measurable impact our solution makes across key
              operational areas
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all"
            >
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-red-50">
                  <FaClock className="text-2xl text-red-500" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">
                  Traditional Service
                </h3>
              </div>
              <ul className="space-y-3">
                {comparisonData.before.map((item, i) => (
                  <li
                    key={i}
                    className="flex items-start py-2 border-b border-gray-100 last:border-0"
                  >
                    <span className="flex-shrink-0 mt-1 mr-3 text-red-500">
                      ✗
                    </span>
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="bg-white p-8 rounded-xl shadow-md border border-amber-100 relative overflow-hidden hover:shadow-lg transition-all"
            >
              <div className="absolute top-0 right-0 px-4 py-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-medium rounded-bl-lg">
                OUR SOLUTION
              </div>
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-amber-50">
                  <FaMobileAlt className="text-2xl text-amber-500" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">
                  Digital Experience
                </h3>
              </div>
              <ul className="space-y-3">
                {comparisonData.after.map((item, i) => (
                  <li
                    key={i}
                    className="flex items-start py-2 border-b border-amber-50 last:border-0"
                  >
                    <span className="flex-shrink-0 mt-1 mr-3 text-green-500">
                      ✓
                    </span>
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Magazine Layout Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row gap-12">
            {/* Main Feature */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="md:w-2/3"
            >
              <div className="relative rounded-xl overflow-hidden shadow-xl h-96 bg-gradient-to-br from-amber-500 to-orange-600 flex items-end p-8 text-white">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1470&auto=format&fit=crop')] bg-cover bg-center opacity-20"></div>
                <div className="relative z-10">
                  <span className="inline-block px-3 py-1 mb-4 bg-white/20 backdrop-blur-sm rounded-full text-sm">
                    FLAGSHIP FEATURE
                  </span>
                  <h2 className="text-3xl font-bold mb-4">
                    Intelligent Menu Recommendations
                  </h2>
                  <p className="max-w-lg">
                    Our Product analyzes ordering patterns to suggest menu
                    optimizations that increase average order value by 22%.
                  </p>
                  <Link to="/how-it-works">
                    <button className="mt-6 px-6 py-2 bg-white text-amber-600 font-medium rounded-lg hover:bg-gray-50 transition-colors">
                      Learn More
                    </button>
                  </Link>
                </div>
              </div>
            </motion.div>

            {/* Side Features */}
            <div className="md:w-1/3 space-y-6">
              {magazineFeatures.map((feature, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                  viewport={{ once: true }}
                  className={`border-l-4 ${feature.borderColor} pl-6 py-4 hover:bg-gray-50 rounded-r-lg transition-colors`}
                >
                  <h3 className="text-xl font-semibold mb-2 text-gray-900">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">{feature.description}</p>
                </motion.div>
              ))}

              {/* Award Badge */}
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                viewport={{ once: true }}
                className="mt-8 p-6 bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-200 text-center"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 mx-auto mb-4 rounded-full bg-amber-100 text-amber-600">
                  <FiAward className="text-xl" />
                </div>
                <h4 className="font-medium text-gray-900 mb-1">
                  Award-Winning Technology
                </h4>
                <p className="text-sm text-gray-600">
                  2023 Hospitality Innovation Award
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-br from-gray-900 to-gray-800 text-white">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="p-6"
            >
              <div className="text-4xl font-bold text-amber-400 mb-2">30%</div>
              <div className="text-sm text-gray-300 uppercase tracking-wider">
                Labor Cost Reduction
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="p-6"
            >
              <div className="text-4xl font-bold text-orange-400 mb-2">40%</div>
              <div className="text-sm text-gray-300 uppercase tracking-wider">
                Faster Service
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="p-6"
            >
              <div className="text-4xl font-bold text-red-400 mb-2">4.8/5</div>
              <div className="text-sm text-gray-300 uppercase tracking-wider">
                Customer Rating
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              className="p-6"
            >
              <div className="text-4xl font-bold text-amber-300 mb-2">500+</div>
              <div className="text-sm text-gray-300 uppercase tracking-wider">
                Happy Restaurants
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default RestaurantBenefits;
