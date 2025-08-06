import React, { useEffect, useState } from "react";
import axios from "axios";
import { baseUrl } from "../config";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loader from "../components/Loader"; // adjust path if needed

const AddCouponPage: React.FC = () => {
  const [coupons, setCoupons] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteCouponId, setDeleteCouponId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    code: "",
    discountType: "flat",
    discountValue: "",
    maxDiscount: "",
    minOrderValue: "",
    validFrom: "",
    validTill: "",
    usageLimit: "",
    description: "",
  });

  const fetchCoupons = async () => {
    const token = localStorage.getItem("token");
    try {
      setIsLoading(true);
      const res = await axios.get(`${baseUrl}/api/coupons`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCoupons(res.data || []);
    } catch (err) {
      console.error("Fetch error:", err);
      toast.error("Failed to fetch coupons");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      setIsLoading(true);
      if (editMode && editingId !== null) {
        await axios.put(`${baseUrl}/api/coupons/${editingId}`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Coupon updated successfully");
      } else {
        await axios.post(`${baseUrl}/api/coupons/create`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Coupon added successfully");
      }

      setFormData({
        code: "",
        discountType: "flat",
        discountValue: "",
        maxDiscount: "",
        minOrderValue: "",
        validFrom: "",
        validTill: "",
        usageLimit: "",
        description: "",
      });
      setEditMode(false);
      setEditingId(null);
      fetchCoupons();
    } catch (err) {
      console.error("Coupon submit error:", err);
      toast.error("Failed to submit coupon");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteCoupon = async () => {
    if (!deleteCouponId) return;
    const token = localStorage.getItem("token");
    try {
      setIsDeleting(true);
      setIsLoading(true);
      await axios.delete(`${baseUrl}/api/coupons/${deleteCouponId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Coupon deleted successfully");
      setShowConfirm(false);
      fetchCoupons();
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete coupon");
    } finally {
      setIsDeleting(false);
      setIsLoading(false);
      setDeleteCouponId(null);
    }
  };

  return (
    <>
      {isLoading && <Loader />}
      <div className="p-4 bg-white min-h-[calc(100vh-4rem)] flex justify-center">
        <div className="w-full max-w-6xl">
          {" "}
          {/* Added container with max width */}
          <h1 className="text-4xl font-bold text-orange-800 mb-4">
            Add Coupon
          </h1>
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8"
          >
            <input
              name="code"
              placeholder="Coupon Code"
              required
              value={formData.code}
              onChange={handleChange}
              className="border p-2 rounded"
            />
            <select
              name="discountType"
              value={formData.discountType}
              onChange={handleChange}
              className="border p-2 rounded"
              aria-label="Discount Type"
            >
              <option value="flat">Flat ₹</option>
              <option value="percent">Percentage %</option>
            </select>
            <input
              name="discountValue"
              placeholder="Discount Value"
              required
              type="number"
              value={formData.discountValue}
              onChange={handleChange}
              className="border p-2 rounded"
            />
            <input
              name="maxDiscount"
              placeholder="Max Discount (optional)"
              type="number"
              value={formData.maxDiscount}
              onChange={handleChange}
              className="border p-2 rounded"
            />
            <input
              name="minOrderValue"
              placeholder="Min Order Value"
              required
              type="number"
              value={formData.minOrderValue}
              onChange={handleChange}
              className="border p-2 rounded"
            />
            <input
              name="validFrom"
              placeholder="Valid From"
              required
              type="date"
              value={formData.validFrom}
              onChange={handleChange}
              className="border p-2 rounded"
            />
            <input
              name="validTill"
              placeholder="Valid Till"
              required
              type="date"
              value={formData.validTill}
              onChange={handleChange}
              className="border p-2 rounded"
            />
            <input
              name="usageLimit"
              placeholder="Usage Limit"
              required
              type="number"
              value={formData.usageLimit}
              onChange={handleChange}
              className="border p-2 rounded"
            />
            <input
              name="description"
              placeholder="Description"
              value={formData.description}
              onChange={handleChange}
              className="col-span-full border p-2 rounded"
            />
            <button
              type="submit"
              className="col-span-full bg-orange-600 text-white py-2 rounded hover:bg-orange-700"
            >
              {editMode ? "Update Coupon" : "Create Coupon"}
            </button>
          </form>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">
            Existing Coupons
          </h2>
          {coupons.length === 0 ? (
            <p className="text-gray-500">No coupons created yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-200 text-sm text-left">
                <thead className="bg-gray-100 text-gray-700 font-semibold">
                  <tr>
                    <th className="py-2 px-4">Code</th>
                    <th className="py-2 px-4">Type</th>
                    <th className="py-2 px-4">Value</th>
                    <th className="py-2 px-4">Min Order</th>
                    <th className="py-2 px-4">Valid Till</th>
                    <th className="py-2 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {coupons.map((c: any) => (
                    <tr key={c.id} className="border-t">
                      <td className="py-2 px-4 font-semibold text-indigo-600">
                        {c.code}
                      </td>
                      <td className="py-2 px-4">{c.discountType}</td>
                      <td className="py-2 px-4">₹{c.discountValue}</td>
                      <td className="py-2 px-4">₹{c.minOrderValue}</td>
                      <td className="py-2 px-4">
                        {new Date(c.validTill).toLocaleDateString("en-IN")}
                      </td>
                      <td className="py-2 px-4 flex gap-2">
                        <button
                          onClick={() => {
                            setFormData({
                              code: c.code,
                              discountType: c.discountType,
                              discountValue: c.discountValue,
                              maxDiscount: c.maxDiscount || "",
                              minOrderValue: c.minOrderValue,
                              validFrom: c.validFrom.slice(0, 10),
                              validTill: c.validTill.slice(0, 10),
                              usageLimit: c.usageLimit,
                              description: c.description || "",
                            });
                            setEditMode(true);
                            setEditingId(c.id);
                            window.scrollTo({ top: 0, behavior: "smooth" });
                          }}
                          className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 text-xs"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => {
                            setShowConfirm(true);
                            setDeleteCouponId(c.id);
                          }}
                          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-xs"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* ✅ Delete Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-[320px] text-center shadow-lg">
            <p className="text-lg font-semibold mb-4 text-gray-800">
              Are you sure you want to delete this coupon?
            </p>
            <div className="flex justify-around">
              <button
                onClick={handleDeleteCoupon}
                disabled={isDeleting}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
              <button
                onClick={() => {
                  setShowConfirm(false);
                  setDeleteCouponId(null);
                }}
                className="bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-4 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <ToastContainer position="top-center" autoClose={1000} />
    </>
  );
};

export default AddCouponPage;
