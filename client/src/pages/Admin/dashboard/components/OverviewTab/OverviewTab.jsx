import React from "react";
import { FaEye, FaEnvelope } from "react-icons/fa";
import StatsCards from "../StatsCards/StatsCards";

const OverviewTab = ({
  loading,
  properties,
  recentInquiries,
  recentUsers,
  stats,
  onTabChange,
}) => {
  const timeAgo = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    const seconds = Math.floor((new Date() - date) / 1000);
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
    return Math.floor(seconds) + " seconds ago";
  };

  return (
    <div className="space-y-6 animate-[fadeInUp_0.5s_ease-out]">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Dashboard Overview
        </h2>
        <p className="text-gray-600">
          Welcome back! Here's what's happening with your properties.
        </p>
      </div>

      <StatsCards stats={stats} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Properties */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">
              Recent Properties
            </h3>
            <button
              onClick={() => onTabChange("properties")}
              className="text-orange-600 hover:text-orange-700 font-semibold text-sm"
            >
              View All →
            </button>
          </div>
          <div className="space-y-4">
            {loading ? (
              <div className="text-center py-4 text-gray-500">
                Loading properties...
              </div>
            ) : (
              properties.slice(0, 3).map((property) => (
                <div
                  key={property._id}
                  className="flex gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  <img
                    src={
                      property.images?.[0] ||
                      "https://via.placeholder.com/400x300"
                    }
                    alt={property.title}
                    className="w-20 h-20 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 mb-1">
                      {property.title}
                    </h4>
                    <p className="text-sm text-gray-600 mb-2">
                      {typeof property.location === "object"
                        ? `${property.location.area}, ${property.location.city}`
                        : property.location}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-gray-600">
                      <span className="flex items-center gap-1">
                        <FaEye /> {property.views || 0}
                      </span>
                      <span className="flex items-center gap-1">
                        <FaEnvelope /> {property.inquiries || 0}
                      </span>
                      <span
                        className={`px-2 py-1 rounded-full capitalize ${
                          property.status === "active"
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {property.status}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-orange-600">
                      {property.priceRange}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Inquiries */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">
              Recent Inquiries
            </h3>
            <button
              onClick={() => onTabChange("inquiries")}
              className="text-orange-600 hover:text-orange-700 font-semibold text-sm"
            >
              View All →
            </button>
          </div>
          <div className="space-y-4">
            {recentInquiries.map((inquiry) => (
              <div
                key={inquiry.id}
                className="p-4 rounded-xl hover:bg-gray-50 transition-colors border border-gray-200"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      {inquiry.userName}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {inquiry.propertyTitle}
                    </p>
                  </div>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      inquiry.status === "Pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : inquiry.status === "Contacted"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-green-100 text-green-700"
                    }`}
                  >
                    {inquiry.status}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs text-gray-600">
                  <span>{inquiry.email}</span>
                  <span>{inquiry.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Users */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900">Recent Users</h3>
          <button
            onClick={() => onTabChange("users")}
            className="text-orange-600 hover:text-orange-700 font-semibold text-sm"
          >
            View All →
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {recentUsers.slice(0, 6).map((user) => (
            <div
              key={user._id}
              className="flex items-center gap-3 p-4 rounded-xl border border-gray-200 hover:border-orange-600 transition-colors"
            >
              <img
                src={
                  user.avatar ||
                  `https://api.dicebear.com/7.x/initials/svg?seed=${user.firstName}`
                }
                alt={user.firstName}
                className="w-12 h-12 rounded-full object-cover shadow-sm bg-gray-100"
              />
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-gray-900 truncate">
                  {user.firstName} {user.lastName}
                </h4>
                <p className="text-xs text-gray-600 truncate">{user.email}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-bold uppercase">
                    {user.role}
                  </span>
                  <span className="text-[10px] text-gray-500 font-medium">
                    {timeAgo(user.createdAt)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OverviewTab;
