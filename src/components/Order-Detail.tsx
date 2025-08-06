import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { baseUrl } from "../config";
import UserCart from "./user/UserCart";

interface Item {
  productId: number;
  quantity: number;
  price: number;
  status?: string;
  name?: string;
  id?: number; // Add item ID for individual updates
}

interface Order {
  order_id: string;
  table_number: number;
  total_amount: number;
  payment_method: string;
  estimated_time: string;
  status: string;
  created_at: string;
  items: Item[];
}

const baseURL = baseUrl;

const OrderDetails: React.FC = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [updatingItems, setUpdatingItems] = useState<Set<number>>(new Set());
  const [showCart, setShowCart] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const numericId = parseInt(orderId?.replace("ORD", "") || "0", 10);
        const response = await axios.get(`${baseURL}/api/orders/${numericId}`);
        console.log("Fetched Order: ", response.data);
        setOrder(response.data);
      } catch (error) {
        console.error("Error fetching order:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-green-500";
      case "Pending":
        return "bg-red-500";
      case "Ready":
        return "bg-blue-500";
      case "Served":
        return "bg-yellow-500";
      default:
        return "bg-gray-400";
    }
  };

  // Function to update individual item status
  const updateItemStatus = async (itemIndex: number, newStatus: string) => {
    if (!order) return;

    // Add item to updating set
    setUpdatingItems((prev) => new Set(prev).add(itemIndex));

    try {
      const numericId = parseInt(order.order_id.replace("ORD", ""), 10);
      const token = localStorage.getItem("token");
      const item = order.items[itemIndex];

      // API call to update individual item status
      await axios.patch(
        `${baseURL}/api/orders/${numericId}/items/${item.productId}/status`,
        {
          status: newStatus,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Update local state
      const updatedItems = [...order.items];
      updatedItems[itemIndex] = {
        ...updatedItems[itemIndex],
        status: newStatus,
      };

      // Calculate overall order status based on items
      const allItemsCompleted = order.items.every(
        (item) => item.status === "Completed"
      );
      const overallStatus = allItemsCompleted ? "Completed" : "Pending";

      const updatedOrder = {
        ...order,
        items: updatedItems,
        status: overallStatus,
      };

      setOrder(updatedOrder);
      toast.success(`✅ Item status updated to ${newStatus}`);
    } catch (error) {
      console.error("Failed to update item status", error);
      toast.error("❌ Failed to update item status. Please try again.");
    } finally {
      // Remove item from updating set
      setUpdatingItems((prev) => {
        const newSet = new Set(prev);
        newSet.delete(itemIndex);
        return newSet;
      });
    }
  };

  // Function to update all items to completed
  const handleCompleteAllItems = async () => {
    if (!order) return;

    setUpdating(true);

    try {
      const numericId = parseInt(order.order_id.replace("ORD", ""), 10);
      const token = localStorage.getItem("token");

      // API call to update all items to served
      await axios.patch(
        `${baseURL}/api/orders/${numericId}/complete-all`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Update local state
      const updatedItems = order.items.map((item) => ({
        ...item,
        status: "Completed",
      }));

      const updatedOrder = {
        ...order,
        items: updatedItems,
        status: "Completed",
      };

      setOrder(updatedOrder);
      toast.success("✅ All items marked as completed!");
    } catch (error) {
      console.error("Failed to complete all items", error);
      toast.error("❌ Failed to complete all items. Please try again.");
    } finally {
      setUpdating(false);
    }
  };

  const handleProceedToBilling = async () => {
    if (!order) return;

    // Check if all items are served
    const allItemsCompleted = order.items.every(
      (item) => item.status === "Completed"
    );

    if (!allItemsCompleted) {
      toast.warning(
        "⚠️ Please complete all items before proceeding to billing"
      );
      return;
    }

    // Navigate to billing page
    navigate(`/bill/${order.order_id}`, { state: { order } });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center text-lg text-gray-600">
          Loading order details...
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center text-lg text-red-600">Order not found.</div>
      </div>
    );
  }

  // Calculate served items count
  const completedItemsCount = order.items.filter(
    (item) => item.status === "Completed"
  ).length;
  const totalItemsCount = order.items.length;

  return (
    <div className="bg-white min-h-screen font-sans -mt-4 -mb-10">
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Header Section */}
        <div className="bg-[#060224] text-white px-6 py-4 rounded-xl shadow-lg mb-6">
          <div className="flex justify-between items-center">
            <div className="text-xl font-bold">
              🪑 Table No: {order.table_number}
            </div>
            <div className="text-right">
              <div className="text-sm font-medium">{order.status}</div>
              <div className="text-xs opacity-75 mt-1">
                {completedItemsCount}/{totalItemsCount} items completed
              </div>
            </div>
          </div>
        </div>

        {/* Order Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-sm font-semibold text-gray-600 mb-2">
              Order ID
            </h3>
            <p className="text-lg font-medium text-black">{order.order_id}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-sm font-semibold text-gray-600 mb-2">
              Payment Method
            </h3>
            <p className="text-lg font-medium text-black">
              {order.payment_method}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-sm font-semibold text-gray-600 mb-2">
              Estimated Time
            </h3>
            <p className="text-lg font-medium text-black">
              {order.estimated_time}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-sm font-semibold text-gray-600 mb-2">
              Total Amount
            </h3>
            <p className="text-lg font-medium text-black">
              ₹{order.total_amount}
            </p>
          </div>
        </div>

        {/* Items Section Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
          <h2 className="text-lg font-semibold text-gray-700">
            🧾 Items Ordered
          </h2>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => setShowCart(true)}
              className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-md transition duration-300"
            >
              Edit Order
            </button>
            <button
              onClick={handleCompleteAllItems}
              disabled={completedItemsCount === totalItemsCount}
              className={`${
                updating || completedItemsCount === totalItemsCount
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700"
              } text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-md transition duration-300`}
            >
              {updating ? "Processing..." : "Order Complete"}
            </button>
          </div>
        </div>

        {/* Items List */}
        <div className="space-y-4 mb-8">
          {order.items.map((item, index) => (
            <div
              key={index}
              className="bg-white border border-gray-200 rounded-xl p-4 shadow-md hover:shadow-lg transition duration-200"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="font-semibold text-black text-lg">
                  {item.name}
                </div>
                <div className="text-lg font-semibold text-gray-700">
                  ₹{item.price}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                <div className="text-sm text-gray-600">
                  <span className="font-medium">Qty: {item.quantity}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-600 font-medium">
                    Status:
                  </span>
                  <div className="flex items-center gap-2">
                    <select
                      aria-label="Change item status"
                      value={item.status || order.status}
                      onChange={(e) => updateItemStatus(index, e.target.value)}
                      disabled={updatingItems.has(index)}
                      className={`font-medium px-3 py-1 rounded-full text-white text-xs border-none outline-none cursor-pointer ${getStatusColor(
                        item.status || order.status
                      )} ${
                        updatingItems.has(index)
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                      }`}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Ready">Ready</option>
                      <option value="Served">Served</option>
                      <option value="Completed">Completed</option>
                    </select>
                    {updatingItems.has(index) && (
                      <div className="text-xs text-gray-500 animate-pulse">
                        Updating...
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Billing Button Section */}
        <div className="text-center pt-4">
          <button
            onClick={handleProceedToBilling}
            disabled={completedItemsCount !== totalItemsCount}
            className={`${
              completedItemsCount !== totalItemsCount
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-[#060224] hover:bg-[#1a1a40]"
            } text-white px-8 py-3 rounded-full text-lg font-semibold shadow-lg transition duration-300 transform hover:scale-105`}
          >
            Proceed to Billing
          </button>
          {completedItemsCount !== totalItemsCount && (
            <p className="text-sm text-gray-500 mt-3">
              Please complete all items before proceeding to billing
            </p>
          )}
        </div>
      </div>

      {/* Cart Modal */}
      {showCart && order && (
        <UserCart
          items={order.items.map((item, index) => ({
            id: typeof item.productId === "number" ? item.productId : index,
            name: item.name || `Item ${index + 1}`,
            image: "",
            quantity: item.quantity,
            price: item.price,
            status: item.status || "Pending", // ✅ Add this line
          }))}
          orderId={order.order_id}
          onClose={() => setShowCart(false)}
        />
      )}
    </div>
  );
};

export default OrderDetails;
