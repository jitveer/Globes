import React, { useState, useMemo } from "react";
import {
  FaEnvelope,
  FaClock,
  FaCheckCircle,
  FaSearch,
  FaPhone,
  FaUser,
  FaBuilding,
} from "react-icons/fa";

const InquiriesTab = ({ recentInquiries = [], fetchInquiries, stats }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      const token = localStorage.getItem("accessToken");
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/inquiries/${id}/status`,
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
        fetchInquiries(); // Refresh the list
      } else {
        alert(data.message || "Failed to update status");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Something went wrong");
    }
  };

  const filteredInquiries = useMemo(() => {
    let filtered = [...recentInquiries];

    // Status Filter
    if (statusFilter !== "All Status") {
      filtered = filtered.filter(
        (i) => i.status.toLowerCase() === statusFilter.toLowerCase(),
      );
    }

    // Search term filter
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase().trim();
      filtered = filtered.filter(
        (i) =>
          i.name?.toLowerCase().includes(term) ||
          i.email?.toLowerCase().includes(term) ||
          i.phone?.includes(term) ||
          i.propertyId?.title?.toLowerCase().includes(term),
      );
    }

    return filtered;
  }, [recentInquiries, searchTerm, statusFilter]);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-6 animate-[fadeInUp_0.5s_ease-out]">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Inquiry Management
        </h2>
        <p className="text-gray-600">Manage all property inquiries</p>
      </div>

      {/* Inquiry Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-orange-100 p-3 rounded-xl">
              <FaEnvelope className="text-2xl text-orange-600" />
            </div>
            <span className="text-3xl font-bold text-gray-900">
              {stats?.totalInquiries || 0}
            </span>
          </div>
          <h3 className="text-gray-600 font-semibold">Total Inquiries</h3>
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-yellow-100 p-3 rounded-xl">
              <FaClock className="text-2xl text-yellow-600" />
            </div>
            <span className="text-3xl font-bold text-gray-900">
              {stats?.pendingInquiries || 0}
            </span>
          </div>
          <h3 className="text-gray-600 font-semibold">Pending</h3>
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-green-100 p-3 rounded-xl">
              <FaCheckCircle className="text-2xl text-green-600" />
            </div>
            <span className="text-3xl font-bold text-gray-900">
              {(stats?.totalInquiries || 0) - (stats?.pendingInquiries || 0)}
            </span>
          </div>
          <h3 className="text-gray-600 font-semibold">Processed</h3>
        </div>
      </div>

      {/* Inquiries List */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, email, property..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option>All Status</option>
              <option>Pending</option>
              <option>Contacted</option>
              <option>Closed</option>
            </select>
          </div>
        </div>
        <div className="divide-y divide-gray-200">
          {filteredInquiries.length > 0 ? (
            filteredInquiries.map((inquiry) => (
              <div
                key={inquiry._id}
                className="p-6 hover:bg-gray-50 transition-colors"
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-bold text-gray-900 flex items-center gap-2">
                        <FaUser className="text-gray-400 text-sm" />{" "}
                        {inquiry.name}
                      </h3>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                          inquiry.status === "pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : inquiry.status === "contacted"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-green-100 text-green-700"
                        }`}
                      >
                        {inquiry.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-3 flex items-center gap-2">
                      <FaBuilding className="text-gray-400" />
                      Property:{" "}
                      <span className="font-semibold text-gray-900">
                        {inquiry.propertyId?.title || "General Inquiry"}
                      </span>
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm text-gray-600">
                      <span className="flex items-center gap-2">
                        <FaEnvelope className="text-gray-400" /> {inquiry.email}
                      </span>
                      <span className="flex items-center gap-2">
                        <FaPhone className="text-gray-400" /> {inquiry.phone}
                      </span>
                      <span className="flex items-center gap-2">
                        <FaClock className="text-gray-400" />{" "}
                        {formatDate(inquiry.createdAt)}
                      </span>
                    </div>
                    {inquiry.message && (
                      <div className="mt-4 p-3 bg-gray-50 rounded-lg border-l-4 border-orange-500">
                        <p className="text-sm text-gray-700 italic">
                          "{inquiry.message}"
                        </p>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {inquiry.status === "pending" && (
                      <button
                        onClick={() =>
                          handleUpdateStatus(inquiry._id, "contacted")
                        }
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-semibold shadow-sm"
                      >
                        Mark Contacted
                      </button>
                    )}
                    {inquiry.status !== "closed" && (
                      <button
                        onClick={() =>
                          handleUpdateStatus(inquiry._id, "closed")
                        }
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-semibold shadow-sm"
                      >
                        Resolve
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="px-6 py-12 text-center text-gray-500">
              No inquiries found
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InquiriesTab;
