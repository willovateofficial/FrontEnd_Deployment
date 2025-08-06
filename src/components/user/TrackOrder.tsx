import React, { useState, useEffect } from "react";
import type { JSX } from "react";
import axios from "axios";
import {
  FaUtensils,
  FaClock,
  FaCheckCircle,
  FaMoneyBillWave,
  FaTable,
  FaReceipt,
  FaSearch,
} from "react-icons/fa";
import { GiCook } from "react-icons/gi";
import { MdFoodBank, MdPayment } from "react-icons/md";
import UserCart from "./UserCart";
import { baseUrl } from "../../config";

interface OrderItem {
  productId: number | string;
  quantity: number;
  price: number;
  name?: string;
}

interface OrderDetails {
  order_id: string;
  table_number: number;
  total_amount: number;
  payment_method: string;
  status: string;
  estimated_time: string;
  created_at: string;
  items: OrderItem[];
}

const baseURL = baseUrl;

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  preparing: "bg-blue-100 text-blue-800",
  ready: "bg-green-100 text-green-800",
  served: "bg-purple-100 text-purple-800",
  completed: "bg-gray-100 text-gray-800",
};

const statusIcons: Record<string, JSX.Element> = {
  pending: <FaClock className="mr-2" />,
  preparing: <GiCook className="mr-2" />,
  ready: <FaCheckCircle className="mr-2" />,
  served: <FaUtensils className="mr-2" />,
  completed: <FaCheckCircle className="mr-2" />,
};

const TrackOrder: React.FC = () => {
  const savedOrderId = localStorage.getItem("lastOrderId") || "";
  const redirectFlag = localStorage.getItem("trackFromRedirect") === "true";

  const [orderId, setOrderId] = useState(savedOrderId);
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [editOrderId, setEditOrderId] = useState<string | null>(null);
  const [searched, setSearched] = useState(false); // 🔧 NEW STATE to track if user searched

  useEffect(() => {
    if (savedOrderId && redirectFlag) {
      fetchOrderDetails(savedOrderId);
      localStorage.removeItem("trackFromRedirect");
    }
  }, [savedOrderId, redirectFlag]);

  const fetchOrderDetails = async (id: string) => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${baseURL}/api/orders/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setOrderDetails(response.data);
      setOrderId(id);
      setSearched(true);
    } catch (err) {
      setError("Order not found or invalid Order ID.");
      setOrderDetails(null);
      setSearched(false);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (orderId.trim()) {
      fetchOrderDetails(orderId.trim());
    }
  };

  const getStatusDisplay = (status: string) => {
    const formattedStatus = status.charAt(0).toUpperCase() + status.slice(1);
    return (
      <span
        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
          statusColors[status] || "bg-gray-100 text-gray-800"
        }`}
      >
        {statusIcons[status] || <FaClock className="mr-2" />}
        {formattedStatus}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-amber-100 py-8 px-4 sm:px-6 lg:px-8 -mt-4 -mb-10">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center bg-amber-100 rounded-full p-4 shadow-lg mb-4">
            <FaUtensils className="text-amber-600 text-4xl" />
          </div>
          <h1 className="text-4xl font-extrabold text-amber-800 mb-2">
            Track Your Order
          </h1>
          <p className="text-lg text-amber-600">
            Check the status of your delicious meal
          </p>
        </div>

        {/* Order Search Box */}
        {!orderDetails && (
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 mb-10"
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
              <FaSearch className="mr-3 text-amber-500" />
              Find Your Order
            </h2>
            <div className="mb-6">
              <label
                htmlFor="orderId"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Enter Your Order ID
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaReceipt className="text-gray-400" />
                </div>
                <input
                  id="orderId"
                  type="text"
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  placeholder="e.g., ORD00013"
                  className="pl-10 w-full p-4 rounded-lg border border-gray-300 focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold py-4 px-6 rounded-lg shadow-md hover:shadow-lg transition duration-300 flex items-center justify-center"
            >
              <FaSearch className="mr-2" />
              Track Order
            </button>
          </form>
        )}

        {/* Loader */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500 mb-4"></div>
            <p className="text-lg font-medium text-amber-700">
              Loading your order details...
            </p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-8 rounded-lg">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">{error}</h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>Please check your order ID and try again.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Order Info */}
        {orderDetails && (
          <>
            <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 mb-6">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                  <MdFoodBank className="mr-3 text-amber-500" />
                  Order Summary
                </h2>
                <div>{getStatusDisplay(orderDetails.status)}</div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-amber-50 rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <FaTable className="text-amber-600 mr-2" />
                    <span className="font-medium text-gray-700">
                      Table Number
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-amber-800">
                    {orderDetails.table_number}
                  </p>
                </div>
                <div className="bg-amber-50 rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <FaMoneyBillWave className="text-amber-600 mr-2" />
                    <span className="font-medium text-gray-700">
                      Total Amount
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-amber-800">
                    ₹{orderDetails.total_amount.toFixed(2)}
                  </p>
                </div>
                <div className="bg-amber-50 rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <MdPayment className="text-amber-600 mr-2" />
                    <span className="font-medium text-gray-700">
                      Payment Method
                    </span>
                  </div>
                  <p className="text-xl font-semibold text-amber-800 capitalize">
                    {orderDetails.payment_method}
                  </p>
                </div>
                <div className="bg-amber-50 rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <FaClock className="text-amber-600 mr-2" />
                    <span className="font-medium text-gray-700">
                      Estimated Time
                    </span>
                  </div>
                  <p className="text-xl font-semibold text-amber-800">
                    {orderDetails.estimated_time}
                  </p>
                </div>
              </div>

              <p className="text-sm text-gray-500 border-t border-gray-200 pt-4">
                <span className="font-medium">Order ID:</span>{" "}
                {orderDetails.order_id} •{" "}
                <span className="font-medium ml-2">Placed at:</span>{" "}
                {new Date(orderDetails.created_at).toLocaleString()}
              </p>

              {searched && (
                <button
                  onClick={() => setEditOrderId(orderDetails.order_id)}
                  className="mt-6 w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 rounded-lg shadow-md transition duration-300"
                >
                  Edit Order
                </button>
              )}
            </div>

            {/* Order Items */}
            <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8">
              <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                <FaUtensils className="mr-3 text-amber-500" />
                Your Order Items
              </h3>
              <div className="space-y-4">
                {orderDetails.items.map((item, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center p-4 bg-amber-50 rounded-lg hover:bg-amber-100 transition duration-200"
                  >
                    <div className="flex items-center">
                      <div className="bg-amber-200 rounded-full p-2 mr-4">
                        <MdFoodBank className="text-amber-700" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-800">
                          {item.name || `Item ${index + 1}`}
                        </h4>
                        <p className="text-sm text-gray-600">
                          Qty: {item.quantity}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-amber-800">
                        ₹{item.price.toFixed(2)}
                      </p>
                      <p className="text-sm text-gray-600">
                        ₹{(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      {/* UserCart popup */}
      {editOrderId && orderDetails && (
        <UserCart
          orderId={editOrderId}
          items={orderDetails.items.map((item, index) => ({
            id: typeof item.productId === "number" ? item.productId : index,
            name: item.name || `Item ${index + 1}`,
            image: "",
            quantity: item.quantity,
            price: item.price,
          }))}
          onClose={() => setEditOrderId(null)}
        />
      )}
    </div>
  );
};

export default TrackOrder;
