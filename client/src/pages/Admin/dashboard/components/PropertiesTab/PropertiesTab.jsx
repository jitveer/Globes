import React, { useState } from "react";
import { FaPlus, FaSearch, FaEye, FaEdit, FaTrash } from "react-icons/fa";

const PropertiesTab = ({
  loading,
  properties,
  navigate,
  handleDeleteProperty,
  handleToggleStatus,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [sortBy, setSortBy] = useState("Latest First");

  const filteredProperties = properties.filter((property) => {
    const searchLower = searchTerm.toLowerCase();
    const titleMatch = property.title?.toLowerCase().includes(searchLower);
    const locationStr =
      typeof property.location === "object"
        ? `${property.location.area} ${property.location.city}`
        : property.location;
    const locationMatch = locationStr?.toLowerCase().includes(searchLower);

    const matchesSearch = titleMatch || locationMatch;
    const matchesStatus =
      statusFilter === "All Status" ||
      property.status?.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  const sortedAndFilteredProperties = [...filteredProperties].sort((a, b) => {
    if (sortBy === "Latest First") {
      return new Date(b.createdAt) - new Date(a.createdAt);
    }
    if (sortBy === "Price: Low to High") {
      // Priority to 'price' property, fallback to parsing 'priceRange'
      const priceA = a.price || parseFloat(a.priceRange) || 0;
      const priceB = b.price || parseFloat(b.priceRange) || 0;
      return priceA - priceB;
    }
    if (sortBy === "Price: High to Low") {
      const priceA = a.price || parseFloat(a.priceRange) || 0;
      const priceB = b.price || parseFloat(b.priceRange) || 0;
      return priceB - priceA;
    }
    return 0;
  });

  return (
    <div className="space-y-6 animate-[fadeInUp_0.5s_ease-out]">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Property Management
          </h2>
          <p className="text-gray-600">Manage all your property listings</p>
        </div>
        <button
          className="flex items-center gap-2 bg-gradient-to-r from-orange-600 to-orange-700 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
          onClick={() => navigate("/admin/add-property")}
        >
          <FaPlus /> Add New Property
        </button>
      </div>

      {/* Filters (Simplified for now) */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Search
            </label>
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search properties by title or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-700"
            >
              <option value="All Status">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="pending">Pending</option>
              <option value="sold">Sold</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Sort By
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-700"
            >
              <option value="Latest First">Latest First</option>
              <option value="Price: Low to High">Price: Low to High</option>
              <option value="Price: High to Low">Price: High to Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Properties Table */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Property
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Location
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Price
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Status
                </th>
                {/* <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Views
                </th> */}
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    Loading properties...
                  </td>
                </tr>
              ) : sortedAndFilteredProperties.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    No properties found matching your filters
                  </td>
                </tr>
              ) : (
                sortedAndFilteredProperties.map((property) => (
                  <tr
                    key={property._id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={
                            property.images?.[0] ||
                            "https://via.placeholder.com/100x100"
                          }
                          alt={property.title}
                          className="w-16 h-16 rounded-lg object-cover"
                        />
                        <div>
                          <p className="font-semibold text-gray-900">
                            {property.title}
                          </p>
                          <p className="text-xs text-gray-500 uppercase">
                            {property.type}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {typeof property.location === "object"
                        ? `${property.location.area}, ${property.location.city}`
                        : property.location}
                    </td>
                    <td className="px-6 py-4 font-semibold text-orange-600">
                      {property.priceRange}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() =>
                            handleToggleStatus(property._id, property.status)
                          }
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                            property.status === "active"
                              ? "bg-green-600"
                              : "bg-gray-300"
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              property.status === "active"
                                ? "translate-x-6"
                                : "translate-x-1"
                            }`}
                          />
                        </button>
                        <span
                          className={`text-xs font-semibold uppercase inline-block w-16 ${
                            property.status === "active"
                              ? "text-green-700"
                              : "text-gray-500"
                          }`}
                        >
                          {property.status === "active" ? "Active" : "Inactive"}
                        </span>
                      </div>
                    </td>
                    {/* <td className="px-6 py-4 text-gray-900">
                      {property.views || 0}
                    </td> */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => navigate(`/property/${property._id}`)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-blue-100"
                        >
                          <FaEye />
                        </button>
                        <button
                          onClick={() =>
                            navigate(`/admin/edit-property/${property._id}`)
                          }
                          className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors border border-orange-100"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDeleteProperty(property._id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-red-100"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PropertiesTab;
