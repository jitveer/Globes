import React from "react";
import {
  FaCheckCircle,
  FaTimesCircle,
  FaInfoCircle,
  FaExclamationTriangle,
} from "react-icons/fa";

/**
 * Reusable Popup Component
 * Supports multiple types: success, error, info, warning
 * Can act as a simple notification or a confirmation modal
 */
const Popup = ({
  isOpen, // Boolean to control visibility
  onClose, // Function to call when closing the popup
  type = "success", // success | error | info | warning
  title, // Title text
  message, // Description/body text
  onConfirm, // Optional: Function for confirmation action (shows Yes/No)
}) => {
  if (!isOpen) return null;

  // --- Configuration for different popup types ---
  const config = {
    success: {
      icon: <FaCheckCircle className="text-emerald-500 text-5xl" />,
      color: "bg-emerald-500",
      btnHover: "hover:bg-emerald-600",
    },
    error: {
      icon: <FaTimesCircle className="text-red-500 text-5xl" />,
      color: "bg-red-500",
      btnHover: "hover:bg-red-600",
    },
    info: {
      icon: <FaInfoCircle className="text-blue-500 text-5xl" />,
      color: "bg-blue-500",
      btnHover: "hover:bg-blue-600",
    },
    warning: {
      icon: <FaExclamationTriangle className="text-amber-500 text-5xl" />,
      color: "bg-amber-500",
      btnHover: "hover:bg-amber-600",
    },
  };

  // Get styles based on current type, default to success
  const { icon, color, btnHover } = config[type] || config.success;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]">
      <div
        className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl shadow-black/20 transform animate-[popIn_0.3s_cubic-bezier(0.34,1.56,0.64,1)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-center">
          <div className="mb-4 flex justify-center drop-shadow-lg">{icon}</div>
          <h3 className="text-2xl font-black text-slate-800 mb-2 tracking-tight">
            {title || (type === "success" ? "Success" : "Notification")}
          </h3>
          <p className="text-slate-500 font-medium leading-relaxed">
            {message}
          </p>

          {/* Button Action Area */}
          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            {/* Show 'Cancel' button if it's a confirmation type (warning/info with onConfirm) */}
            {(type === "warning" || type === "info") && onConfirm && (
              <button
                onClick={onClose}
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold py-3 px-6 rounded-2xl transition-all active:scale-95"
              >
                Cancel
              </button>
            )}
            {/* Main Action Button */}
            <button
              onClick={() => {
                if (onConfirm) {
                  onConfirm();
                }
                onClose();
              }}
              className={`flex-1 ${color} ${btnHover} text-white font-bold py-3 px-6 rounded-2xl transition-all shadow-lg shadow-black/10 active:scale-95`}
            >
              {onConfirm ? "Confirm" : "Got it!"}
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes popIn {
          from {
            opacity: 0;
            transform: scale(0.8) translateY(10px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default Popup;
