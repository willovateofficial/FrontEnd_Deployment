import React, { useEffect, useState } from "react";
import axios from "axios";
import { baseUrl } from "../config";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  PlusIcon,
  XMarkIcon,
  PencilIcon,
  CheckIcon,
} from "@heroicons/react/24/outline";

type InventoryItem = {
  id: number;
  name: string;
  quantity: number;
  unit: string;
  threshold: number;
};

const InventoryPage = () => {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [newItem, setNewItem] = useState({
    name: "",
    quantity: "",
    unit: "",
    threshold: "",
  });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editItem, setEditItem] = useState({
    name: "",
    quantity: "",
    unit: "",
    threshold: "",
  });
  const [isLoading, setIsLoading] = useState(true);

  const fetchInventory = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${baseUrl}/api/inventory`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setInventory(res.data);
    } catch (error) {
      toast.error("Failed to fetch inventory");
      console.error("Fetch error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const handleAddStock = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      const payload = {
        ...newItem,
        quantity: parseFloat(newItem.quantity),
        threshold: parseFloat(newItem.threshold),
      };

      await axios.post(`${baseUrl}/api/inventory`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setNewItem({ name: "", quantity: "", unit: "", threshold: "" });
      setShowForm(false);
      fetchInventory();
      toast.success("Item added successfully");
    } catch (err) {
      toast.error("Failed to add item");
      console.error("Add error:", err);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent, id: number) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      const payload = {
        name: editItem.name,
        quantity: parseFloat(editItem.quantity),
        unit: editItem.unit,
        threshold: parseFloat(editItem.threshold),
      };

      await axios.put(`${baseUrl}/api/inventory/${id}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setEditingId(null);
      fetchInventory();
      toast.success("Item updated successfully");
    } catch (err) {
      toast.error("Failed to update item");
      console.error("Update error:", err);
    }
  };

  const getStatus = (qty: number, threshold: number) => {
    if (qty === 0) return "Out of Stock";
    if (qty < threshold) return "Low Stock";
    return "In Stock";
  };

  const getStatusColor = (qty: number, threshold: number) => {
    if (qty === 0) return "bg-red-50 text-red-700 border-red-200";
    if (qty < threshold) return "bg-amber-50 text-amber-700 border-amber-200";
    return "bg-green-50 text-green-700 border-green-200";
  };

  const getStatusIcon = (qty: number, threshold: number) => {
    if (qty === 0) return "❌";
    if (qty < threshold) return "⚠️";
    return "✅";
  };

  return (
    <div className="min-h-screen bg-white py-4 px-2 sm:py-6 sm:px-4 lg:px-8 -mt-4 mb-10">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col justify-between items-start mb-4 sm:mb-8 sm:flex-row sm:items-center">
          <div className="mb-3 sm:mb-0">
            <h1 className="text-2xl sm:text-4xl font-extrabold text-orange-900">
              Inventory Management
            </h1>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">
              Track and manage your restaurant's ingredients
            </p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="inline-flex items-center justify-center px-3 py-2 sm:px-4 sm:py-2.5 border border-transparent text-xs sm:text-sm font-medium rounded-lg shadow-sm text-white bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-all w-full sm:w-auto min-w-[120px]"
          >
            {showForm ? (
              <>
                <XMarkIcon className="-ml-1 mr-1 h-4 w-4 sm:h-5 sm:w-5" />
                Cancel
              </>
            ) : (
              <>
                <PlusIcon className="-ml-1 mr-1 h-4 w-4 sm:h-5 sm:w-5" />
                Add New Item
              </>
            )}
          </button>
        </div>

        {/* Add Item Form */}
        {showForm && (
          <div className="bg-white rounded-lg sm:rounded-xl shadow-md border border-gray-100 p-3 sm:p-6 mb-4 sm:mb-8">
            <h2 className="text-md sm:text-lg font-bold text-gray-900 mb-3 flex items-center">
              <span className="bg-orange-100 text-orange-600 p-1.5 sm:p-2 rounded-lg mr-2 sm:mr-3">
                <PlusIcon className="h-4 w-4 sm:h-5 sm:w-5" />
              </span>
              Add New Inventory Item
            </h2>
            <form
              onSubmit={handleAddStock}
              className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4"
            >
              <div>
                <label
                  htmlFor="name"
                  className="block text-xs sm:text-sm font-medium text-gray-700 mb-1"
                >
                  Ingredient Name
                </label>
                <input
                  type="text"
                  id="name"
                  className="block w-full border border-gray-200 rounded-lg shadow-sm py-2 px-3 sm:py-2.5 sm:px-4 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition text-xs sm:text-sm"
                  value={newItem.name}
                  onChange={(e) =>
                    setNewItem({ ...newItem, name: e.target.value })
                  }
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="quantity"
                  className="block text-xs sm:text-sm font-medium text-gray-700 mb-1"
                >
                  Quantity
                </label>
                <input
                  type="number"
                  id="quantity"
                  className="block w-full border border-gray-200 rounded-lg shadow-sm py-2 px-3 sm:py-2.5 sm:px-4 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition text-xs sm:text-sm"
                  value={newItem.quantity}
                  onChange={(e) =>
                    setNewItem({ ...newItem, quantity: e.target.value })
                  }
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="unit"
                  className="block text-xs sm:text-sm font-medium text-gray-700 mb-1"
                >
                  Unit
                </label>
                <input
                  type="text"
                  id="unit"
                  className="block w-full border border-gray-200 rounded-lg shadow-sm py-2 px-3 sm:py-2.5 sm:px-4 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition text-xs sm:text-sm"
                  value={newItem.unit}
                  onChange={(e) =>
                    setNewItem({ ...newItem, unit: e.target.value })
                  }
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="threshold"
                  className="block text-xs sm:text-sm font-medium text-gray-700 mb-1"
                >
                  Minimum Threshold
                </label>
                <input
                  type="number"
                  id="threshold"
                  className="block w-full border border-gray-200 rounded-lg shadow-sm py-2 px-3 sm:py-2.5 sm:px-4 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition text-xs sm:text-sm"
                  value={newItem.threshold}
                  onChange={(e) =>
                    setNewItem({ ...newItem, threshold: e.target.value })
                  }
                  required
                />
              </div>

              <div className="sm:col-span-2">
                <button
                  type="submit"
                  className="inline-flex justify-center py-2 px-4 sm:py-3 sm:px-6 border border-transparent shadow-sm text-xs sm:text-sm font-medium rounded-lg text-white bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-all w-full"
                >
                  Add to Inventory
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Inventory List */}
        <div className="bg-white rounded-lg sm:rounded-xl shadow-md border border-gray-100">
          {isLoading ? (
            <div className="p-4 sm:p-6 text-center">
              <div className="flex justify-center">
                <div className="animate-spin rounded-full h-8 w-8 sm:h-10 sm:w-10 border-t-2 border-b-2 border-orange-500"></div>
              </div>
            </div>
          ) : inventory.length === 0 ? (
            <div className="p-4 sm:p-6 text-center text-gray-500 text-xs sm:text-sm">
              No inventory items found. Add your first item to get started.
            </div>
          ) : (
            <>
              {/* Desktop Table View */}
              <div className="hidden sm:block">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-orange-600">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-center text-xs sm:text-sm font-semibold text-white uppercase tracking-wider"
                      >
                        Ingredient
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-center text-xs sm:text-sm font-semibold text-white uppercase tracking-wider"
                      >
                        Quantity
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-center text-xs sm:text-sm font-semibold text-white uppercase tracking-wider"
                      >
                        Unit
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-center text-xs sm:text-sm font-semibold text-white uppercase tracking-wider"
                      >
                        Threshold
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-center text-xs sm:text-sm font-semibold text-white uppercase tracking-wider"
                      >
                        Status
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-center text-xs sm:text-sm font-semibold text-white uppercase tracking-wider"
                      >
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {inventory.map((item) => (
                      <React.Fragment key={item.id}>
                        <tr className="hover:bg-orange-50/50 transition">
                          <td className="px-6 py-4 whitespace-nowrap text-center text-sm sm:text-md font-medium text-gray-900">
                            {item.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center text-sm sm:text-md text-gray-700 font-medium">
                            {item.quantity}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center text-sm sm:text-md text-gray-700">
                            {item.unit}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center text-sm sm:text-md text-gray-700">
                            {item.threshold}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            <span
                              className={`px-2 py-1 sm:px-3 sm:py-1 inline-flex items-center text-xs sm:text-sm leading-5 font-bold rounded-full border ${getStatusColor(
                                item.quantity,
                                item.threshold
                              )}`}
                            >
                              {getStatusIcon(item.quantity, item.threshold)}{" "}
                              {getStatus(item.quantity, item.threshold)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center text-sm sm:text-md font-medium">
                            <button
                              onClick={() => {
                                setEditingId(item.id);
                                setEditItem({
                                  name: item.name,
                                  quantity: item.quantity.toString(),
                                  unit: item.unit,
                                  threshold: item.threshold.toString(),
                                });
                              }}
                              className="text-orange-600 hover:text-orange-800 flex items-center justify-center mx-auto"
                            >
                              <PencilIcon className="h-3 w-3 sm:h-4 sm:w-4 mr-1" /> Edit
                            </button>
                          </td>
                        </tr>

                        {editingId === item.id && (
                          <tr className="bg-orange-50">
                            <td colSpan={6} className="px-6 py-4">
                              <form
                                onSubmit={(e) => handleEditSubmit(e, item.id)}
                                className="grid grid-cols-1 sm:grid-cols-5 gap-3 sm:gap-4 items-center"
                              >
                                <div className="sm:col-span-2">
                                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                                    Update Item Details
                                  </label>
                                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
                                    <input
                                      type="text"
                                      className="block w-full border border-gray-200 rounded-lg shadow-sm py-1.5 px-2 sm:py-2 sm:px-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition text-xs sm:text-sm"
                                      placeholder="Name"
                                      value={editItem.name}
                                      onChange={(e) =>
                                        setEditItem({
                                          ...editItem,
                                          name: e.target.value,
                                        })
                                      }
                                      required
                                    />
                                    <input
                                      type="number"
                                      className="block w-full border border-gray-200 rounded-lg shadow-sm py-1.5 px-2 sm:py-2 sm:px-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition text-xs sm:text-sm"
                                      placeholder="Qty"
                                      value={editItem.quantity}
                                      onChange={(e) =>
                                        setEditItem({
                                          ...editItem,
                                          quantity: e.target.value,
                                        })
                                      }
                                      required
                                    />
                                    <input
                                      type="text"
                                      className="block w-full border border-gray-200 rounded-lg shadow-sm py-1.5 px-2 sm:py-2 sm:px-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition text-xs sm:text-sm"
                                      placeholder="Unit"
                                      value={editItem.unit}
                                      onChange={(e) =>
                                        setEditItem({
                                          ...editItem,
                                          unit: e.target.value,
                                        })
                                      }
                                      required
                                    />
                                    <input
                                      type="number"
                                      className="block w-full border border-gray-200 rounded-lg shadow-sm py-1.5 px-2 sm:py-2 sm:px-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition text-xs sm:text-sm"
                                      placeholder="Threshold"
                                      value={editItem.threshold}
                                      onChange={(e) =>
                                        setEditItem({
                                          ...editItem,
                                          threshold: e.target.value,
                                        })
                                      }
                                      required
                                    />
                                  </div>
                                </div>
                                <div className="flex items-center">
                                  <span
                                    className={`px-2 py-1 text-xs font-semibold rounded-full border ${getStatusColor(
                                      parseFloat(editItem.quantity),
                                      parseFloat(editItem.threshold)
                                    )}`}
                                  >
                                    {getStatus(
                                      parseFloat(editItem.quantity),
                                      parseFloat(editItem.threshold)
                                    )}
                                  </span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <button
                                    type="submit"
                                    className="inline-flex items-center px-3 py-1.5 sm:px-4 sm:py-2 border border-transparent text-xs sm:text-sm font-medium rounded-lg shadow-sm text-white bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-all"
                                  >
                                    <CheckIcon className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                                    Save
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setEditingId(null)}
                                    className="inline-flex items-center px-3 py-1.5 sm:px-4 sm:py-2 border border-gray-300 text-xs sm:text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-all"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </form>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card View */}
              <div className="sm:hidden space-y-3 p-2">
                {inventory.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white border border-gray-200 rounded-lg shadow-sm p-3 hover:bg-orange-50/50 transition"
                  >
                    {editingId === item.id ? (
                      <form
                        onSubmit={(e) => handleEditSubmit(e, item.id)}
                        className="space-y-2"
                      >
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            Ingredient Name
                          </label>
                          <input
                            type="text"
                            className="block w-full border border-gray-200 rounded-lg shadow-sm py-1.5 px-2 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition text-xs"
                            placeholder="Name"
                            value={editItem.name}
                            onChange={(e) =>
                              setEditItem({
                                ...editItem,
                                name: e.target.value,
                              })
                            }
                            required
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                              Quantity
                            </label>
                            <input
                              type="number"
                              className="block w-full border border-gray-200 rounded-lg shadow-sm py-1.5 px-2 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition text-xs"
                              placeholder="Qty"
                              value={editItem.quantity}
                              onChange={(e) =>
                                setEditItem({
                                  ...editItem,
                                  quantity: e.target.value,
                                })
                              }
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                              Unit
                            </label>
                            <input
                              type="text"
                              className="block w-full border border-gray-200 rounded-lg shadow-sm py-1.5 px-2 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition text-xs"
                              placeholder="Unit"
                              value={editItem.unit}
                              onChange={(e) =>
                                setEditItem({
                                  ...editItem,
                                  unit: e.target.value,
                                })
                              }
                              required
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            Minimum Threshold
                          </label>
                          <input
                            type="number"
                            className="block w-full border border-gray-200 rounded-lg shadow-sm py-1.5 px-2 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition text-xs"
                            placeholder="Threshold"
                            value={editItem.threshold}
                            onChange={(e) =>
                              setEditItem({
                                ...editItem,
                                threshold: e.target.value,
                              })
                            }
                            required
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <span
                            className={`px-2 py-1 text-xs font-semibold rounded-full border ${getStatusColor(
                              parseFloat(editItem.quantity),
                              parseFloat(editItem.threshold)
                            )}`}
                          >
                            {getStatusIcon(
                              parseFloat(editItem.quantity),
                              parseFloat(editItem.threshold)
                            )}{" "}
                            {getStatus(
                              parseFloat(editItem.quantity),
                              parseFloat(editItem.threshold)
                            )}
                          </span>
                          <div className="flex space-x-2">
                            <button
                              type="submit"
                              className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-lg shadow-sm text-white bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-all"
                            >
                              <CheckIcon className="h-3 w-3 mr-1" />
                              Save
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditingId(null)}
                              className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-all"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      </form>
                    ) : (
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <h3 className="text-sm font-bold text-gray-900">
                            {item.name}
                          </h3>
                          <button
                            onClick={() => {
                              setEditingId(item.id);
                              setEditItem({
                                name: item.name,
                                quantity: item.quantity.toString(),
                                unit: item.unit,
                                threshold: item.threshold.toString(),
                              });
                            }}
                            className="text-orange-600 hover:text-orange-800 flex items-center text-xs"
                          >
                            <PencilIcon className="h-3 w-3 mr-1" /> Edit
                          </button>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <span className="block text-xs font-medium text-gray-700">
                              Quantity
                            </span>
                            <span className="text-xs text-gray-900">
                              {item.quantity}
                            </span>
                          </div>
                          <div>
                            <span className="block text-xs font-medium text-gray-700">
                              Unit
                            </span>
                            <span className="text-xs text-gray-900">
                              {item.unit}
                            </span>
                          </div>
                          <div>
                            <span className="block text-xs font-medium text-gray-700">
                              Threshold
                            </span>
                            <span className="text-xs text-gray-900">
                              {item.threshold}
                            </span>
                          </div>
                          <div>
                            <span className="block text-xs font-medium text-gray-700">
                              Status
                            </span>
                            <span
                              className={`px-2 py-0.5 inline-flex items-center text-xs font-bold rounded-full border ${getStatusColor(
                                item.quantity,
                                item.threshold
                              )}`}
                            >
                              {getStatusIcon(item.quantity, item.threshold)}{" "}
                              {getStatus(item.quantity, item.threshold)}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        <ToastContainer
          position="top-center"
          autoClose={1000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          pauseOnFocusLoss
          draggable
          pauseOnHover
          toastClassName="rounded-lg shadow-lg"
        />
      </div>
    </div>
  );
};

export default InventoryPage;