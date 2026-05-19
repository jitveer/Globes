import React, { useRef, useEffect } from "react";
import {
  FaUserShield,
  FaSearch,
  FaBell,
  FaCheck,
  FaCalendarAlt,
} from "react-icons/fa";

const timeAgo = (date) => {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + " years ago";
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + " months ago";
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + " days ago";
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + " hours ago";
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + " minutes ago";
  return "Just now";
};

const TopNav = ({
  adminData,
  searchQuery,
  setSearchQuery,
  showNotifications,
  setShowNotifications,
  notifications = [],
  unreadCount = 0,
  onMarkAsRead,
  onNotificationClick,
  onMarkAllAsRead,
}) => {
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };

    if (showNotifications) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showNotifications, setShowNotifications]);

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white shadow-lg z-50">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-r from-orange-600 to-orange-700 p-2 rounded-lg">
              <FaUserShield className="text-white text-2xl" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                Admin Dashboard
              </h1>
              <p className="text-xs text-gray-600">Globes Properties</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Search Bar */}
          <div className="hidden md:flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-lg">
            <FaSearch className="text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent outline-none text-sm w-64"
            />
          </div>

          {/* Notifications */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors group"
            >
              <FaBell className="text-gray-600 text-xl group-hover:text-orange-600 transition-colors" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 bg-red-500 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-bold animate-bounce shadow-lg">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-3 w-96 bg-white rounded-2xl shadow-2xl border border-gray-100 py-0 overflow-hidden animate-[slideDown_0.3s_ease-out]">
                <div className="px-5 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
                  <h3 className="font-bold text-gray-900 flex items-center gap-2">
                    <FaBell className="text-orange-500" /> Notifications
                  </h3>
                  {unreadCount > 0 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onMarkAllAsRead();
                      }}
                      className="text-xs font-bold text-orange-600 hover:text-orange-700 underline flex items-center gap-1"
                    >
                      <FaCheck /> Mark all as read
                    </button>
                  )}
                </div>
                <div className="max-h-[400px] overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-10 text-center">
                      <FaBell className="text-4xl text-gray-200 mx-auto mb-3" />
                      <p className="text-sm font-bold text-gray-400">
                        No notifications yet
                      </p>
                    </div>
                  ) : (
                    notifications.map((notif) => (
                      <div
                        key={notif._id}
                        className={`px-5 py-4 hover:bg-orange-50/30 cursor-pointer border-b border-gray-50 transition-all flex gap-4 items-start ${!notif.isRead ? "bg-orange-50/10" : ""}`}
                        onClick={() => onNotificationClick(notif)}
                      >
                        <div
                          className={`mt-1 p-2 rounded-xl text-lg ${!notif.isRead ? "bg-orange-100 text-orange-600" : "bg-gray-100 text-gray-400"}`}
                        >
                          <FaCalendarAlt />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p
                            className={`text-sm leading-tight mb-1 ${!notif.isRead ? "font-black text-gray-900" : "text-gray-600 font-medium"}`}
                          >
                            {notif.title}
                          </p>
                          <p className="text-xs text-gray-500 line-clamp-2 mb-2 font-medium">
                            {notif.message}
                          </p>
                          <div className="flex items-center justify-between">
                            <p className="text-[10px] text-gray-400 font-black uppercase tracking-wider">
                              {timeAgo(notif.createdAt)}
                            </p>
                            {!notif.isRead && (
                              <span className="w-2 h-2 bg-orange-600 rounded-full shadow-lg shadow-orange-200"></span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                <div className="p-3 bg-gray-50 text-center border-t border-gray-100">
                  <button className="text-xs font-black text-gray-500 hover:text-orange-600 uppercase tracking-widest">
                    View Older Notifications
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Admin Profile */}
          <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
            <img
              src={
                adminData?.avatar ||
                `https://api.dicebear.com/7.x/bottts/svg?seed=${adminData?.firstName || "Admin"}&backgroundColor=f1f5f9`
              }
              alt="Admin"
              className="w-10 h-10 rounded-full ring-2 ring-orange-100"
            />
            <div className="hidden md:block">
              <p className="text-sm font-semibold text-gray-900">
                {adminData
                  ? `${adminData.firstName} ${adminData.lastName}`
                  : "Admin User"}
              </p>
              <p className="text-xs text-gray-600 capitalize">
                {adminData?.role || "Super Admin"}
              </p>
            </div>
          </div>
        </div>
      </div>
      <style>{`
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </nav>
  );
};

export default TopNav;
