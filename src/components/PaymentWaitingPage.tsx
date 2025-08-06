import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const PaymentWaitingPage = () => {
  const navigate = useNavigate();
  const [secondsLeft, setSecondsLeft] = useState(1800); // 30 minutes in seconds

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate("/dashboard");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate]);

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const seconds = secs % 60;
    return `${String(mins).padStart(2, "0")}:${String(seconds).padStart(
      2,
      "0"
    )}`;
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-orange-50 px-4">
      <div className="bg-white shadow-xl rounded-2xl p-8 max-w-lg w-full text-center border border-orange-200">
        <h2 className="text-3xl font-bold text-orange-600 mb-4">
          Payment Received!
        </h2>
        <p className="text-gray-700 text-lg mb-6">
          Your subscription will be activated within:
        </p>
        <div className="text-5xl font-mono text-orange-500 mb-6">
          {formatTime(secondsLeft)}
        </div>
        <p className="text-gray-600">
          Please don’t refresh or close this page. You will be redirected to
          your dashboard automatically.
        </p>
      </div>
    </div>
  );
};

export default PaymentWaitingPage;
