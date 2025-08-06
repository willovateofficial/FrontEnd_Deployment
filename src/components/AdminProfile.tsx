import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import imageCompression from "browser-image-compression";
import {
  UserIcon,
  BuildingStorefrontIcon,
  CameraIcon,
  PencilIcon,
  CheckIcon,
  XMarkIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/outline";
import { baseUrl } from "../config";
import BusinessWhatsappModal from "./BusinessWhatsappModal";

const baseURL = baseUrl;

export default function ProfilePage() {
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    businessName: "",
  });
  const [profilePhoto, setProfilePhoto] = useState<File | null>(null);
  const [previewPhotoUrl, setPreviewPhotoUrl] = useState<string>("");
  const [originalData, setOriginalData] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const [qrCode, setQrCode] = useState<File | null>(null);
  const [qrPreviewUrl, setQrPreviewUrl] = useState<string>("");


  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Authorization token missing");

        const payload = JSON.parse(atob(token.split(".")[1]));
        if (payload.role === "SuperAdmin") {
          const demoData = {
            name: "SuperAdmin",
            email: "admin@willovate.com",
            phone: "+91 8237883928",
            address: "Nagpur, Maharashtra",
            business: {
              name: "Willovate Resto",
              plan: { name: "Enterprise Plan" },
              qrCodeUrl: "/demo-qr.png",
            },
            profilePhotoUrl: "/admin-avatar.png",
          };
          setUserData(demoData);
          setFormData({
            name: demoData.name,
            phone: demoData.phone,
            address: demoData.address,
            businessName: demoData.business.name,
          });
          setPreviewPhotoUrl(demoData.profilePhotoUrl);
          setQrPreviewUrl(demoData.business.qrCodeUrl);
          setOriginalData({
            ...demoData,
            businessName: demoData.business.name,
          });
          setLoading(false);
          return;
        }

        const response = await axios.get(`${baseURL}/api/auth/user`, {
          headers: { Authorization: `Bearer ${token}` },
        });


        const data = response.data;
        setUserData(data);
        setFormData({
          name: data.name,
          phone: data.phone || "",
          address: data.address || "",
          businessName: data.business?.name || "",
        });
        setPreviewPhotoUrl(data.profilePhotoUrl || "/default-avatar.png");
        setQrPreviewUrl(data.business?.qrCodeUrl || ""); // ✅ Set existing QR preview
        setOriginalData({
          ...data,
          businessName: data.business?.name || "",
        });
      } catch (error) {
        toast.error("Failed to load profile data");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      try {
        const file = e.target.files[0];
        const compressedFile = await imageCompression(file, {
          maxSizeMB: 0.5,
          maxWidthOrHeight: 800,
        });
        setProfilePhoto(compressedFile);
        setPreviewPhotoUrl(URL.createObjectURL(compressedFile));
      } catch (error) {
        toast.error("Error processing image");
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditToggle = () => setIsEditing(!isEditing);

  const handleCancel = () => {
    if (originalData) {
      setFormData({
        name: originalData.name,
        phone: originalData.phone,
        address: originalData.address,
        businessName: originalData.businessName,
      });
      setPreviewPhotoUrl(originalData.profilePhotoUrl);
      setProfilePhoto(null);
    }
    setIsEditing(false);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Authorization required");

      const updateData = new FormData();
      if (formData.name !== originalData.name)
        updateData.append("name", formData.name);
      if (formData.phone !== originalData.phone)
        updateData.append("phone", formData.phone);
      if (formData.address !== originalData.address)
        updateData.append("address", formData.address);
      if (formData.businessName !== originalData.businessName)
        updateData.append("businessName", formData.businessName);
      if (profilePhoto) updateData.append("profilePhoto", profilePhoto);
      if (qrCode) updateData.append("qrCode", qrCode); // ✅ Add QR code to form

      await axios.put(`${baseURL}/api/auth/user`, updateData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("Profile updated successfully");
      setIsEditing(false);

      // Refresh data
      const response = await axios.get(`${baseURL}/api/auth/user`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = response.data;
      setUserData(data);
      setQrPreviewUrl(data.business?.qrCodeUrl || ""); // ✅ Update preview again
    } catch (error) {
      toast.error("Failed to update profile");
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };
  const handleQrUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      try {
        const compressed = await imageCompression(file, {
          maxSizeMB: 0.5,
          maxWidthOrHeight: 800,
        });
        setQrCode(compressed);
        setQrPreviewUrl(URL.createObjectURL(compressed));
      } catch (error) {
        toast.error("Failed to upload QR image");
        console.error(error);
      }
    }
  };
  const qrSrc = qrPreviewUrl || userData?.qrCodeUrl || "";


  if (!userData) {
    return <div>Loading profile...</div>;
  }


  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="p-8 bg-white rounded-lg shadow-md">
          <div className="animate-pulse flex space-x-4">
            <div className="rounded-full bg-gray-200 h-12 w-12"></div>
            <div className="flex-1 space-y-4 py-1">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="p-8 bg-white rounded-lg shadow-md text-center">
          <p className="text-gray-700">No profile data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-orange-50 py-12 px-4 sm:px-4 lg:px-8 -mt-8 -mb-10 ">
      <div className="max-w-4xl mx-auto">
        {/* Premium Header */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center space-x-3 mb-4">
            <div className="w-16 h-1 bg-orange-300 rounded-full"></div>
            <ShieldCheckIcon className="h-8 w-8 text-orange-500" />
            <div className="w-16 h-1 bg-orange-300 rounded-full"></div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-amber-600">
              Admin Profile
            </span>
          </h1>
          <p className="mt-3 text-md text-gray-600 font-medium">
            Manage your profile and settings
          </p>
        </div>

        {/* Premium Profile Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-orange-100 transition-all duration-300 hover:shadow-2xl">
          {/* Card Header with Orange Accent */}
          <div className="bg-gradient-to-r from-orange-500 to-amber-600 px-8 py-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-white">
                Profile Overview
              </h2>
              <div className="flex space-x-3">
                {isEditing ? (
                  <>
                    <button
                      onClick={handleSave}
                      disabled={isSaving}
                      className="flex items-center space-x-1 px-4 py-2 bg-white text-orange-600 rounded-lg font-medium hover:bg-gray-50 disabled:opacity-70 transition-all"
                      aria-label="Save changes"
                    >
                      <CheckIcon className="h-5 w-5" />
                      <span>{isSaving ? "Saving..." : "Save"}</span>
                    </button>
                    <button
                      onClick={handleCancel}
                      className="flex items-center space-x-1 px-4 py-2 bg-transparent border border-white text-white rounded-lg font-medium hover:bg-white hover:bg-opacity-10 transition-all"
                      aria-label="Cancel editing"
                    >
                      <XMarkIcon className="h-5 w-5" />
                      <span>Cancel</span>
                    </button>
                  </>
                ) : (
                  <button
                    onClick={handleEditToggle}
                    className="flex items-center space-x-1 px-4 py-2 bg-white text-orange-600 rounded-lg font-medium hover:bg-gray-50 transition-all"
                    aria-label="Edit profile"
                  >
                    <PencilIcon className="h-5 w-5" />
                    <span>Edit Profile</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Profile Content */}
          <div className="p-8">
            <div className="flex flex-col lg:flex-row gap-10">
              {/* Profile Photo Section */}
              <div className="flex-shrink-0 flex flex-col items-center">
                <div className="relative group">
                  <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-white shadow-lg relative">
                    <img
                      src={previewPhotoUrl}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                    {isEditing && (
                      <label className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer">
                        <div className="text-center p-4">
                          <CameraIcon className="h-8 w-8 text-white mx-auto mb-2" />
                          <span className="text-white font-medium">
                            Change Photo
                          </span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handlePhotoChange}
                            className="hidden"
                            aria-label="Upload profile photo"
                          />
                        </div>
                      </label>
                    )}
                  </div>
                </div>
                <div className="mt-6 text-center">
                  {isEditing ? (
                    <div>
                      <label htmlFor="name-input" className="sr-only">
                        Name
                      </label>
                      <input
                        id="name-input"
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Enter your full name"
                        className="text-2xl font-bold text-center text-gray-900 border-b-2 border-orange-200 focus:border-orange-500 focus:outline-none bg-transparent py-1 px-2"
                      />
                    </div>
                  ) : (
                    <h3 className="text-2xl font-bold text-gray-900">
                      {formData.name}
                    </h3>
                  )}
                  <p className="text-gray-600 mt-1">{userData?.email}</p>
                </div>
              </div>

              {/* Profile Details */}
              <div className="flex-1">
                {/* Stats Cards */}
                <div className="grid grid-cols-2 gap-5 mb-8">
                  <div className="bg-orange-50 rounded-xl p-5 border border-orange-100">
                    <p className="text-sm font-medium text-orange-600 uppercase tracking-wider">
                      Role
                    </p>
                    <p className="mt-1 text-xl font-semibold text-gray-900">
                      {userData?.role || "Administrator"}
                    </p>
                  </div>
                  <div className="bg-orange-50 rounded-xl p-5 border border-orange-100">
                    <p className="text-sm font-medium text-orange-600 uppercase tracking-wider">
                      Plan
                    </p>
                    <p className="mt-1 text-xl font-semibold text-gray-900">
                      {userData?.business?.plan?.name || "Premium"}
                    </p>
                  </div>
                </div>

                {/* Divider */}
                <div className="border-t border-gray-200 my-6"></div>

                {/* Form Sections */}
                <div className="grid md:grid-cols-2 gap-8">
                  {/* Business Information */}
                  <div>
                    <h3 className="flex items-center text-lg font-semibold text-gray-900 mb-4">
                      <BuildingStorefrontIcon className="h-6 w-6 text-orange-500 mr-2" />
                      Business Details
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label
                          htmlFor="business-input"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Business Name
                        </label>
                        {isEditing ? (
                          <input
                            id="business-input"
                            type="text"
                            name="businessName"
                            value={formData.businessName}
                            onChange={handleInputChange}
                            placeholder="Enter business name"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white"
                          />
                        ) : (
                          <p className="px-4 py-3 bg-gray-50 rounded-lg text-gray-900">
                            {formData.businessName || "Not specified"}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div>
                    <h3 className="flex items-center text-lg font-semibold text-gray-900 mb-4">
                      <UserIcon className="h-6 w-6 text-orange-500 mr-2" />
                      Contact Information
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label
                          htmlFor="phone-input"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Phone Number
                        </label>
                        {isEditing ? (
                          <input
                            id="phone-input"
                            type="text"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            placeholder="Enter phone number"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white"
                          />
                        ) : (
                          <p className="px-4 py-3 bg-gray-50 rounded-lg text-gray-900">
                            {formData.phone || "Not specified"}
                          </p>
                        )}
                      </div>
                      <button
                        onClick={() => setShowModal(true)}
                        className="flex items-center space-x-1 px-4 py-2 bg-orange-600 text-white rounded-lg font-medium hover:bg-orange-700 transition-all"
                      >
                        <span>Add WhatsApp Details</span>
                      </button>
                      <div>
                        <label
                          htmlFor="address-input"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Business Address
                        </label>
                        {isEditing ? (
                          <input
                            id="address-input"
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={handleInputChange}
                            placeholder="Enter business address"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white"
                          />
                        ) : (
                          <p className="px-4 py-3 bg-gray-50 rounded-lg text-gray-900">
                            {formData.address || "Not specified"}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center space-x-4">
                        <p className="text-sm font-medium">Your QR Code:</p>
                        {qrSrc ? (
                          <img
                            src={qrSrc}
                            alt="QR Code Preview"
                            className="w-24 h-24 object-cover rounded border border-gray-300"
                          />
                        ) : (
                          <div className="w-24 h-24 bg-gray-100 border border-gray-300 flex items-center justify-center text-gray-500 rounded">
                            QR Preview
                          </div>
                        )}
                      </div>
                      {isEditing && (
                        <div className="mt-2">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Upload New QR Code
                          </label>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleQrUpload}
                            className="w-full text-sm text-gray-700"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Toast Notifications */}
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        toastClassName="rounded-lg shadow-lg"
      />
      {/* Modal */}
      {showModal && (
        <BusinessWhatsappModal onClose={() => setShowModal(false)} />
      )}
    </div>
  );
}
