import { motion } from "framer-motion";
import {
  FaChartLine,
  FaMobileAlt,
  FaShieldAlt,
  FaSyncAlt,
} from "react-icons/fa";
import { GiHotMeal, GiSaucepan } from "react-icons/gi";
import { BsArrowRight, BsPlayFill } from "react-icons/bs";
import { Link } from "react-router-dom"; // Added import for Link

export default function Hero() {
  return (
    <section className="min-h-screen flex flex-col md:flex-row items-center justify-between w-full px-4 md:px-12 lg:px-24 bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 relative overflow-hidden -mt-8">
      {/* Animated Background Elements */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
        className="absolute inset-0 overflow-hidden z-0"
      >
        {/* Floating gradient circles */}
        <motion.div
          animate={{
            y: [0, -20, 0],
            x: [0, 15, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-20 left-10 w-60 h-60 rounded-full bg-gradient-to-r from-amber-200/30 to-orange-200/30 blur-3xl"
        ></motion.div>

        <motion.div
          animate={{
            y: [0, 30, 0],
            x: [0, -20, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
          className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-gradient-to-br from-orange-200/30 to-red-200/30 blur-3xl"
        ></motion.div>
      </motion.div>

      {/* Text Content */}
      <div className="relative z-10 w-full md:w-1/2 py-20 md:py-0">
        <div className="max-w-md mx-auto md:mx-0 md:ml-8 lg:ml-16">
          {/* Animated tag */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center px-4 py-2 mb-6 rounded-full bg-white shadow-sm border border-amber-100"
          >
            <span className="bg-gradient-to-r from-amber-500 to-orange-600 bg-clip-text text-transparent font-medium">
              Restaurant Technology Platform
            </span>
            <div className="ml-2 w-2 h-2 rounded-full bg-amber-400 animate-pulse"></div>
          </motion.div>

          {/* Animated headline */}
          <motion.h1
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6"
          >
            <span className="bg-gradient-to-r from-amber-500 via-orange-600 to-red-600 text-transparent bg-clip-text">
              Transform
            </span>{" "}
            Your Restaurant Business
          </motion.h1>

          {/* Animated description */}
          <motion.p
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="text-lg text-gray-700 mb-8 leading-relaxed"
          >
            WillovateResto combines{" "}
            <span className="font-semibold text-amber-600">
              cutting-edge technology
            </span>{" "}
            with powerful tools to help you manage, grow, and delight your
            customers.
          </motion.p>

          {/* Animated buttons */}
          {/* Animated buttons */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 mb-12"
          >
            <a
              href="plan-section" // direct jump without smooth scroll
              className="group relative overflow-hidden bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-medium py-3 px-8 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-2"
            >
              <span>Get Started</span>
              <BsArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
              <div className="absolute inset-0 bg-white/10 group-hover:bg-white/0 transition-all duration-500"></div>
            </a>

            <Link to="/demo">
              <button className="group relative overflow-hidden border border-amber-500 text-amber-600 hover:bg-amber-50 font-medium py-3 px-8 rounded-lg transition-all duration-300 flex items-center gap-2">
                <span>Watch Demo</span>
                <BsPlayFill className="transition-transform duration-300 group-hover:scale-110" />
                <div className="absolute inset-0 bg-amber-500/5 group-hover:bg-amber-500/0 transition-all duration-500"></div>
              </button>
            </Link>
          </motion.div>

          {/* Animated features */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.8 }}
            className="grid grid-cols-2 gap-4"
          >
            {[
              {
                icon: <FaChartLine className="text-amber-600" />,
                text: "Real-time Analytics",
              },
              {
                icon: <FaMobileAlt className="text-orange-500" />,
                text: "Mobile Friendly",
              },
              {
                icon: <FaShieldAlt className="text-red-500" />,
                text: "Secure Payments",
              },
              {
                icon: <FaSyncAlt className="text-amber-500" />,
                text: "Auto Updates",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -3 }}
                className="flex items-center gap-3 bg-white/80 backdrop-blur-sm p-3 rounded-xl border border-orange-100 shadow-sm hover:shadow-md transition-all"
              >
                <div className="text-xl">{feature.icon}</div>
                <span className="text-sm font-medium text-gray-700">
                  {feature.text}
                </span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Image Content */}
      <div className="relative z-10 w-full md:w-1/2 h-full flex items-center justify-center p-8 md:mb-0">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.7 }}
          className="relative w-full max-w-2xl"
        >
          {/* Main image with animated frame */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="relative rounded-3xl overflow-hidden shadow-2xl border-8 border-white"
          >
            <img
              src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80"
              alt="Restaurant management dashboard"
              className="w-full h-auto object-cover"
            />

            {/* Animated floating food icons */}
            <motion.div
              animate={{
                y: [0, -10, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute -bottom-6 -left-6 w-24 h-24 bg-white rounded-xl shadow-lg p-2 flex items-center justify-center"
            >
              <GiHotMeal className="text-3xl text-amber-600" />
            </motion.div>

            <motion.div
              animate={{
                y: [0, 10, 0],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.5,
              }}
              className="absolute -top-6 -right-6 w-20 h-20 bg-white rounded-xl shadow-lg p-2 flex items-center justify-center"
            >
              <GiSaucepan className="text-3xl text-orange-500" />
            </motion.div>
          </motion.div>

          {/* Animated floating cards */}
          <motion.div
            animate={{
              y: [0, -15, 0],
              rotate: [6, -2, 6],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute -bottom-10 left-10 bg-amber-100 text-amber-800 px-4 py-2 rounded-lg shadow-md"
          >
            <span className="font-medium">+85% Orders</span>
          </motion.div>

          <motion.div
            animate={{
              y: [0, 15, 0],
              rotate: [-6, 2, -6],
            }}
            transition={{
              duration: 7,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.3,
            }}
            className="absolute -top-10 right-10 bg-orange-100 text-orange-800 px-4 py-2 rounded-lg shadow-md"
          >
            <span className="font-medium">24/7 Support</span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
