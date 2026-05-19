// --- Imports ---
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";

// Icons for visual elements
import {
  FaUserShield,
  FaEnvelope,
  FaLock,
  FaArrowRight,
  FaHome,
} from "react-icons/fa";
// Custom animated popup component for notifications
import Popup from "../../../components/Popup";

const AdminLogin = () => {
  // --- Navigation & State ---
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false); // Manages button loading state

  // Stores email and password input values
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // Configures the custom popup (success/error messages)
  const [popupConfig, setPopupConfig] = useState({
    isOpen: false,
    type: "success",
    title: "",
    message: "",
  });

  // --- Helper Functions ---

  // Displays the popup with specific type and message
  const showPopup = (type, title, message) => {
    setPopupConfig({ isOpen: true, type, title, message });
  };

  // Handles real-time input changes for the form
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  /**
   * Handles the Login process.
   * Sends credentials to the backend and verifies if the user is an Admin.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // API call to dedicated Admin login endpoint using environment variable
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/auth/admin/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      // 1. Strict check: Only allow users with 'admin' role to proceed
      if (data.data.user.role !== "admin") {
        throw new Error(
          "Access denied. This portal is for Administrators only.",
        );
      }

      // 2. Use the login function from AuthContext to set user and token globally
      if (data.data && data.data.accessToken) {
        login(data.data.user, data.data.accessToken);
      }

      // 3. Show success feedback and redirect
      showPopup(
        "success",
        "Welcome Back!",
        "Redirecting to Admin Dashboard...",
      );
      setTimeout(() => {
        navigate("/admin");
      }, 1500);
    } catch (err) {
      // Handle any errors (network, invalid creds, or wrong role)
      showPopup("error", "Login Failed", err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[120px] animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/20 rounded-full blur-[120px] animate-pulse delay-700"></div>

      <div className="max-w-md w-full relative z-10">
        {/* Back to Home */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-8 group"
        >
          <FaHome className="group-hover:-translate-y-0.5 transition-transform" />
          <span className="text-sm font-medium">Back to Home</span>
        </Link>

        {/* Main Login Card - Glassmorphism UI */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-8 md:p-12 shadow-2xl">
          {/* Header & Animated Logo Area */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-blue-600 mb-6 shadow-lg shadow-blue-600/30 animate-[float_3s_infinite_ease-in-out]">
              <FaUserShield className="text-4xl text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight mb-3">
              Admin <span className="text-blue-500">Portal</span>
            </h1>
            <p className="text-slate-400 font-medium">
              Securely manage your real estate operations
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">
                Email Address
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FaEnvelope className="text-slate-500 group-focus-within:text-blue-500 transition-colors" />
                </div>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="admin@globes.com"
                  className="w-full bg-white/5 border border-white/10 text-white pl-11 pr-4 py-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all placeholder:text-slate-600"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FaLock className="text-slate-500 group-focus-within:text-blue-500 transition-colors" />
                </div>
                <input
                  type="password"
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full bg-white/5 border border-white/10 text-white pl-11 pr-4 py-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all placeholder:text-slate-600"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-2xl shadow-lg shadow-blue-600/30 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed group flex items-center justify-center gap-3 overflow-hidden relative"
            >
              <span className="relative z-10">
                {loading ? "Verifying..." : "Sign In Now"}
              </span>
              {!loading && (
                <FaArrowRight className="group-hover:translate-x-1 transition-transform relative z-10" />
              )}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] pointer-events-none"></div>
            </button>
          </form>

          {/* Footer Info */}
          <div className="text-center mt-12 pt-8 border-t border-white/5">
            <p className="text-slate-500 text-sm">
              Secured by{" "}
              <span className="text-slate-400 font-bold">
                Globes Properties
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Global Animations */}
      <style>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        @keyframes shimmer {
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>

      {/* Popup Component */}
      <Popup
        isOpen={popupConfig.isOpen}
        type={popupConfig.type}
        title={popupConfig.title}
        message={popupConfig.message}
        onClose={() => setPopupConfig({ ...popupConfig, isOpen: false })}
      />
    </div>
  );
};

export default AdminLogin;
