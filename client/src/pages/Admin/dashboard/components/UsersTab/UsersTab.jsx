import React, { useState, useMemo } from "react";
import {
  FaPlus,
  FaSearch,
  FaUsers,
  FaCheckCircle,
  FaUserShield,
  FaClock,
  FaEye,
  FaEdit,
  FaTrash,
} from "react-icons/fa";

const UsersTab = ({ recentUsers = [], stats }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // Filter users based on search term
  const filteredUsers = useMemo(() => {
    if (!searchTerm.trim()) return recentUsers;
    const term = searchTerm.toLowerCase().trim();
    return recentUsers.filter(
      (user) =>
        user.firstName?.toLowerCase().includes(term) ||
        user.lastName?.toLowerCase().includes(term) ||
        user.email?.toLowerCase().includes(term) ||
        user.phone?.includes(term),
    );
  }, [recentUsers, searchTerm]);

  return (
    <div className="space-y-6 animate-[fadeInUp_0.5s_ease-out]">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            User Management
          </h2>
          <p className="text-gray-600">Manage all registered users</p>
        </div>
        <button className="flex items-center gap-2 bg-gradient-to-r from-orange-600 to-orange-700 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all">
          <FaPlus /> Add New User
        </button>
      </div>

      {/* User Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-purple-100 p-3 rounded-xl">
              <FaUsers className="text-2xl text-purple-600" />
            </div>
            <span className="text-3xl font-bold text-gray-900">
              {stats?.totalUsers || 0}
            </span>
          </div>
          <h3 className="text-gray-600 font-semibold">Total Users</h3>
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-green-100 p-3 rounded-xl">
              <FaCheckCircle className="text-2xl text-green-600" />
            </div>
            <span className="text-3xl font-bold text-gray-900">
              {recentUsers.filter((u) => u.isActive).length}
            </span>
          </div>
          <h3 className="text-gray-600 font-semibold">Active Users</h3>
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-blue-100 p-3 rounded-xl">
              <FaUserShield className="text-2xl text-blue-600" />
            </div>
            <span className="text-3xl font-bold text-gray-900">
              {recentUsers.filter((u) => u.role === "agent").length}
            </span>
          </div>
          <h3 className="text-gray-600 font-semibold">Agents</h3>
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-orange-100 p-3 rounded-xl">
              <FaClock className="text-2xl text-orange-600" />
            </div>
            <span className="text-3xl font-bold text-gray-900">
              {stats?.newUsersThisMonth || 0}
            </span>
          </div>
          <h3 className="text-gray-600 font-semibold">New This Month</h3>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search users by name, email or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 text-sm"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  User
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Email
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Phone
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Role
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Joined
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr
                    key={user._id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={
                            user.avatar ||
                            `https://api.dicebear.com/7.x/initials/svg?seed=${user.firstName}`
                          }
                          alt={user.firstName}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div>
                          <p className="font-semibold text-gray-900">
                            {user.firstName} {user.lastName}
                          </p>
                          <p className="text-xs text-gray-600 truncate max-w-[150px]">
                            ID: {user._id}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-900 text-sm">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 text-gray-900 text-sm">
                      {user.phone}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          user.role === "admin" || user.role === "superadmin"
                            ? "bg-red-100 text-red-700"
                            : user.role === "agent"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-900 text-sm">
                      {formatDate(user.createdAt)}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          user.isActive
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {user.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                          <FaEye />
                        </button>
                        <button className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors">
                          <FaEdit />
                        </button>
                        <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="7"
                    className="px-6 py-10 text-center text-gray-500"
                  >
                    No users found matching "{searchTerm}"
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UsersTab;
