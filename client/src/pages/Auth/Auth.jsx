import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import {
  FaEnvelope,
  FaLock,
  FaUser,
  FaPhone,
  FaEye,
  FaEyeSlash,
  FaGoogle,
  FaFacebook,
} from "react-icons/fa";
import OTPVerification from "../../components/OTP/OTPVerification";

const Auth = () => {
  const navigate = useNavigate();
  const { login, user: contextUser } = useAuth();

  useEffect(() => {
    if (contextUser) {
      navigate("/user_dashboard");
    }
  }, [contextUser, navigate]);

  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const [registerData, setRegisterData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const handleLogin = async (e) => {
    e.preventDefault();

    // --- Validation Logic ---
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(loginData.email)) {
      alert("Kripya ek valid email address bharein.");
      return;
    }
    if (loginData.password.length === 0) {
      alert("Password bharna zaroori hai.");
      return;
    }
    // --- End Validation ---

    setLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: loginData.email,
            password: loginData.password,
          }),
        },
      );

      const data = await response.json();

      if (response.ok) {
        alert("Login successful! Welcome back.");
        // Store tokens and user details
        if (data.data && data.data.accessToken) {
          login(data.data.user, data.data.accessToken);
        }
        navigate("/user_dashboard");
      } else {
        alert(
          data.message || "Login failed. Kripya apne credentials check karein.",
        );
      }
    } catch (error) {
      console.error("Login error:", error);
      alert(
        "Server se connect nahi ho pa rahe. Kripya check karein ki server chal raha hai.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    // --- Validation Logic ---
    const nameRegex = /^[a-zA-Z\s]{2,50}$/;
    const phoneRegex = /^[6-9]\d{9}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!nameRegex.test(registerData.firstName)) {
      alert("Kripya sahi First Name bharein (sirf characters allow hain).");
      return;
    }
    if (registerData.lastName && !nameRegex.test(registerData.lastName)) {
      alert("Kripya sahi Last Name bharein (sirf characters allow hain).");
      return;
    }
    if (!emailRegex.test(registerData.email)) {
      alert("Kripya ek valid email address bharein.");
      return;
    }
    if (!phoneRegex.test(registerData.phone)) {
      alert("Kripya 10-digit ka mobile number bharein (starting with 6-9).");
      return;
    }
    if (registerData.password.length < 8) {
      alert("Password kam se kam 8 characters ka hona chahiye.");
      return;
    }
    if (registerData.password !== registerData.confirmPassword) {
      alert("Passwords mismatch! Dono password ek jaise hone chahiye.");
      return;
    }
    // --- End Validation ---

    setShowOtpModal(true);
  };

  const completeRegistration = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/auth/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            firstName: registerData.firstName,
            lastName: registerData.lastName,
            email: registerData.email,
            phone: registerData.phone,
            password: registerData.password,
          }),
        },
      );

      const data = await response.json();

      if (response.ok) {
        alert("Registration successful! Welcome to Globes Properties.");
        // Store token if needed or navigate
        if (data.data && data.data.accessToken) {
          login(data.data.user, data.data.accessToken);
        }
        navigate("/user_dashboard");
      } else {
        alert(data.message || data.errors?.[0]?.msg || "Registration failed");
      }
    } catch (error) {
      console.error("Registration error:", error);
      alert(
        "An error occurred during registration. Please check if the server is running.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 pt-3 md:pt-36">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Left Side - Branding */}
          <div className="hidden lg:block animate-[fadeInLeft_0.6s_ease-out] h-full">
            <div className="bg-gradient-to-br from-orange-600 to-orange-700 rounded-3xl p-24 text-white shadow-2xl h-[90%]">
              <h1 className="text-4xl font-bold mb-6">
                Welcome to Globes Properties
              </h1>
              <p className="text-lg text-orange-100 mb-8">
                Find your dream property with us. Join thousands of satisfied
                customers who found their perfect home.
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                    <span className="text-2xl">🏠</span>
                  </div>
                  <div>
                    <h3 className="font-semibold">10,000+ Properties</h3>
                    <p className="text-sm text-orange-100">Verified listings</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                    <span className="text-2xl">⭐</span>
                  </div>
                  <div>
                    <h3 className="font-semibold">Trusted by 50,000+</h3>
                    <p className="text-sm text-orange-100">Happy customers</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                    <span className="text-2xl">🔒</span>
                  </div>
                  <div>
                    <h3 className="font-semibold">100% Secure</h3>
                    <p className="text-sm text-orange-100">Your data is safe</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Auth Form */}
          <div className="animate-[fadeInRight_0.6s_ease-out]">
            <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12">
              {/* Toggle Tabs */}
              <div className="flex gap-2 mb-8 bg-gray-100 p-1 rounded-xl">
                <button
                  onClick={() => setIsLogin(true)}
                  className={`flex-1 py-3 rounded-lg font-semibold transition-all duration-300 ${
                    isLogin
                      ? "bg-gradient-to-r from-orange-600 to-orange-700 text-white shadow-lg"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Login
                </button>
                <button
                  onClick={() => setIsLogin(false)}
                  className={`flex-1 py-3 rounded-lg font-semibold transition-all duration-300 ${
                    !isLogin
                      ? "bg-gradient-to-r from-orange-600 to-orange-700 text-white shadow-lg"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Register
                </button>
              </div>

              {/* Login Form */}
              {isLogin ? (
                <form onSubmit={handleLogin} className="space-y-6">
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">
                      Welcome Back!
                    </h2>
                    <p className="text-gray-600">
                      Login to access your account
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="email"
                        value={loginData.email}
                        onChange={(e) =>
                          setLoginData({ ...loginData, email: e.target.value })
                        }
                        placeholder="your@email.com"
                        className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type={showPassword ? "text" : "password"}
                        value={loginData.password}
                        onChange={(e) =>
                          setLoginData({
                            ...loginData,
                            password: e.target.value,
                          })
                        }
                        placeholder="Enter your password"
                        className="w-full pl-12 pr-12 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-300"
                      >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                      />
                      <span className="text-sm text-gray-600">Remember me</span>
                    </label>
                    <Link
                      to="/forgot-password"
                      className="text-sm text-orange-600 hover:text-orange-700 font-semibold transition-colors duration-300"
                    >
                      Forgot Password?
                    </Link>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-orange-600 to-orange-700 text-white py-3 rounded-xl font-semibold hover:from-orange-700 hover:to-orange-800 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? "Logging in..." : "Login"}
                  </button>

                  <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-4 bg-white text-gray-500">
                        Or continue with
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-gray-200 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 transition-all duration-300 hover:scale-105"
                    >
                      <FaGoogle className="text-red-500" />
                      Google
                    </button>
                    <button
                      type="button"
                      className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-gray-200 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 transition-all duration-300 hover:scale-105"
                    >
                      <FaFacebook className="text-blue-600" />
                      Facebook
                    </button>
                  </div>
                </form>
              ) : (
                // Register Form
                <form onSubmit={handleRegister} className="space-y-6">
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">
                      Create Account
                    </h2>
                    <p className="text-gray-600">
                      Join us to find your dream property
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        First Name
                      </label>
                      <div className="relative">
                        <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          type="text"
                          value={registerData.firstName}
                          onChange={(e) =>
                            setRegisterData({
                              ...registerData,
                              firstName: e.target.value,
                            })
                          }
                          placeholder="John"
                          className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Last Name
                      </label>
                      <div className="relative">
                        <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          type="text"
                          value={registerData.lastName}
                          onChange={(e) =>
                            setRegisterData({
                              ...registerData,
                              lastName: e.target.value,
                            })
                          }
                          placeholder="Doe"
                          className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="email"
                        value={registerData.email}
                        onChange={(e) =>
                          setRegisterData({
                            ...registerData,
                            email: e.target.value,
                          })
                        }
                        placeholder="your@email.com"
                        className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <div className="relative">
                      <FaPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="tel"
                        value={registerData.phone}
                        onChange={(e) =>
                          setRegisterData({
                            ...registerData,
                            phone: e.target.value,
                          })
                        }
                        placeholder="+91 98765 43210"
                        className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type={showPassword ? "text" : "password"}
                        value={registerData.password}
                        onChange={(e) =>
                          setRegisterData({
                            ...registerData,
                            password: e.target.value,
                          })
                        }
                        placeholder="Create a strong password"
                        className="w-full pl-12 pr-12 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-300"
                      >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type={showPassword ? "text" : "password"}
                        value={registerData.confirmPassword}
                        onChange={(e) =>
                          setRegisterData({
                            ...registerData,
                            confirmPassword: e.target.value,
                          })
                        }
                        placeholder="Confirm your password"
                        className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300"
                        required
                      />
                    </div>
                  </div>

                  <label className="flex items-start gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      className="w-4 h-4 mt-1 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                      required
                    />
                    <span className="text-sm text-gray-600">
                      I agree to the{" "}
                      <Link
                        to="/terms"
                        className="text-orange-600 hover:text-orange-700 font-semibold"
                      >
                        Terms & Conditions
                      </Link>{" "}
                      and{" "}
                      <Link
                        to="/privacy"
                        className="text-orange-600 hover:text-orange-700 font-semibold"
                      >
                        Privacy Policy
                      </Link>
                    </span>
                  </label>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-orange-600 to-orange-700 text-white py-3 rounded-xl font-semibold hover:from-orange-700 hover:to-orange-800 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? "Creating Account..." : "Create Account"}
                  </button>

                  <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-4 bg-white text-gray-500">
                        Or register with
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-gray-200 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 transition-all duration-300 hover:scale-105"
                    >
                      <FaGoogle className="text-red-500" />
                      Google
                    </button>
                    <button
                      type="button"
                      className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-gray-200 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 transition-all duration-300 hover:scale-105"
                    >
                      <FaFacebook className="text-blue-600" />
                      Facebook
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      <OTPVerification
        isOpen={showOtpModal}
        recipient={registerData.phone}
        type="phone"
        onVerify={(data) => {
          setShowOtpModal(false);
          completeRegistration();
        }}
        onCancel={() => setShowOtpModal(false)}
      />
    </div>
  );
};

export default Auth;
