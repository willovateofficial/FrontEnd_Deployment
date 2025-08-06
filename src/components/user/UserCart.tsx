import React, { useState, useEffect } from "react";
import { FaPlus, FaMinus, FaTrash } from "react-icons/fa";
import axios from "axios";
import cartImg from "../../assets/CartImg.jpg";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { baseUrl } from "../../config";

export interface CartItem {
  id: number;
  name: string;
  image: string;
  quantity: number;
  price: number;
  status?: string; // Optional status field
}

interface OrderResponse {
  order_id?: string;
  id?: string;
}

interface OrderData {
  cart_items: {
    productId: number;
    name: string;
    price: number;
    quantity: number;
  }[];
  table_number: number;
  total_amount: number;
  payment_method: string;
  estimated_time: string;
}

interface UserCartProps {
  items: CartItem[];
  onClose: () => void;
  onIncrement?: (id: number) => void;
  onDecrement?: (id: number) => void;
  orderId?: string;
  onNextStep?: () => void;
  onItemDelete?: (id: number) => void;
}

const baseURL = baseUrl;
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || `${baseURL}/api`;

const UserCart: React.FC<UserCartProps> = ({
  items,
  onClose,
  onIncrement,
  onDecrement,
  orderId,
  onNextStep,
  onItemDelete,
}) => {
  const [cartItems, setCartItems] = useState<CartItem[]>(items || []);
  const [paymentMethod, setPaymentMethod] =
    useState<"Cash on Counter">("Cash on Counter");
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [tableNumber, setTableNumber] = useState<number>(1);
  const navigate = useNavigate();
  const isLoggedIn = Boolean(localStorage.getItem("role"));
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [discountAmount, setDiscountAmount] = useState(0);

  useEffect(() => {
    const storedTableNumber = localStorage.getItem("table_number");
    if (storedTableNumber) {
      setTableNumber(parseInt(storedTableNumber));
    }
    const isFromTrackOrderPage = !!orderId; // Only true if orderId prop is passed
    setIsEditing(isFromTrackOrderPage);

    const currentOrderId = orderId;
    let existingItems: CartItem[] = [];

    const storedItems = localStorage.getItem("existingItems");
    if (storedItems) {
      try {
        existingItems = JSON.parse(storedItems);
      } catch (error) {
        console.error("Failed to parse existingItems:", error);
      }
    }

    if (currentOrderId) {
      existingItems = existingItems.filter((item) => {
        const itemOrderId = localStorage.getItem(`item_${item.id}_orderId`);
        return itemOrderId === currentOrderId;
      });
    }

    const storedNewItems = localStorage.getItem("newlyAddedItems");
    let newItems: CartItem[] = storedNewItems ? JSON.parse(storedNewItems) : [];
    if (currentOrderId) {
      newItems = newItems.filter((item) => {
        const itemOrderId = localStorage.getItem(`item_${item.id}_orderId`);
        return !itemOrderId || itemOrderId === currentOrderId;
      });
    }

    let allItems = mergeAllItems(items, existingItems, newItems);

    allItems.forEach((item) => {
      if (currentOrderId) {
        localStorage.setItem(`item_${item.id}_orderId`, currentOrderId);
      }
    });

    setCartItems(allItems);
    localStorage.setItem("existingItems", JSON.stringify(allItems));

    if (newItems.length > 0) {
      const newItemNames = newItems.map((item) => item.name).join(", ");
      toast.success(`Added to cart: ${newItemNames}`, {
        position: "top-center",
        autoClose: 3000,
      });
      localStorage.removeItem("newlyAddedItems");
    }
  }, [items, orderId]);

  const mergeAllItems = (
    propItems: CartItem[],
    existingItems: CartItem[],
    newItems: CartItem[]
  ): CartItem[] => {
    const mergedItemsMap = new Map<number, CartItem>();

    existingItems.forEach((item) => {
      mergedItemsMap.set(item.id, {
        ...item,
        image: item.image || cartImg,
        status: item.status, // ✅ Preserve status
      });
    });

    newItems.forEach((item) => {
      mergedItemsMap.set(item.id, {
        ...item,
        image: item.image || cartImg,
        status: item.status, // ✅ Preserve status
      });
    });

    propItems.forEach((item) => {
      if (!mergedItemsMap.has(item.id)) {
        mergedItemsMap.set(item.id, {
          ...item,
          image: item.image || cartImg,
          status: item.status, // ✅ Keep status from props too
        });
      }
    });

    return Array.from(mergedItemsMap.values());
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      toast.error("Please enter a coupon code");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `${API_BASE_URL}/coupons/validate`,
        {
          code: couponCode,
          orderTotal: total,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const { discount, coupon } = res.data;
      setDiscountAmount(discount);
      setAppliedCoupon(coupon);

      toast.success(`Coupon applied: ₹${discount} off`, {
        position: "top-center",
      });
    } catch (err: any) {
      console.error("Coupon Error:", err);
      toast.error(
        err?.response?.data?.error || "Invalid or expired coupon code"
      );
      setAppliedCoupon(null);
      setDiscountAmount(0);
    }
  };

  const handleIncrement = (id: number) => {
    const updatedItems = cartItems.map((item) =>
      item.id === id ? { ...item, quantity: item.quantity + 1 } : item
    );
    setCartItems(updatedItems);
    localStorage.setItem("existingItems", JSON.stringify(updatedItems));
  };

  const handleDecrement = (id: number) => {
    const updatedItems = cartItems.map((item) =>
      item.id === id && item.quantity > 1
        ? { ...item, quantity: item.quantity - 1 }
        : item
    );
    setCartItems(updatedItems);
    localStorage.setItem("existingItems", JSON.stringify(updatedItems));
  };

  const handleDelete = (id: number) => {
    const itemToDelete = cartItems.find((item) => item.id === id);
    const updatedItems = cartItems.filter((item) => item.id !== id);
    setCartItems(updatedItems);
    localStorage.setItem("existingItems", JSON.stringify(updatedItems));
    localStorage.removeItem(`item_${id}_orderId`);
    if (onItemDelete) {
      onItemDelete(id);
    }
    if (itemToDelete) {
      toast.info(`Removed: ${itemToDelete.name}`, {
        position: "top-center",
        autoClose: 3000,
      });
    }
  };

  const handleAddNewItem = () => {
    const editId = orderId || localStorage.getItem("editOrderId") || "";

    // Save current cart items
    localStorage.setItem("existingItems", JSON.stringify(cartItems));
    localStorage.setItem("editOrderId", editId);

    // Save orderId reference for each item
    cartItems.forEach((item) => {
      localStorage.setItem(`item_${item.id}_orderId`, editId);
    });

    // Also store them as newly added items
    localStorage.setItem("newlyAddedItems", JSON.stringify(cartItems));

    navigate("/restaurant");
  };

  const total = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const finalAmount = Math.max(0, total - discountAmount);

  const handleOrderSubmit = async () => {
    if (cartItems.length === 0) {
      toast.error("Your cart is empty.", {
        position: "top-center",
        autoClose: 3000,
      });
      return;
    }

    if (tableNumber <= 0) {
      toast.error("Please enter a valid table number.", {
        position: "top-center",
        autoClose: 3000,
      });
      return;
    }

    setLoading(true);

    const cart_items = cartItems.map((item) => ({
      productId: item.id,
      quantity: item.quantity,
      price: item.price,
      name: item.name,
      status: item.status || "Pending", // ✅ Default to "Pending" if missing
    }));

    const businessId = Number(localStorage.getItem("businessId"));

    const orderData: OrderData & { businessId: number | null } = {
      businessId, // ✅ Add this line
      table_number: tableNumber,
      cart_items,
      total_amount: finalAmount,
      payment_method: paymentMethod,
      estimated_time: "15 min",
    };

    const currentOrderId = orderId || localStorage.getItem("editOrderId");

    try {
      const response = currentOrderId
        ? await axios.put<OrderResponse>(
            `${API_BASE_URL}/orders/${currentOrderId}`,
            orderData
          )
        : await axios.post<OrderResponse>(`${API_BASE_URL}/orders`, orderData);

      if ([200, 201].includes(response.status)) {
        const newOrderId =
          response.data.order_id || response.data.id || currentOrderId || "N/A";
        localStorage.setItem("lastOrderId", newOrderId);

        localStorage.removeItem("editOrderId");
        localStorage.removeItem("existingItems");
        localStorage.removeItem("newlyAddedItems");

        cartItems.forEach((item) => {
          localStorage.removeItem(`item_${item.id}_orderId`);
        });

        toast.success(
          `Order ${currentOrderId ? "updated" : "placed"} successfully!`,
          {
            position: "top-center",
            autoClose: 3000,
          }
        );

        onNextStep?.();

        setTimeout(() => {
          window.location.href = "/track-order";
        }, 500);
      }
    } catch (error) {
      console.error("Order Error:", error);
      toast.error(`Failed to ${currentOrderId ? "update" : "place"} order.`, {
        position: "top-center",
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const currentOrderId = orderId || localStorage.getItem("editOrderId");
  const isEditMode = !!currentOrderId;

  return (
    <>
      <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-40">
        <div className="w-[90%] max-w-sm bg-white shadow-2xl flex flex-col rounded-2xl overflow-hidden">
          <div className="relative">
            <img
              src={cartImg}
              alt="Cart banner"
              className="w-full h-36 object-cover"
            />
            <button
              className="absolute top-3 right-3 bg-[#FF2E2E] text-white rounded-full w-8 h-8 flex items-center justify-center"
              onClick={onClose}
            >
              ✕
            </button>
          </div>

          <div className="p-4 overflow-y-auto text-[#333] max-h-[60vh]">
            <div className="flex justify-between text-sm font-semibold mb-2 text-[#555]">
              <div className="font-bold">
                {isEditMode ? (
                  <div>
                    <div className="text-orange-600">Editing Order</div>
                    <div className="text-xs text-gray-600">
                      {currentOrderId}
                    </div>
                  </div>
                ) : (
                  "My Cart"
                )}
              </div>
              <span className="text-xl font-bold">›</span>
            </div>

            <h2 className="text-xl font-bold mb-3">Today's Meal</h2>

            {cartItems.length === 0 && (
              <p className="text-center text-gray-500">No items in cart.</p>
            )}

            {cartItems.map((item) => (
              <div
                key={item.id}
                className="flex justify-between bg-[#FFF6F0] p-3 mb-3 rounded-xl shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={item.image || cartImg}
                    alt={item.name}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <span className="text-sm font-semibold">{item.name}</span>
                </div>
                <div className="flex items-center gap-2 bg-white rounded-full px-3 py-1 border border-gray-300 shadow">
                  <button
                    onClick={() => handleDecrement(item.id)}
                    className="hover:text-orange-600 transition-colors"
                    title="Decrease quantity"
                  >
                    <FaMinus />
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    onClick={() => handleIncrement(item.id)}
                    className="hover:text-orange-600 transition-colors"
                    title="Increase quantity"
                  >
                    <FaPlus />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="text-red-600 hover:text-red-700 transition-colors"
                    title="Remove item"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))}

            {isEditMode && (
              <div className="text-center mb-4">
                <button
                  onClick={handleAddNewItem}
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
                >
                  + Add New Item
                </button>
              </div>
            )}

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Apply Coupon
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  placeholder="Enter coupon code"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                />
                <button
                  onClick={handleApplyCoupon}
                  className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                >
                  Apply
                </button>
              </div>
              {appliedCoupon && (
                <div className="text-green-600 text-sm mt-1">
                  ✅ Applied: {appliedCoupon.code} (−₹{discountAmount})
                </div>
              )}
            </div>

            <div className="px-4 pt-2 text-center text-lg font-bold text-black">
              Total to pay ₹{finalAmount}
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Table Number
              </label>
              <input
                type="number"
                value={tableNumber}
                onChange={(e) => {
                  const value = Math.max(1, parseInt(e.target.value) || 0);
                  setTableNumber(value);
                  localStorage.setItem("table_number", value.toString());
                }}
                min="1"
                disabled={!isLoggedIn}
                className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 ${
                  isLoggedIn
                    ? "focus:ring-orange-500"
                    : "bg-gray-100 cursor-not-allowed"
                }`}
                placeholder={
                  isLoggedIn
                    ? "Enter table number"
                    : "Login to set table number"
                }
              />
            </div>

            <div className="text-sm mb-4">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  value="Cash on Counter"
                  checked={paymentMethod === "Cash on Counter"}
                  onChange={() => setPaymentMethod("Cash on Counter")}
                />
                Cash on Counter
              </label>
            </div>

            <div className="bg-[#FFF7F0] border border-[#FFD2A8] rounded-xl p-3 text-center text-sm text-orange-600 font-semibold mb-4">
              <div className="text-xl mb-1">🛎️</div>
              At Your Table <br /> in <strong>15 min</strong>
            </div>
          </div>

          <div className="px-4 pb-4">
            <button
              onClick={handleOrderSubmit}
              className={`bg-[#FF6B00] hover:bg-orange-700 text-white font-bold rounded-xl w-full py-3 shadow-md transition ${
                loading || cartItems.length === 0
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
              disabled={loading || cartItems.length === 0}
            >
              {loading
                ? isEditMode
                  ? "Saving..."
                  : "Placing Order..."
                : isEditMode
                ? "Save Changes"
                : "Secure Payment"}
            </button>
          </div>
        </div>
      </div>

      {/* Toast Container for Notifications */}
      <ToastContainer position="top-center" autoClose={3000} />
    </>
  );
};

export default UserCart;
