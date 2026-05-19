import React from "react";
import { FaBuilding, FaCheckCircle, FaUsers, FaEnvelope } from "react-icons/fa";

const StatsCards = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
        <div className="flex items-center justify-between mb-4">
          <div className="bg-blue-100 p-3 rounded-xl">
            <FaBuilding className="text-2xl text-blue-600" />
          </div>
          <span className="text-3xl font-bold text-gray-900">
            {stats.totalProperties}
          </span>
        </div>
        <h3 className="text-gray-600 font-semibold">Total Properties</h3>
        <p className="text-sm text-green-600 mt-1">Real-time data</p>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
        <div className="flex items-center justify-between mb-4">
          <div className="bg-green-100 p-3 rounded-xl">
            <FaCheckCircle className="text-2xl text-green-600" />
          </div>
          <span className="text-3xl font-bold text-gray-900">
            {stats.activeListings}
          </span>
        </div>
        <h3 className="text-gray-600 font-semibold">Active Listings</h3>
        <p className="text-sm text-green-600 mt-1">Currently published</p>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
        <div className="flex items-center justify-between mb-4">
          <div className="bg-purple-100 p-3 rounded-xl">
            <FaUsers className="text-2xl text-purple-600" />
          </div>
          <span className="text-3xl font-bold text-gray-900">
            {stats.totalUsers}
          </span>
        </div>
        <h3 className="text-gray-600 font-semibold">Total Users</h3>
        <p className="text-sm text-green-600 mt-1">
          ↑ {stats.newUsersThisMonth} new this month
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
        <div className="flex items-center justify-between mb-4">
          <div className="bg-orange-100 p-3 rounded-xl">
            <FaEnvelope className="text-2xl text-orange-600" />
          </div>
          <span className="text-3xl font-bold text-gray-900">
            {stats.totalInquiries}
          </span>
        </div>
        <h3 className="text-gray-600 font-semibold">Total Inquiries</h3>
        <p className="text-sm text-yellow-600 mt-1">
          {stats.pendingInquiries} pending
        </p>
      </div>
    </div>
  );
};

export default StatsCards;
