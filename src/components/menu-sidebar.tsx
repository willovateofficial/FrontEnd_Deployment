import React, { useState } from "react";
import { FaChevronDown, FaChevronUp, FaEdit, FaTrash } from "react-icons/fa";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useCategories } from "../hooks/useCategory";
import { baseUrl } from "../config";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loader from "../components/Loader";

interface SidebarProps {
  onCategorySelect: (category: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onCategorySelect }) => {
  const businessId = localStorage.getItem("businessId");
  const { data: categories = [], isLoading } = useCategories(businessId);
  const [newItem, setNewItem] = useState("");
  const [showInput, setShowInput] = useState(false);
  const [activeItem, setActiveItem] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");
  const [newImage, setNewImage] = useState<File | null>(null);
  const [editImage, setEditImage] = useState<File | null>(null);

  const queryClient = useQueryClient();
  const token = localStorage.getItem("authToken");

  const { mutate: addCategory, isPending: isAdding } = useMutation({
    mutationFn: async (newCategory: string) => {
      const formData = new FormData();
      formData.append("name", newCategory);
      if (newImage) formData.append("image", newImage);
      return axios.post(`${baseUrl}/api/categories`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      setNewItem("");
      setNewImage(null);
      setShowInput(false);
      toast.success("Category added successfully!");
    },
    onError: () => toast.error("Error adding category"),
  });

  const { mutate: editCategory, isPending: isEditing } = useMutation({
    mutationFn: async ({ id, name }: { id: number; name: string }) => {
      const formData = new FormData();
      formData.append("name", name);
      if (editImage) formData.append("image", editImage);
      return axios.put(`${baseUrl}/api/categories/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      setEditId(null);
      setEditName("");
      setEditImage(null);
      toast.success("Category updated successfully!");
    },
    onError: () => toast.error("Error updating category"),
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: async (id: number) => {
      return axios.delete(`${baseUrl}/api/categories/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success("Category deleted successfully!");
    },
    onError: () => toast.error("Error deleting category"),
  });

  const handleSelect = (item: string) => {
    setActiveItem(item);
    onCategorySelect(item);
    setDropdownOpen(false);
  };

  const handleAddItem = () => {
    if (!newItem.trim()) {
      toast.error("Category name is required");
      return;
    }

    if (!newImage) {
      toast.error("Please upload an image for the category");
      return;
    }

    addCategory(newItem.trim());
  };

  const renderCategory = (item: any) => {
    const isEditingItem = editId === item.id;

    return (
      <li
        key={item.id}
        className={`group px-2 py-2 rounded hover:bg-yellow-400 ${
          activeItem === item.name
            ? "bg-yellow-400 text-white font-semibold"
            : ""
        }`}
      >
        {isEditingItem ? (
          <div className="flex flex-col gap-2 bg-yellow-50 p-2 rounded">
            <input
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              placeholder="Edit category name"
              className="w-full px-3 py-1 border border-gray-300 rounded"
            />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setEditImage(e.target.files?.[0] || null)}
              className="w-full"
              title="Upload category image"
              placeholder="Upload category image"
            />
            <div className="flex justify-end gap-3 mt-2">
              <button
                onClick={() => editCategory({ id: item.id, name: editName })}
                className="bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600"
                disabled={isEditing}
              >
                {isEditing ? "Saving..." : "Save"}
              </button>
              <button
                onClick={() => setEditId(null)}
                className="bg-gray-300 text-black px-4 py-1 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="flex justify-between items-center">
            <span
              className="flex-1 cursor-pointer text-lg"
              onClick={() => handleSelect(item.name)}
            >
              {item.name}
            </span>
            <FaEdit
              onClick={() => {
                setEditId(item.id);
                setEditName(item.name);
              }}
              className="text-blue-600 cursor-pointer ml-2 opacity-0 group-hover:opacity-100 transition"
            />
            <FaTrash
              onClick={() => {
                toast.info("Click again to confirm deletion", {
                  autoClose: 1500,
                  onClose: () => deleteCategoryMutation.mutate(item.id),
                });
              }}
              className="text-red-600 cursor-pointer ml-2 opacity-0 group-hover:opacity-100 transition"
            />
          </div>
        )}
      </li>
    );
  };

  return (
    <>
      {isAdding && <Loader/>}
      <aside className="w-full md:w-64 bg-white shadow-md md:p-4 p-2">
        <div className="md:hidden">
          <div
            className="flex items-center justify-between text-xl font-bold px-4 py-2 rounded-full cursor-pointer"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            <span>Category</span>
            {dropdownOpen ? <FaChevronUp /> : <FaChevronDown />}
          </div>

          {dropdownOpen && (
            <ul className="mt-2 space-y-1">
              {/*Add Button FIRST */}
              <li>
                <button
                  onClick={() => setShowInput(true)}
                  className="w-full bg-yellow-400 bg-gradient-to-r from-orange-400 to-amber-500 hover:from-orange-500 hover:to-amber-600 focus:outline-none text-white py-1 rounded-full font-bold flex items-center justify-center gap-2"
                >
                  <span className="text-2xl">+</span> Add
                </button>
              </li>

              {/*Input field (if Add is clicked) */}
              {showInput && (
                <li className="mt-2">
                  <input
                    type="text"
                    value={newItem}
                    onChange={(e) => setNewItem(e.target.value)}
                    placeholder="Enter new menu item"
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                  />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setNewImage(e.target.files?.[0] || null)}
                    className="mt-2 w-full"
                    title="Upload category image"
                    placeholder="Upload category image"
                  />
                  <button
                    onClick={handleAddItem}
                    disabled={isAdding}
                    className="mt-1 w-full bg-green-500 text-white px-4 py-2 rounded"
                  >
                    {isAdding ? "Adding..." : "Add Category"}
                  </button>
                </li>
              )}

              {/*Category List */}
              {isLoading ? (
                <li>Loading...</li>
              ) : (
                categories.map((item) => renderCategory(item))
              )}
            </ul>
          )}
        </div>

        <div
          className="hidden md:block"
          style={{ height: "calc(100vh - 64px)", overflowY: "auto" }}
        >
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-2xl font-bold">Category</h2>
            <button
              onClick={() => setShowInput(true)}
              className="bg-yellow-400 bg-gradient-to-r from-orange-400 to-amber-500 hover:from-orange-500 hover:to-amber-600 focus:outline-none transition text-white py-1 px-5 rounded-xl font-bold flex items-center gap-1"
            >
              <span className="text-xl">+</span> Add
            </button>
          </div>

          {showInput && (
            <div className="mb-4">
              <input
                type="text"
                value={newItem}
                onChange={(e) => setNewItem(e.target.value)}
                placeholder="Enter new menu item"
                className="w-full px-3 py-2 border border-gray-300 rounded"
              />
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setNewImage(e.target.files?.[0] || null)}
                className="mt-2 w-full"
                title="Upload category image"
                placeholder="Upload category image"
              />
              <button
                onClick={handleAddItem}
                disabled={isAdding}
                className="mt-1 bg-green-500 text-white px-4 py-2 rounded"
              >
                {isAdding ? "Adding..." : "Add Category"}
              </button>
            </div>
          )}

          <ul className="space-y-1">
            {isLoading ? (
              <li>Loading...</li>
            ) : (
              categories.map((item) => renderCategory(item))
            )}
          </ul>
        </div>
      </aside>
      <ToastContainer position="top-center" autoClose={1500} />
    </>
  );
};

export default Sidebar;
