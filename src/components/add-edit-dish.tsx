import React, { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { baseUrl } from "../config";

interface Dish {
  id?: number;
  name: string;
  description: string;
  priceHalf: string;
  priceFull: string;
  spiciness: number;
  ingredients: string;
  about: string;
  image: File | null;
  category: string;
  favorite?: boolean;
  imageUrl?: string;
  metadata?: {
    priceHalf?: number;
    priceFull?: number;
    spiciness?: number;
    ingredients?: string;
    about?: string;
    [key: string]: any;
  };
}

const baseURL = baseUrl;

const AddEditDish: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const dishToEdit = location.state?.dishToEdit as Dish | undefined;

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [dish, setDish] = useState<Dish>({
    id: dishToEdit?.id,
    name: dishToEdit?.name || "",
    description: dishToEdit?.description || "",
    priceHalf:
      dishToEdit?.metadata?.priceHalf?.toString() ||
      dishToEdit?.priceHalf?.toString() ||
      "",
    priceFull:
      dishToEdit?.metadata?.priceFull?.toString() ||
      (dishToEdit?.priceFull ? dishToEdit.priceFull.toString() : "") ||
      "",
    spiciness: dishToEdit?.metadata?.spiciness || dishToEdit?.spiciness || 2,
    ingredients: dishToEdit?.metadata?.ingredients || "",
    about: dishToEdit?.metadata?.about || "",
    image: null,
    category: dishToEdit?.category || "",
    favorite: dishToEdit?.favorite || false,
    imageUrl: typeof dishToEdit?.image === "string" ? dishToEdit.image : "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setDish((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image must be less than 5 MB");
        return;
      }
      setDish((prev) => ({ ...prev, image: file, imageUrl: "" }));
      if (errors.image) setErrors((prev) => ({ ...prev, image: "" }));
    }
  };

  const triggerFileInput = () => fileInputRef.current?.click();

  const handleSpicinessChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDish((prev) => ({ ...prev, spiciness: Number(e.target.value) }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!dish.name.trim()) newErrors.name = "Please enter dish name";
    if (!dish.category) newErrors.category = "Please select a category";
    if (!dishToEdit && !dish.image) newErrors.image = "Please upload an image";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const [categories, setCategories] = useState<string[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const businessId = localStorage.getItem("businessId");

        const response = await axios.get(
          `${baseURL}/api/categories?businessId=${businessId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const categoryNames = response.data.map(
          (cat: { name: string }) => cat.name
        );
        setCategories(categoryNames);
        setLoadingCategories(false);
      } catch (error) {
        setFetchError("Failed to load categories");
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const formData = new FormData();

      formData.append("name", dish.name.trim());
      formData.append("description", dish.description.trim());
      formData.append("category", dish.category);
      formData.append("productType", "dish");

      formData.append("price", dish.priceFull);

      // Prepare metadata WITHOUT images
      const metadata: { [key: string]: any } = {
        spiciness: dish.spiciness,
        ingredients: dish.ingredients.trim(),
        about: dish.about.trim(),
        priceHalf: Number(dish.priceHalf),
        priceFull: Number(dish.priceFull),
        favorite: dish.favorite || false,
      };

      formData.append("metadata", JSON.stringify(metadata));

      // Append image file ONLY if user selected new image (add or edit)
      if (dish.image) {
        formData.append("images", dish.image);
      }

      const url = dishToEdit
        ? `${baseURL}/api/products/${dishToEdit.id}`
        : `${baseURL}/api/products`;

      const method = dishToEdit ? "PUT" : "POST";

      const token = localStorage.getItem("token");

      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        toast.error(result.message || "Something went wrong.");
      } else {
        toast.success(`Dish ${dishToEdit ? "updated" : "added"} successfully!`);
        setTimeout(() => {
          if (!dishToEdit) {
            setDish({
              id: undefined,
              name: "",
              description: "",
              priceHalf: "",
              priceFull: "",
              spiciness: 2,
              ingredients: "",
              about: "",
              image: null,
              category: "",
              favorite: false,
              imageUrl: "",
            });
          }
          navigate("/admin-menu-list", { state: { refresh: true } });
        }, 1000);
      }
    } catch (error) {
      console.error("Error submitting dish:", error);
      toast.error("Network error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white px-10 py-6 max-w-5xl mx-auto">
      <h2 className="text-4xl font-bold text-center mb-6">
        {dishToEdit ? "Edit Dish" : "Add Dish"}
      </h2>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col md:flex-row gap-10"
      >
        {/* Image upload */}
        <div className="w-full md:w-1/3 flex flex-col items-center gap-3 mt-5">
          <div
            className="w-full h-60 bg-gray-100 border rounded-lg shadow-md flex items-center justify-center cursor-pointer overflow-hidden mt-5"
            onClick={triggerFileInput}
          >
            {dish.image ? (
              <img
                src={URL.createObjectURL(dish.image)}
                alt="Preview"
                className="object-cover h-full w-full rounded"
              />
            ) : dish.imageUrl ? (
              <img
                src={
                  dish.imageUrl.startsWith("http")
                    ? dish.imageUrl
                    : `${baseURL}/${dish.imageUrl}`
                }
                alt="Existing dish"
                className="object-cover h-full w-full rounded"
                onError={() =>
                  console.error("Failed to load existing image:", dish.imageUrl)
                }
              />
            ) : (
              <span className="text-gray-400">Click to upload image</span>
            )}
          </div>

          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            className="hidden"
            onChange={handleImageChange}
            title="Upload dish image"
          />

          <button
            type="button"
            onClick={triggerFileInput}
            className="px-4 py-2 bg-gray-800 text-white rounded text-sm hover:bg-gray-700 transition"
          >
            Upload Image
          </button>
          {errors.image && (
            <p className="text-red-500 text-sm mt-1">{errors.image}</p>
          )}
        </div>

        {/* Form fields */}
        <div className="w-full md:w-2/3 space-y-4">
          {/* Name */}
          <div>
            <label className="block font-semibold mb-1">Dish Name</label>
            <input
              type="text"
              name="name"
              value={dish.name}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
              placeholder="Enter dish name"
              title="Dish Name"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block font-semibold mb-1">Description</label>
            <textarea
              name="description"
              value={dish.description}
              onChange={handleChange}
              rows={3}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
              placeholder="Enter dish description"
              title="Description"
            />
          </div>

          {/* Prices & Spiciness */}
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block font-semibold mb-1">Half Price</label>
              <input
                type="number"
                name="priceHalf"
                value={dish.priceHalf}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                placeholder="Enter half price"
              />
              {errors.priceHalf && (
                <p className="text-red-500 text-sm mt-1">{errors.priceHalf}</p>
              )}
            </div>

            <div className="flex-1">
              <label className="block font-semibold mb-1">Full Price</label>
              <input
                type="number"
                name="priceFull"
                value={dish.priceFull}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                placeholder="Enter full price"
              />
              {errors.priceFull && (
                <p className="text-red-500 text-sm mt-1">{errors.priceFull}</p>
              )}
            </div>

            <div className="flex-1">
              <label className="block font-semibold mb-1">Spiciness</label>
              <div className="flex justify-between text-sm mb-1">
                {[1, 2, 3, 4, 5].map((level) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() =>
                      setDish((prev) => ({ ...prev, spiciness: level }))
                    }
                    className={`w-6 h-6 rounded-full flex items-center justify-center ${
                      dish.spiciness === level
                        ? "bg-yellow-500 text-white font-bold"
                        : "text-gray-600 hover:text-black"
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min={1}
                  max={5}
                  value={dish.spiciness}
                  onChange={handleSpicinessChange}
                  className="w-full accent-red-500"
                  title="Select spiciness level"
                />
                <span className="text-red-500 text-xl">🌶️</span>
              </div>
            </div>
          </div>

          {/* Ingredients */}
          <div>
            <label className="block font-semibold mb-1">Ingredients</label>
            <input
              type="text"
              name="ingredients"
              value={dish.ingredients}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
              placeholder="Enter ingredients"
              title="Ingredients"
            />
          </div>

          {/* About */}
          <div>
            <label className="block font-semibold mb-1">About it</label>
            <textarea
              name="about"
              value={dish.about}
              onChange={handleChange}
              rows={3}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
              placeholder="Tell us more about this dish"
              title="About this dish"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block font-semibold mb-1">Category</label>
            {loadingCategories ? (
              <p>Loading categories...</p>
            ) : fetchError ? (
              <p className="text-red-500">{fetchError}</p>
            ) : (
              <select
                name="category"
                value={dish.category}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                title="Select dish category"
              >
                <option value="" disabled>
                  Select a category
                </option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            )}
            {errors.category && (
              <p className="text-red-500 text-sm mt-1">{errors.category}</p>
            )}
          </div>

          {/* Submit */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 rounded shadow ${
                isSubmitting ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isSubmitting
                ? "Submitting..."
                : dishToEdit
                ? "Update Dish"
                : "Add to Menu"}
            </button>
          </div>
        </div>
      </form>

      {/* Toast container for notifications */}
      <ToastContainer position="top-center" autoClose={3000} />
    </div>
  );
};

export default AddEditDish;
