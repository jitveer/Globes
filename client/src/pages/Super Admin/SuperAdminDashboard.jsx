import { useState, useEffect, useRef } from "react";
import {
  FaHome,
  FaBuilding,
  FaUsers,
  FaEnvelope,
  FaBlog,
  FaChartLine,
  FaCog,
  FaSignOutAlt,
  FaPlus,
  FaEdit,
  FaTrash,
  FaEye,
  FaSearch,
  FaFilter,
  FaBell,
  FaMapMarkerAlt,
  FaBed,
  FaBath,
  FaRulerCombined,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaUserShield,
  FaMoneyBillWave,
  FaHeart,
  FaDownload,
  FaServer,
  FaShieldAlt,
  FaUserTie,
  FaHistory,
  FaChartBar,
  FaTools,
  FaCalendarAlt,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Popup from "../../components/Popup";

// --- Global Mock Data ---
// These objects represent data that will eventually be fetched from a live API.
const platformStats = {
  totalRevenue: "₹45,67,000",
  activeUsers: 4521,
  totalProperties: 856,
  pendingApprovals: 42,
  systemUptime: "99.99%",
  databaseHealth: "Optimal",
  failedLogins: 12,
  activeAdmins: 5,
};

// Breakdown of user counts based on their assigned system roles.
const userRolesBreakdown = [
  {
    role: "Super Admin",
    count: 2,
    icon: FaShieldAlt,
    color: "text-red-600",
    bg: "bg-red-100",
  },
  {
    role: "Admin",
    count: 5,
    icon: FaUserShield,
    color: "text-orange-600",
    bg: "bg-orange-100",
  },
  {
    role: "Agent",
    count: 48,
    icon: FaUserTie,
    color: "text-blue-600",
    bg: "bg-blue-100",
  },
  {
    role: "Builder",
    count: 32,
    icon: FaBuilding,
    color: "text-purple-600",
    bg: "bg-purple-100",
  },
  {
    role: "User",
    count: 4434,
    icon: FaUsers,
    color: "text-green-600",
    bg: "bg-green-100",
  },
];

const recentSystemLogs = [
  {
    id: 1,
    action: "New Admin Created",
    user: "SuperAdmin1",
    target: "Admin_Rahul",
    timestamp: "2 hours ago",
    status: "Success",
    type: "security",
  },
  {
    id: 2,
    action: "Property Approved",
    user: "Admin_Sneha",
    target: "Luxury Villa #88",
    timestamp: "4 hours ago",
    status: "Success",
    type: "content",
  },
  {
    id: 3,
    action: "Mass Notification Sent",
    user: "SuperAdmin1",
    target: "All Agents",
    timestamp: "1 day ago",
    status: "Success",
    type: "system",
  },
  {
    id: 4,
    action: "Backup Completed",
    user: "System",
    target: "Daily_Backup_v45",
    timestamp: "12 hours ago",
    status: "Success",
    type: "server",
  },
];

const pendingProperties = [
  {
    id: 1,
    title: "Ocean View Penthouse",
    owner: "Modern Builders",
    location: "Goa, India",
    price: "4,50,00,000",
    date: "1 day ago",
    image:
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&h=300&fit=crop",
  },
  {
    id: 2,
    title: "Tech Park Residences",
    owner: "SkyHigh Agents",
    location: "Whitefield, Bangalore",
    price: "1,20,00,000",
    date: "2 days ago",
    image:
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&h=300&fit=crop",
  },
];

const SuperAdminDashboard = () => {
  const dropdownRef = useRef(null);
  // --- Navigation & UI State ---
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(
    localStorage.getItem("superAdminActiveTab") || "overview",
  ); // Controls which section is visible
  const [searchQuery, setSearchQuery] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);
  const [adminData, setAdminData] = useState(null); // Stores logged-in user profile info
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // --- Administrators List State ---
  const [adminsList, setAdminsList] = useState([]); // Array to store admins fetched from DB
  const [listLoading, setListLoading] = useState(false); // Controls table loading spinner

  // --- Popup State ---
  const [popupConfig, setPopupConfig] = useState({
    isOpen: false,
    type: "success",
    title: "",
    message: "",
    onConfirm: null,
  });

  // Persist tab selection on refresh
  useEffect(() => {
    localStorage.setItem("superAdminActiveTab", activeTab);
  }, [activeTab]);

  const showPopup = (type, title, message, onConfirm = null) => {
    setPopupConfig({ isOpen: true, type, title, message, onConfirm });
  };

  /**
   * Fetches the list of all administrators from the backend.
   * Requires a valid Super Admin JWT token.
   */
  const fetchAdmins = async () => {
    setListLoading(true);
    const token = localStorage.getItem("accessToken");
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/superadmin/admins`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      const data = await response.json();
      if (response.ok) {
        setAdminsList(data.data);
      }
    } catch (err) {
      console.error("Failed to fetch admins:", err);
    } finally {
      setListLoading(false);
    }
  };

  /**
   * Toggles an administrator's account status (Active/Inactive)
   */
  const handleToggleStatus = async (adminId) => {
    const token = localStorage.getItem("accessToken");
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/superadmin/admins/${adminId}/status`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      const data = await response.json();
      if (response.ok) {
        showPopup("success", "Status Updated", data.message);
        fetchAdmins(); // Refresh the list
      } else {
        showPopup("error", "Error", data.message);
      }
    } catch (err) {
      showPopup("error", "Error", "Failed to update status");
    }
  };

  /**
   * Component Lifecycle:
   * 1. Verifies if a user is logged in and has 'superadmin' role.
   * 2. Redirects to login if unauthorized.
   * 3. Fetches initial data if authorized.
   */
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const user = JSON.parse(localStorage.getItem("user"));

    if (!token || user?.role !== "superadmin") {
      navigate("/super-admin/login");
    } else {
      setAdminData(user);
      fetchAdmins(); // Load initial admin list
      fetchNotifications();
      fetchUnreadCount();

      // Poll for new notifications every 30 seconds
      const interval = setInterval(() => {
        fetchUnreadCount();
        if (showNotifications) fetchNotifications();
      }, 30000);

      return () => clearInterval(interval);
    }
  }, [navigate, showNotifications]);

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
  }, [showNotifications]);

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/notifications`,
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
    }
  };

  const fetchUnreadCount = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/notifications/unread-count`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      const data = await res.json();
      if (data.success) {
        setUnreadCount(data.data.count);
      }
    } catch (error) {
      console.error("Failed to fetch unread count:", error);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      const token = localStorage.getItem("accessToken");
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/notifications/${id}/read`,
        {
          method: "PATCH",
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      const data = await res.json();
      if (data.success) {
        setNotifications((prev) =>
          prev.map((n) => (n._id === id ? { ...n, isRead: true } : n)),
        );
        fetchUnreadCount();
      }
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/notifications/mark-all-read`,
        {
          method: "PATCH",
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      const data = await res.json();
      if (data.success) {
        setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
        setUnreadCount(0);
      }
    } catch (error) {
      console.error("Failed to mark all as read:", error);
    }
  };

  const timeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + "y ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + "mo ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + "d ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + "h ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + "m ago";
    return "Just now";
  };

  // --- Admin Creation State ---
  const [createLoading, setCreateLoading] = useState(false);
  const [newAdmin, setNewAdmin] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
  });

  // Updates form state when typing in the Create Admin form
  const handleAdminChange = (e) => {
    setNewAdmin({ ...newAdmin, [e.target.name]: e.target.value });
  };

  /**
   * Unified handler for create vs update
   */
  const handleSubmit = (e) => {
    if (editingAdmin) {
      handleUpdateAdmin(e);
    } else {
      handleCreateAdmin(e);
    }
  };

  /**
   * Handles submission of the New Admin form.
   * Sends a POST request to create a new administrator record.
   */
  const handleCreateAdmin = async (e) => {
    e.preventDefault();
    setCreateLoading(true);
    const token = localStorage.getItem("accessToken");

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/superadmin/admins`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(newAdmin),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create admin");
      }

      showPopup(
        "success",
        "Success!",
        "New administrator account has been created successfully.",
      );
      setNewAdmin({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        password: "",
      });
      fetchAdmins(); // Refresh the list
    } catch (err) {
      showPopup("error", "Error", err.message);
    } finally {
      setCreateLoading(false);
    }
  };

  /**
   * Handles submission of the Edit Admin form.
   * Sends a PUT request to update the admin record.
   */
  const [editingAdmin, setEditingAdmin] = useState(null);

  /**
   * Opens the edit mode and populates the form with the selected admin's data.
   */
  const handleEditAdmin = (admin) => {
    showPopup(
      "info",
      "Edit Administrator",
      `Do you want to edit the details of ${admin.firstName} ${admin.lastName}?`,
      () => {
        setEditingAdmin(admin);
        setNewAdmin({
          firstName: admin.firstName,
          lastName: admin.lastName,
          email: admin.email,
          phone: admin.phone,
          password: "",
        });
        // Scroll to form for better UX
        window.scrollTo({ top: 0, behavior: "smooth" });
        // Close popup immediately after confirming
        setPopupConfig({ ...popupConfig, isOpen: false });
      },
    );
  };

  /**
   * Cancels the edit mode and resets the form.
   */
  const handleCancelUpdate = () => {
    setEditingAdmin(null);
    setNewAdmin({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      password: "",
    });
  };

  /**
   * Handles submission of the Edit Admin form.
   * Sends a PUT request to update the admin record.
   */
  const handleUpdateAdmin = async (e) => {
    e.preventDefault();
    setCreateLoading(true);
    const token = localStorage.getItem("accessToken");

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/superadmin/admins/${editingAdmin._id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(newAdmin),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update admin");
      }

      showPopup(
        "success",
        "Success!",
        "Administrator account has been updated successfully.",
      );
      setEditingAdmin(null); // Exit edit mode
      setNewAdmin({
        // Reset form
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        password: "",
      });
      fetchAdmins(); // Refresh the list
    } catch (err) {
      showPopup("error", "Error", err.message);
    } finally {
      setCreateLoading(false);
    }
  };

  /**
   * Handles deletion of an administrator.
   * Sends a DELETE request to remove an administrator record.
   */
  const adminDelete = async (admin) => {
    showPopup(
      "warning",
      "Confirm Deletion",
      `Are you sure you want to delete ${admin.firstName} ${admin.lastName} (${admin.email})? This action cannot be undone.`,
      async () => {
        const token = localStorage.getItem("accessToken");
        try {
          const response = await fetch(
            `${import.meta.env.VITE_API_BASE_URL}/api/v1/superadmin/admins/${admin._id}`,
            {
              method: "DELETE",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            },
          );
          const data = await response.json();
          if (!response.ok) {
            throw new Error(data.message || "Failed to delete admin");
          }
          showPopup("success", "Deleted!", "Administrator has been removed.");
          fetchAdmins();
        } catch (err) {
          showPopup("error", "Error", err.message);
        }
      },
    );
  };

  const menuItems = [
    { id: "overview", label: "Platform Overview", icon: FaChartBar },
    { id: "admins", label: "Admin Management", icon: FaUserShield },
    { id: "users", label: "Global Users", icon: FaUsers },
    { id: "approvals", label: "Approvals", icon: FaCheckCircle },
    { id: "finance", label: "Financials", icon: FaMoneyBillWave },
    { id: "logs", label: "System Logs", icon: FaHistory },
    { id: "system", label: "System Health", icon: FaServer },
    { id: "settings", label: "Platform Settings", icon: FaTools },
  ];

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    navigate("/super-admin/login");
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top Navbar */}
      <nav className="fixed top-0 left-0 right-0 bg-white border-b border-slate-200 z-50">
        <div className="flex items-center justify-between px-6 py-3">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="bg-red-600 p-2 rounded-lg">
                <FaShieldAlt className="text-white text-xl" />
              </div>
              <div className="hidden md:block">
                <h1 className="text-lg font-bold text-slate-800 leading-tight">
                  SUPER ADMIN
                </h1>
                <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">
                  Control Panel
                </p>
              </div>
            </div>

            <div className="hidden lg:flex items-center bg-slate-100 px-4 py-2 rounded-full border border-slate-200">
              <FaSearch className="text-slate-400 text-sm" />
              <input
                type="text"
                placeholder="Search platform data..."
                className="bg-transparent border-none outline-none text-sm ml-2 w-64 text-slate-600"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 rounded-full border border-green-100">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-xs font-semibold text-green-700">
                System Live
              </span>
            </div>

            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors relative group"
              >
                <FaBell className="group-hover:text-red-600 transition-colors" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-red-600 text-white text-[10px] font-bold rounded-full border-2 border-white flex items-center justify-center animate-bounce">
                    {unreadCount}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-2xl border border-slate-100 py-0 overflow-hidden z-[100] animate-[slideDown_0.3s_ease-out]">
                  <div className="px-5 py-3 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
                    <h3 className="font-bold text-slate-800 text-sm">
                      Notifications
                    </h3>
                    {unreadCount > 0 && (
                      <button
                        onClick={handleMarkAllAsRead}
                        className="text-[10px] font-bold text-red-600 hover:underline"
                      >
                        Mark all as read
                      </button>
                    )}
                  </div>
                  <div className="max-h-[350px] overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="p-8 text-center text-slate-400">
                        <FaBell className="mx-auto mb-2 opacity-20 text-3xl" />
                        <p className="text-xs font-bold">No notifications</p>
                      </div>
                    ) : (
                      notifications.map((notif) => (
                        <div
                          key={notif._id}
                          onClick={() =>
                            !notif.isRead && handleMarkAsRead(notif._id)
                          }
                          className={`px-5 py-3 hover:bg-slate-50 cursor-pointer border-b border-slate-50 transition-all flex gap-3 items-start ${!notif.isRead ? "bg-red-50/20" : ""}`}
                        >
                          <div
                            className={`mt-0.5 p-1.5 rounded-lg text-xs ${!notif.isRead ? "bg-red-100 text-red-600" : "bg-slate-100 text-slate-400"}`}
                          >
                            <FaCalendarAlt />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p
                              className={`text-xs leading-tight mb-0.5 ${!notif.isRead ? "font-bold text-slate-900" : "text-slate-600"}`}
                            >
                              {notif.title}
                            </p>
                            <p className="text-[10px] text-slate-500 line-clamp-1 mb-1">
                              {notif.message}
                            </p>
                            <p className="text-[9px] text-slate-400 font-bold uppercase">
                              {timeAgo(notif.createdAt)}
                            </p>
                          </div>
                          {!notif.isRead && (
                            <span className="mt-2 w-1.5 h-1.5 bg-red-600 rounded-full"></span>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="h-8 w-[1px] bg-slate-200 mx-2" />

            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-slate-800">
                  {adminData
                    ? `${adminData.firstName} ${adminData.lastName}`
                    : "Loading..."}
                </p>
                <p className="text-[10px] text-red-600 font-bold uppercase">
                  Super Admin
                </p>
              </div>
              <img
                src="https://api.dicebear.com/7.x/bottts/svg?seed=SuperAdmin&backgroundColor=f1f5f9"
                alt="Profile"
                className="w-10 h-10 rounded-full border-2 border-white shadow-sm"
              />
            </div>
          </div>
        </div>
      </nav>

      <div className="flex pt-16">
        {/* Sidebar Navigation */}
        <aside className="fixed left-0 top-16 bottom-0 w-64 bg-slate-900 overflow-y-auto border-r border-slate-800">
          <div className="p-4 space-y-1">
            <p className="text-[10px] font-bold text-slate-500 uppercase px-4 mb-2">
              Main Navigation
            </p>
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition-all ${
                  activeTab === item.id
                    ? "bg-red-600 text-white shadow-lg shadow-red-900/20"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <item.icon
                  className={
                    activeTab === item.id ? "text-white" : "text-slate-500"
                  }
                />
                <span>{item.label}</span>
                {item.id === "approvals" && (
                  <span className="ml-auto bg-white/20 px-1.5 py-0.5 rounded text-[10px]">
                    {platformStats.pendingApprovals}
                  </span>
                )}
              </button>
            ))}

            <div className="pt-8 mt-8 border-t border-white/10 uppercase font-bold text-[10px] text-slate-500 px-4 mb-2">
              Support & Actions
            </div>

            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold text-slate-400 hover:text-white hover:bg-white/5">
              <FaDownload className="text-slate-500" />
              <span>Export Reports</span>
            </button>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold text-red-400 hover:bg-red-400/10 transition-all mt-4"
            >
              <FaSignOutAlt />
              <span>Sign Out</span>
            </button>
          </div>
        </aside>

        {/* Dynamic Content Area: Changes based on activeTab */}
        <main className="flex-1 ml-64 p-8 min-h-[calc(100vh-64px)]">
          {activeTab === "overview" && (
            <div className="space-y-8 animate-[fadeIn_0.5s_ease-out]">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                  <h2 className="text-3xl font-black text-slate-800 tracking-tight">
                    Platform Dashboard
                  </h2>
                  <p className="text-slate-500 font-medium">
                    Global analytics and platform controls
                  </p>
                </div>
                <div className="flex gap-2">
                  <button className="bg-white border border-slate-200 px-4 py-2 rounded-lg text-sm font-bold text-slate-700 hover:bg-slate-50 transition-all">
                    Generate Report
                  </button>
                  <button className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/20">
                    Refresh Stats
                  </button>
                </div>
              </div>

              {/* Stat Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-2xl p-6 text-white shadow-xl shadow-indigo-200">
                  <div className="flex justify-between items-start mb-4">
                    <div className="bg-white/20 p-2 rounded-lg">
                      <FaMoneyBillWave className="text-xl" />
                    </div>
                    <span className="text-[10px] font-bold bg-white/20 px-2 py-0.5 rounded-full uppercase">
                      Monthly
                    </span>
                  </div>
                  <h3 className="text-white/80 text-xs font-bold uppercase tracking-wider mb-1">
                    Total Revenue
                  </h3>
                  <p className="text-3xl font-black">
                    {platformStats.totalRevenue}
                  </p>
                  <p className="text-[10px] mt-4 font-bold text-indigo-100 flex items-center gap-1">
                    <span className="text-xs">↑</span> 14.5% vs last month
                  </p>
                </div>

                <div className="bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-2xl p-6 text-white shadow-xl shadow-emerald-200">
                  <div className="flex justify-between items-start mb-4">
                    <div className="bg-white/20 p-2 rounded-lg">
                      <FaUsers className="text-xl" />
                    </div>
                    <span className="text-[10px] font-bold bg-white/20 px-2 py-0.5 rounded-full uppercase">
                      Live
                    </span>
                  </div>
                  <h3 className="text-white/80 text-xs font-bold uppercase tracking-wider mb-1">
                    Active Users
                  </h3>
                  <p className="text-3xl font-black">
                    {platformStats.activeUsers.toLocaleString()}
                  </p>
                  <p className="text-[10px] mt-4 font-bold text-emerald-100 flex items-center gap-1">
                    <span className="text-xs">↑</span> 8.2% new registrations
                  </p>
                </div>

                <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl p-6 text-white shadow-xl shadow-amber-200">
                  <div className="flex justify-between items-start mb-4">
                    <div className="bg-white/20 p-2 rounded-lg">
                      <FaBuilding className="text-xl" />
                    </div>
                    <span className="text-[10px] font-bold bg-white/20 px-2 py-0.5 rounded-full uppercase">
                      Pending
                    </span>
                  </div>
                  <h3 className="text-white/80 text-xs font-bold uppercase tracking-wider mb-1">
                    Property Approvals
                  </h3>
                  <p className="text-3xl font-black">
                    {platformStats.pendingApprovals}
                  </p>
                  <p className="text-[10px] mt-4 font-bold text-amber-100 flex items-center gap-1">
                    Requires immediate action
                  </p>
                </div>

                <div className="bg-gradient-to-br from-red-600 to-red-700 rounded-2xl p-6 text-white shadow-xl shadow-red-200">
                  <div className="flex justify-between items-start mb-4">
                    <div className="bg-white/20 p-2 rounded-lg">
                      <FaServer className="text-xl" />
                    </div>
                    <span className="text-[10px] font-bold bg-white/20 px-2 py-0.5 rounded-full uppercase">
                      Status
                    </span>
                  </div>
                  <h3 className="text-white/80 text-xs font-bold uppercase tracking-wider mb-1">
                    System Health
                  </h3>
                  <p className="text-3xl font-black">
                    {platformStats.systemUptime}
                  </p>
                  <p className="text-[10px] mt-4 font-bold text-red-100 flex items-center gap-1">
                    Database: {platformStats.databaseHealth}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Role Breakdown */}
                <div className="lg:col-span-1 bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                  <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                    <FaUsers className="text-slate-400" />
                    Users by Role
                  </h3>
                  <div className="space-y-4">
                    {userRolesBreakdown.map((role, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 transition-colors group"
                      >
                        <div
                          className={`${role.bg} ${role.color} p-3 rounded-lg group-hover:scale-110 transition-transform`}
                        >
                          <role.icon />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-bold text-slate-700">
                            {role.role}
                          </p>
                          <p className="text-xs text-slate-500">
                            {role.count} Total
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold text-slate-800">
                            {(
                              (role.count / platformStats.activeUsers) *
                              100
                            ).toFixed(idx === 0 ? 3 : 1)}
                            %
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button className="w-full mt-6 py-3 border-2 border-slate-100 rounded-xl text-xs font-bold text-slate-600 hover:border-red-100 hover:text-red-600 transition-all uppercase tracking-wider">
                    Manage Roles
                  </button>
                </div>

                {/* System Activity Logs */}
                <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                      <FaHistory className="text-slate-400" />
                      Recent Platform Activity
                    </h3>
                    <button className="text-xs font-bold text-red-600 hover:underline">
                      View Audit Log
                    </button>
                  </div>
                  <div className="space-y-4">
                    {recentSystemLogs.map((log) => (
                      <div
                        key={log.id}
                        className="flex items-start gap-4 p-4 border border-slate-50 rounded-xl hover:shadow-md transition-shadow"
                      >
                        <div
                          className={`mt-1 h-3 w-3 rounded-full flex-shrink-0 ${
                            log.type === "security"
                              ? "bg-red-500"
                              : log.type === "server"
                                ? "bg-purple-500"
                                : log.type === "content"
                                  ? "bg-orange-500"
                                  : "bg-blue-500"
                          }`}
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-bold text-slate-800">
                              {log.action}
                            </span>
                            <span className="text-[10px] font-bold px-2 py-0.5 bg-slate-100 text-slate-500 rounded uppercase">
                              {log.type}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500">
                            Performed by{" "}
                            <span className="font-bold text-slate-700">
                              {log.user}
                            </span>{" "}
                            on{" "}
                            <span className="font-bold text-slate-700">
                              {log.target}
                            </span>
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] font-bold text-slate-400 uppercase">
                            {log.timestamp}
                          </p>
                          <span className="text-[10px] font-bold text-emerald-600 flex items-center justify-end gap-1">
                            <FaCheckCircle className="text-[8px]" />{" "}
                            {log.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Pending Approvals Strip */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-bold text-slate-800">
                      Require Verification
                    </h3>
                    <p className="text-xs text-slate-500">
                      Review and approve new property listings from agents and
                      builders
                    </p>
                  </div>
                  <button className="text-xs font-bold text-red-600 bg-red-50 px-3 py-1.5 rounded-lg hover:bg-red-100">
                    Review All
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {pendingProperties.map((prop) => (
                    <div
                      key={prop.id}
                      className="flex gap-4 p-3 bg-slate-50 rounded-xl group border border-transparent hover:border-red-200 transition-all"
                    >
                      <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={prop.image}
                          alt=""
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-bold text-slate-800 truncate">
                          {prop.title}
                        </h4>
                        <p className="text-[10px] text-slate-500 flex items-center gap-1 mb-2">
                          <FaUserTie className="text-[8px]" /> {prop.owner}
                        </p>
                        <div className="flex items-center gap-2">
                          <button className="text-[10px] font-bold bg-white text-emerald-600 border border-slate-200 px-3 py-1 rounded hover:bg-emerald-600 hover:text-white transition-colors">
                            Approve
                          </button>
                          <button className="text-[10px] font-bold bg-white text-red-600 border border-slate-200 px-3 py-1 rounded hover:bg-red-600 hover:text-white transition-colors">
                            Reject
                          </button>
                          <button className="text-[10px] font-bold text-slate-400 p-1 hover:text-slate-800">
                            <FaEye />
                          </button>
                        </div>
                      </div>
                      <div className="text-right flex flex-col justify-between">
                        <p className="text-xs font-black text-slate-800 tracking-tighter">
                          ₹{prop.price}
                        </p>
                        <p className="text-[10px] font-bold text-slate-400">
                          {prop.date}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "admins" && (
            <div className="space-y-8 animate-[fadeIn_0.5s_ease-out]">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                  <h2 className="text-3xl font-black text-slate-800 tracking-tight">
                    Admin Management
                  </h2>
                  <p className="text-slate-500 font-medium">
                    Create and manage system administrators
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Create Admin Form */}
                <div
                  className={`
                    lg:col-span-1 bg-white rounded-2xl shadow-sm border p-6 h-fit transition-all duration-700
                    ${editingAdmin ? "border-emerald-500 shadow-emerald-100 scale-100" : "border-slate-200 shadow-sm"}
                    ${popupConfig.isOpen ? "" : editingAdmin ? "animate-[formPulse_0.6s_ease-in-out]" : ""}
                  `}
                >
                  <style jsx>{`
                    @keyframes formPulse {
                      0% {
                        transform: scale(1);
                      }
                      50% {
                        transform: scale(1.03);
                        filter: brightness(1.1);
                      }
                      100% {
                        transform: scale(1);
                      }
                    }
                  `}</style>
                  <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                    {editingAdmin ? (
                      <FaEdit className="text-emerald-500 text-sm" />
                    ) : (
                      <FaPlus className="text-red-500 text-sm" />
                    )}
                    {editingAdmin ? "Edit Administrator" : "Create New Admin"}
                  </h3>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1 ml-1">
                          First Name
                        </label>
                        <input
                          type="text"
                          name="firstName"
                          value={newAdmin.firstName}
                          onChange={handleAdminChange}
                          required
                          pattern="[A-Za-z]+"
                          title="First name should only contain letters"
                          placeholder="John"
                          className="w-full bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-xl focus:outline-none focus:border-red-500 transition-all text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1 ml-1">
                          Last Name
                        </label>
                        <input
                          type="text"
                          name="lastName"
                          value={newAdmin.lastName}
                          onChange={handleAdminChange}
                          required
                          pattern="[A-Za-z]+"
                          title="Last name should only contain letters"
                          placeholder="Doe"
                          className="w-full bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-xl focus:outline-none focus:border-red-500 transition-all text-sm"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1 ml-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={newAdmin.email}
                        onChange={handleAdminChange}
                        required
                        placeholder="admin@globes.com"
                        className="w-full bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-xl focus:outline-none focus:border-red-500 transition-all text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1 ml-1">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={newAdmin.phone}
                        onChange={handleAdminChange}
                        required
                        pattern="[6-9][0-9]{9}"
                        title="Please enter a valid 10-digit Indian mobile number starting with 6-9"
                        placeholder="9876543210"
                        className="w-full bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-xl focus:outline-none focus:border-red-500 transition-all text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1 ml-1">
                        Initial Password
                      </label>
                      <input
                        type="password"
                        name="password"
                        value={newAdmin.password}
                        onChange={handleAdminChange}
                        required={!editingAdmin}
                        pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                        title="Must contain at least one number, one uppercase, one lowercase letter, and at least 8 characters"
                        placeholder={
                          editingAdmin ? "Leave blank to keep same" : "••••••••"
                        }
                        className="w-full bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-xl focus:outline-none focus:border-red-500 transition-all text-sm"
                      />
                    </div>
                    <div className="flex gap-2">
                      {editingAdmin && (
                        <button
                          type="button"
                          onClick={handleCancelUpdate}
                          className="flex-1 bg-slate-100 text-slate-600 font-bold py-3 rounded-xl hover:bg-slate-200 transition-all border border-slate-200"
                        >
                          Cancel
                        </button>
                      )}
                      <button
                        type="submit"
                        disabled={createLoading}
                        className={`flex-[2] ${editingAdmin ? "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20" : "bg-red-600 hover:bg-red-700 shadow-red-600/20"} text-white font-bold py-3 rounded-xl disabled:bg-slate-300 disabled:cursor-not-allowed transition-all shadow-lg mt-0`}
                      >
                        {createLoading
                          ? editingAdmin
                            ? "Updating..."
                            : "Creating..."
                          : editingAdmin
                            ? "Update Account"
                            : "Create Admin Account"}
                      </button>
                    </div>
                  </form>
                </div>

                {/* Admins List Table */}
                <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                  <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                    <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                      <FaUserShield className="text-slate-400" />
                      Existing Administrators
                    </h3>
                    <div className="flex items-center bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
                      <FaSearch className="text-slate-400 text-xs" />
                      <input
                        type="text"
                        placeholder="Search admins..."
                        className="bg-transparent border-none outline-none text-xs ml-2 w-32"
                      />
                    </div>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="bg-slate-50 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                          <th className="px-6 py-4">Administrator</th>
                          <th className="px-6 py-4">Role</th>
                          <th className="px-6 py-4">Status</th>
                          <th className="px-6 py-4">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {listLoading ? (
                          <tr>
                            <td
                              colSpan="4"
                              className="px-6 py-8 text-center text-slate-400 text-sm"
                            >
                              Loading administrators...
                            </td>
                          </tr>
                        ) : !Array.isArray(adminsList) ||
                          adminsList.length === 0 ? (
                          <tr>
                            <td
                              colSpan="4"
                              className="px-6 py-8 text-center text-slate-400 text-sm"
                            >
                              No administrators found.
                            </td>
                          </tr>
                        ) : (
                          adminsList.map((admin) => (
                            <tr
                              key={admin._id}
                              className="hover:bg-slate-50 transition-colors"
                            >
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                  <div className="h-8 w-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-bold text-xs">
                                    {admin?.firstName?.[0] || "?"}
                                    {admin?.lastName?.[0] || "?"}
                                  </div>
                                  <div>
                                    <p className="text-sm font-bold text-slate-800">
                                      {admin.firstName} {admin.lastName}
                                    </p>
                                    <p className="text-xs text-slate-500">
                                      {admin.email}
                                    </p>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <span className="text-[10px] font-bold px-2 py-1 bg-orange-100 text-orange-600 rounded-full uppercase">
                                  {admin.role}
                                </span>
                              </td>
                              <td className="px-6 py-4">
                                <label className="relative inline-flex items-center cursor-pointer group">
                                  <input
                                    type="checkbox"
                                    checked={admin.isActive}
                                    className="sr-only peer"
                                    onChange={() =>
                                      handleToggleStatus(admin._id)
                                    }
                                  />
                                  <div
                                    className={`
                                    w-20 h-8 rounded-full transition-all duration-300 flex items-center px-1.5 
                                    ${
                                      admin.isActive
                                        ? "bg-emerald-100 border border-emerald-200"
                                        : "bg-red-100 border border-red-200"
                                    }
                                  `}
                                  >
                                    <div
                                      className={`
                                      absolute w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-300
                                      ${admin.isActive ? "translate-x-12" : "translate-x-0"}
                                      flex items-center justify-center
                                    `}
                                    >
                                      <div
                                        className={`w-1.5 h-1.5 rounded-full ${admin.isActive ? "bg-emerald-500" : "bg-red-500"}`}
                                      />
                                    </div>
                                    <span
                                      className={`
                                      text-[10px] font-black uppercase tracking-wider w-full text-center pr-1
                                      ${
                                        admin.isActive
                                          ? "text-emerald-600 pr-6"
                                          : "text-red-600 pl-6"
                                      }
                                    `}
                                    >
                                      {admin.isActive ? "Active" : "OFF"}
                                    </span>
                                  </div>
                                </label>
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-2">
                                  <button
                                    className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                                    onClick={() => handleEditAdmin(admin)}
                                  >
                                    <FaEdit className="text-sm" />
                                  </button>
                                  <button
                                    onClick={() => adminDelete(admin)}
                                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                  >
                                    <FaTrash className="text-sm" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                  <div className="p-4 bg-slate-50 border-t border-slate-100 text-center">
                    <button className="text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors uppercase tracking-widest">
                      View All Administrators
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab !== "overview" && activeTab !== "admins" && (
            <div className="flex flex-col items-center justify-center h-full py-20 text-center animate-[fadeIn_0.5s_ease-out]">
              <div className="bg-slate-200 p-6 rounded-full mb-6">
                <FaTools className="text-4xl text-slate-400" />
              </div>
              <h2 className="text-2xl font-black text-slate-800 mb-2">
                {menuItems.find((i) => i.id === activeTab)?.label}
              </h2>
              <p className="text-slate-500 max-w-sm mb-8">
                This module is currently being optimized for Super Admin usage.
                Security protocols are active.
              </p>
              <button
                onClick={() => setActiveTab("overview")}
                className="bg-slate-900 text-white px-6 py-2 rounded-lg font-bold hover:bg-slate-800 transition-all"
              >
                Back to Overview
              </button>
            </div>
          )}
        </main>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
      <Popup
        isOpen={popupConfig.isOpen}
        type={popupConfig.type}
        title={popupConfig.title}
        message={popupConfig.message}
        onConfirm={popupConfig.onConfirm}
        onClose={() => setPopupConfig({ ...popupConfig, isOpen: false })}
      />
    </div>
  );
};

export default SuperAdminDashboard;
