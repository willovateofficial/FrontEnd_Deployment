import React from "react";
import { Link } from "react-router-dom";
import { FaInstagram, FaLinkedinIn, FaYoutube } from "react-icons/fa";

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-100 text-gray-700 text-sm border-t border-gray-200 mt-10">
      {/* Top Section */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 px-6 py-12 ">
        {/* Brand & Socials */}
        <div>
          <img
            src="/Willovate_Resto LogoF.png"
            alt="Willovate Resto Logo"
            className="mb-5 h-20"
          />
          <div className="flex gap-4 text-xl text-black">
            <a
              href="https://www.instagram.com/willovate_/"
              target="_blank"
              rel="noopener noreferrer"
              title="Instagram"
              className="hover:text-orange-500 transition"
            >
              <FaInstagram />
            </a>
            <a
              href="https://www.linkedin.com/company/willovate-private-limited/posts/?feedView=all"
              target="_blank"
              rel="noopener noreferrer"
              title="LinkedIn"
              className="hover:text-orange-500 transition"
            >
              <FaLinkedinIn />
            </a>
            <a
              href="https://youtube.com/@willovate?si=n2EFzCB8hRSNd4yl"
              target="_blank"
              rel="noopener noreferrer"
              title="YouTube"
              className="hover:text-orange-500 transition"
            >
              <FaYoutube />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-lg font-semibold mb-4 text-gray-900">
            Quick Links
          </h4>
          <ul className="space-y-2">
            <li>
              <Link to="/" className="hover:text-orange-500 transition">
                Home
              </Link>
            </li>
            <li>
              <Link to="/about" className="hover:text-orange-500 transition">
                About Us
              </Link>
            </li>
            <li>
              <Link
                to="/how-it-works"
                className="hover:text-orange-500 transition"
              >
                Working
              </Link>
            </li>
            <li>
              <Link
                to="/plan-section"
                className="hover:text-orange-500 transition"
              >
                Plans
              </Link>
            </li>
          </ul>
        </div>

        {/* Legal Pages */}
        <div>
          <h4 className="text-lg font-semibold mb-4 text-gray-900">
            Legal Pages
          </h4>
          <ul className="space-y-2">
            <li>
              <Link to="/t&c" className="hover:text-orange-500 transition">
                Terms and Conditions
              </Link>
            </li>
            <li>
              <Link
                to="/privacy-policy"
                className="hover:text-orange-500 transition"
              >
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link
                to="/cancellation-policy"
                className="hover:text-orange-500 transition"
              >
                Cancellation Policy
              </Link>
            </li>
          </ul>
        </div>

        {/* Company Info */}
        <div>
          <h4 className="text-lg font-semibold mb-4 text-gray-900">
            Our Company
          </h4>
          <p className="mb-3 leading-relaxed">
            Willovate Resto — Serving innovation through digital dining
            experiences. Explore our exclusive dishes, modern ambiance, and
            seamless online experience.
          </p>
          <Link
            to="/about"
            className="text-orange-500 underline font-medium hover:text-orange-600 transition"
          >
            Learn More →
          </Link>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-black text-white text-sm py-4 px-6 md:px-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-center md:text-left">
            © 2025 — All Rights Reserved.
          </p>
          <div className="flex flex-wrap justify-center md:justify-end gap-4">
            <Link to="/privacy-policy" className="hover:underline">
              Privacy Policy
            </Link>
            <Link to="/t&c" className="hover:underline">
              Terms
            </Link>
            <Link to="/plans" className="hover:underline">
              Pricing
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
