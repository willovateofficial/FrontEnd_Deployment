import { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaArrowLeft, FaPlay } from "react-icons/fa";

export default function DemoVideoPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Handle video loading and playback
  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      const handleLoadedData = () => setIsLoading(false);
      const handleError = () => {
        console.error("Video loading error:", video.error);
        setError(
          "Failed to load video. Please check the file or try again later."
        );
      };
      video.addEventListener("loadeddata", handleLoadedData);
      video.addEventListener("error", handleError);

      return () => {
        video.removeEventListener("loadeddata", handleLoadedData);
        video.removeEventListener("error", handleError);
      };
    }
  }, []);

  // Toggle play/pause
  const handlePlayPause = () => {
    const video = videoRef.current;
    if (video) {
      if (isPlaying) {
        video.pause();
      } else {
        video.play().catch((err) => {
          console.error("Play error:", err);
          setError("Autoplay blocked. Please click to play.");
        });
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 py-12 px-4 sm:px-6 lg:px-8 -mt-4 -mb-10"
    >
      <div className="max-w-7xl mx-auto">
        {/* Back button */}
        <motion.button
          whileHover={{ x: -3 }}
          onClick={() => window.history.back()}
          className="flex items-center gap-2 text-amber-600 font-medium mb-8"
        >
          <FaArrowLeft />
          <span>Back to Home</span>
        </motion.button>

        {/* Video Player Section */}
        <div className="bg-white rounded-xl shadow-xl overflow-hidden">
          <div className="relative w-full min-h-[90vh] bg-black">
            <video
              ref={videoRef}
              className="w-full max-h-[100vh] object-cover"
              controls
              poster="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80"
            >
              <source src="/demo_video.mp4" type="video/mp4" />
              <p>
                Your browser does not support the video tag.{" "}
                <a href="/demo_video.mp4" download>
                  Download the video
                </a>
                .
              </p>
            </video>
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                <span className="text-white font-medium">Loading...</span>
              </div>
            )}
            {error && (
              <div className="absolute inset-0 flex items-center justify-center bg-red-500/50">
                <span className="text-white font-medium">{error}</span>
              </div>
            )}
            {!isPlaying && !error && !isLoading && (
              <button
                onClick={handlePlayPause}
                className="absolute inset-0 flex items-center justify-center bg-black/50 hover:bg-black/70 transition-colors duration-300"
                aria-label="Play Video"
                title="Play Video"
              >
                <FaPlay className="text-white text-5xl" />
              </button>
            )}
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
