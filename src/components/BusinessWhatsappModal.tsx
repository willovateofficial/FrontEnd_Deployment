import React from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { baseUrl } from "../config";

interface WhatsAppFormValues {
  whatsappNumber: string;
  phoneNumberId: string;
  wabaId: string;
  accessToken: string;
}

interface Props {
  onClose: () => void;
}

const BusinessWhatsappModal: React.FC<Props> = ({ onClose }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<WhatsAppFormValues>();

  const onSubmit = async (data: WhatsAppFormValues) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(`${baseUrl}/api/whatsapp/setup`, data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("WhatsApp credentials saved successfully.");
      reset();
      onClose();
    } catch (error) {
      alert("Error saving WhatsApp credentials.");
      console.error(error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
      <div className="bg-white w-full max-w-md md:max-w-lg rounded-2xl shadow-2xl p-6 md:p-8 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-red-500 transition"
          title="MarkIcon"
        >
          <XMarkIcon className="h-6 w-6" />
        </button>

        <h2 className="text-2xl font-bold text-center text-orange-600 mb-6">
          WhatsApp Details
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <InputField
            label="WhatsApp Number"
            placeholder="+91XXXXXXXXXX"
            register={register("whatsappNumber", { required: true })}
            error={errors.whatsappNumber}
          />
          <InputField
            label="Phone Number ID"
            register={register("phoneNumberId", { required: true })}
            error={errors.phoneNumberId}
          />
          <InputField
            label="WABA ID"
            register={register("wabaId", { required: true })}
            error={errors.wabaId}
          />
          <InputField
            label="Access Token"
            register={register("accessToken", { required: true })}
            error={errors.accessToken}
          />

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 text-white font-semibold rounded-lg transition-all bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 disabled:opacity-70"
          >
            {isSubmitting ? "Saving..." : "Save Credentials"}
          </button>
        </form>
      </div>
    </div>
  );
};

const InputField = ({
  label,
  placeholder,
  register,
  error,
}: {
  label: string;
  placeholder?: string;
  register: any;
  error: any;
}) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <input
      {...register}
      placeholder={placeholder}
      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:outline-none"
    />
    {error && (
      <p className="text-red-500 text-sm mt-1">This field is required</p>
    )}
  </div>
);

export default BusinessWhatsappModal;
