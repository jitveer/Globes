import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaHeart,
  FaBed,
  FaBath,
  FaRulerCombined,
  FaMapMarkerAlt,
  FaTrash,
  FaEye,
  FaFilter,
  FaSortAmountDown,
} from "react-icons/fa";

// Dummy wishlist data
const dummyWishlist = [
  {
    id: 1,
    title: "Luxury Villa with Pool and Garden",
    type: "House",
    location: "Whitefield, Bangalore",
    price: "12500",
    beds: 4,
    baths: 3,
    area: 3500,
    image:
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&h=600&fit=crop",
    addedDate: "2024-12-15",
  },
  {
    id: 2,
    title: "Modern 3BHK Apartment in Prime Location",
    type: "Apartment",
    location: "Koramangala, Bangalore",
    price: "8500",
    beds: 3,
    baths: 2,
    area: 1850,
    image:
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=600&fit=crop",
    addedDate: "2024-12-14",
  },
  {
    id: 3,
    title: "Penthouse with Terrace Garden",
    type: "Apartment",
    location: "Jayanagar, Bangalore",
    price: "22000",
    beds: 4,
    baths: 3,
    area: 3200,
    image:
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=600&fit=crop",
    addedDate: "2024-12-13",
  },
  {
    id: 4,
    title: "Beautiful 5BHK Independent House",
    type: "House",
    location: "HSR Layout, Bangalore",
    price: "18000",
    beds: 5,
    baths: 4,
    area: 4200,
    image:
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop",
    addedDate: "2024-12-12",
  },
];

const Wishlist = () => {
  const navigate = useNavigate();
  const [wishlist, setWishlist] = useState(dummyWishlist);
  const [sortBy, setSortBy] = useState("newest");
  const [filterType, setFilterType] = useState("all");

  // Filter and sort wishlist
  const filteredWishlist = wishlist
    .filter(
      (item) =>
        filterType === "all" ||
        item.type.toLowerCase() === filterType.toLowerCase()
    )
    .sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return parseFloat(a.price) - parseFloat(b.price);
        case "price-high":
          return parseFloat(b.price) - parseFloat(a.price);
        case "newest":
          return new Date(b.addedDate) - new Date(a.addedDate);
        case "oldest":
          return new Date(a.addedDate) - new Date(b.addedDate);
        default:
          return 0;
      }
    });

  const handleRemove = (id) => {
    setWishlist(wishlist.filter((item) => item.id !== id));
  };

  const handleClearAll = () => {
    if (window.confirm("Are you sure you want to clear all favorites?")) {
      setWishlist([]);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-orange-50/20 to-gray-50 pt-20 md:pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 animate-[fadeInUp_0.5s_ease-out]">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                <FaHeart className="text-red-500" />
                My Wishlist
              </h1>
              <p className="text-gray-600">
                {filteredWishlist.length}{" "}
                {filteredWishlist.length === 1 ? "property" : "properties"}{" "}
                saved
              </p>
            </div>
            {wishlist.length > 0 && (
              <button
                onClick={handleClearAll}
                className="hidden md:flex items-center gap-2 px-6 py-3 bg-red-100 text-red-600 rounded-xl font-semibold hover:bg-red-200 transition-all duration-300 hover:scale-105"
              >
                <FaTrash />
                Clear All
              </button>
            )}
          </div>

          {/* Filters and Sort */}
          {wishlist.length > 0 && (
            <div className="flex flex-col sm:flex-row gap-4 bg-white rounded-2xl shadow-lg p-4">
              <div className="flex-1">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <FaFilter className="inline mr-2" />
                  Filter by Type
                </label>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300"
                >
                  <option value="all">All Types</option>
                  <option value="house">Houses</option>
                  <option value="apartment">Apartments</option>
                  <option value="commercial">Commercial</option>
                  <option value="land">Land</option>
                </select>
              </div>
              <div className="flex-1">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <FaSortAmountDown className="inline mr-2" />
                  Sort By
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Empty State */}
        {wishlist.length === 0 && (
          <div className="text-center py-16 animate-[fadeInUp_0.6s_ease-out]">
            <div className="w-32 h-32 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaHeart className="text-6xl text-orange-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Your Wishlist is Empty
            </h3>
            <p className="text-gray-600 mb-6">
              Start adding properties you love to your wishlist
            </p>
            <button
              onClick={() => navigate("/properties")}
              className="bg-gradient-to-r from-orange-600 to-orange-700 text-white px-8 py-3 rounded-xl font-semibold hover:from-orange-700 hover:to-orange-800 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
            >
              Browse Properties
            </button>
          </div>
        )}

        {/* Wishlist Grid */}
        {filteredWishlist.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-[fadeInUp_0.6s_ease-out]">
            {filteredWishlist.map((property, index) => (
              <article
                key={property.id}
                className={`group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden hover:scale-105 hover:-translate-y-2 animate-[fadeInUp_${
                  0.3 + index * 0.05
                }s_ease-out]`}
              >
                {/* Image */}
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={property.image}
                    alt={property.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                  {/* Type Badge */}
                  <div className="absolute top-4 left-4 bg-orange-600 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
                    {property.type}
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => handleRemove(property.id)}
                    className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-lg hover:bg-red-500 hover:text-white transition-all duration-300 hover:scale-110"
                  >
                    <FaTrash />
                  </button>

                  {/* View Button */}
                  <button
                    onClick={() => navigate(`/property/${property.id}`)}
                    className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 flex items-center gap-2 font-semibold text-orange-600"
                  >
                    <FaEye />
                    View
                  </button>
                </div>

                {/* Content */}
                <div className="p-6">
                  {/* Title */}
                  <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-orange-600 transition-colors duration-300">
                    {property.title}
                  </h3>

                  {/* Location */}
                  <div className="flex items-center gap-2 text-gray-600 mb-4">
                    <FaMapMarkerAlt className="text-orange-600 flex-shrink-0 text-sm" />
                    <span className="text-sm font-medium line-clamp-1">
                      {property.location}
                    </span>
                  </div>

                  {/* Features */}
                  <div className="flex items-center gap-4 mb-4 text-gray-600">
                    <div className="flex items-center gap-1">
                      <FaBed className="text-orange-600" />
                      <span className="text-sm font-medium">
                        {property.beds}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <FaBath className="text-orange-600" />
                      <span className="text-sm font-medium">
                        {property.baths}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <FaRulerCombined className="text-orange-600" />
                      <span className="text-sm font-medium">
                        {property.area} sqft
                      </span>
                    </div>
                  </div>

                  {/* Price and Added Date */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <div>
                      <span className="text-2xl font-bold text-orange-600">
                        ₹{parseInt(property.price).toLocaleString()}
                      </span>
                      <span className="text-gray-500 text-sm">/month</span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Added on {new Date(property.addedDate).toLocaleDateString()}
                  </p>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* No Results After Filter */}
        {wishlist.length > 0 && filteredWishlist.length === 0 && (
          <div className="text-center py-16 animate-[fadeInUp_0.6s_ease-out]">
            <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaFilter className="text-5xl text-orange-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              No Properties Found
            </h3>
            <p className="text-gray-600 mb-6">Try adjusting your filters</p>
            <button
              onClick={() => setFilterType("all")}
              className="bg-orange-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-orange-700 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Clear Filters
            </button>
          </div>
        )}

        {/* Mobile Clear All Button */}
        {wishlist.length > 0 && (
          <div className="md:hidden fixed bottom-6 right-6 z-50">
            <button
              onClick={handleClearAll}
              className="bg-red-500 text-white p-4 rounded-full shadow-2xl hover:bg-red-600 transition-all duration-300 hover:scale-110 active:scale-95"
            >
              <FaTrash className="text-xl" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
