import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import api from "../api/axios";
import loginBg from "../assets/bg-login.avif";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

export default function Login() {

  // Form state to store email, password and remember checkbox value
  const [form, setForm] = useState({
    email: "",
    password: "",
    remember: false
  });

  // State to toggle password visibility
  const [showPwd, setShowPwd] = useState(false);

  // Navigation hooks
  const navigate = useNavigate();
  const location = useLocation();

  // Access login function from AuthContext
  const { login } = useAuth();

  // Determine redirect path after login
  // If user was redirected from another protected page, go back there
  const redirectPath = location.state?.from || "/";

  // Handle input change for form fields
  const onChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prevState) => ({
      ...prevState,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  // Handle form submission
  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      // Send login request to backend API
      const response = await api.post("/users/login", {
        email: form.email,
        password: form.password
      });

      // Save user information using AuthContext
      // AuthContext internally handles localStorage and global state
      login(response.data);

      // Show success message
      toast.success("Login successful");

      // Redirect user to previous page or home page
      navigate(redirectPath, { replace: true });

    } catch (error) {

      // Show error message if login fails
      toast.error(
        error?.response?.data?.message || "Invalid email or password"
      );
    }
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-2 bg-gray-50">

      {/* Left side background section */}
      <aside
        className="hidden lg:flex items-center justify-center bg-cover bg-center relative"
        style={{ backgroundImage: `url(${loginBg})` }}
      >
        <div className="absolute inset-0 bg-black/60"></div>

        <div className="relative z-10 text-center px-10 text-white">
          <h1 className="text-5xl font-extrabold mb-4">
            Welcome Back
          </h1>

          <p className="text-lg">
            Login to manage menus, bookings, and orders
          </p>
        </div>
      </aside>

      {/* Right side login form */}
      <main className="flex items-center justify-center p-6 sm:p-12">

        <div className="w-full max-w-md">

          <div className="bg-white/70 backdrop-blur-xl border rounded-3xl shadow p-10">

            <h2 className="text-2xl font-semibold text-gray-800 text-center mb-8">
              Login
            </h2>

            <form onSubmit={onSubmit} className="space-y-6">

              {/* Email field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>

                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={onChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-amber-400 focus:outline-none"
                />
              </div>

              {/* Password field */}
              <div className="relative">

                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>

                <div className="relative">

                  <input
                    name="password"
                    type={showPwd ? "text" : "password"}
                    value={form.password}
                    onChange={onChange}
                    required
                    className="w-full px-4 py-3 pr-10 rounded-xl border border-gray-300 focus:ring-2 focus:ring-amber-400 focus:outline-none"
                  />

                  {/* Toggle password visibility */}
                  <button
                    type="button"
                    onClick={() => setShowPwd(!showPwd)}
                    className="absolute inset-y-0 right-3 flex items-center"
                  >
                    {showPwd ? (
                      <EyeSlashIcon className="w-5 h-5" />
                    ) : (
                      <EyeIcon className="w-5 h-5" />
                    )}
                  </button>

                </div>
              </div>

              {/* Remember me checkbox */}
              <div className="flex items-center justify-between text-sm">

                <label className="inline-flex items-center gap-2">
                  <input
                    name="remember"
                    type="checkbox"
                    checked={form.remember}
                    onChange={onChange}
                    className="h-4 w-4"
                  />
                  <span>Remember me</span>
                </label>

              </div>

              {/* Submit button */}
              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-amber-600 text-white font-semibold hover:bg-amber-700 transition"
              >
                Login
              </button>

            </form>

            {/* Register link */}
            <div className="mt-8 text-center text-sm text-gray-700">
              Do not have an account?
              <Link to="/register" className="text-amber-600 ml-1 hover:underline">
                Create account
              </Link>
            </div>

          </div>

        </div>

      </main>

    </div>
  );
}
