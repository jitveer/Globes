import React, { useState, useEffect } from "react";
import {
  FaCalendarAlt,
  FaClock,
  FaCheckCircle,
  FaSearch,
  FaPhone,
  FaEnvelope,
  FaUser,
  FaHistory,
  FaSpinner,
} from "react-icons/fa";

const VisitsTab = () => {
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const fetchVisits = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("accessToken");
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/schedule-visit`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      const data = await res.json();
      if (data.success) {
        setVisits(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch visits:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVisits();
  }, []);

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      const token = localStorage.getItem("accessToken");
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/schedule-visit/${id}`,
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
        fetchVisits(); // Refresh list
      }
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  const filteredVisits = visits.filter((visit) => {
    const matchesSearch =
      visit.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      visit.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      visit.phone.includes(searchQuery);

    const matchesFilter =
      filterStatus === "all" || visit.status === filterStatus;

    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      case "confirmed":
        return "bg-blue-100 text-blue-700";
      case "completed":
        return "bg-green-100 text-green-700";
      case "cancelled":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="space-y-6 animate-[fadeInUp_0.5s_ease-out]">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2 font-black">
          Scheduled Visits
        </h2>
        <p className="text-gray-600 font-medium">
          Manage and track property tour requests
        </p>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-3xl shadow-xl p-6 border border-gray-50 group hover:scale-105 transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-orange-100 p-4 rounded-2xl group-hover:bg-orange-600 group-hover:text-white transition-colors duration-300">
              <FaCalendarAlt className="text-2xl" />
            </div>
            <span className="text-4xl font-black text-gray-900">
              {visits.length}
            </span>
          </div>
          <h3 className="text-gray-500 font-bold uppercase tracking-wider text-xs">
            Total Requests
          </h3>
        </div>

        <div className="bg-white rounded-3xl shadow-xl p-6 border border-gray-50 group hover:scale-105 transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-yellow-100 p-4 rounded-2xl group-hover:bg-yellow-500 group-hover:text-white transition-colors duration-300">
              <FaHistory className="text-2xl" />
            </div>
            <span className="text-4xl font-black text-gray-900">
              {visits.filter((v) => v.status === "pending").length}
            </span>
          </div>
          <h3 className="text-gray-500 font-bold uppercase tracking-wider text-xs">
            Pending
          </h3>
        </div>

        <div className="bg-white rounded-3xl shadow-xl p-6 border border-gray-50 group hover:scale-105 transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-blue-100 p-4 rounded-2xl group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
              <FaCheckCircle className="text-2xl" />
            </div>
            <span className="text-4xl font-black text-gray-900">
              {visits.filter((v) => v.status === "confirmed").length}
            </span>
          </div>
          <h3 className="text-gray-500 font-bold uppercase tracking-wider text-xs">
            Confirmed
          </h3>
        </div>

        <div className="bg-white rounded-3xl shadow-xl p-6 border border-gray-50 group hover:scale-105 transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-green-100 p-4 rounded-2xl group-hover:bg-green-600 group-hover:text-white transition-colors duration-300">
              <FaCheckCircle className="text-2xl" />
            </div>
            <span className="text-4xl font-black text-gray-900">
              {visits.filter((v) => v.status === "completed").length}
            </span>
          </div>
          <h3 className="text-gray-500 font-bold uppercase tracking-wider text-xs">
            Completed
          </h3>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-3xl shadow-xl p-6 border border-gray-50">
        <div className="flex flex-col md:flex-row items-center gap-4">
          <div className="flex-1 relative w-full">
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, email or phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-transparent focus:border-orange-500 rounded-2xl outline-none transition-all font-medium"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full md:w-48 px-4 py-4 bg-gray-50 border-2 border-transparent focus:border-orange-500 rounded-2xl outline-none transition-all font-bold text-gray-700"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <button
            onClick={fetchVisits}
            className="p-4 bg-orange-600 text-white rounded-2xl hover:bg-orange-700 transition-all shadow-lg active:scale-95"
            title="Refresh List"
          >
            <FaSpinner className={loading ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      {/* Visits List */}
      <div className="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-gray-50">
        {loading ? (
          <div className="p-20 text-center">
            <FaSpinner className="text-4xl text-orange-600 animate-spin mx-auto mb-4" />
            <p className="text-gray-500 font-bold">Loading visits...</p>
          </div>
        ) : filteredVisits.length === 0 ? (
          <div className="p-20 text-center">
            <FaCalendarAlt className="text-6xl text-gray-200 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              No visits found
            </h3>
            <p className="text-gray-500">Scheduled visits will appear here.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50/50">
                  <th className="px-6 py-5 text-left text-xs font-black text-gray-500 uppercase tracking-widest border-b border-gray-100">
                    User Details
                  </th>
                  <th className="px-6 py-5 text-left text-xs font-black text-gray-500 uppercase tracking-widest border-b border-gray-100">
                    Schedule Info
                  </th>
                  <th className="px-6 py-5 text-left text-xs font-black text-gray-500 uppercase tracking-widest border-b border-gray-100">
                    Message
                  </th>
                  <th className="px-6 py-5 text-left text-xs font-black text-gray-500 uppercase tracking-widest border-b border-gray-100">
                    Status
                  </th>
                  <th className="px-6 py-5 text-right text-xs font-black text-gray-500 uppercase tracking-widest border-b border-gray-100">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredVisits.map((visit) => (
                  <tr
                    key={visit._id}
                    className="hover:bg-gray-50/50 transition-colors group"
                  >
                    <td className="px-6 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center font-black text-lg group-hover:bg-orange-600 group-hover:text-white transition-all duration-300">
                          {visit.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-black text-gray-900 mb-1">
                            {visit.name}
                          </div>
                          <div className="flex flex-col gap-1">
                            <span className="flex items-center gap-2 text-xs text-gray-500 font-bold">
                              <FaEnvelope className="text-[10px]" />{" "}
                              {visit.email}
                            </span>
                            <span className="flex items-center gap-2 text-xs text-gray-500 font-bold">
                              <FaPhone className="text-[10px]" /> {visit.phone}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm font-black text-gray-800">
                          <FaCalendarAlt className="text-orange-500" />
                          {new Date(visit.date).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </div>
                        <div className="flex items-center gap-2 text-xs font-bold text-gray-500">
                          <FaClock className="text-orange-500" />
                          {visit.time}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-6 max-w-xs">
                      <p className="text-sm text-gray-600 font-medium line-clamp-2 italic">
                        "{visit.message || "No message provided"}"
                      </p>
                    </td>
                    <td className="px-6 py-6">
                      <span
                        className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm ${getStatusColor(visit.status)}`}
                      >
                        {visit.status}
                      </span>
                    </td>
                    <td className="px-6 py-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {visit.status === "pending" && (
                          <button
                            onClick={() =>
                              handleUpdateStatus(visit._id, "confirmed")
                            }
                            className="p-2 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white rounded-xl transition-all duration-300 shadow-sm"
                            title="Confirm"
                          >
                            <FaCheckCircle />
                          </button>
                        )}
                        {visit.status !== "completed" &&
                          visit.status !== "cancelled" && (
                            <button
                              onClick={() =>
                                handleUpdateStatus(visit._id, "completed")
                              }
                              className="p-2 bg-green-50 text-green-600 hover:bg-green-600 hover:text-white rounded-xl transition-all duration-300 shadow-sm"
                              title="Complete"
                            >
                              <FaCheckCircle />
                            </button>
                          )}
                        {visit.status !== "cancelled" &&
                          visit.status !== "completed" && (
                            <button
                              onClick={() =>
                                handleUpdateStatus(visit._id, "cancelled")
                              }
                              className="p-2 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white rounded-xl transition-all duration-300 shadow-sm"
                              title="Cancel"
                            >
                              <FaHistory />
                            </button>
                          )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default VisitsTab;
