import React from "react";
import { useNavigate } from "react-router-dom";

const NoAccessPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4 text-center">
      <div className="text-6xl mb-4">🚫</div>
      <h2 className="text-3xl font-bold mb-2">No Access</h2>
      <p className="text-lg text-gray-700 mb-4 max-w-xl">
        The feature you’re trying to access is restricted based on your current subscription plan. 
        To use this feature, you'll need to upgrade to a higher plan that includes access.
      </p>
      <button
        onClick={() => navigate("/plan-section")}
        className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg shadow-lg transition"
      >
        Upgrade Plan
      </button>
    </div>
  );
};

export default NoAccessPage;
