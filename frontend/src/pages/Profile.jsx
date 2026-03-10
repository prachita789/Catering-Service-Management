import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";
import toast from "react-hot-toast";
import { User, Mail, Lock, Save, Eye, EyeOff, ShieldCheck } from "lucide-react";

export default function Profile() {
  const { user, login } = useAuth();

  const [nameForm,  setNameForm]  = useState({ name: user?.name || "" });
  const [pwdForm,   setPwdForm]   = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [showPwd,   setShowPwd]   = useState({ current: false, new: false, confirm: false });
  const [saving,    setSaving]    = useState({ name: false, pwd: false });

  // ── Update name ───────────────────────────────────────────
  const handleNameSave = async (e) => {
    e.preventDefault();
    if (!nameForm.name.trim()) { toast.error("Name cannot be empty."); return; }
    setSaving((s) => ({ ...s, name: true }));
    try {
      const { data } = await api.put("/users/profile", { name: nameForm.name });
      login({ ...user, name: data.name }); // update context + localStorage
      toast.success("Name updated successfully!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update name.");
    } finally {
      setSaving((s) => ({ ...s, name: false }));
    }
  };

  // ── Update password ───────────────────────────────────────
  const handlePwdSave = async (e) => {
    e.preventDefault();
    if (pwdForm.newPassword !== pwdForm.confirmPassword) {
      toast.error("New passwords do not match."); return;
    }
    if (pwdForm.newPassword.length < 6) {
      toast.error("Password must be at least 6 characters."); return;
    }
    setSaving((s) => ({ ...s, pwd: true }));
    try {
      await api.put("/users/profile", {
        currentPassword: pwdForm.currentPassword,
        newPassword: pwdForm.newPassword,
      });
      toast.success("Password updated successfully!");
      setPwdForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update password.");
    } finally {
      setSaving((s) => ({ ...s, pwd: false }));
    }
  };

  const togglePwd = (field) => setShowPwd((s) => ({ ...s, [field]: !s[field] }));

  // Avatar initials
  const initials = user?.name?.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) || "U";

  return (
    <div className="bg-[#fffaf5] min-h-screen pt-24 pb-16">
      <div className="max-w-2xl mx-auto px-4">

        {/* ── Header ── */}
        <div className="flex items-center gap-5 mb-8">
          <div className="w-16 h-16 rounded-full bg-amber-600 flex items-center justify-center text-white text-2xl font-bold shadow-md">
            {initials}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{user?.name}</h1>
            <div className="flex items-center gap-2 mt-1">
              <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold ${
                user?.role === "admin" ? "bg-amber-100 text-amber-700" : "bg-gray-100 text-gray-600"
              }`}>
                {user?.role === "admin" ? "👑 Admin" : "Customer"}
              </span>
              <span className="text-sm text-gray-400">{user?.email}</span>
            </div>
          </div>
        </div>

        {/* ── Update Name ── */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-5">
          <h2 className="font-bold text-gray-800 text-lg mb-5 flex items-center gap-2">
            <User className="w-5 h-5 text-amber-600" /> Personal Info
          </h2>
          <form onSubmit={handleNameSave} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input
                type="text"
                value={nameForm.name}
                onChange={(e) => setNameForm({ name: e.target.value })}
                className="w-full border border-gray-300 px-4 py-3 rounded-xl focus:ring-2 focus:ring-amber-400 focus:outline-none text-sm"
                placeholder="Your full name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <div className="flex items-center gap-3 w-full border border-gray-200 bg-gray-50 px-4 py-3 rounded-xl text-sm text-gray-500">
                <Mail className="w-4 h-4 shrink-0" />
                {user?.email}
                <span className="ml-auto text-xs text-gray-400">(cannot be changed)</span>
              </div>
            </div>
            <button
              type="submit"
              disabled={saving.name}
              className="flex items-center gap-2 bg-amber-700 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-amber-800 transition disabled:opacity-60 cursor-pointer text-sm"
            >
              {saving.name ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Save className="w-4 h-4" />}
              {saving.name ? "Saving..." : "Save Name"}
            </button>
          </form>
        </div>

        {/* ── Change Password ── */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-5">
          <h2 className="font-bold text-gray-800 text-lg mb-5 flex items-center gap-2">
            <Lock className="w-5 h-5 text-amber-600" /> Change Password
          </h2>
          <form onSubmit={handlePwdSave} className="space-y-4">
            {[
              { key: "current",  label: "Current Password",  field: "currentPassword" },
              { key: "new",      label: "New Password",      field: "newPassword" },
              { key: "confirm",  label: "Confirm Password",  field: "confirmPassword" },
            ].map(({ key, label, field }) => (
              <div key={key}>
                <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                <div className="relative">
                  <input
                    type={showPwd[key] ? "text" : "password"}
                    value={pwdForm[field]}
                    onChange={(e) => setPwdForm((p) => ({ ...p, [field]: e.target.value }))}
                    className="w-full border border-gray-300 px-4 py-3 pr-11 rounded-xl focus:ring-2 focus:ring-amber-400 focus:outline-none text-sm"
                    placeholder={label}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => togglePwd(key)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                  >
                    {showPwd[key] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            ))}
            <button
              type="submit"
              disabled={saving.pwd}
              className="flex items-center gap-2 bg-amber-700 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-amber-800 transition disabled:opacity-60 cursor-pointer text-sm"
            >
              {saving.pwd ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
              {saving.pwd ? "Updating..." : "Update Password"}
            </button>
          </form>
        </div>

        {/* ── Account Info ── */}
        <div className="bg-amber-50 border border-amber-100 rounded-2xl p-5 text-sm text-amber-800">
          <p className="font-semibold mb-1">Account Info</p>
          <p>Role: <span className="font-medium capitalize">{user?.role}</span></p>
          <p className="mt-1 text-amber-600 text-xs">To change your email, please contact support.</p>
        </div>

      </div>
    </div>
  );
}