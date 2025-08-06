import React from "react";
import { motion } from "framer-motion";
import { FaUtensils } from "react-icons/fa";

const Loader = () => {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm">
      <motion.div
        className="relative w-20 h-20 border-[6px] border-yellow-400 border-t-transparent rounded-full shadow-xl flex items-center justify-center"
        initial={{ rotate: 0 }}
        animate={{ rotate: 360 }}
        transition={{ ease: "linear", duration: 0.7, repeat: Infinity }}
      >
        <motion.div
          className="absolute text-white text-2xl"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 0.8, repeat: Infinity }}
        >
          <FaUtensils />
        </motion.div>
        <span className="sr-only">Loading...</span>
      </motion.div>
    </div>
  );
};

export default Loader;
