import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import axios from "axios";
import FoodImg from "../../assets/food-img.jpg";
import { useNavigate } from "react-router-dom";
import { baseUrl } from "../../config";

interface RegisterPageProps {
  onClose?: () => void;
}

interface RegisterFormData {
  name: string;
  email: string;
  mobile: string;
  password: string;
  confirmPassword: string;
}

const baseURL = baseUrl;

const RegisterPage: React.FC<RegisterPageProps> = ({ onClose }) => {
  const { register, handleSubmit, reset } = useForm<RegisterFormData>();
  const navigate = useNavigate();

  const businessId = Number(localStorage.getItem("businessId"));

  const onSubmit = async (data: RegisterFormData) => {
    if (data.password !== data.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      await axios.post(`${baseURL}/api/customers/register`, {
        name: data.name,
        email: data.email,
        mobile: data.mobile,
        password: data.password,
        businessId,
      });

      toast.success("Registration successful!");

      reset();
      if (onClose) onClose(); // close modal if needed

      setTimeout(() => {
        navigate("/restaurant"); // ⬅️ Redirect to login page
      }, 1500); // wait 1.5s to let toast show
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Registration failed");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-4">
      <div className="bg-white rounded-xl overflow-hidden shadow-lg w-full max-w-md animate-fadeIn">
        {/* Header with image */}
        <div className="relative h-44 w-full">
          <img
            src={FoodImg}
            alt="Food Banner"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-30 rounded-t-xl" />

          <button
            onClick={() => window.history.back()}
            title="Go back" // ✅ Add this line
            className="absolute top-3 left-3 w-10 h-10 flex items-center justify-center bg-white text-black rounded-full shadow-md hover:bg-gray-200 transition z-10"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          {onClose && (
            <button
              onClick={onClose}
              title="Close" // ✅ Add this line
              className="absolute top-3 right-3 w-10 h-10 flex items-center justify-center bg-white text-black rounded-full shadow-md hover:bg-gray-200 transition z-10"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}

          <h1 className="absolute bottom-2 left-4 text-white text-lg font-semibold drop-shadow-md z-10">
            Let’s Join!
          </h1>
        </div>

        {/* Form */}
        <div className="p-6">
          <form
            className="flex flex-col gap-4"
            onSubmit={handleSubmit(onSubmit)}
          >
            <input
              type="text"
              placeholder="Full Name"
              {...register("name", { required: true })}
              className="w-full px-4 py-2.5 rounded-md bg-gray-100 focus:outline-none"
              required
            />
            <input
              type="email"
              placeholder="Email"
              {...register("email", { required: true })}
              className="w-full px-4 py-2.5 rounded-md bg-gray-100 focus:outline-none"
              required
            />
            <input
              type="tel"
              placeholder="Mobile No."
              pattern="[0-9]{10}"
              maxLength={10}
              {...register("mobile", { required: true })}
              className="w-full px-4 py-2.5 rounded-md bg-gray-100 focus:outline-none"
              required
            />
            <input
              type="password"
              placeholder="Password"
              {...register("password", { required: true })}
              className="w-full px-4 py-2.5 rounded-md bg-gray-100 focus:outline-none"
              required
            />
            <input
              type="password"
              placeholder="Confirm password"
              {...register("confirmPassword", { required: true })}
              className="w-full px-4 py-2.5 rounded-md bg-gray-100 focus:outline-none"
              required
            />

            <button
              type="submit"
              className="bg-gradient-to-r from-orange-400 to-orange-500 text-white py-2.5 rounded-md font-semibold hover:opacity-90 transition"
            >
              Register
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
