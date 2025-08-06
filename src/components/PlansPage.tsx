import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { getDemoPlans } from "../data/demoPlans";
import { Plan } from "../types/plan";
import { motion } from "framer-motion";

// Define the subscription type
interface Subscription {
  status: string;
  name: string;
  expiresAt: string;
}

const PlansPage = () => {
  const [billing, setBilling] = useState("monthly");
  const [subscriptionStatus, setSubscriptionStatus] =
    useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAlert, setShowAlert] = useState(false);
  const navigate = useNavigate();
  const plans: Plan[] = getDemoPlans(billing);

  // Utility: Decode token and get businessId
  const getBusinessId = (): string | null => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return null;
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.businessId;
    } catch (err) {
      console.error("Error decoding token:", err);
      return null;
    }
  };

  // Check subscription status
  const checkSubscriptionStatus = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const businessId = getBusinessId();

      if (!token || !businessId) {
        setLoading(false);
        return;
      }

      const response = await fetch(`/api/subscription/status/${businessId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
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

    if (window.location.hash === "#plan-section") {
      const el = document.querySelector("#plan-section");
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
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

  const closeAlert = () => setShowAlert(false);

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-orange-50 via-white to-orange-100 min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  const highlightPlanIndex = 1;

  return (
    <div
      id="plan-section"
      className="bg-gradient-to-br from-orange-50 via-white to-orange-100 min-h-screen pt-14 pb-10 -mt-6 -mb-10"
    >
      {/* Alert for already active plan */}
      {showAlert && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            className="bg-white rounded-lg p-6 max-w-md shadow-xl"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-orange-100 mb-4">
                <svg
                  className="h-6 w-6 text-orange-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Subscription Already Active
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                Aapka subscription already active hai. Aap dobara subscription
                nahi le sakte.
              </p>
              <button
                onClick={closeAlert}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-4 rounded-md"
              >
                Samjh Gaya
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Header Section */}
      <section className="text-center px-4 mt-5">
        <motion.h2
          className="text-4xl sm:text-5xl font-extrabold text-gray-800 mb-4"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Explore Our Plans
        </motion.h2>
        <p className="text-gray-600 mb-6 max-w-xl mx-auto text-lg">
          Choose the plan that best suits your needs. Upgrade anytime.
        </p>

        {/* Current subscription message */}
        {subscriptionStatus && subscriptionStatus.status === "active" && (
          <motion.div
            className="max-w-md mx-auto mb-6 p-4 bg-green-100 border border-green-300 rounded-lg"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p className="text-green-800 font-medium">
              ✅ Aapka {subscriptionStatus.name} plan active hai
            </p>
            <p className="text-green-600 text-sm">
              Expires:{" "}
              {new Date(subscriptionStatus.expiresAt).toLocaleDateString(
                "hi-IN"
              )}
            </p>
          </motion.div>
        )}

        {/* Billing Toggle */}
        <div className="flex justify-center mb-6 space-x-4">
          {["monthly", "annual"].map((type) => (
            <button
              key={type}
              className={`px-5 py-2 rounded-full font-medium border transition-all ${
                billing === type
                  ? "bg-orange-500 text-white border-orange-500 shadow"
                  : "bg-white text-gray-600 border-gray-300 hover:border-orange-500 hover:text-orange-500"
              }`}
              onClick={() => setBilling(type)}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>

        {/* Plans Grid */}
        <div className="flex flex-wrap justify-center gap-8 px-4 sm:px-10 py-6">
          {plans.map((plan, index) => {
            const isSubscribed =
              subscriptionStatus &&
              subscriptionStatus.status === "active" &&
              subscriptionStatus.name
                .toLowerCase()
                .includes(plan.name.toLowerCase());

            return (
              <motion.div
                key={index}
                className={`w-full sm:w-[320px] lg:w-[300px] p-8 rounded-2xl shadow-xl border transition-transform duration-300 hover:-translate-y-2 hover:shadow-2xl ${
                  index === highlightPlanIndex ? "ring-4 ring-orange-300" : ""
                } ${isSubscribed ? "opacity-75" : "bg-white"}`}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                {index === highlightPlanIndex && (
                  <div className="absolute -top-4 right-4 bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full animate-pulse">
                    Most Popular
                  </div>
                )}

                {isSubscribed && (
                  <div className="absolute -top-4 left-4 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                    Active
                  </div>
                )}

                <h3 className="text-2xl font-semibold text-gray-800 mb-2">
                  {plan.name}
                </h3>

                <p className="text-2xl font-bold text-gray-900 mb-4">
                  {plan.name === "Trial" ? (
                    <span>5 Days Free Trial</span>
                  ) : (
                    <>
                      ₹{plan.price}
                      <span className="text-sm text-gray-500 ml-1">
                        / {billing}
                      </span>
                    </>
                  )}
                </p>

                <ul className="text-left text-sm space-y-2 mb-4 min-h-[200px]">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start">
                      {feature.includes("Disabled") ? (
                        <span className="text-gray-400 line-through">
                          ❌ {feature.replace(" (Disabled)", "")}
                        </span>
                      ) : (
                        <span className="text-black">✅ {feature}</span>
                      )}
                    </li>
                  ))}
                </ul>

                <button
                  className={`group w-full py-2 rounded-full font-semibold transition-all duration-300 ${
                    isSubscribed
                      ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                      : "bg-orange-500 text-white hover:bg-white hover:text-black"
                  }`}
                  onClick={() => handleBuy(plan)}
                  disabled={!!isSubscribed} // ✅ fixed here
                >
                  {isSubscribed
                    ? "Already Subscribed"
                    : plan.name === "Trial"
                    ? "Start Free Trial"
                    : "Subscribe"}
                </button>
              </motion.div>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default PlansPage;
