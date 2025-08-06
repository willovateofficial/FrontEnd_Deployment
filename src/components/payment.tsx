import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { baseUrl } from "../config";

const baseURL = baseUrl;

const PaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const {
    price = 0,
    planName = "Custom Plan",
    features = [],
    expiresAt = "2025-12-31T23:59:59.999Z",
  } = location.state || {};

  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleScreenshotUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setScreenshot(file);
      toast.success("Screenshot uploaded successfully!");
    }
  };

  const handleFinalConfirm = async () => {
    try {
      setUploading(true);
      let paymentProofUrl = "";

      if (screenshot) {
        const formData = new FormData();
        formData.append("file", screenshot);
        formData.append("upload_preset", "paymentProof"); // Cloudinary preset
        formData.append("folder", "Willovate");

        const cloudinaryRes = await axios.post(
          "https://api.cloudinary.com/v1_1/dcvgsktsc/image/upload",
          formData
        );

        paymentProofUrl = cloudinaryRes.data.secure_url;
      }

      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("You are not logged in. Please log in again.");
        setUploading(false);
        return;
      }

      await axios.post(
        `${baseURL}/api/plan`,
        {
          name: planName,
          features,
          expiresAt,
          paymentProofUrl,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success(
        "Thank you! Your subscription has been submitted. It will be activated within 30 minutes.",
        {
          autoClose: 1000,
          style: {
            width: "600px",
            whiteSpace: "normal",
            wordWrap: "break-word",
          },
        }
      );

      setTimeout(() => {
        navigate("/");
      }, 1000);
    } catch (error: any) {
      console.error("Error submitting plan:", error);
      toast.error(
        "Something went wrong: " +
          (error?.response?.data?.error || error.message || "Unknown error")
      );
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-[83vh] bg-white-50 flex items-center justify-center px-4 py-7">
      <div className="max-w-2xl w-full bg-white p-8 rounded-2xl shadow-xl border border-orange-100">
        <div className="text-center">
          <h2 className="text-4xl font-extrabold text-orange-500 mb-2">
            Complete Your Subscription
          </h2>
          <p className="text-gray-600 text-sm">Secure checkout</p>
        </div>

        <div className="mt-5 text-center">
          <h3 className="text-2xl font-semibold text-orange-600 mb-4">
            Our payment gateway is currently under maintenance.
          </h3>
          <p className="text-gray-700 mb-4 text-base">
            Please follow the steps below to complete your subscription
            manually.
          </p>

          <img
            src="/payment_qr.jpg"
            alt="QR Code"
            className="mx-auto w-48 h-48 mb-6 border rounded-lg shadow"
          />

          <div className="text-left space-y-4 text-lg text-gray-700">
            <div>
              <strong>Step 1:</strong> Scan the QR code above using any UPI app.
            </div>
            <div>
              <strong>Step 2:</strong> Pay the amount of{" "}
              <span className="text-green-700 font-bold">₹{price}</span>.
            </div>
            <div>
              <strong>Step 3:</strong> Upload the screenshot of your payment
              confirmation below:
            </div>

            <div className="flex flex-col items-start mt-4">
              <label
                htmlFor="screenshotUpload"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Upload Screenshot
              </label>
              <input
                type="file"
                accept="image/*"
                id="screenshotUpload"
                onChange={handleScreenshotUpload}
                className="block w-full text-sm text-gray-900 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
              />
              {screenshot && (
                <p className="text-sm mt-2 text-green-600 font-medium">
                  ✔ Screenshot uploaded: {screenshot.name}
                </p>
              )}
            </div>

            <div>
              <strong>Step 4:</strong> Your subscription will be activated
              within <span className="font-semibold">30 minutes</span>.
            </div>

            <hr className="my-6 border-t border-gray-300" />

            <div className="text-lg text-gray-600">
              <strong>Need Help?</strong>
              <br />
              📞 <span className="font-medium">+91 98765 43210</span>
              <br />
              📧 <span className="font-medium">support@example.com</span>
            </div>
          </div>

          {/* Final Confirmation Button */}
          {screenshot && (
            <button
              onClick={handleFinalConfirm}
              disabled={uploading}
              className={`mt-6 w-full ${
                uploading
                  ? "bg-orange-300 cursor-not-allowed"
                  : "bg-orange-600 hover:bg-orange-700"
              } text-white text-lg font-semibold py-3 rounded-xl shadow transition-all duration-300`}
            >
              {uploading ? "Uploading..." : "Done with Payment"}
            </button>
          )}
        </div>
      </div>

      {/* Toast container for notifications */}
      <ToastContainer
        position="top-center"
        autoClose={1000}
        style={{ width: "600px" }}
      />
    </div>
  );
};

export default PaymentPage;
