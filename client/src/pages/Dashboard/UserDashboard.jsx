import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  FaUser,
  FaHeart,
  FaHistory,
  FaBell,
  FaCog,
  FaSignOutAlt,
  FaEdit,
  FaCamera,
  FaBed,
  FaBath,
  FaRulerCombined,
  FaMapMarkerAlt,
  FaTrash,
  FaEye,
  FaCheck,
  FaInfoCircle,
  FaTags,
  FaBullhorn,
  FaHome as FaHomeIcon,
  FaExternalLinkAlt,
} from "react-icons/fa";

// Dummy user data
const dummyUser = {
  name: "Jeet Veer",
  email: "jeetveer@example.com",
  phone: "+91 98765 43210",
  avatar:
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Jeet&backgroundColor=ffdfbf",
  joinedDate: "January 2024",
  savedProperties: 5,
  viewedProperties: 12,
  inquiries: 3,
};

// Dummy saved properties
const savedProperties = [
  {
    id: 1,
    title: "Luxury Villa with Pool",
    location: "Whitefield, Bangalore",
    price: "12500",
    beds: 4,
    baths: 3,
    area: 3500,
    image:
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=400&h=300&fit=crop",
  },
  {
    id: 2,
    title: "Modern 3BHK Apartment",
    location: "Koramangala, Bangalore",
    price: "8500",
    beds: 3,
    baths: 2,
    area: 1850,
    image:
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&h=300&fit=crop",
  },
];

// Dummy recent activities
const recentActivities = [
  {
    id: 1,
    type: "inquiry",
    property: "Luxury Villa with Pool",
    date: "2 days ago",
    status: "Pending",
  },
  {
    id: 2,
    type: "view",
    property: "Modern 3BHK Apartment",
    date: "3 days ago",
    status: "Completed",
  },
  {
    id: 3,
    type: "saved",
    property: "Penthouse with Terrace",
    date: "5 days ago",
    status: "Completed",
  },
];

const UserDashboard = () => {
  const navigate = useNavigate();
  const {
    user: contextUser,
    logout,
    loading: authLoading,
    notifications,
    unreadCount,
    fetchNotifications: globalFetchNotifications,
    markNotificationAsRead: globalMarkAsRead,
  } = useAuth();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState(() => {
    // Check for tab parameter in URL first
    const params = new URLSearchParams(location.search);
    const tabParam = params.get("tab");
    if (tabParam) return tabParam;

    return localStorage.getItem("activeDashboardTab") || "overview";
  });

  // Handle tab change from URL params
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tabParam = params.get("tab");
    if (tabParam && tabParam !== activeTab) {
      setActiveTab(tabParam);
    }
  }, [location.search]);

  useEffect(() => {
    localStorage.setItem("activeDashboardTab", activeTab);
  }, [activeTab]);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [savedList, setSavedList] = useState([]);
  const [loadingList, setLoadingList] = useState(false);
  const [notificationFilter, setNotificationFilter] = useState("all");

  useEffect(() => {
    if (!authLoading && !contextUser) {
      navigate("/login");
      return;
    }

    if (contextUser) {
      const fullName = `${contextUser.firstName} ${contextUser.lastName}`;
      setUser({
        ...dummyUser, // Keep dummy stats for now (savedProperties, etc.)
        name: fullName,
        email: contextUser.email,
        phone: contextUser.phone,
        avatar: contextUser.avatar || dummyUser.avatar,
        id: contextUser.id || contextUser._id,
      });

      setProfileData({
        name: fullName,
        email: contextUser.email,
        phone: contextUser.phone,
      });

      fetchSavedList();
      globalFetchNotifications(contextUser);
    }
  }, [contextUser, authLoading, navigate]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const fileInputRef = useRef(null);

  // Helper to get correct avatar URL
  const getAvatarUrl = (avatarPath) => {
    if (!avatarPath) return dummyUser.avatar;
    if (avatarPath.startsWith("http")) return avatarPath;
    return `${import.meta.env.VITE_API_BASE_URL}/${avatarPath}`;
  };

  // Helper function to format property image URLs
  const getImageUrl = (imageInput) => {
    const placeholder = "https://via.placeholder.com/800x600?text=No+Image";
    if (!imageInput) return placeholder;

    // Support both old string format and new optimized object format
    const url = typeof imageInput === "string" ? imageInput : imageInput.webp;

    if (!url) return placeholder;
    if (url.startsWith("http")) return url;

    const baseUrl = (import.meta.env.VITE_API_BASE_URL || "").replace(
      /\/$/,
      "",
    );
    const path = url.startsWith("/") ? url : `/${url}`;
    return `${baseUrl}${path}`;
  };

  const fetchSavedList = async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) return;

    try {
      setLoadingList(true);
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/wishlist`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      const data = await response.json();
      if (data.success) {
        setSavedList(data.data);
      }
    } catch (error) {
      console.error("Error fetching wishlist:", error);
    } finally {
      setLoadingList(false);
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current.click();
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      alert("Kripya sirf images upload karein.");
      return;
    }

    // Validate file size (e.g., 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("File ka size 5MB se kam hona chahiye.");
      return;
    }

    const formData = new FormData();
    formData.append("avatar", file);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/users/avatar`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
          body: formData,
        },
      );

      const data = await response.json();

      if (response.ok) {
        alert("Profile image updated successfully!");

        // Update local state
        const updatedUser = {
          ...user,
          avatar: getAvatarUrl(data.data.avatar),
        };
        setUser(updatedUser);

        // Update localStorage
        const storedUser = JSON.parse(localStorage.getItem("user"));
        storedUser.avatar = data.data.avatar;
        localStorage.setItem("user", JSON.stringify(storedUser));
      } else {
        alert(data.message || "Upload failed");
      }
    } catch (error) {
      console.error("Avatar upload error:", error);
      alert("Server error during upload. Please try again.");
    }
  };

  const tabs = [
    { id: "overview", label: "Overview", icon: FaUser },
    { id: "saved", label: "Saved Properties", icon: FaHeart },
    { id: "notifications", label: "Notifications", icon: FaBell },
    { id: "activity", label: "Activity", icon: FaHistory },
    { id: "settings", label: "Settings", icon: FaCog },
  ];

  const handleProfileUpdate = (e) => {
    e.preventDefault();
    setUser({ ...user, ...profileData });
    setIsEditingProfile(false);
  };

  const handleRemoveProperty = async (propertyId) => {
    const token = localStorage.getItem("accessToken");
    if (!token) return;

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/wishlist/toggle/${propertyId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      const data = await response.json();
      if (data.success) {
        // Remove from local state
        setSavedList((prev) =>
          prev.filter((item) => item.propertyId?._id !== propertyId),
        );
      }
    } catch (error) {
      console.error("Error removing property:", error);
      alert("Failed to remove property. Please try again.");
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-12 h-12 border-4 border-orange-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-orange-50/20 to-gray-50 pt-20 md:pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 animate-[fadeInUp_0.5s_ease-out]">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            My Dashboard
          </h1>
          <p className="text-gray-600">
            Manage your profile and saved properties
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24 animate-[fadeInLeft_0.6s_ease-out]">
              {/* Profile Section */}
              <div className="text-center mb-6 pb-6 border-b border-gray-200">
                <div className="relative inline-block mb-4">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleAvatarChange}
                    className="hidden"
                    accept="image/*"
                  />
                  <img
                    src={getAvatarUrl(user.recordAvatar || user.avatar)}
                    alt={user.name}
                    className="w-24 h-24 rounded-full object-cover ring-4 ring-orange-100"
                  />
                  <button
                    onClick={handleAvatarClick}
                    className="absolute bottom-0 right-0 bg-orange-600 text-white p-2 rounded-full shadow-lg hover:bg-orange-700 transition-all duration-300 hover:scale-110"
                  >
                    <FaCamera className="text-sm" />
                  </button>
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-1">
                  {user.name}
                </h2>
                <p className="text-sm text-gray-600 mb-2">{user.email}</p>
                <p className="text-xs text-gray-500">
                  Member since {user.joinedDate}
                </p>
              </div>

              {/* Navigation Tabs */}
              <nav className="space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all duration-300 ${
                      activeTab === tab.id
                        ? "bg-gradient-to-r from-orange-600 to-orange-700 text-white shadow-lg"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <tab.icon />
                    <span>{tab.label}</span>
                  </button>
                ))}
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-red-600 hover:bg-red-50 transition-all duration-300"
                >
                  <FaSignOutAlt />
                  <span>Logout</span>
                </button>
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-3">
            {/* Overview Tab */}
            {activeTab === "overview" && (
              <div className="space-y-6 animate-[fadeInUp_0.6s_ease-out]">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
                    <div className="flex items-center justify-between mb-4">
                      <div className="bg-orange-100 p-3 rounded-xl">
                        <FaHeart className="text-2xl text-orange-600" />
                      </div>
                      <span className="text-3xl font-bold text-gray-900">
                        {savedList.length}
                      </span>
                    </div>
                    <h3 className="text-gray-600 font-semibold">
                      Saved Properties
                    </h3>
                  </div>

                  <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
                    <div className="flex items-center justify-between mb-4">
                      <div className="bg-blue-100 p-3 rounded-xl">
                        <FaEye className="text-2xl text-blue-600" />
                      </div>
                      <span className="text-3xl font-bold text-gray-900">
                        {user.viewedProperties}
                      </span>
                    </div>
                    <h3 className="text-gray-600 font-semibold">
                      Viewed Properties
                    </h3>
                  </div>

                  <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
                    <div className="flex items-center justify-between mb-4">
                      <div className="bg-green-100 p-3 rounded-xl">
                        <FaBell className="text-2xl text-green-600" />
                      </div>
                      <span className="text-3xl font-bold text-gray-900">
                        {user.inquiries}
                      </span>
                    </div>
                    <h3 className="text-gray-600 font-semibold">
                      Active Inquiries
                    </h3>
                  </div>
                </div>

                {/* Profile Information */}
                <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">
                      Profile Information
                    </h2>
                    <button
                      onClick={() => setIsEditingProfile(!isEditingProfile)}
                      className="flex items-center gap-2 text-orange-600 hover:text-orange-700 font-semibold transition-colors duration-300"
                    >
                      <FaEdit />
                      {isEditingProfile ? "Cancel" : "Edit"}
                    </button>
                  </div>

                  {isEditingProfile ? (
                    <form onSubmit={handleProfileUpdate} className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Full Name
                        </label>
                        <input
                          type="text"
                          value={profileData.name}
                          onChange={(e) =>
                            setProfileData({
                              ...profileData,
                              name: e.target.value,
                            })
                          }
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Email
                        </label>
                        <input
                          type="email"
                          value={profileData.email}
                          onChange={(e) =>
                            setProfileData({
                              ...profileData,
                              email: e.target.value,
                            })
                          }
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Phone
                        </label>
                        <input
                          type="tel"
                          value={profileData.phone}
                          onChange={(e) =>
                            setProfileData({
                              ...profileData,
                              phone: e.target.value,
                            })
                          }
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300"
                        />
                      </div>
                      <button
                        type="submit"
                        className="bg-gradient-to-r from-orange-600 to-orange-700 text-white px-6 py-3 rounded-xl font-semibold hover:from-orange-700 hover:to-orange-800 transition-all duration-300 shadow-lg hover:shadow-xl"
                      >
                        Save Changes
                      </button>
                    </form>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex justify-between py-3 border-b border-gray-200">
                        <span className="text-gray-600 font-medium">Name</span>
                        <span className="text-gray-900 font-semibold">
                          {user.name}
                        </span>
                      </div>
                      <div className="flex justify-between py-3 border-b border-gray-200">
                        <span className="text-gray-600 font-medium">Email</span>
                        <span className="text-gray-900 font-semibold">
                          {user.email}
                        </span>
                      </div>
                      <div className="flex justify-between py-3 border-b border-gray-200">
                        <span className="text-gray-600 font-medium">Phone</span>
                        <span className="text-gray-900 font-semibold">
                          {user.phone}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Saved Properties Tab */}
            {activeTab === "saved" && (
              <div className="space-y-6 animate-[fadeInUp_0.6s_ease-out]">
                <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    Saved Properties ({savedList.length})
                  </h2>
                  {loadingList ? (
                    <div className="flex justify-center py-12">
                      <div className="w-8 h-8 border-4 border-orange-600 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  ) : savedList.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FaHeart className="text-gray-400 text-2xl" />
                      </div>
                      <p className="text-gray-500 font-medium">
                        No saved properties yet.
                      </p>
                      <button
                        onClick={() => navigate("/properties")}
                        className="mt-4 text-orange-600 font-bold hover:underline"
                      >
                        Explore properties
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {savedList.map((item) => {
                        const property = item.propertyId;
                        if (!property) return null;

                        return (
                          <div
                            key={property._id}
                            className="group bg-white border-2 border-gray-200 rounded-xl overflow-hidden hover:border-orange-600 hover:shadow-xl transition-all duration-300"
                          >
                            <div className="relative h-48 overflow-hidden">
                              <img
                                src={getImageUrl(property.images?.[0])}
                                alt={property.title}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                              />
                              <button
                                onClick={() =>
                                  handleRemoveProperty(property._id)
                                }
                                className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg hover:bg-red-500 hover:text-white transition-all duration-300"
                              >
                                <FaTrash className="text-sm" />
                              </button>
                            </div>
                            <div className="p-4">
                              <h3 className="font-bold text-gray-900 mb-2 line-clamp-1">
                                {property.title}
                              </h3>
                              <div className="flex items-center gap-2 text-gray-600 mb-3">
                                <FaMapMarkerAlt className="text-orange-600 text-sm" />
                                <span className="text-sm">
                                  {property.location?.city ||
                                    property.location?.area ||
                                    "N/A"}
                                </span>
                              </div>
                              <div className="flex items-center gap-4 mb-3 text-sm text-gray-600">
                                <div className="flex items-center gap-1">
                                  <FaBed className="text-orange-600" />
                                  <span>{property.beds || 0}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <FaBath className="text-orange-600" />
                                  <span>{property.baths || 0}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <FaRulerCombined className="text-orange-600" />
                                  <span>{property.area_sqm || 0} sqft</span>
                                </div>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-xl font-bold text-orange-600">
                                  ₹{property.priceRange || "Contact"}
                                </span>
                                <button
                                  onClick={() =>
                                    navigate(`/property/${property._id}`)
                                  }
                                  className="bg-orange-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-orange-700 transition-all duration-300"
                                >
                                  View
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === "notifications" && (
              <div className="space-y-6 animate-[fadeInUp_0.6s_ease-out]">
                <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">
                      Notifications
                    </h2>
                    <div className="flex gap-2 bg-gray-50 p-1 rounded-xl border border-gray-100 w-full sm:w-auto">
                      {["all", "unread", "read"].map((tab) => (
                        <button
                          key={tab}
                          onClick={() => setNotificationFilter(tab)}
                          className={`flex-1 sm:px-4 py-2 rounded-lg text-xs font-bold transition-all duration-300 ${
                            notificationFilter === tab
                              ? "bg-orange-600 text-white shadow-md"
                              : "text-gray-500 hover:text-gray-700 hover:bg-white"
                          }`}
                        >
                          {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    {authLoading ? (
                      <div className="py-12 text-center">
                        <div className="animate-spin w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                        <p className="text-gray-500 font-medium">
                          Loading alerts...
                        </p>
                      </div>
                    ) : notifications.filter((n) => {
                        const unread = !n.readBy.includes(user?.id);
                        if (notificationFilter === "unread") return unread;
                        if (notificationFilter === "read") return !unread;
                        return true;
                      }).length === 0 ? (
                      <div className="text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                        <FaBell className="text-5xl text-gray-200 mx-auto mb-4" />
                        <h3 className="text-lg font-bold text-gray-900 mb-2">
                          All caught up!
                        </h3>
                        <p className="text-gray-500 text-sm">
                          {notificationFilter === "unread"
                            ? "No unread notifications."
                            : "No notifications found."}
                        </p>
                      </div>
                    ) : (
                      notifications
                        .filter((n) => {
                          const userId = contextUser?.id || contextUser?._id;
                          const unread = !n.readBy.some(
                            (id) => id.toString() === userId?.toString(),
                          );
                          if (notificationFilter === "unread") return unread;
                          if (notificationFilter === "read") return !unread;
                          return true;
                        })
                        .map((notif) => (
                          <NotificationCard
                            key={notif._id}
                            notif={notif}
                            isUnread={
                              !notif.readBy.some(
                                (id) =>
                                  id.toString() ===
                                  (
                                    contextUser?.id || contextUser?._id
                                  )?.toString(),
                              )
                            }
                            onMarkAsRead={globalMarkAsRead}
                            timeAgo={getTimeAgo(notif.createdAt)}
                          />
                        ))
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Activity Tab */}
            {activeTab === "activity" && (
              <div className="space-y-6 animate-[fadeInUp_0.6s_ease-out]">
                <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    Recent Activity
                  </h2>
                  <div className="space-y-4">
                    {recentActivities.map((activity) => (
                      <div
                        key={activity.id}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-orange-50 transition-colors duration-300"
                      >
                        <div className="flex items-center gap-4">
                          <div
                            className={`p-3 rounded-full ${
                              activity.type === "inquiry"
                                ? "bg-orange-100"
                                : activity.type === "view"
                                  ? "bg-blue-100"
                                  : "bg-green-100"
                            }`}
                          >
                            {activity.type === "inquiry" ? (
                              <FaBell className="text-orange-600" />
                            ) : activity.type === "view" ? (
                              <FaEye className="text-blue-600" />
                            ) : (
                              <FaHeart className="text-green-600" />
                            )}
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">
                              {activity.property}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {activity.date}
                            </p>
                          </div>
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-semibold ${
                            activity.status === "Pending"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-green-100 text-green-700"
                          }`}
                        >
                          {activity.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === "settings" && (
              <div className="space-y-6 animate-[fadeInUp_0.6s_ease-out]">
                <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    Account Settings
                  </h2>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          Email Notifications
                        </h3>
                        <p className="text-sm text-gray-600">
                          Receive updates about new properties
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
                      </label>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          SMS Notifications
                        </h3>
                        <p className="text-sm text-gray-600">
                          Get SMS alerts for inquiries
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

const getTimeAgo = (date) => {
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

const NotificationCard = ({ notif, isUnread, onMarkAsRead, timeAgo }) => {
  const getIcon = () => {
    switch (notif.type) {
      case "offer":
        return <FaTags className="text-red-500" />;
      case "new_property":
        return <FaHomeIcon className="text-green-500" />;
      case "system":
        return <FaBullhorn className="text-blue-500" />;
      default:
        return <FaInfoCircle className="text-orange-500" />;
    }
  };

  const getBadgeColor = () => {
    switch (notif.type) {
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
      className={`group relative bg-white rounded-2xl p-4 border transition-all duration-300 transform
        ${isUnread ? "border-orange-200 shadow-sm ring-1 ring-orange-50" : "border-gray-100 hover:border-gray-200"}
        hover:scale-[1.01] hover:shadow-md cursor-pointer
      `}
      onClick={() => isUnread && onMarkAsRead(notif._id)}
    >
      <div className="flex gap-4 items-start">
        <div className="shrink-0">
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl relative overflow-hidden ${
              notif.image ? "" : getBadgeColor()
            }`}
          >
            {notif.image ? (
              <img
                src={notif.image}
                alt={notif.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
            ) : (
              getIcon()
            )}
            {isUnread && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-orange-600 rounded-full border-2 border-white shadow-sm"></span>
            )}
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start mb-1">
            <h4
              className={`text-base transition-colors ${
                isUnread
                  ? "font-bold text-gray-900"
                  : "font-semibold text-gray-700"
              } group-hover:text-orange-600`}
            >
              {notif.title}
            </h4>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap ml-4">
              {timeAgo}
            </span>
          </div>
          <p className="text-gray-600 text-sm leading-relaxed line-clamp-2 mb-3">
            {notif.message}
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <span
              className={`text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-tighter ${getBadgeColor()}`}
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

        {isUnread && (
          <div className="sm:opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onMarkAsRead(notif._id);
              }}
              className="p-1.5 bg-orange-50 text-orange-600 rounded-lg hover:bg-orange-600 hover:text-white transition-all shadow-sm"
              title="Mark as read"
            >
              <FaCheck size={10} />
            </button>
          </div>
        )}
      </div>
    </article>
  );
};

export default UserDashboard;
