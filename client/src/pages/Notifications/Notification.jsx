import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  FaBell,
  FaCheck,
  FaTimes,
  FaUserPlus,
  FaTrash,
  FaExternalLinkAlt,
  FaInfoCircle,
  FaTags,
  FaHome,
  FaBullhorn,
} from "react-icons/fa";

const Notification = () => {
  const {
    user: currentUser,
    notifications,
    unreadCount,
    markNotificationAsRead,
    fetchNotifications,
  } = useAuth();
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("all"); // all, unread, read
  const [selectedNotif, setSelectedNotif] = useState(null);
  const location = useLocation();

  useEffect(() => {
    if (currentUser && notifications.length === 0) {
      fetchNotifications(currentUser);
    }
  }, [currentUser]);

  // Handle deep-linking from URL (?id=...)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const notifId = params.get("id");
    if (notifId && notifications.length > 0) {
      const found = notifications.find((n) => n._id === notifId);
      if (found) {
        handleNotifClick(found);
      }
    }
  }, [location.search, notifications]);

  const handleNotifClick = (notif) => {
    setSelectedNotif(notif);
    if (isUnread(notif)) {
      markNotificationAsRead(notif._id);
    }
  };

  const isUnread = (notification) => {
    if (!currentUser) return false;
    const userId = (currentUser.id || currentUser._id)?.toString();
    if (!userId) return false;

    // Explicit match check: User is only read if THEIR specific ID is in the list
    return !notification.readBy.some((rid) => rid?.toString() === userId);
  };

  const filteredNotifications = notifications.filter((notif) => {
    const unread = isUnread(notif);
    if (filter === "unread") return unread;
    if (filter === "read") return !unread;
    return true;
  });

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

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50/50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 bg-white p-12 rounded-3xl shadow-xl shadow-orange-100/20 border border-gray-100 text-center animate-[fadeIn_0.6s_ease-out]">
          <div className="relative mx-auto w-24 h-24 bg-orange-50 rounded-full flex items-center justify-center mb-8 ring-8 ring-orange-50/30">
            <FaBell className="text-4xl text-orange-600 animate-bounce" />
            <div className="absolute top-0 right-0 w-6 h-6 bg-red-500 rounded-full border-4 border-white shadow-sm"></div>
          </div>
          <div className="space-y-3">
            <h2 className="text-3xl font-black text-gray-900 tracking-tight">
              Sign in Required
            </h2>
            <p className="text-gray-500 font-medium leading-relaxed">
              Log in to your account to view your personalized alerts, exclusive
              offers, and property updates.
            </p>
          </div>
          <div className="pt-8">
            <button
              onClick={() => (window.location.href = "/login")}
              className="w-full bg-gradient-to-r from-orange-600 to-orange-700 text-white py-4 rounded-2xl font-bold shadow-lg shadow-orange-100 hover:shadow-orange-200 transition-all transform hover:scale-[1.02] active:scale-100 flex items-center justify-center gap-2 group"
            >
              Take me to Login
              <span className="group-hover:translate-x-1 transition-transform">
                →
              </span>
            </button>
            <p className="text-xs text-gray-400 mt-6 font-medium uppercase tracking-widest flex items-center justify-center gap-2">
              <span className="w-8 h-[1px] bg-gray-100"></span>
              Security & Privacy
              <span className="w-8 h-[1px] bg-gray-100"></span>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-orange-50/30 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="mb-8 animate-[fadeIn_0.6s_ease-out]">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 md:mt-20">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <FaBell className="text-orange-600" /> Notifications
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Stay updated with special offers, new properties, and platform
                news.
              </p>
            </div>
            {unreadCount > 0 && (
              <span className="px-3 py-1 bg-orange-100 text-orange-600 text-sm font-bold rounded-full">
                {unreadCount} New
              </span>
            )}
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-2 bg-white p-1 rounded-xl shadow-sm border border-gray-100">
            {["all", "unread", "read"].map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-bold transition-all duration-300 ${
                  filter === tab
                    ? "bg-orange-600 text-white shadow-lg shadow-orange-100"
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Notifications list */}
        <div className="space-y-4">
          {loading ? (
            <div className="py-20 text-center">
              <div className="animate-spin w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-gray-500 font-medium">
                Loading your alerts...
              </p>
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
              <FaBell className="text-6xl text-gray-100 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                All Caught Up!
              </h3>
              <p className="text-gray-500">
                {filter === "unread"
                  ? "No unread notifications right now."
                  : "You don't have any notifications yet."}
              </p>
            </div>
          ) : (
            filteredNotifications.map((notif, index) => (
              <NotificationCard
                key={notif._id}
                notif={notif}
                isUnread={isUnread(notif)}
                onClick={() => handleNotifClick(notif)}
                timeAgo={timeAgo(notif.createdAt)}
                index={index}
              />
            ))
          )}
        </div>
      </div>

      {/* Detail Modal */}
      {selectedNotif && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]">
          <div
            className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-[slideUp_0.3s_ease-out]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div
                  className={`p-4 rounded-2xl ${
                    selectedNotif.type === "offer"
                      ? "bg-red-50 text-red-600"
                      : selectedNotif.type === "new_property"
                        ? "bg-green-50 text-green-600"
                        : "bg-orange-50 text-orange-600"
                  }`}
                >
                  <NotificationIcon type={selectedNotif.type} size="text-2xl" />
                </div>
                <button
                  onClick={() => setSelectedNotif(null)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <FaTimes className="text-gray-400" />
                </button>
              </div>

              <div className="mb-4">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-600 mb-2 block">
                  {selectedNotif.type.replace("_", " ")} alert
                </span>
                <h2 className="text-2xl font-black text-gray-900 leading-tight">
                  {selectedNotif.title}
                </h2>
              </div>

              <div className="relative mb-6 rounded-2xl overflow-hidden h-48 bg-gray-100">
                {selectedNotif.image ? (
                  <img
                    src={selectedNotif.image}
                    alt={selectedNotif.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center opacity-10">
                    <NotificationIcon
                      type={selectedNotif.type}
                      size="text-8xl"
                    />
                  </div>
                )}
              </div>

              <p className="text-gray-600 leading-relaxed font-medium text-lg mb-8">
                {selectedNotif.message}
              </p>

              <div className="flex items-center justify-between pt-6 border-t border-gray-100">
                <span className="text-sm font-bold text-gray-400 flex items-center gap-2">
                  <FaInfoCircle size={14} /> {timeAgo(selectedNotif.createdAt)}
                </span>
                {selectedNotif.link && (
                  <a
                    href={selectedNotif.link}
                    className="px-6 py-3 bg-gray-900 text-white rounded-xl font-bold flex items-center gap-2 hover:bg-orange-600 transition-all hover:scale-105"
                  >
                    View Source <FaExternalLinkAlt size={12} />
                  </a>
                )}
              </div>
            </div>

            <button
              onClick={() => setSelectedNotif(null)}
              className="w-full py-4 bg-orange-600 text-white font-black text-sm uppercase tracking-widest hover:bg-orange-700 transition-colors"
            >
              Dismiss Notification
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideIn { from { opacity: 0; transform: translateX(-10px); } to { opacity: 1; transform: translateX(0); } }
      `}</style>
    </div>
  );
};

const NotificationIcon = ({ type, size = "text-xl" }) => {
  switch (type) {
    case "offer":
      return <FaTags className={size} />;
    case "new_property":
      return <FaHome className={size} />;
    case "system":
      return <FaBullhorn className={size} />;
    default:
      return <FaInfoCircle className={size} />;
  }
};

const NotificationCard = ({ notif, isUnread, onClick, timeAgo, index }) => {
  const getBadgeColorClasses = (type) => {
    switch (type) {
      case "offer":
        return "bg-red-50 text-red-600";
      case "new_property":
        return "bg-green-50 text-green-600";
      default:
        return "bg-orange-50 text-orange-600";
    }
  };

  return (
    <article
      className={`group relative bg-white rounded-2xl p-5 border transition-all duration-300 transform animate-[slideIn_0.3s_ease-out] cursor-pointer
        ${isUnread ? "border-orange-200 shadow-md ring-1 ring-orange-50" : "border-gray-100 hover:border-gray-200"}
        hover:scale-[1.01] hover:shadow-xl
      `}
      onClick={onClick}
    >
      <div className="flex gap-4 items-start">
        {/* Left Icon/Image */}
        <div className="shrink-0">
          <div
            className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl relative overflow-hidden ${
              notif.image ? "" : getBadgeColorClasses(notif.type)
            }`}
          >
            {notif.image ? (
              <img
                src={notif.image}
                alt={notif.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
            ) : (
              <NotificationIcon type={notif.type} />
            )}
            {isUnread && (
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-orange-600 rounded-full border-2 border-white shadow-sm"></span>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start mb-1">
            <h4
              className={`text-lg transition-colors ${
                isUnread
                  ? "font-black text-gray-900"
                  : "font-bold text-gray-700"
              } group-hover:text-orange-600`}
            >
              {notif.title}
            </h4>
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap ml-4">
              {timeAgo}
            </span>
          </div>
          <p className="text-gray-600 text-sm leading-relaxed line-clamp-2 mb-3 font-medium">
            {notif.message}
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <span
              className={`text-[10px] font-black px-2 py-1 rounded uppercase tracking-tighter ${getBadgeColorClasses(notif.type)}`}
            >
              {notif.type.replace("_", " ")}
            </span>
            {notif.link && (
              <a
                href={notif.link}
                target="_blank"
                rel="noreferrer"
                className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1 group/link"
                onClick={(e) => e.stopPropagation()}
              >
                View Details
                <FaExternalLinkAlt className="text-[10px] group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
              </a>
            )}
          </div>
        </div>

        {/* Unread Action */}
        {isUnread && (
          <div className="md:opacity-0 group-hover:opacity-100 transition-opacity">
            <div
              className="p-2 bg-orange-50 text-orange-600 rounded-lg shadow-sm"
              title="Unread"
            >
              <FaCheck size={12} />
            </div>
          </div>
        )}
      </div>
    </article>
  );
};

export default Notification;
