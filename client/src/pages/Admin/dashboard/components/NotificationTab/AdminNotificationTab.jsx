import React, { useState, useEffect } from "react";
import {
  FaBell,
  FaHistory,
  FaPaperPlane,
  FaSearch,
  FaFilter,
  FaUserCircle,
  FaCheckCircle,
  FaClock,
  FaInfoCircle,
  FaUsers,
} from "react-icons/fa";

const NotificationTab = ({ users = [] }) => {
  const [activeSubTab, setActiveSubTab] = useState("history"); // history | compose
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");

  // For Compose Notification
  const [composeData, setComposeData] = useState({
    title: "",
    message: "",
    recipientType: "all", // all | specific
    selectedUsers: [],
  });

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("accessToken");
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/admin-notifications`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      const data = await res.json();
      if (data.success) {
        setNotifications(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendNotification = async (e) => {
    e.preventDefault();
    // Logic to send notification - will need backend endpoint
    alert("This feature will be available once the backend API is ready!");
  };

  const filteredNotifications = notifications.filter((notif) => {
    const matchesSearch =
      notif.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notif.message.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterType === "all" || notif.type === filterType;
    return matchesSearch && matchesFilter;
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

  return (
    <div className="space-y-6">
      {/* Header & Tabs */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <FaBell className="text-orange-500" /> Notifications Manager
            </h2>
            <p className="text-gray-500 text-sm">
              Track history and send custom alerts to users
            </p>
          </div>

          <div className="flex bg-gray-100 p-1 rounded-xl">
            <button
              onClick={() => setActiveSubTab("history")}
              className={`flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-bold transition-all ${
                activeSubTab === "history"
                  ? "bg-white text-orange-600 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <FaHistory /> History
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* Filters */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-wrap gap-4 items-center">
          <div className="flex-1 min-w-[300px] relative">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search notifications..."
              className="w-full pl-11 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-orange-500 transition-colors"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2">
            <FaFilter className="text-gray-400" />
            <select
              className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 outline-none focus:border-orange-500 font-medium text-sm"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="all">All Types</option>
              <option value="user_registered">Registrations</option>
              <option value="inquiry_received">Inquiries</option>
              <option value="visit_scheduled">Visits</option>
              <option value="system">System</option>
            </select>
          </div>
        </div>

        {/* History List */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="p-20 text-center">
              <div className="animate-spin w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-gray-500 font-medium">Loading history...</p>
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div className="p-20 text-center">
              <FaBell className="text-6xl text-gray-100 mx-auto mb-4" />
              <p className="text-gray-500 font-bold">No notifications found</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {filteredNotifications.map((notif) => (
                <div
                  key={notif._id}
                  className="p-6 hover:bg-gray-50 transition-colors flex gap-4 items-start"
                >
                  <div
                    className={`p-3 rounded-xl text-xl ${
                      notif.type === "user_registered"
                        ? "bg-blue-100 text-blue-600"
                        : notif.type === "inquiry_received"
                          ? "bg-orange-100 text-orange-600"
                          : notif.type === "visit_scheduled"
                            ? "bg-green-100 text-green-600"
                            : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {notif.type === "user_registered" ? (
                      <FaUserCircle />
                    ) : notif.type === "inquiry_received" ? (
                      <FaInfoCircle />
                    ) : notif.type === "visit_scheduled" ? (
                      <FaCheckCircle />
                    ) : (
                      <FaBell />
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-bold text-gray-900">{notif.title}</h4>
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1">
                        <FaClock /> {timeAgo(notif.createdAt)}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {notif.message}
                    </p>

                    {notif.metadata && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {Object.entries(notif.metadata).map(([key, value]) => (
                          <span
                            key={key}
                            className="px-2 py-1 bg-gray-100 text-gray-500 text-[10px] rounded font-bold"
                          >
                            {key}: {String(value)}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationTab;
