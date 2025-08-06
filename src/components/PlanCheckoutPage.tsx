import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Plan } from "../types/plan";
import { FaCheckCircle, FaRegCreditCard } from "react-icons/fa";
import bgImage from "../assets/bg.jpg";

const PlanCheckoutPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const plan: Plan = location.state?.plan;

  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [endDate, setEndDate] = useState("");

  const [emailError, setEmailError] = useState("");
  const [mobileError, setMobileError] = useState("");

  // ✅ Auto-fill email & mobile from localStorage
  useEffect(() => {
    const storedEmail = localStorage.getItem("userEmail");

    if (storedEmail) setEmail(storedEmail);
  }, []);

  useEffect(() => {
    if (plan?.durationDays) {
      const today = new Date();
      const future = new Date(today);
      future.setDate(today.getDate() + plan.durationDays);
      setEndDate(future.toLocaleDateString());
    }
  }, [plan]);

  if (!plan) {
    return (
      <div className="p-6 sm:p-10 text-center h-screen flex flex-col justify-center items-center bg-gray-50">
        <p className="text-lg sm:text-xl font-semibold">
          No plan selected. Please go back and choose a plan.
        </p>
        <button
          onClick={() => navigate("/plan-section")}
          className="mt-6 px-6 py-3 bg-orange-600 text-white rounded-xl shadow-md hover:bg-orange-500 transition duration-300 text-sm sm:text-base"
        >
          Back to Plans
        </button>
      </div>
    );
  }

  const handleConfirm = () => {
    let isValid = true;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setEmailError("Please enter your email address.");
      isValid = false;
    } else if (!emailRegex.test(email)) {
      setEmailError("Please enter a valid email address.");
      isValid = false;
    } else {
      setEmailError("");
    }

    const mobileRegex = /^[0-9]{10}$/;
    if (!mobile) {
      setMobileError("Please enter your mobile number.");
      isValid = false;
    } else if (!mobileRegex.test(mobile)) {
      setMobileError("Please enter a valid 10-digit mobile number.");
      isValid = false;
    } else {
      setMobileError("");
    }

    if (!isValid) return;

    // ✅ Calculate expiry date
    const today = new Date();
    const duration = plan.durationDays ?? 30; // Fallback if undefined
    const expiresAt = new Date(today.setDate(today.getDate() + duration)).toISOString();

    // Optional: store expiry in localStorage
    // localStorage.setItem("planExpiresAt", expiresAt);

    // Navigate with all required info
    navigate("/payment", {
      state: {
        planName: plan.name,
        price: plan.price,
        features: plan.features,
        expiresAt,
      },
    });
  };

  return (
    <div className="relative min-h-screen w-full -mt-4 -mb-10">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${bgImage})` }}
      >
        <div className="absolute inset-0 bg-black opacity-50"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex justify-center items-center px-4 py-12 sm:px-6 lg:px-8 min-h-screen">
        <div className="w-full max-w-6xl bg-white bg-opacity-90 backdrop-blur-sm rounded-xl shadow-xl p-4 sm:p-8 grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Plan Summary */}
          <div className="bg-orange-100 rounded-lg p-5 sm:p-7 shadow-md">
            <h2 className="text-xl sm:text-3xl font-bold text-orange-600 mb-4 flex items-center">
              <FaCheckCircle className="mr-2 text-lg" />
              Plan Summary
            </h2>
            <p className="text-lg mb-2">
              <strong>Name:</strong> {plan.name}
            </p>
            <p className="text-lg mb-2">
              <strong>Price:</strong> ₹{plan.price}
            </p>
            <p className="text-lg mb-2">
              <strong>Duration:</strong> {plan.durationDays} Days
            </p>

            <h3 className="mt-4 mb-2 text-lg font-semibold">Features:</h3>
            <ul className="list-disc list-inside text-lg text-gray-700 space-y-1">
              {plan.features.map((feature, index) => (
                <li key={index}>{feature}</li>
              ))}
            </ul>
          </div>

          {/* User Form */}
          <div>
            <h2 className="text-xl sm:text-3xl font-bold mb-6 text-gray-800">
              Enter Your Details
            </h2>

            <div className="mb-4">
              <label className="block font-medium mb-1 text-sm sm:text-lg">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 outline-none text-sm sm:text-lg"
                placeholder="you@example.com"
              />
              {emailError && (
                <p className="text-red-500 text-sm mt-1">{emailError}</p>
              )}
            </div>

            <div className="mb-4">
              <label className="block font-medium mb-1 text-sm sm:text-lg">
                Mobile Number
              </label>
              <input
                type="tel"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 outline-none text-sm sm:text-lg"
                placeholder="9876543210"
              />
              {mobileError && (
                <p className="text-red-500 text-sm mt-1">{mobileError}</p>
              )}
            </div>

            <div className="mb-6">
              <label className="block font-medium mb-1 text-sm sm:text-lg">
                Plan End Date
              </label>
              <input
                type="text"
                value={endDate}
                disabled
                placeholder="Plan end date"
                title="Plan end date"
                className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg text-sm sm:text-lg"
              />
            </div>

            <button
              onClick={handleConfirm}
              className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 rounded-lg flex items-center justify-center text-sm sm:text-lg transition duration-300"
            >
              <FaRegCreditCard className="mr-2" />
              Confirm & Pay
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlanCheckoutPage;
