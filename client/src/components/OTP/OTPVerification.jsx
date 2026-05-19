import React, { useState, useEffect, useRef } from "react";
import { FaShieldAlt, FaTimes } from "react-icons/fa";

/**
 * OTPVerification Component
 * @param {string} recipient - The email or phone number to send OTP to.
 * @param {string} type - 'email' or 'phone'.
 * @param {function} onVerify - Callback function called when OTP is successfully verified.
 * @param {function} onCancel - Callback function called when verification is cancelled.
 * @param {boolean} isOpen - Control visibility from outside.
 */
const OTPVerification = ({ recipient, type, onVerify, onCancel, isOpen }) => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const inputRefs = useRef([]);

  useEffect(() => {
    let interval;
    if (isOpen && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      setCanResend(true);
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isOpen, timer]);

  useEffect(() => {
    if (isOpen) {
      // Send OTP when component opens
      handleSendOTP();
      // Focus first input
      setTimeout(() => {
        if (inputRefs.current[0]) inputRefs.current[0].focus();
      }, 100);
    }
  }, [isOpen]);

  const handleSendOTP = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/otp/send`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ recipient, type }),
        }
      );
      const data = await response.json();
      if (!response.ok) {
        setError(data.message || "Failed to send OTP. Please try again.");
      } else {
        setTimer(60);
        setCanResend(false);
      }
    } catch (err) {
      setError("Network error. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    const otpString = otp.join("");
    if (otpString.length < 6) {
      setError("Please enter the complete 6-digit OTP.");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/otp/verify`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ recipient, otp: otpString }),
        }
      );
      const data = await response.json();
      if (response.ok) {
        onVerify(data);
      } else {
        setError(data.message || "Invalid OTP. Please try again.");
      }
    } catch (err) {
      setError("Verification failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (index, value) => {
    if (isNaN(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    // Move to next input
    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-[scaleIn_0.3s_ease-out]">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-600 to-orange-700 p-6 text-white relative">
          <button
            onClick={onCancel}
            className="absolute right-4 top-4 text-white/80 hover:text-white transition-colors"
          >
            <FaTimes size={20} />
          </button>
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-4">
              <FaShieldAlt size={32} />
            </div>
            <h2 className="text-2xl font-bold">OTP Verification</h2>
            <p className="text-orange-100 text-sm mt-1">
              We've sent a 6-digit code to <br />
              <span className="font-semibold">{recipient}</span>
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          {error && (
            <div className="mb-6 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm rounded-r-lg animate-shake">
              {error}
            </div>
          )}

          <div className="flex justify-between gap-2 mb-8">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-12 h-14 text-center text-2xl font-bold border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all duration-200"
              />
            ))}
          </div>

          <div className="text-center mb-8">
            {timer > 0 ? (
              <p className="text-gray-500 text-sm">
                Resend code in <span className="text-orange-600 font-bold">{timer}s</span>
              </p>
            ) : (
              <button
                onClick={handleSendOTP}
                disabled={loading}
                className="text-orange-600 font-bold text-sm hover:text-orange-700 underline underline-offset-4"
              >
                Resend OTP
              </button>
            )}
          </div>

          <button
            onClick={handleVerifyOTP}
            disabled={loading || otp.some((d) => !d)}
            className="w-full bg-gradient-to-r from-orange-600 to-orange-700 text-white py-4 rounded-2xl font-bold shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Verifying..." : "Verify & Proceed"}
          </button>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes scaleIn {
          from { transform: scale(0.9); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-shake {
          animation: shake 0.2s ease-in-out 0s 2;
        }
      `}} />
    </div>
  );
};

export default OTPVerification;
