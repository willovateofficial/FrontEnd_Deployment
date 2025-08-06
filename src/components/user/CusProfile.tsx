import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaUser, FaEnvelope, FaPhone, FaStar } from "react-icons/fa";
import { PencilIcon, CheckIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { baseUrl } from "../../config";
import { toast } from "react-toastify";

const CusProfile: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [formData, setFormData] = useState({ name: "", mobile: "" });
  const [originalData, setOriginalData] = useState({ name: "", mobile: "" });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchCustomerProfile = async () => {
      try {
        const token = localStorage.getItem("customerToken");
        const response = await axios.get(`${baseUrl}/api/customers/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(response.data);
        setFormData({
          name: response.data.name,
          mobile: response.data.mobile,
        });
        setOriginalData({
          name: response.data.name,
          mobile: response.data.mobile,
        });
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomerProfile();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async (): Promise<void> => {
    setIsSaving(true);
    try {
      const token = localStorage.getItem("customerToken");
      await axios.put(
        `${baseUrl}/api/customers/customer/${user.id}/full`,
        { name: formData.name, mobile: formData.mobile },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUser((prev: any) => ({ ...prev, ...formData }));
      setOriginalData(formData);
      setIsEditing(false);
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Failed to save profile:", error);
      toast.error("Failed to update profile.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = (): void => {
    setFormData(originalData);
    setIsEditing(false);
    toast.info("Changes canceled.");
  };

  if (loading) {
    return <div className="text-center py-10">Loading profile...</div>;
  }

  if (!user) {
    return (
      <div className="text-center py-10 text-red-600">
        Unable to load profile
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-blue-100 py-10 px-4 sm:px-6">
      <div className="max-w-lg mx-auto bg-white rounded-3xl shadow-xl p-6 sm:p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
            👤 Customer Profile
          </h2>
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center text-blue-600 hover:text-blue-800"
            >
              <PencilIcon className="w-5 h-5 mr-1" />
              Edit
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="px-3 py-1 text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-60"
              >
                <CheckIcon className="w-4 h-4 inline-block mr-1" />
                {isSaving ? "Saving..." : "Save"}
              </button>
              <button
                onClick={handleCancel}
                className="px-3 py-1 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
              >
                <XMarkIcon className="w-4 h-4 inline-block mr-1" />
                Cancel
              </button>
            </div>
          )}
        </div>

        {/* Avatar */}
        <div className="flex justify-center mb-6">
          <img
            src="/customer-avatar.png"
            alt="Customer Avatar"
            className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-blue-300 shadow-md"
          />
        </div>

        <div className="space-y-4">
          {/* Name */}
          <ProfileField
            label="Name"
            icon={<FaUser />}
            isEditing={isEditing}
            name="name"
            value={formData.name}
            onChange={handleInputChange}
          />
          {/* Email */}
          <ProfileStatic
            label="Email"
            value={user.email}
            icon={<FaEnvelope />}
          />
          {/* Mobile */}
          <ProfileField
            label="Mobile"
            icon={<FaPhone />}
            isEditing={isEditing}
            name="mobile"
            value={formData.mobile}
            onChange={handleInputChange}
          />
          {/* Points */}
          <ProfileStatic
            label="Loyalty Points"
            value={user.points ?? 0}
            icon={<FaStar className="text-yellow-500" />}
          />
        </div>
      </div>
    </div>
  );
};

interface ProfileFieldProps {
  icon: React.ReactNode;
  label: string;
  name: string;
  value: string;
  isEditing: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const ProfileField: React.FC<ProfileFieldProps> = ({
  icon,
  label,
  name,
  value,
  isEditing,
  onChange,
}) => (
  <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-xl shadow-sm">
    <div className="text-xl text-blue-600">{icon}</div>
    <div className="w-full">
      <p className="text-sm text-gray-500">{label}</p>
      {isEditing ? (
        <input
          type="text"
          name={name}
          value={value}
          onChange={onChange}
          aria-label={label}
          title={label}
          className="w-full text-base font-semibold text-gray-800 border-b border-gray-300 focus:outline-none bg-transparent"
        />
      ) : (
        <p className="text-lg font-semibold text-gray-800">{value}</p>
      )}
    </div>
  </div>
);

interface ProfileStaticProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
}

const ProfileStatic: React.FC<ProfileStaticProps> = ({
  icon,
  label,
  value,
}) => (
  <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-xl shadow-sm">
    <div className="text-xl text-blue-600">{icon}</div>
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-lg font-semibold text-gray-800">{value}</p>
    </div>
  </div>
);

export default CusProfile;
