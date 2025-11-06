import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import api from "../api/axios";
import loginBg from "../assets/bg-login.avif";
import toast from "react-hot-toast";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "", remember: false });
  const [showPwd, setShowPwd] = useState(false);
  const navigate = useNavigate();
  const location = useLocation(); // 👈 detect where user came from (like /booking)

  // ✅ Get redirect path (if any)
  const redirectPath = location.state?.from || "/";

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((s) => ({ ...s, [name]: type === "checkbox" ? checked : value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post("/users/login", {
        email: form.email,
        password: form.password,
      });

      // ✅ Save user info in localStorage
      localStorage.setItem("userInfo", JSON.stringify(res.data));

      // ✅ Success toast
      toast.success("Welcome back! Logged in successfully 🎉", {
        duration: 2500,
        position: "bottom-right",
      });

      // ✅ Redirect user — if came from booking, go back there
      setTimeout(() => navigate(redirectPath, { replace: true }), 2000);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Invalid email or password.", {
        duration: 2500,
        position: "bottom-right",
      });
    }
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-2 bg-gray-50">
      {/* LEFT SIDE IMAGE SECTION */}
      <aside
        className="hidden lg:flex items-center justify-center bg-cover bg-center relative"
        style={{ backgroundImage: `url(${loginBg})` }}
      >
        <div className="absolute inset-0 bg-linear-to-br from-black/60 to-amber-800/40"></div>
        <div className="relative z-10 text-center px-10 text-white">
          <h1 className="text-5xl font-extrabold leading-tight mb-4">
            Welcome Back
          </h1>
          <p className="text-lg text-white/90">
            Login to manage menus, bookings, and orders.
          </p>
        </div>
      </aside>

      {/* RIGHT SIDE FORM SECTION */}
      <main className="flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md">
          <div className="relative bg-white/70 backdrop-blur-xl border border-white/30 rounded-3xl shadow-[0_10px_30px_rgba(2,6,23,0.12)] p-10">
            <h2 className="text-2xl font-semibold text-gray-800 text-center mb-8">
              Login or Order Now
            </h2>

            <form onSubmit={onSubmit} className="space-y-6">
              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={onChange}
                  placeholder="hungry@catering.com"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-amber-400 focus:outline-none"
                />
              </div>

              {/* Password */}
              <div className="relative">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
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
                    className="w-full px-4 py-3 pr-10 rounded-xl border border-gray-300 focus:ring-2 focus:ring-amber-400 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPwd((s) => !s)}
                    className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
                  >
                    {showPwd ? (
                      <EyeSlashIcon className="w-5 h-5" />
                    ) : (
                      <EyeIcon className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between text-sm">
                <label className="inline-flex items-center gap-2">
                  <input
                    name="remember"
                    type="checkbox"
                    checked={form.remember}
                    onChange={onChange}
                    className="h-4 w-4 text-amber-500 border-gray-300 rounded focus:ring-amber-400"
                  />
                  <span className="text-gray-700">Remember me</span>
                </label>
                <Link to="/forgot" className="text-amber-600 hover:underline">
                  Forgot password?
                </Link>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-3 mt-2 rounded-xl bg-linear-to-r from-amber-500 to-amber-600 text-white font-semibold shadow hover:opacity-95 transition cursor-pointer"
              >
                Login or Order Now
              </button>

              {/* Social Login */}
              <div className="mt-8 text-center text-sm text-gray-600">
                or continue with
              </div>
              <div className="mt-4 flex gap-3">
                <button
                  type="button"
                  className="flex-1 py-3 border border-gray-300 rounded-xl bg-white hover:bg-gray-100 flex items-center justify-center gap-2 text-gray-700 cursor-pointer"
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
                  className="flex-1 py-3 border border-gray-300 rounded-xl bg-white hover:bg-gray-100 flex items-center justify-center gap-2 text-gray-700 cursor-pointer"
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

            <div className="mt-8 text-center text-sm text-gray-700">
              Don’t have an account?{" "}
              <Link
                to="/register"
                className="text-amber-600 font-medium hover:underline"
              >
                Create account
              </Link>
            </div>
          </div>

          <p className="text-center text-xs text-gray-400 mt-6">
            © {new Date().getFullYear()} Catering Service. All rights reserved.
          </p>
        </div>
      </main>
    </div>
  );
}
