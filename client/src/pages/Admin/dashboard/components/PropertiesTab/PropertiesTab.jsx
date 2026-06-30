import React, { useState, useEffect } from "react";
import { FaPlus, FaSearch, FaEye, FaEdit, FaTrash } from "react-icons/fa";

const PropertiesTab = ({
  loading,
  properties,
  navigate,
  handleDeleteProperty,
  handleToggleStatus,
}) => {
  // Load initial states from sessionStorage if available to preserve user context
  const [searchTerm, setSearchTerm] = useState(() => {
    return sessionStorage.getItem("adminPropertiesSearch") || "";
  });
  const [statusFilter, setStatusFilter] = useState(() => {
    return sessionStorage.getItem("adminPropertiesStatus") || "All Status";
  });
  const [sortBy, setSortBy] = useState(() => {
    return sessionStorage.getItem("adminPropertiesSort") || "Latest First";
  });
  const [currentPage, setCurrentPage] = useState(() => {
    return parseInt(sessionStorage.getItem("adminPropertiesPage"), 10) || 1;
  });

  // Track scroll position dynamically
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        sessionStorage.setItem("adminDashboardScrollY", window.scrollY.toString());
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Restore scroll position when loading is complete
  useEffect(() => {
    if (!loading && properties.length > 0) {
      const savedScrollY = sessionStorage.getItem("adminDashboardScrollY");
      if (savedScrollY) {
        const scrollPos = parseInt(savedScrollY, 10);
        const timer = setTimeout(() => {
          window.scrollTo(0, scrollPos);
        }, 100);
        return () => clearTimeout(timer);
      }
    }
  }, [loading, properties]);

  // Filter logic
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

  // Sorting logic
  const sortedAndFilteredProperties = [...filteredProperties].sort((a, b) => {
    if (sortBy === "Latest First") {
      return new Date(b.createdAt) - new Date(a.createdAt);
    }
    if (sortBy === "Price: Low to High") {
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

  // Pagination logic (20 items per page)
  const ITEMS_PER_PAGE = 20;
  const totalItems = sortedAndFilteredProperties.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

  // Validate active page bounds
  const activePage = Math.min(Math.max(1, currentPage), totalPages || 1);

  const startIndex = (activePage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedProperties = sortedAndFilteredProperties.slice(startIndex, endIndex);

  // Update states helper functions
  const handleSearchChange = (value) => {
    setSearchTerm(value);
    sessionStorage.setItem("adminPropertiesSearch", value);
    setCurrentPage(1);
    sessionStorage.setItem("adminPropertiesPage", "1");
  };

  const handleStatusFilterChange = (value) => {
    setStatusFilter(value);
    sessionStorage.setItem("adminPropertiesStatus", value);
    setCurrentPage(1);
    sessionStorage.setItem("adminPropertiesPage", "1");
  };

  const handleSortChange = (value) => {
    setSortBy(value);
    sessionStorage.setItem("adminPropertiesSort", value);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    sessionStorage.setItem("adminPropertiesPage", page.toString());
    // Scroll slightly to the top of table container on page change
    const tableEl = document.getElementById("properties-table-container");
    if (tableEl) {
      tableEl.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

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
          onClick={() => {
            sessionStorage.removeItem("adminDashboardScrollY");
            navigate("/admin/add-property");
          }}
        >
          <FaPlus /> Add New Property
        </button>
      </div>

      {/* Sticky Filters with glassmorphism */}
      <div className="sticky top-[75px] z-30 bg-white/90 backdrop-blur-md rounded-2xl shadow-lg p-6 border border-gray-100/50">
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
                onChange={(e) => handleSearchChange(e.target.value)}
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
              onChange={(e) => handleStatusFilterChange(e.target.value)}
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
              onChange={(e) => handleSortChange(e.target.value)}
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
      <div id="properties-table-container" className="bg-white rounded-2xl shadow-lg overflow-hidden">
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
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td
                    colSpan="5"
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    Loading properties...
                  </td>
                </tr>
              ) : paginatedProperties.length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    No properties found matching your filters
                  </td>
                </tr>
              ) : (
                paginatedProperties.map((property) => (
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
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${property.status === "active"
                            ? "bg-green-600"
                            : "bg-gray-300"
                            }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${property.status === "active"
                              ? "translate-x-6"
                              : "translate-x-1"
                              }`}
                          />
                        </button>
                        <span
                          className={`text-xs font-semibold uppercase inline-block w-16 ${property.status === "active"
                            ? "text-green-700"
                            : "text-gray-500"
                            }`}
                        >
                          {property.status === "active" ? "Active" : "Inactive"}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <a
                          href={`/property/${property._id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-blue-100 inline-flex items-center justify-center"
                        >
                          <FaEye />
                        </a>
                        <button
                          onClick={() => {
                            sessionStorage.setItem("adminDashboardScrollY", window.scrollY.toString());
                            navigate(`/admin/edit-property/${property._id}`);
                          }}
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

        {/* Premium Pagination Footer */}
        {!loading && totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-gray-50 px-6 py-4 border-t border-gray-200">
            <div className="text-sm text-gray-600">
              Showing <span className="font-semibold text-gray-900">{startIndex + 1}</span> to{" "}
              <span className="font-semibold text-gray-900">
                {Math.min(endIndex, totalItems)}
              </span>{" "}
              of <span className="font-semibold text-gray-900">{totalItems}</span> properties
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(activePage - 1)}
                disabled={activePage === 1}
                className={`px-4 py-2 border rounded-lg text-sm font-semibold transition-all ${activePage === 1
                  ? "border-gray-200 text-gray-400 bg-gray-100 cursor-not-allowed"
                  : "border-gray-300 text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-400"
                  }`}
              >
                Previous
              </button>

              <div className="hidden md:flex items-center gap-1">
                {[...Array(totalPages)].map((_, index) => {
                  const pageNumber = index + 1;
                  return (
                    <button
                      key={pageNumber}
                      onClick={() => handlePageChange(pageNumber)}
                      className={`w-9 h-9 rounded-lg text-sm font-semibold transition-all ${activePage === pageNumber
                        ? "bg-gradient-to-r from-orange-600 to-orange-700 text-white shadow-md"
                        : "text-gray-700 bg-white border border-gray-200 hover:bg-gray-50"
                        }`}
                    >
                      {pageNumber}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => handlePageChange(activePage + 1)}
                disabled={activePage === totalPages}
                className={`px-4 py-2 border rounded-lg text-sm font-semibold transition-all ${activePage === totalPages
                  ? "border-gray-200 text-gray-400 bg-gray-100 cursor-not-allowed"
                  : "border-gray-300 text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-400"
                  }`}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PropertiesTab;
