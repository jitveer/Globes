import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FaCalendar,
  FaClock,
  FaUser,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaCheckCircle,
  FaHome,
} from "react-icons/fa";

// Dummy property data
const dummyProperty = {
  id: 1,
  title: "Luxury Villa with Pool and Garden",
  location: "Whitefield, Bangalore",
  image:
    "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&h=600&fit=crop",
  agent: {
    name: "Rajesh Kumar",
    phone: "+91 98765 43210",
    email: "rajesh@globesproperties.com",
  },
};

const Inquiry = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property] = useState(dummyProperty);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const formRef = useRef(null);

  useEffect(() => {
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    date: "",
    time: "",
    message: "I would like to schedule a visit to this property.",
  });

  // --- OTP & Bot Protection States ---
  const [showOtpField, setShowOtpField] = useState(false);
  const [otp, setOtp] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [botField, setBotField] = useState(""); // Honeypot field

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1. Bot Protection
    if (botField) return;

    // 2. Client-side Validation logic
    const nameRegex = /^[a-zA-Z\s]{2,50}$/;
    const phoneRegex = /^[6-9]\d{9}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!showOtpField) {
      if (!nameRegex.test(formData.name)) {
        alert("Kripya sahi naam bharein (sirf characters allow hain).");
        return;
      }
      if (!emailRegex.test(formData.email)) {
        alert("Kripya ek valid email address bharein.");
        return;
      }
      if (!phoneRegex.test(formData.phone)) {
        alert(
          "Kripya 10-digit ka valid mobile number bharein (jo 6-9 se shuru ho).",
        );
        return;
      }
    }

    setIsVerifying(true);

    try {
      if (!showOtpField) {
        // Step 1: Request OTP
        const res = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/v1/inquiries/request-otp`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
          },
        );
        const data = await res.json();
        if (data.success) {
          setShowOtpField(true);
          alert("OTP bhej diya hai! Please email check karein!");
        } else {
          alert(data.message || "OTP bhejne mein samasya hui.");
        }
      } else {
        // Step 2: Verify OTP
        const res = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/v1/inquiries/verify-otp`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: formData.email, otp }),
          },
        );
        const data = await res.json();
        if (data.success) {
          alert("Mubaarak ho! Aapka visit schedule ho gaya hai.");
          setSubmitted(true);
        } else {
          alert(data.message || "Galat OTP!");
        }
      }
    } catch (err) {
      alert("Server error. Please try again.");
    } finally {
      setIsVerifying(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-orange-50/20 to-gray-50 pt-20 md:pt-24 pb-12 flex items-center justify-center px-4">
        <div className="max-w-2xl w-full text-center animate-[fadeInUp_0.6s_ease-out]">
          <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaCheckCircle className="text-5xl text-green-600" />
            </div>

            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Visit Scheduled Successfully!
            </h2>

            <p className="text-lg text-gray-600 mb-8">
              Thank you for your interest! Our agent will contact you shortly to
              confirm your visit.
            </p>

            <div className="bg-gradient-to-br from-orange-50 to-orange-100/50 rounded-2xl p-6 mb-8">
              <h3 className="font-bold text-gray-900 mb-4">Visit Details</h3>
              <div className="space-y-3 text-left">
                <div className="flex items-center gap-3">
                  <FaHome className="text-orange-600" />
                  <span className="text-gray-700">{property.title}</span>
                </div>
                <div className="flex items-center gap-3">
                  <FaMapMarkerAlt className="text-orange-600" />
                  <span className="text-gray-700">{property.location}</span>
                </div>
                <div className="flex items-center gap-3">
                  <FaCalendar className="text-orange-600" />
                  <span className="text-gray-700">
                    {new Date(formData.date).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <FaClock className="text-orange-600" />
                  <span className="text-gray-700">{formData.time}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate("/")}
                className="bg-gradient-to-r from-orange-600 to-orange-700 text-white px-8 py-3 rounded-xl font-semibold hover:from-orange-700 hover:to-orange-800 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
              >
                Back to Home
              </button>
              <button
                onClick={() => navigate("/properties")}
                className="bg-white border-2 border-gray-200 text-gray-700 px-8 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-300 hover:scale-105 active:scale-95"
              >
                Browse More Properties
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-orange-50/20 to-gray-50 pt-20 md:pt-24 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 text-center animate-[fadeInUp_0.5s_ease-out]">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Schedule a Property Visit
          </h1>
          <p className="text-gray-600">Book your visit at a convenient time</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Property Info Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden sticky top-24 animate-[fadeInLeft_0.6s_ease-out]">
              <img
                src={property.image}
                alt={property.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="font-bold text-gray-900 mb-2 line-clamp-2">
                  {property.title}
                </h3>
                <div className="flex items-center gap-2 text-gray-600 mb-4">
                  <FaMapMarkerAlt className="text-orange-600 text-sm" />
                  <span className="text-sm">{property.location}</span>
                </div>
                <div className="pt-4 border-t border-gray-200">
                  <h4 className="font-semibold text-gray-900 mb-3">
                    Contact Agent
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-gray-600">
                      <FaUser className="text-orange-600" />
                      <span>{property.agent.name}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <FaPhone className="text-orange-600" />
                      <span>{property.agent.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <FaEnvelope className="text-orange-600" />
                      <span className="truncate">{property.agent.email}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Booking Form */}
          <div className="lg:col-span-2" ref={formRef}>
            <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 animate-[fadeInRight_0.6s_ease-out]">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Your Information
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <input
                  type="text"
                  value={botField}
                  onChange={(e) => setBotField(e.target.value)}
                  className="hidden"
                  tabIndex="-1"
                  autoComplete="off"
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      disabled={showOtpField}
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      placeholder="John Doe"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300 disabled:bg-gray-50"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      disabled={showOtpField}
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      placeholder="your@email.com"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300 disabled:bg-gray-50"
                      required
                    />
                  </div>
                </div>

                {!showOtpField && (
                  <div className="space-y-6 animate-[fadeIn_0.5s_ease-out]">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        maxLength="10"
                        inputMode="numeric"
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            phone: e.target.value.replace(/\D/g, ""),
                          })
                        }
                        placeholder="9876543210"
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Preferred Date *
                        </label>
                        <div className="relative">
                          <FaCalendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                          <input
                            type="date"
                            value={formData.date}
                            onChange={(e) =>
                              setFormData({ ...formData, date: e.target.value })
                            }
                            min={new Date().toISOString().split("T")[0]}
                            className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Preferred Time *
                        </label>
                        <div className="relative">
                          <FaClock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                          <input
                            type="time"
                            value={formData.time}
                            onChange={(e) =>
                              setFormData({ ...formData, time: e.target.value })
                            }
                            className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300"
                            required
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Additional Message (Optional)
                      </label>
                      <textarea
                        value={formData.message}
                        onChange={(e) =>
                          setFormData({ ...formData, message: e.target.value })
                        }
                        rows="4"
                        placeholder="Any specific requirements or questions..."
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300 resize-none"
                      ></textarea>
                    </div>
                  </div>
                )}

                {showOtpField && (
                  <div className="animate-[slideUp_0.4s_ease-out] bg-orange-50 p-8 border-2 border-orange-200 rounded-2xl text-center">
                    <label className="block text-sm font-black text-orange-600 mb-4 uppercase tracking-[0.2em]">
                      Verify Email OTP
                    </label>
                    <input
                      type="text"
                      required
                      maxLength="6"
                      inputMode="numeric"
                      value={otp}
                      onChange={(e) =>
                        setOtp(e.target.value.replace(/\D/g, ""))
                      }
                      placeholder="••••••"
                      className="w-full max-w-[300px] px-4 py-4 border-2 border-orange-500 rounded-2xl focus:ring-8 focus:ring-orange-500/10 outline-none bg-white text-center text-4xl font-black tracking-[12px] placeholder:tracking-normal"
                    />
                    <p className="text-sm text-gray-500 mt-4 italic">
                      Sent to {formData.email}
                    </p>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    type="submit"
                    disabled={isVerifying}
                    className="flex-1 bg-gradient-to-r from-orange-600 to-orange-700 text-white py-4 rounded-xl font-bold hover:from-orange-700 hover:to-orange-800 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3"
                  >
                    {isVerifying ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <FaCheckCircle />
                    )}
                    {showOtpField
                      ? "Verify & Schedule Visit"
                      : "Send Verification OTP"}
                  </button>
                  {showOtpField && (
                    <button
                      type="button"
                      onClick={() => setShowOtpField(false)}
                      className="flex-1 bg-white border-2 border-orange-200 text-orange-600 py-4 rounded-xl font-bold hover:bg-orange-50 transition-all duration-300"
                    >
                      Edit Booking Details
                    </button>
                  )}
                  {!showOtpField && (
                    <button
                      type="button"
                      onClick={() => navigate(-1)}
                      className="flex-1 bg-white border-2 border-gray-200 text-gray-700 py-4 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-300"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInRight {
          from { opacity: 0; transform: translateX(20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes fadeInLeft {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default Inquiry;
