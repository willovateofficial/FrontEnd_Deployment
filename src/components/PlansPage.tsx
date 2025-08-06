import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { getDemoPlans } from "../data/demoPlans";
import { Plan } from "../types/plan";
import { motion } from "framer-motion";
import BookDemoPopup from "../components/BookDemoPopup"; // import the reusable popup

interface Subscription {
  status: string;
  name: string;
  expiresAt: string;
}

const PlansPage = () => {
  const [billing, setBilling] = useState<"monthly" | "annual">("monthly");
  const [subscriptionStatus, setSubscriptionStatus] =
    useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAlert, setShowAlert] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [showContactPopup, setShowContactPopup] = useState(false); // NEW
  const navigate = useNavigate();
  const plans: Plan[] = getDemoPlans(billing);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const getBusinessId = (): string | null => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return null;
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.businessId;
    } catch {
      return null;
    }
  };

  const checkSubscriptionStatus = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const businessId = getBusinessId();
      if (!token || !businessId) {
        setLoading(false);
        return;
      }

      const response = await fetch(`/api/subscription/status/${businessId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        setSubscriptionStatus(data.subscription);
      }
    } catch (error) {
      console.error("Subscription check error:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkSubscriptionStatus();
  }, [checkSubscriptionStatus]);

  const handleBuy = (plan: Plan) => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    if (
      subscriptionStatus &&
      subscriptionStatus.status === "active" &&
      subscriptionStatus.name.toLowerCase() === plan.name.toLowerCase()
    ) {
      setShowAlert(true);
      return;
    }
    navigate("/PlanCheckoutPage", { state: { plan } });
  };

  const highlightPlanIndex = 2;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-12 md:pb-20 -mt-4 -mb-10">
      {/* Alert Modal */}
      {showAlert && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            className="bg-white rounded-xl p-6 w-full max-w-sm shadow-2xl mx-4"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-orange-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
            </div>
            <h3 className="text-xl font-bold text-center text-gray-800 mb-2">
              Subscription Active
            </h3>
            <p className="text-center text-gray-600 mb-6">
              You already have an active {subscriptionStatus?.name}{" "}
              subscription.
            </p>
            <button
              onClick={() => setShowAlert(false)}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-2.5 rounded-lg transition-colors"
            >
              Continue
            </button>
          </motion.div>
        </div>
      )}

      {/* Header */}
      <div className="bg-white py-12 md:py-16 px-4 sm:px-6 lg:px-8 text-center shadow-sm">
        <div className="max-w-5xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-2 bg-gradient-to-r from-amber-500 to-orange-600 bg-clip-text text-transparent leading-normal pb-2"
          >
            Choose the Right Plan for Your Business
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto px-2 sm:px-0"
          >
            Streamline your restaurant operations with Willovate Resto's
            tailored solutions.
          </motion.p>

          {/* Billing Toggle */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-8 flex flex-row flex-wrap items-center justify-center gap-2 sm:gap-4"
          >
            <span className="text-gray-700 font-medium">Billed monthly</span>
            <button
              onClick={() =>
                setBilling((prev) =>
                  prev === "monthly" ? "annual" : "monthly"
                )
              }
              className={`relative inline-flex h-8 w-16 items-center rounded-full transition-colors focus:outline-none ${
                billing === "annual" ? "bg-orange-500" : "bg-gray-300"
              }`}
              title="Toggle billing period"
              aria-label="Toggle billing period"
            >
              <span
                className={`inline-block h-6 w-6 transform rounded-full bg-white shadow-md transition-transform ${
                  billing === "annual" ? "translate-x-9" : "translate-x-1"
                }`}
              />
            </button>
            <div className="flex items-center">
              <span className="text-gray-700 font-medium">Billed annually</span>
              <span className="ml-2 px-2 py-1 text-xs bg-orange-100 text-orange-700 rounded-full">
                Save 20%
              </span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Plans */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 md:mt-12">
        <div className="grid gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-4">
          {plans.map((plan, index) => {
            const isSubscribed =
              subscriptionStatus &&
              subscriptionStatus.status === "active" &&
              subscriptionStatus.name.toLowerCase() === plan.name.toLowerCase();

            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`relative rounded-xl overflow-hidden transition-all duration-300 ${
                  !isMobile && index === highlightPlanIndex
                    ? "transform md:-translate-y-4"
                    : ""
                }`}
              >
                {/* Recommended Badge */}
                {index === highlightPlanIndex && (
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-400 to-orange-600"></div>
                )}

                <div
                  className={`h-full flex flex-col ${
                    index === highlightPlanIndex
                      ? "border-2 border-orange-500 shadow-lg md:shadow-xl"
                      : "border border-gray-200 shadow-md"
                  } bg-white rounded-xl overflow-hidden`}
                >
                  {/* Plan Header */}
                  <div className="px-4 sm:px-6 pt-6 sm:pt-8 pb-4 sm:pb-6 text-center relative">
                    {index === highlightPlanIndex && (
                      <div className="absolute top-2 sm:top-4 right-2 sm:right-4 bg-orange-500 text-white text-xs font-bold px-2 sm:px-3 py-1 rounded-full">
                        Recommended
                      </div>
                    )}
                    {isSubscribed && (
                      <div className="absolute top-2 sm:top-4 left-2 sm:left-4 bg-green-500 text-white text-xs font-bold px-2 sm:px-3 py-1 rounded-full">
                        Current Plan
                      </div>
                    )}

                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900">
                      {plan.name}
                    </h3>
                    <div className="mt-3 sm:mt-4">
                      <span className="text-3xl sm:text-4xl font-extrabold text-gray-900">
                        {plan.name === "Trial" ? "Free" : `₹${plan.price}`}
                      </span>
                      {plan.name !== "Trial" && (
                        <span className="text-gray-600 text-sm sm:text-base">
                          /{billing === "monthly" ? "mo" : "yr"}
                        </span>
                      )}

                      {/* NEW - 5 Days Free Trial Label */}
                      {plan.name === "Trial" && (
                        <div className="mt-1 text-xs sm:text-sm font-medium text-orange-500 bg-orange-100 px-2 py-0.5 rounded-full inline-block">
                          5 Days Free Trial
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Features */}
                  <div className="px-4 sm:px-6 py-4 flex-1 border-t border-gray-100">
                    <ul className="space-y-2 sm:space-y-3 text-sm sm:text-base">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-start">
                          {feature.includes("Disabled") ? (
                            <span className="text-gray-400">
                              <svg
                                className="h-4 w-4 sm:h-5 sm:w-5 mr-2 mt-0.5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M6 18L18 6M6 6l12 12"
                                />
                              </svg>
                              <span className="line-through">
                                {feature.replace(" (Disabled)", "")}
                              </span>
                            </span>
                          ) : (
                            <span className="text-gray-700">
                              <svg
                                className="h-4 w-4 sm:h-5 sm:w-5 mr-2 mt-0.5 text-green-500"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                              {feature}
                            </span>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Button */}
                  <div className="px-4 sm:px-6 pb-4 sm:pb-6">
                    <button
                      onClick={() => handleBuy(plan)}
                      disabled={!!isSubscribed}
                      className={`w-full py-2 sm:py-3 rounded-lg font-medium transition-all duration-300 text-sm sm:text-base ${
                        isSubscribed
                          ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                          : index === highlightPlanIndex
                          ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700"
                          : "bg-gray-900 text-white hover:bg-gray-800"
                      }`}
                    >
                      {isSubscribed
                        ? "Current Plan"
                        : plan.name === "Trial"
                        ? "Start Free Trial"
                        : "Get Started"}
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Enterprise CTA */}
        <div className="mt-12 md:mt-16 bg-white rounded-xl shadow-md overflow-hidden mx-2 sm:mx-0">
          <div className="flex flex-col md:flex-row">
            <div className="p-6 md:p-8 lg:p-12 bg-gradient-to-r from-gray-900 to-gray-800 text-white">
              <h3 className="text-xl md:text-2xl font-bold mb-3">
                Need Custom Solutions?
              </h3>
              <p className="text-gray-300 mb-6 text-sm sm:text-base">
                Our enterprise plan offers tailored features and dedicated
                support for large restaurant chains and franchises.
              </p>
              <button
                onClick={() => setShowContactPopup(true)}
                className="px-4 py-2 sm:px-6 sm:py-3 bg-white text-gray-900 font-medium rounded-lg hover:bg-gray-100 transition-colors text-sm sm:text-base"
              >
                Book A Demo
              </button>
            </div>
            <div className="p-6 md:p-8 lg:p-12">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">
                Enterprise Features
              </h4>
              <ul className="space-y-2 sm:space-y-3 text-sm sm:text-base">
                <li className="flex items-start text-gray-700">
                  <svg
                    className="h-4 w-4 sm:h-5 sm:w-5 mr-2 mt-0.5 text-green-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  Custom API integrations
                </li>
                <li className="flex items-start text-gray-700">
                  <svg
                    className="h-4 w-4 sm:h-5 sm:w-5 mr-2 mt-0.5 text-green-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  Dedicated account manager
                </li>
                <li className="flex items-start text-gray-700">
                  <svg
                    className="h-4 w-4 sm:h-5 sm:w-5 mr-2 mt-0.5 text-green-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  Priority 24/7 support
                </li>
                <li className="flex items-start text-gray-700">
                  <svg
                    className="h-4 w-4 sm:h-5 sm:w-5 mr-2 mt-0.5 text-green-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  Custom reporting and analytics
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      {/* Reusable Popup */}
      <BookDemoPopup
        isOpen={showContactPopup}
        onClose={() => setShowContactPopup(false)}
      />
    </div>
  );
};

export default PlansPage;
