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
  FaTimes,
  FaUser,
  FaPhone,
  FaEnvelope,
  FaCalendarAlt,
  FaInfoCircle,
} from "react-icons/fa";
import Popup from "../../../../../components/Popup";

const UsersTab = ({ recentUsers = [], stats, fetchUsers }) => {
  const [searchTerm, setSearchTerm] = useState("");

  // Modal States
  const [viewingUser, setViewingUser] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [editFormData, setEditFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    role: "user",
    isActive: true,
  });

  // Reusable Popup State
  const [popupData, setPopupData] = useState({
    isOpen: false,
    type: "success",
    title: "",
    message: "",
    onConfirm: null,
  });

  const showPopup = (type, title, message, onConfirm = null) => {
    setPopupData({
      isOpen: true,
      type,
      title,
      message,
      onConfirm,
    });
  };

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

  // DELETE USER Logic
  const executeDeleteUser = async (id) => {
    try {
      const token = localStorage.getItem("accessToken");
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/users/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      const data = await res.json();
      if (data.success) {
        showPopup("success", "Deleted Successfully", "User has been deleted successfully.");
        if (typeof fetchUsers === "function") fetchUsers();
      } else {
        showPopup("error", "Deletion Failed", data.message || "Failed to delete user.");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      showPopup("error", "Server Error", "Something went wrong while deleting user.");
    }
  };

  const handleDeleteUser = (user) => {
    showPopup(
      "warning",
      "Confirm Delete",
      `Are you sure you want to delete ${user.firstName} ${user.lastName}? This action cannot be undone.`,
      () => executeDeleteUser(user._id)
    );
  };

  // EDIT USER Logic
  const handleEditClick = (user) => {
    setEditingUser(user);
    setEditFormData({
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      email: user.email || "",
      phone: user.phone || "",
      role: user.role || "user",
      isActive: user.isActive !== undefined ? user.isActive : true,
    });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editFormData.firstName.trim() || !editFormData.lastName.trim()) {
      showPopup("warning", "Validation Error", "First name and Last name are required.");
      return;
    }

    try {
      const token = localStorage.getItem("accessToken");
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/users/${editingUser._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(editFormData),
        },
      );
      const data = await res.json();
      if (data.success) {
        showPopup("success", "Success", "User details updated successfully.");
        setEditingUser(null);
        if (typeof fetchUsers === "function") fetchUsers();
      } else {
        showPopup("error", "Update Failed", data.message || "Failed to update user details.");
      }
    } catch (error) {
      console.error("Error updating user:", error);
      showPopup("error", "Server Error", "Something went wrong while updating user details.");
    }
  };

  return (
    <div className="space-y-6 animate-[fadeInUp_0.5s_ease-out]">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            User Management
          </h2>
          <p className="text-gray-600">Manage all registered users</p>
        </div>
        <button className="flex items-center gap-2 bg-gradient-to-r from-orange-600 to-orange-700 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all cursor-not-allowed opacity-80">
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
                        <button
                          onClick={() => setViewingUser(user)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="View User Details"
                        >
                          <FaEye />
                        </button>
                        <button
                          onClick={() => handleEditClick(user)}
                          className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                          title="Edit User"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete User"
                        >
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

      {/* VIEW USER DETAILS MODAL */}
      {viewingUser && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden relative animate-[scaleIn_0.3s_ease-out]">
            <button
              onClick={() => setViewingUser(null)}
              className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center bg-gray-100 hover:bg-orange-600 hover:text-white rounded-full transition-all duration-300 z-10"
            >
              <FaTimes />
            </button>

            <div className="p-8">
              <div className="text-center mb-6">
                <img
                  src={
                    viewingUser.avatar ||
                    `https://api.dicebear.com/7.x/initials/svg?seed=${viewingUser.firstName}`
                  }
                  alt={viewingUser.firstName}
                  className="w-24 h-24 rounded-full object-cover mx-auto mb-4 border-4 border-orange-100 shadow-md"
                />
                <h3 className="text-2xl font-bold text-gray-900">
                  {viewingUser.firstName} {viewingUser.lastName}
                </h3>
                <span
                  className={`mt-2 inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase ${
                    viewingUser.role === "admin" || viewingUser.role === "superadmin"
                      ? "bg-red-100 text-red-700"
                      : viewingUser.role === "agent"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {viewingUser.role}
                </span>
              </div>

              <div className="space-y-4 border-t border-gray-100 pt-6">
                <div className="flex items-center gap-3 text-gray-700">
                  <FaEnvelope className="text-orange-500 w-5" />
                  <div>
                    <p className="text-xs text-gray-400 font-bold uppercase">Email Address</p>
                    <p className="font-semibold text-sm">{viewingUser.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-gray-700">
                  <FaPhone className="text-orange-500 w-5" />
                  <div>
                    <p className="text-xs text-gray-400 font-bold uppercase">Phone Number</p>
                    <p className="font-semibold text-sm">{viewingUser.phone || "N/A"}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-gray-700">
                  <FaCalendarAlt className="text-orange-500 w-5" />
                  <div>
                    <p className="text-xs text-gray-400 font-bold uppercase">Registration Date</p>
                    <p className="font-semibold text-sm">{formatDate(viewingUser.createdAt)}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-gray-700">
                  <FaInfoCircle className="text-orange-500 w-5" />
                  <div>
                    <p className="text-xs text-gray-400 font-bold uppercase">Account Status</p>
                    <span
                      className={`mt-1 inline-block px-3 py-0.5 rounded-full text-xs font-bold ${
                        viewingUser.isActive
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {viewingUser.isActive ? "Active Account" : "Inactive Account"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <button
                  onClick={() => setViewingUser(null)}
                  className="w-full bg-gray-900 text-white py-3 rounded-xl font-bold hover:bg-gray-800 transition-all shadow-md active:scale-95"
                >
                  Close Details
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* EDIT USER DETAILS MODAL */}
      {editingUser && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden relative animate-[scaleIn_0.3s_ease-out]">
            <button
              onClick={() => setEditingUser(null)}
              className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center bg-gray-100 hover:bg-orange-600 hover:text-white rounded-full transition-all duration-300 z-10"
            >
              <FaTimes />
            </button>

            <div className="p-8">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900">
                  Edit User Details
                </h3>
                <p className="text-gray-500 text-sm mt-1">
                  Modify role, status or contact info
                </p>
              </div>

              <form onSubmit={handleEditSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                      First Name
                    </label>
                    <input
                      type="text"
                      required
                      value={editFormData.firstName}
                      onChange={(e) => setEditFormData({ ...editFormData, firstName: e.target.value })}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 rounded-xl outline-none transition-all text-sm font-medium"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                      Last Name
                    </label>
                    <input
                      type="text"
                      required
                      value={editFormData.lastName}
                      onChange={(e) => setEditFormData({ ...editFormData, lastName: e.target.value })}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 rounded-xl outline-none transition-all text-sm font-medium"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={editFormData.email}
                    onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 rounded-xl outline-none transition-all text-sm font-medium"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    value={editFormData.phone}
                    onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 rounded-xl outline-none transition-all text-sm font-medium"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                      Account Role
                    </label>
                    <select
                      value={editFormData.role}
                      onChange={(e) => setEditFormData({ ...editFormData, role: e.target.value })}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 rounded-xl outline-none transition-all text-sm font-semibold"
                    >
                      <option value="user">User</option>
                      <option value="agent">Agent</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                      Account Status
                    </label>
                    <select
                      value={editFormData.isActive ? "true" : "false"}
                      onChange={(e) => setEditFormData({ ...editFormData, isActive: e.target.value === "true" })}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 rounded-xl outline-none transition-all text-sm font-semibold"
                    >
                      <option value="true">Active</option>
                      <option value="false">Inactive</option>
                    </select>
                  </div>
                </div>

                <div className="mt-8 flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setEditingUser(null)}
                    className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold py-3 px-6 rounded-xl transition-all active:scale-95"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-md active:scale-95"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Reusable Notification & Confirmation Popup */}
      <Popup
        isOpen={popupData.isOpen}
        type={popupData.type}
        title={popupData.title}
        message={popupData.message}
        onConfirm={popupData.onConfirm}
        onClose={() => setPopupData({ ...popupData, isOpen: false })}
      />
    </div>
  );
};

export default UsersTab;
