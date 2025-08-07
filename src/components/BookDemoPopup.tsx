// src/components/BookDemoPopup.tsx
import React from "react";
import { motion } from "framer-motion";

interface BookDemoPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const BookDemoPopup: React.FC<BookDemoPopupProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 relative"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>

        <h2 className="text-2xl font-bold text-gray-900 mb-4">Book a Demo</h2>
        <p className="text-gray-600 mb-6">
          Get in touch with us to schedule a personalized demo for your
          restaurant.
        </p>

        {/* Contact Info */}
        <div className="space-y-3 text-gray-800">
          <div>
            <span className="font-medium">Phone:</span> +91 9518769620
          </div>
          <div>
            <span className="font-medium">Email:</span> admin@willovate.in
          </div>
          <div>
            <span className="font-medium">Address:</span> Nagpur, Maharashtra,
            India
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default BookDemoPopup;
