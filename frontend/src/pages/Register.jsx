import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import api from "../api/axios";
import registerBg from "../assets/bg-register.avif";
import toast from "react-hot-toast";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirmPwd, setShowConfirmPwd] = useState(false);
  const navigate = useNavigate();

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    try {
      await api.post("/users/register", {
        name: form.name,
        email: form.email,
        password: form.password,
      });

      toast.success("Account created successfully! Redirecting...");
      setTimeout(() => navigate("/login"), 2500);
    } catch (err) {
      toast.error(
        err?.response?.data?.message || "Registration failed. Please try again."
      );
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* LEFT IMAGE SIDE */}
      <aside
        className="hidden lg:flex w-1/2 items-center justify-center bg-cover bg-center relative"
        style={{ backgroundImage: `url(${registerBg})` }}
      >
        <div className="absolute inset-0 bg-linear-to-br from-black/60 to-amber-800/40"></div>
        <div className="relative z-10 text-center px-10 text-white">
          <h1 className="text-5xl font-extrabold leading-tight mb-4">
            Create an Account
          </h1>
          <p className="text-lg text-white/90">
            Join our catering family — manage menus, bookings, and events effortlessly.
          </p>
        </div>
      </aside>

      {/* RIGHT SIDE FORM */}
      <main className="flex w-full lg:w-1/2 items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md">
          <div className="relative bg-white/60 backdrop-blur-xl border border-white/30 rounded-3xl shadow-[0_10px_30px_rgba(2,6,23,0.12)] p-10">
            <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">
              Register
            </h2>

            <form onSubmit={onSubmit} className="space-y-5">
              {/* Full Name */}
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Full Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={form.name}
                  onChange={onChange}
                  placeholder="John Doe"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-amber-400 focus:outline-none"
                />
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={onChange}
                  placeholder="you@example.com"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-amber-400 focus:outline-none"
                />
              </div>

              {/* Password */}
              <div className="relative">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>

                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPwd ? "text" : "password"}
                    value={form.password}
                    onChange={onChange}
                    placeholder="Enter password"
                    required
                    className="w-full px-4 py-3 pr-12 rounded-xl border border-gray-300 focus:ring-2 focus:ring-amber-400 focus:outline-none"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPwd(s => !s)}
                    aria-label={showPwd ? "Hide password" : "Show password"}
                    className="absolute inset-y-0 right-3 flex items-center justify-center text-gray-500 hover:text-gray-700 bg-transparent border-0 p-0"
                  >
                    {showPwd ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="relative">
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm Password
                </label>

                <div className="relative">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPwd ? "text" : "password"}
                    value={form.confirmPassword}
                    onChange={onChange}
                    placeholder="Re-enter password"
                    required
                    className="w-full px-4 py-3 pr-12 rounded-xl border border-gray-300 focus:ring-2 focus:ring-amber-400 focus:outline-none"
                  />

                  <button
                    type="button"
                    onClick={() => setShowConfirmPwd(s => !s)}
                    aria-label={showConfirmPwd ? "Hide confirm password" : "Show confirm password"}
                    className="absolute inset-y-0 right-3 flex items-center justify-center text-gray-500 hover:text-gray-700 bg-transparent border-0 p-0"
                  >
                    {showConfirmPwd ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="w-full py-3 mt-2 rounded-xl bg-linear-to-r from-amber-500 to-amber-600 text-white font-semibold shadow hover:opacity-95 transition cursor-pointer"
              >
                Create Account
              </button>

              {/* Social Buttons */}
              <div className="mt-6 text-center text-sm text-gray-600">
                or register with
              </div>
              <div className="mt-3 flex gap-3">
                <button
                  type="button"
                  className="flex-1 py-2 border border-gray-300 rounded-xl bg-white hover:bg-gray-100 flex items-center justify-center gap-2 text-gray-700"
                >
                  <img
                    src="https://www.svgrepo.com/show/475656/google-color.svg"
                    alt="Google"
                    className="w-5 h-5"
                  />
                  Google
                </button>
                <button
                  type="button"
                  className="flex-1 py-2 border border-gray-300 rounded-xl bg-white hover:bg-gray-100 flex items-center justify-center gap-2 text-gray-700"
                >
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg"
                    alt="Apple"
                    className="w-5 h-5"
                  />
                  Apple
                </button>
              </div>
            </form>

            {/* Link to Login */}
            <div className="mt-6 text-center text-sm text-gray-700">
              Already have an account?{" "}
              <Link to="/login" className="text-amber-600 font-medium hover:underline">
                Login
              </Link>
            </div>
          </div>

          {/* Footer */}
          <p className="text-center text-xs text-gray-400 mt-4">
            © {new Date().getFullYear()} Catering Service. All rights reserved.
          </p>
        </div>
      </main>
    </div>
  );
}
