import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  FaShieldAlt,
  FaLock,
  FaEnvelope,
  FaEye,
  FaEyeSlash,
  FaArrowRight,
} from "react-icons/fa";

const SuperAdminLogin = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/auth/super-admin/login`,
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

      // Use the login function from AuthContext to set user and token globally
      if (data.data && data.data.accessToken) {
        login(data.data.user, data.data.accessToken);
      }

      // Redirect to dashboard
      navigate("/super-admin");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Abstract Background Shapes */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-red-900/20 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-900/20 rounded-full blur-[120px] animate-pulse delay-700" />

      <div className="w-full max-w-md relative z-10">
        {/* Branding/Logo */}
        <div className="text-center mb-8 animate-[fadeIn_0.5s_ease-out]">
          <div className="inline-block p-4 bg-red-600 rounded-2xl shadow-2xl shadow-red-600/20 mb-4 ring-4 ring-red-600/10">
            <FaShieldAlt className="text-4xl text-white" />
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">
            SUPER ADMIN
          </h1>
          <p className="text-slate-500 font-bold text-xs uppercase tracking-[0.2em] mt-2">
            Executive Access Portal
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 p-8 rounded-3xl shadow-2xl shadow-black/50 animate-[slideUp_0.6s_ease-out]">
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-sm font-bold flex items-center gap-2 animate-shake">
              <span className="w-1.5 h-1.5 bg-red-500 rounded-full" />
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 ml-1">
                Administrative Email
              </label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-red-500 transition-colors">
                  <FaEnvelope />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="admin@globes.com"
                  className="w-full bg-slate-800/50 border border-slate-700 text-white pl-12 pr-4 py-4 rounded-2xl focus:outline-none focus:border-red-600/50 focus:ring-4 focus:ring-red-600/10 transition-all font-medium placeholder:text-slate-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 ml-1">
                Security Key / Password
              </label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-red-500 transition-colors">
                  <FaLock />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="••••••••••••"
                  className="w-full bg-slate-800/50 border border-slate-700 text-white pl-12 pr-12 py-4 rounded-2xl focus:outline-none focus:border-red-600/50 focus:ring-4 focus:ring-red-600/10 transition-all font-medium placeholder:text-slate-600"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-600 hover:bg-red-700 disabled:bg-slate-800 disabled:cursor-not-allowed text-white py-4 rounded-2xl font-black tracking-wider shadow-xl shadow-red-600/20 active:scale-[0.98] transition-all flex items-center justify-center gap-3 group"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  AUTHENTICATE
                  <FaArrowRight className="text-sm group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-slate-800 text-center">
            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest leading-relaxed">
              This system is restricted to authorized personnel only.
              <br />
              All access attempts are logged and monitored.
            </p>
          </div>
        </div>

        <button
          onClick={() => navigate("/")}
          className="mt-8 w-full text-slate-600 hover:text-slate-400 text-xs font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-2"
        >
          Return to Hub
        </button>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes shake {
          0%,
          100% {
            transform: translateX(0);
          }
          25% {
            transform: translateX(-5px);
          }
          75% {
            transform: translateX(5px);
          }
        }
        .animate-shake {
          animation: shake 0.3s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default SuperAdminLogin;
