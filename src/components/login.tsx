import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLogin } from "../hooks/useLogin"; // <-- Your mutation hook

const Login = () => {
  const navigate = useNavigate();
  const { mutateAsync, isPending, error } = useLogin();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = await mutateAsync({ email, password });

      console.log("Login Response:", data); // 🟡 Debug

      if (data?.token) {
        const token = data.token;
        const user = data.user;
        const business = user.business;
        const businessId = business?.id;
        const planStatus = business?.plan?.status;

        localStorage.setItem("authToken", token);
        localStorage.setItem("userEmail", user.email);
        localStorage.setItem("role", user.role.toLowerCase());
        localStorage.setItem("plan_status", planStatus);

        if (businessId) {
          localStorage.setItem("businessId", businessId.toString());

          if (user.role === "SuperAdmin") {
            navigate("/admin");
            return;
          }

          // ✅ STRONG CONDITION: Only allow "active"
          if (planStatus === "active") {
            navigate("/dashboard");
          } else {
            console.warn("Subscription not active. Redirecting to home.");
            navigate("/");
            return; // 🛑 Strictly stop further flow
          }
        } else {
          console.warn("No business ID found");
          navigate("/");
          return; // 🛑 Strictly stop
        }
      } else {
        console.error("No token returned");
      }
    } catch (err) {
      console.error("Login failed:", err);
    }
  };

  return (
    <div
      className="relative min-h-screen bg-cover bg-center flex items-center justify-center"
      style={{
        backgroundImage:
          "url('https://b.zmtcdn.com/data/pictures/7/18692257/e8cc9f07aad58148ba093ba7c9eb9a01.jpg')",
      }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-70 z-0" />

      <div className="absolute top-6 right-6 z-10">
        <h1 className="text-orange-400 text-3xl font-extrabold tracking-wider">
          WILLOVATE
        </h1>
      </div>

      <div className="relative z-10 w-full max-w-md px-6 py-8 bg-black bg-opacity-70 text-white rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold text-center mb-6">Sign In</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email or mobile number"
            className="w-full px-4 py-3 rounded-md bg-gray-800 text-white border border-gray-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full px-4 py-3 rounded-md bg-gray-800 text-white border border-gray-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400"
          />

          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-orange-500 text-white font-semibold py-2 rounded-md hover:bg-orange-600 transition"
          >
            {isPending ? "Signing in..." : "Sign In"}
          </button>
        </form>

        {error && (
          <p className="text-red-500 text-center mt-4">
            Invalid credentials. Please try again.
          </p>
        )}

        <div className="text-center mt-4">
          <p className="text-sm text-gray-300">OR</p>
          <Link
            to="/forgot-password"
            className="text-sm text-gray-300 hover:underline mt-2 block"
          >
            Forgot password?
          </Link>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              className="form-checkbox text-orange-500 rounded"
            />
            <span className="ml-2 text-sm text-gray-300">Remember me</span>
          </label>
        </div>

        <div className="text-center mt-6 text-sm text-gray-300">
          New to Willovate?{" "}
          <Link
            to="/register"
            className="text-orange-400 font-semibold hover:underline"
          >
            Sign up now.
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
