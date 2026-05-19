import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaHome,
  FaBuilding,
  FaUsers,
  FaEnvelope,
  FaBlog,
  FaChartLine,
  FaCog,
  FaBell,
  FaBullhorn,
} from "react-icons/fa";

// Component Imports
import TopNav from "./components/TopNav/TopNav";
import Sidebar from "./components/Sidebar/Sidebar";
import OverviewTab from "./components/OverviewTab/OverviewTab";
import PropertiesTab from "./components/PropertiesTab/PropertiesTab";
import UsersTab from "./components/UsersTab/UsersTab";
import InquiriesTab from "./components/InquiriesTab/InquiriesTab";
import BlogsTab from "./components/BlogsTab/BlogsTab";
import AnalyticsTab from "./components/AnalyticsTab/AnalyticsTab";
import SettingsTab from "./components/SettingsTab/SettingsTab";
import VisitsTab from "./components/VisitsTab/VisitsTab";
import AdminNotificationTab from "./components/NotificationTab/AdminNotificationTab";
import UserNotificationTab from "./components/UserNotificationTab/UserNotificationTab";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(
    localStorage.getItem("adminActiveTab") || "overview",
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);
  const [adminData, setAdminData] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Helper function to format image URLs
  const getImageUrl = (imageInput) => {
    const placeholder = "https://via.placeholder.com/800x600?text=No+Image";
    if (!imageInput) return placeholder;

    // Support both old string format and new optimized object format
    const url = typeof imageInput === "string" ? imageInput : imageInput.webp;

    if (!url) return placeholder;
    if (url.startsWith("http")) return url;

    // Ensure base URL doesn't have trailing slash and path has leading slash
    const baseUrl = (import.meta.env.VITE_API_BASE_URL || "").replace(
      /\/$/,
      "",
    );
    const path = url.startsWith("/") ? url : `/${url}`;

    return `${baseUrl}${path}`;
  };

  // Persist active tab to localStorage
  useEffect(() => {
    localStorage.setItem("adminActiveTab", activeTab);
  }, [activeTab]);

  // Real Data States
  const [properties, setProperties] = useState([]);
  const [users, setUsers] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalProperties: 0,
    activeListings: 0,
    totalUsers: 0,
    totalInquiries: 0,
    pendingInquiries: 0,
    totalBlogs: 0,
    newUsersThisMonth: 0,
  });

  // Dummy Data for fallback/other tabs
  const recentInquiries = [
    {
      id: 1,
      propertyTitle: "Luxury Villa with Pool",
      userName: "Rahul Sharma",
      email: "rahul@example.com",
      phone: "+91 98765 43210",
      status: "Pending",
      date: "2 hours ago",
    },
    {
      id: 2,
      propertyTitle: "Modern 3BHK Apartment",
      userName: "Priya Patel",
      email: "priya@example.com",
      phone: "+91 98765 43211",
      status: "Contacted",
      date: "5 hours ago",
    },
    {
      id: 3,
      propertyTitle: "Penthouse with Terrace",
      userName: "Amit Kumar",
      email: "amit@example.com",
      phone: "+91 98765 43212",
      status: "Closed",
      date: "1 day ago",
    },
  ];

  const recentUsers = [
    {
      id: 1,
      name: "Jeet Veer",
      email: "jeet@example.com",
      role: "User",
      joinedDate: "2 days ago",
      status: "Active",
      avatar:
        "https://api.dicebear.com/7.x/lorelei/svg?seed=Jeet&backgroundColor=b6e3f4",
    },
    {
      id: 2,
      name: "Sneha Reddy",
      email: "sneha@example.com",
      role: "User",
      joinedDate: "3 days ago",
      status: "Active",
      avatar:
        "https://api.dicebear.com/7.x/micah/svg?seed=Sneha&backgroundColor=ffdfbf",
    },
    {
      id: 3,
      name: "Vikram Singh",
      email: "vikram@example.com",
      role: "Agent",
      joinedDate: "5 days ago",
      status: "Active",
      avatar:
        "https://api.dicebear.com/7.x/adventurer/svg?seed=Vikram&backgroundColor=c0aede",
    },
  ];

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const user = JSON.parse(localStorage.getItem("user"));

    if (!token || (user?.role !== "admin" && user?.role !== "superadmin")) {
      navigate("/admin/login");
    } else {
      setAdminData(user);
      fetchProperties();
      fetchUsers();
      fetchInquiries();
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

  const fetchNotifications = async () => {
    try {
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
    }
  };

  const fetchUnreadCount = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/admin-notifications/unread-count`,
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
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/admin-notifications/${id}/read`,
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

  const handleNotificationClick = (notification) => {
    // Mark as read if not already read
    if (!notification.isRead) {
      handleMarkAsRead(notification._id);
    }

    // Switch tab based on notification type
    if (notification.type === "user_registered") {
      setActiveTab("users");
    } else if (notification.type === "visit_scheduled") {
      setActiveTab("visits");
    } else if (notification.type === "inquiry_received") {
      setActiveTab("inquiries");
    }
    // Close notifications dropdown
    setShowNotifications(false);
  };

  const handleMarkAllAsRead = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/admin-notifications/mark-all-read`,
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

  const fetchInquiries = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/inquiries`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      const data = await res.json();
      if (data.success) {
        setInquiries(data.data);
        setStats((prev) => ({
          ...prev,
          totalInquiries: data.data.length,
          pendingInquiries: data.data.filter((i) => i.status === "pending")
            .length,
        }));
      }
    } catch (error) {
      console.error("Failed to fetch inquiries:", error);
    }
  };

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/users`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      const data = await res.json();
      if (data.success) {
        setUsers(data.data.users);
        setStats((prev) => ({
          ...prev,
          totalUsers: data.data.total,
          newUsersThisMonth: data.data.users.filter((u) => {
            const joinedDate = new Date(u.createdAt);
            const now = new Date();
            return (
              joinedDate.getMonth() === now.getMonth() &&
              joinedDate.getFullYear() === now.getFullYear()
            );
          }).length,
        }));
      }
    } catch (error) {
      console.error("Failed to fetch users:", error);
    }
  };

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("accessToken");
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/properties?status=all`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      const data = await res.json();

      if (data.success) {
        const sortedProperties = data.data
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .map((p) => ({
            ...p,
            images: p.images?.map((img) => getImageUrl(img)),
          }));
        setProperties(sortedProperties);

        // Update stats
        setStats((prev) => ({
          ...prev,
          totalProperties: sortedProperties.length,
          activeListings: sortedProperties.filter((p) => p.status === "active")
            .length,
        }));
      }
    } catch (error) {
      console.error("Failed to fetch properties:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProperty = async (id) => {
    if (!window.confirm("Are you sure you want to delete this property?"))
      return;

    try {
      const token = localStorage.getItem("accessToken");
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/properties/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      const data = await res.json();

      if (data.success) {
        alert("Property deleted successfully");
        fetchProperties(); // Refresh list
      } else {
        alert("Error: " + data.message);
      }
    } catch (error) {
      console.error("Error deleting property:", error);
      alert("Failed to delete property");
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      const newStatus = currentStatus === "active" ? "inactive" : "active";
      const token = localStorage.getItem("accessToken");

      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/properties/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: newStatus }),
        },
      );

      const data = await res.json();
      if (data.success) {
        fetchProperties(); // Refresh list
      } else {
        alert("Error: " + data.message);
      }
    } catch (error) {
      console.error("Error toggling status:", error);
      alert("Failed to update status");
    }
  };

  const menuItems = [
    { id: "overview", label: "Dashboard", icon: FaHome },
    { id: "properties", label: "Properties", icon: FaBuilding },
    { id: "users", label: "Users", icon: FaUsers },
    { id: "inquiries", label: "Inquiries", icon: FaEnvelope },
    { id: "visits", label: "Visits", icon: FaChartLine },
    { id: "blogs", label: "Blogs", icon: FaBlog },
    { id: "analytics", label: "Analytics", icon: FaChartLine },
    { id: "admin-alerts", label: "Admin Alerts", icon: FaBell },
    { id: "user-notifications", label: "User Notification", icon: FaBullhorn },
    { id: "settings", label: "Settings", icon: FaCog },
  ];

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    localStorage.removeItem("adminActiveTab");
    navigate("/admin/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-orange-50/20 to-gray-50">
      <TopNav
        adminData={adminData}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        showNotifications={showNotifications}
        setShowNotifications={setShowNotifications}
        notifications={notifications}
        unreadCount={unreadCount}
        onMarkAsRead={handleMarkAsRead}
        onNotificationClick={handleNotificationClick}
        onMarkAllAsRead={handleMarkAllAsRead}
      />

      <div className="flex pt-20">
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          handleLogout={handleLogout}
          menuItems={menuItems}
        />

        <main className="flex-1 ml-64 p-8">
          {activeTab === "overview" && (
            <OverviewTab
              loading={loading}
              properties={properties}
              recentInquiries={recentInquiries}
              recentUsers={users}
              stats={stats}
              onTabChange={setActiveTab}
            />
          )}
          {activeTab === "properties" && (
            <PropertiesTab
              loading={loading}
              properties={properties}
              navigate={navigate}
              handleDeleteProperty={handleDeleteProperty}
              handleToggleStatus={handleToggleStatus}
            />
          )}
          {activeTab === "users" && (
            <UsersTab recentUsers={users} stats={stats} />
          )}
          {activeTab === "inquiries" && (
            <InquiriesTab
              recentInquiries={inquiries}
              fetchInquiries={fetchInquiries}
              stats={stats}
            />
          )}
          {activeTab === "blogs" && <BlogsTab />}
          {activeTab === "analytics" && <AnalyticsTab />}
          {activeTab === "settings" && <SettingsTab />}
          {activeTab === "visits" && <VisitsTab />}
          {activeTab === "user-notifications" && (
            <UserNotificationTab users={users} />
          )}
          {activeTab === "admin-alerts" && (
            <AdminNotificationTab users={users} />
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
