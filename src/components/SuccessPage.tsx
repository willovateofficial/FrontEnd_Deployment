import React from "react";
import { useLocation } from "react-router-dom";

const SuccessPage = () => {
  const location = useLocation();
  const plan = location.state?.plan;

  return (
    <div className="min-h-screen bg-green-50 flex flex-col items-center justify-center p-10 -mt-4 -mb-20">
      <h2 className="text-3xl font-bold text-green-700 mb-4">
        🎉 Purchase Successful!
      </h2>
      <p className="text-lg">
        You have successfully purchased the <strong>{plan?.name}</strong> plan.
      </p>
      <p className="text-gray-600 mt-2">
        A confirmation email has been sent to your registered email.
      </p>
    </div>
  );
};

export default SuccessPage;
