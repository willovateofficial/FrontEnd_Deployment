import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { baseUrl } from "../config";
import Loader from "../components/Loader";

const baseURL = baseUrl;
const API_URL = `${baseURL}/api/business`;

interface FormData {
  id: number | null;
  name: string;
  type: string;
  tagline: string;
  logo: File | string | null;
}

const CreateRestro = () => {
  const [formData, setFormData] = useState<FormData>({
    id: null,
    name: "",
    type: "",
    tagline: "",
    logo: null,
  });

  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const form = new FormData();
      form.append("name", formData.name);
      form.append("type", formData.type);
      form.append("tagline", formData.tagline);
      if (formData.logo instanceof File) {
        form.append("logo", formData.logo);
      }

      const token = localStorage.getItem("token");

      let res;
      if (formData.id) {
        res = await axios.put(`${API_URL}/${formData.id}`, form, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
        toast.success("Restaurant updated successfully");
      } else {
        res = await axios.post(API_URL, form, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });

        localStorage.setItem("businessId", res.data.business.id.toString());
        localStorage.setItem("business_name", res.data.business.name);
        localStorage.setItem("business_logo", res.data.business.logoUrl);
        toast.success("Restaurant created successfully");
      }

      setFormData({
        id: null,
        name: "",
        type: "",
        tagline: "",
        logo: null,
      });

      navigate("/restaurant");
    } catch (error) {
      console.error("Error saving restaurant:", error);
      toast.error("You have already created a restaurant");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {isSubmitting && <Loader />}
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-white p-4 -mt-4 -mb-10">
        <div className="w-full max-w-2xl">
          {/* Header with orange accent */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center mb-4">
              <div className="w-12 h-1 bg-orange-500 rounded-full mr-3"></div>
              <span className="text-orange-600 font-medium">
                CREATE RESTAURANT
              </span>
              <div className="w-12 h-1 bg-orange-500 rounded-full ml-3"></div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Launch Your <span className="text-orange-600">Food Business</span>
            </h1>
            <p className="text-gray-600 max-w-md mx-auto">
              Join our platform and start serving customers in minutes
            </p>
          </div>

          {/* Form with white background and orange accents */}
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-xl shadow-lg p-6 sm:p-8 border border-orange-100"
          >
            <div className="space-y-6">
              {/* Restaurant Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                  Restaurant Name
                  <span className="text-orange-600 ml-1">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <svg
                      className="w-5 h-5 text-orange-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                      ></path>
                    </svg>
                  </div>
                  <input
                    type="text"
                    placeholder="e.g. The Gourmet Kitchen"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-300 focus:border-orange-300 transition placeholder-gray-400"
                  />
                </div>
              </div>

              {/* Cuisine Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                  Cuisine Type
                  <span className="text-orange-600 ml-1">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <svg
                      className="w-5 h-5 text-orange-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      ></path>
                    </svg>
                  </div>
                  <input
                    type="text"
                    placeholder="e.g. Italian, Indian, Fusion"
                    value={formData.type}
                    onChange={(e) =>
                      setFormData({ ...formData, type: e.target.value })
                    }
                    required
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-300 focus:border-orange-300 transition placeholder-gray-400"
                  />
                </div>
              </div>

              {/* Tagline */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tagline (Optional)
                </label>
                <textarea
                  placeholder="A short description that makes your restaurant stand out"
                  value={formData.tagline}
                  onChange={(e) =>
                    setFormData({ ...formData, tagline: e.target.value })
                  }
                  rows={2}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-300 focus:border-orange-300 transition placeholder-gray-400"
                ></textarea>
              </div>

              {/* Logo Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Restaurant Logo
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-200 border-dashed rounded-lg">
                  <div className="space-y-1 text-center">
                    <svg
                      className="mx-auto h-12 w-12 text-orange-400"
                      stroke="currentColor"
                      fill="none"
                      viewBox="0 0 48 48"
                      aria-hidden="true"
                    >
                      <path
                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <div className="flex text-sm text-gray-600">
                      <label
                        htmlFor="file-upload"
                        className="relative cursor-pointer bg-white rounded-md font-medium text-orange-600 hover:text-orange-500 focus-within:outline-none"
                      >
                        <span>Upload a file</span>
                        <input
                          id="file-upload"
                          name="file-upload"
                          type="file"
                          accept="image/*"
                          className="sr-only"
                          onChange={(e) =>
                            e.target.files?.[0] &&
                            setFormData({
                              ...formData,
                              logo: e.target.files[0],
                            })
                          }
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">PNG, JPG up to 2MB</p>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-3 px-4 rounded-xl shadow-md text-white font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-300 transition ${
                    isSubmitting
                      ? "bg-orange-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
                  }`}
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center">
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Processing...
                    </span>
                  ) : (
                    "Launch My Restaurant"
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>

        <ToastContainer
          position="top-center"
          autoClose={3000}
          toastClassName="border border-orange-100 shadow-lg"
          progressClassName="bg-orange-400" // ✅ Tailwind class for progress bar
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </div>
    </>
  );
};

export default CreateRestro;
