import { useRef } from "react";
import { motion } from "framer-motion";
import { FaArrowLeft } from "react-icons/fa";

export default function DemoVideoPage() {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const YOUTUBE_VIDEO_ID = "mdw1PX9X4m0";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 py-6 px-4 sm:px-6 lg:px-8 -mt-4 -mb-10"
    >
      <div className="max-w-7xl mx-auto">
        {/* Back button */}
        <motion.button
          whileHover={{ x: -3 }}
          onClick={() => window.history.back()}
          className="flex items-center gap-2 text-amber-600 font-medium mb-4"
        >
          <FaArrowLeft />
          <span>Back to Home</span>
        </motion.button>

        {/* YouTube Embed Section */}
        <div className="bg-white rounded-xl shadow-xl overflow-hidden">
          <div className="relative w-full pt-[56.25%] bg-black">
            {" "}
            {/* 16:9 ratio */}
            <iframe
              ref={iframeRef}
              className="absolute top-0 left-0 w-full h-full"
              src={`https://www.youtube.com/embed/${YOUTUBE_VIDEO_ID}?enablejsapi=1&rel=0&modestbranding=1`}
              title="WillovateResto Demo"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
            {/* Overlay Play Button */}
          </div>

          {/* Video Description */}
          <div className="p-6 md:p-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              WillovateResto Platform Demo
            </h2>
            <p className="text-gray-600 mb-6">
              Watch how our platform can transform your restaurant operations
              with these key features:
            </p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                "Digital Menu Management",
                "Online Order System",
                "Real-time Analytics",
                "Staff Management",
                "Customer Engagement Tools",
                "Payment Processing",
              ].map((feature, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="text-amber-500 mt-0.5">✓</span>
                  <span className="text-gray-700">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-12 text-center">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">
            Ready to transform your restaurant?
          </h3>
          <a
            href="/plan-section"
            className="inline-block bg-gradient-to-r from-amber-500 to-orange-600 text-white font-medium py-3 px-8 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Get Started Today
          </a>
        </div>
      </div>
    </motion.div>
  );
}
