import React, { useState, useEffect } from "react";
import {
  FaBell,
  FaPaperPlane,
  FaImage,
  FaLink,
  FaUsers,
  FaUserCircle,
  FaHistory,
  FaSearch,
  FaClock,
  FaFilter,
  FaChevronRight,
  FaCheckCircle,
} from "react-icons/fa";

const UserNotificationTab = ({ users = [] }) => {
  const [activeSubTab, setActiveSubTab] = useState("history"); // history | compose
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  // History Filters
  const [historyFilterType, setHistoryFilterType] = useState("all");
  const [historyTargetType, setHistoryTargetType] = useState("all");

  const [formData, setFormData] = useState({
    title: "",
    message: "",
    type: "info",
    targetType: "all",
    recipients: [],
    image: "",
    link: "",
  });

  useEffect(() => {
    if (activeSubTab === "history") {
      fetchHistory();
    }
  }, [activeSubTab]);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("accessToken");
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/user-notifications`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      const data = await res.json();
      if (data.success) {
        setHistory(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch history:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const token = localStorage.getItem("accessToken");

      // Validation
      if (
        formData.targetType === "specific" &&
        formData.recipients.length === 0
      ) {
        alert("Please select at least one recipient!");
        setLoading(false);
        return;
      }

      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/user-notifications/send`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        },
      );
      const data = await res.json();
      if (data.success) {
        alert("Notification broadcasted successfully!");
        setFormData({
          title: "",
          message: "",
          type: "info",
          targetType: "all",
          recipients: [],
          image: "",
          link: "",
        });
        setActiveSubTab("history"); // Switch to history to see the new entry
      } else {
        alert(data.message || "Failed to send notification");
      }
    } catch (error) {
      console.error("Error sending notification:", error);
      alert("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  // Advanced Filtering Logic for History
  const filteredHistory = history.filter((h) => {
    const matchesSearch =
      h.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.message.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType =
      historyFilterType === "all" || h.type === historyFilterType;
    const matchesTarget =
      historyTargetType === "all" || h.targetType === historyTargetType;
    return matchesSearch && matchesType && matchesTarget;
  });

  const timeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + "y ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + "m ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + "d ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + "h ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + "min ago";
    return "Just now";
  };

  const getBadgeColor = (type) => {
    switch (type) {
      case "offer":
        return "bg-red-50 text-red-600 border-red-100";
      case "new_property":
        return "bg-green-50 text-green-600 border-green-100";
      case "system":
        return "bg-blue-50 text-blue-600 border-blue-100";
      default:
        return "bg-orange-50 text-orange-600 border-orange-100";
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <FaBell className="text-orange-600" /> User Notifications Center
          </h2>
          <p className="text-gray-500 text-sm">
            Manage your broadcasts, marketing alerts, and platform
            notifications.
          </p>
        </div>
        <div className="flex bg-gray-100 p-1 rounded-xl">
          <button
            onClick={() => setActiveSubTab("history")}
            className={`px-6 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${
              activeSubTab === "history"
                ? "bg-white text-orange-600 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <FaHistory /> Logs & History
          </button>
          <button
            onClick={() => setActiveSubTab("compose")}
            className={`px-6 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${
              activeSubTab === "compose"
                ? "bg-white text-orange-600 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <FaPaperPlane /> Create Alert
          </button>
        </div>
      </div>

      {activeSubTab === "compose" ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Form */}
          <div className="lg:col-span-2">
            <form
              onSubmit={handleSend}
              className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">
                    Notification Title
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 20% Discount on Luxury Villas"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-orange-500"
                    required
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">
                    Alert Category
                  </label>
                  <select
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-orange-500 font-medium"
                    value={formData.type}
                    onChange={(e) =>
                      setFormData({ ...formData, type: e.target.value })
                    }
                  >
                    <option value="info">General Info</option>
                    <option value="offer">Special Offer</option>
                    <option value="new_property">New Property Launch</option>
                    <option value="system">System Update/Alert</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">
                  Detailed Message Body
                </label>
                <textarea
                  rows="4"
                  placeholder="Tell your users more about this notification..."
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-orange-500 resize-none transition-all"
                  required
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                ></textarea>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                    <FaImage className="text-orange-500" /> Cover Image URL
                  </label>
                  <input
                    type="text"
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-orange-500"
                    value={formData.image}
                    onChange={(e) =>
                      setFormData({ ...formData, image: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                    <FaLink className="text-orange-500" /> Redirection Link
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. /properties/123-abc"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-orange-500"
                    value={formData.link}
                    onChange={(e) =>
                      setFormData({ ...formData, link: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-gray-50">
                <label className="text-sm font-bold text-gray-700 block">
                  Target Audience
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({ ...formData, targetType: "all" })
                    }
                    className={`p-4 rounded-xl border-2 transition-all group ${
                      formData.targetType === "all"
                        ? "border-orange-600 bg-orange-50 text-orange-700 shadow-md ring-2 ring-orange-50"
                        : "border-gray-50 bg-gray-50 text-gray-400 hover:border-orange-100"
                    }`}
                  >
                    <FaUsers className="text-2xl mx-auto mb-2" />
                    <span className="font-black text-xs uppercase tracking-wider">
                      Broadcast to All
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({ ...formData, targetType: "specific" })
                    }
                    className={`p-4 rounded-xl border-2 transition-all group ${
                      formData.targetType === "specific"
                        ? "border-orange-600 bg-orange-50 text-orange-700 shadow-md ring-2 ring-orange-50"
                        : "border-gray-50 bg-gray-50 text-gray-400 hover:border-orange-100"
                    }`}
                  >
                    <FaUserCircle className="text-2xl mx-auto mb-2" />
                    <span className="font-black text-xs uppercase tracking-wider">
                      Specific Users
                    </span>
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-orange-600 to-orange-700 text-white py-4 rounded-xl font-bold shadow-lg shadow-orange-100 hover:shadow-orange-200 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span>
                    Broadcasting...
                  </div>
                ) : (
                  <>
                    <FaPaperPlane /> Broadcast Alert Now
                  </>
                )}
              </button>
            </form>
          </div>

          {/* User Selection Sidebar */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-fit sticky top-6">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2 uppercase text-xs tracking-widest text-gray-400">
              {formData.targetType === "all" ? (
                <FaUsers className="text-orange-500" />
              ) : (
                <FaUserCircle className="text-orange-500" />
              )}
              {formData.targetType === "all"
                ? "Audience Size"
                : "Select Recipients"}
            </h3>

            {formData.targetType === "all" ? (
              <div className="p-6 bg-orange-50 rounded-2xl text-center border border-orange-100">
                <p className="text-orange-900 font-bold text-xs mb-2 opacity-60">
                  Public Broadcast
                </p>
                <p className="text-4xl font-black text-orange-600">
                  {users.length}
                </p>
                <p className="text-[10px] text-orange-400 mt-2 font-bold uppercase tracking-tighter">
                  Every registered user will see this
                </p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[450px] overflow-y-auto custom-scrollbar pr-2">
                <div className="sticky top-0 bg-white pb-2">
                  <span className="text-[10px] font-black text-gray-400">
                    SELECTED: {formData.recipients.length}
                  </span>
                </div>
                {users.map((user) => (
                  <label
                    key={user._id}
                    className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all border ${
                      formData.recipients.includes(user._id)
                        ? "border-orange-500 bg-orange-50/30 shadow-sm"
                        : "border-gray-50 bg-gray-50/50 hover:bg-gray-100"
                    }`}
                  >
                    <input
                      type="checkbox"
                      className="w-5 h-5 accent-orange-600 rounded-lg"
                      checked={formData.recipients.includes(user._id)}
                      onChange={(e) => {
                        const ids = e.target.checked
                          ? [...formData.recipients, user._id]
                          : formData.recipients.filter((id) => id !== user._id);
                        setFormData({ ...formData, recipients: ids });
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-gray-900 truncate">
                        {user.firstName} {user.lastName}
                      </p>
                      <p className="text-[10px] text-gray-400 font-bold truncate">
                        {user.email}
                      </p>
                    </div>
                  </label>
                ))}
              </div>
            )}

            <div className="mt-6 p-4 bg-orange-600 rounded-2xl text-white shadow-xl shadow-orange-100 overflow-hidden relative">
              <div className="relative z-10">
                <h4 className="font-black text-[10px] uppercase tracking-widest mb-1 opacity-80">
                  Quick Tip
                </h4>
                <p className="text-[10px] leading-relaxed italic">
                  Broadcasts are real-time. Double check links before clicking
                  send.
                </p>
              </div>
              <FaBell className="absolute -bottom-2 -right-2 text-6xl text-orange-500/30 rotate-12" />
            </div>
          </div>
        </div>
      ) : (
        /* Enhanced History Section with Filters */
        <div className="space-y-6">
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
            {/* Search Input */}
            <div className="md:col-span-2 relative">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
              <input
                type="text"
                placeholder="Search history by title, content..."
                className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border border-transparent rounded-xl outline-none focus:bg-white focus:border-orange-500 transition-all font-medium text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Type Filter */}
            <div className="relative group">
              <FaFilter className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-hover:text-orange-500 transition-colors" />
              <select
                className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border border-transparent rounded-xl outline-none focus:bg-white focus:border-orange-500 transition-all font-bold text-xs appearance-none uppercase"
                value={historyFilterType}
                onChange={(e) => setHistoryFilterType(e.target.value)}
              >
                <option value="all">All Categories</option>
                <option value="info">General Info</option>
                <option value="offer">Special Offers</option>
                <option value="new_property">Property Launch</option>
                <option value="system">System Alerts</option>
              </select>
            </div>

            {/* Audience Filter */}
            <div className="relative group">
              <FaUsers className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-hover:text-orange-500 transition-colors" />
              <select
                className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border border-transparent rounded-xl outline-none focus:bg-white focus:border-orange-500 transition-all font-bold text-xs appearance-none uppercase"
                value={historyTargetType}
                onChange={(e) => setHistoryTargetType(e.target.value)}
              >
                <option value="all">Every Audience</option>
                <option value="all">Public (All Users)</option>
                <option value="specific">Private (Specific)</option>
              </select>
            </div>
          </div>

          {/* Filter Indicators (Active tags) */}
          {(historyFilterType !== "all" ||
            historyTargetType !== "all" ||
            searchQuery) && (
            <div className="flex gap-2 flex-wrap items-center">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">
                Active View:
              </span>
              {searchQuery && (
                <span className="px-3 py-1 bg-orange-50 text-orange-600 rounded-full text-[10px] font-bold border border-orange-100 flex items-center gap-2">
                  Query: {searchQuery}
                </span>
              )}
              {historyFilterType !== "all" && (
                <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-bold border border-blue-100 flex items-center gap-2">
                  Category: {historyFilterType.replace("_", " ")}
                </span>
              )}
              {historyTargetType !== "all" && (
                <span className="px-3 py-1 bg-green-50 text-green-600 rounded-full text-[10px] font-bold border border-green-100 flex items-center gap-2">
                  Target: {historyTargetType}
                </span>
              )}
              <button
                onClick={() => {
                  setSearchQuery("");
                  setHistoryFilterType("all");
                  setHistoryTargetType("all");
                }}
                className="text-[10px] font-black text-orange-600 hover:underline px-2"
              >
                CLEAR ALL
              </button>
            </div>
          )}

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden divide-y divide-gray-50">
            {loading ? (
              <div className="p-20 text-center">
                <div className="animate-spin w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-gray-500 font-medium">Fetching history...</p>
              </div>
            ) : filteredHistory.length === 0 ? (
              <div className="p-20 text-center">
                <FaBell className="text-6xl text-gray-100 mx-auto mb-4" />
                <p className="text-gray-500 font-bold italic">
                  No matching notifications found. Try different filters.
                </p>
              </div>
            ) : (
              filteredHistory.map((alert) => (
                <div
                  key={alert._id}
                  className="p-6 flex flex-col sm:flex-row gap-6 items-start hover:bg-gray-50/50 transition-colors group relative"
                >
                  <div
                    className={`shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center text-xl border transition-transform group-hover:scale-110 ${getBadgeColor(
                      alert.type,
                    )}`}
                  >
                    <FaBell />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2 gap-2">
                      <div>
                        <h4 className="font-black text-gray-900 group-hover:text-orange-600 transition-colors">
                          {alert.title}
                        </h4>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[10px] font-black text-orange-500 uppercase tracking-tighter">
                            {alert.type.replace("_", " ")}
                          </span>
                          <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                          <span className="text-[9px] font-bold text-gray-400 uppercase">
                            Sent to:{" "}
                            {alert.targetType === "all"
                              ? "Eveyone"
                              : "Selected"}
                          </span>
                        </div>
                      </div>
                      <span className="text-[10px] text-gray-400 flex items-center gap-1 font-black bg-white px-2 py-1 rounded-lg border border-gray-50 shadow-sm">
                        <FaClock /> {timeAgo(alert.createdAt)}
                      </span>
                    </div>

                    <p className="text-gray-600 text-sm leading-relaxed mb-4 font-medium opacity-80">
                      {alert.message}
                    </p>

                    <div className="flex flex-wrap gap-4">
                      {alert.image && (
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-xl text-[10px] font-black text-gray-500">
                          <FaImage /> IMAGE ATTACHED
                        </div>
                      )}
                      {alert.link && (
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-100/50 text-blue-600 rounded-xl text-[10px] font-black">
                          <FaLink /> {alert.link}
                        </div>
                      )}
                      <div className="flex items-center gap-2 px-3 py-1.5 bg-green-100/50 text-green-700 rounded-xl text-[10px] font-black">
                        <FaCheckCircle /> {alert.readBy.length} READERS
                      </div>
                    </div>
                  </div>

                  {/* Indicator for specific target */}
                  {alert.targetType === "specific" && (
                    <div className="absolute top-0 right-0 p-3">
                      <FaUserCircle
                        className="text-orange-200 text-xl"
                        title="Private Notification"
                      />
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserNotificationTab;
