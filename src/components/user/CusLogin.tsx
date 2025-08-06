import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import FoodImg from "../../assets/food-img.jpg";

interface CusLoginProps {
  onRegisterClick: () => void;
  onClose: () => void;
}

interface LoginFormData {
  email: string;
  password: string;
}

const CusLogin: React.FC<CusLoginProps> = ({ onRegisterClick, onClose }) => {
  const { register, handleSubmit, reset } = useForm<LoginFormData>();
  const navigate = useNavigate();

  const onSubmit = async (data: LoginFormData) => {
    try {
      const businessId = 1; // 🔁 Update this if needed dynamically
      const res = await axios.post(
        "http://localhost:4000/api/customers/login",
        {
          ...data,
          businessId,
        }
      );

      localStorage.setItem("customerToken", res.data.token);
      toast.success("Logged in successfully");
      reset();
      onClose(); // close modal
      navigate("/restaurant"); // ✅ redirect
    } catch (err: any) {
      toast.error("Invalid email or password"); // ✅ show error message
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 px-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-fadeIn">
        {/* Banner Image */}
        <div className="relative h-52">
          <img
            src={FoodImg}
            alt="Food Banner"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-40" />
          <h2 className="absolute top-5 left-1/2 -translate-x-1/2 text-white text-lg font-bold z-10">
            Welcome Back!
          </h2>
          <button
            onClick={onClose}
            className="absolute top-3.5 right-3.5 bg-white text-gray-700 hover:text-red-500 rounded-full p-2 shadow transition duration-200 z-10"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* Login Form */}
        <div className="p-6">
          <form
            className="flex flex-col gap-4"
            onSubmit={handleSubmit(onSubmit)}
          >
            <input
              type="email"
              placeholder="Email"
              {...register("email")}
              className="w-full px-4 py-3 rounded-md bg-gray-100 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-400"
              required
            />
            <input
              type="password"
              placeholder="Password"
              {...register("password")}
              className="w-full px-4 py-3 rounded-md bg-gray-100 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-400"
              required
            />
            <button
              type="submit"
              className="bg-gradient-to-r from-orange-400 to-orange-500 text-white py-3 rounded-lg font-semibold shadow hover:opacity-90 transition"
            >
              Login
            </button>
          </form>

          <p className="text-center text-sm mt-6">
            Don’t have an account?{" "}
            <button
              onClick={onRegisterClick}
              className="text-orange-500 font-semibold hover:underline"
            >
              Register Now
            </button>
          </p>

          <p className="text-center text-sm mt-3">
            <button
              onClick={onClose}
              className="text-gray-700 hover:text-orange-500 font-medium transition"
            >
              Continue as Guest?
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default CusLogin;
