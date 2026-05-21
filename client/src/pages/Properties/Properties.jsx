import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  FaBath,
  FaBed,
  FaExpand,
  FaHeart,
  FaMapMarkerAlt,
  FaRulerCombined,
  FaSearch,
  FaFilter,
  FaTimes,
  FaHome,
  FaBuilding,
  FaWarehouse,
  FaTree,
  FaStar,
  FaChevronDown,
  FaThLarge,
  FaList,
} from "react-icons/fa";
import { MdApartment } from "react-icons/md";
import Footer from "../../components/Footer";
import SEO from "../../components/SEO";

// ─────────────────────────────────────────────────────────────
// ProgressiveImage Component
// Pehle thumbnail (blurred, <20KB) dikhata hai, jab tak full
// webp (≤200KB) load na ho jaye. Load hone ke baad smooth
// CSS opacity transition se swap karta hai.
// Backward compatible: agar sirf ek hi src mile (old format),
// woh directly show hoga bina progressive loading ke.
// ─────────────────────────────────────────────────────────────
const ProgressiveImage = ({ src, thumbnailSrc, alt, className }) => {
  const [isFullLoaded, setIsFullLoaded] = useState(false);
  const hasThumbnail = !!thumbnailSrc && !!src && thumbnailSrc !== src;

  return (
    <div className="relative w-full h-full">
      {/* Full Image (webp) — pehle se load hona start kar deta hai, opacity 0 se shuru */}
      {hasThumbnail && (
        <img
          src={src}
          alt={alt}
          onLoad={() => setIsFullLoaded(true)}
          className={`${className} absolute inset-0 transition-opacity duration-700 ease-in-out ${isFullLoaded ? "opacity-100" : "opacity-0"
            }`}
        />
      )}

      {/* Thumbnail ya fallback image */}
      <img
        src={hasThumbnail ? thumbnailSrc : src}
        alt={alt}
        loading="lazy"
        className={`${className} ${hasThumbnail
            ? `transition-opacity duration-700 ease-in-out ${isFullLoaded ? "opacity-0" : "opacity-100"
            }`
            : ""
          }`}
      />
    </div>
  );
};

// Properties Component
const Properties = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const urlSearch = queryParams.get("search") || "";

  // State management
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState([]);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [viewMode, setViewMode] = useState("grid"); // "grid" or "list"
  const [isHeaderScrolled, setIsHeaderScrolled] = useState(false);

  // Scroll listener for sticky header adjustments
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 150) {
        setIsHeaderScrolled(true);
      } else {
        setIsHeaderScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Filter states
  const [filters, setFilters] = useState({
    search: urlSearch,
    propertyType: "all",
    location: "",
    minPrice: 0,
    maxPrice: 30000,
    minArea: 0,
    maxArea: 10000,
    bedrooms: "all",
    bathrooms: "all",
    sortBy: "newest",
  });

  // Helper: relative path ko full URL mein convert karo
  const buildUrl = (relativePath) => {
    if (!relativePath) return null;
    if (relativePath.startsWith("http")) return relativePath;
    const baseUrl = (import.meta.env.VITE_API_BASE_URL || "").replace(
      /\/$/,
      "",
    );
    const p = relativePath.startsWith("/") ? relativePath : `/${relativePath}`;
    return `${baseUrl}${p}`;
  };

  // Helper: image field handle karo — string (old format) ya object (new format)
  // Returns: { webp: string, thumbnail: string }
  const resolveImageUrls = (imageField) => {
    const placeholder = "https://via.placeholder.com/800x600?text=No+Image";
    if (!imageField) return { webp: placeholder, thumbnail: null };

    // New format: { webp, thumbnail, original, url }
    if (typeof imageField === "object" && !Array.isArray(imageField)) {
      return {
        webp: buildUrl(imageField.webp || imageField.url) || placeholder,
        thumbnail: buildUrl(imageField.thumbnail) || null,
      };
    }

    // Old format: plain string path
    if (typeof imageField === "string") {
      const url = buildUrl(imageField) || placeholder;
      return { webp: url, thumbnail: null };
    }

    return { webp: placeholder, thumbnail: null };
  };

  // Fetch properties from API
  const fetchAllProperties = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/properties`,
      );
      const data = await res.json();
      console.log(data);

      if (data.success) {
        // Map DB fields to component fields
        const mappedProperties = data.data.map((p) => {
          const firstPlan = p.plans && p.plans.length > 0 ? p.plans[0] : {};
          const firstImage =
            p.images && p.images.length > 0 ? p.images[0] : null;

          // New format: {webp, thumbnail} | Old format: string URL
          const { webp: imageWebp, thumbnail: imageThumbnail } =
            resolveImageUrls(firstImage);

          return {
            ...p,
            id: p._id,
            imageWebp, // Main display image (≤200KB WebP)
            imageThumbnail, // Progressive loading placeholder (<20KB blurred)
            price: p.priceRange || "Contact for Price",
            beds: p.beds || firstPlan.beds || 0,
            baths: p.baths || firstPlan.baths || 0,
            area_sqm: p.area_sqm || firstPlan.area_sqm || 0,
          };
        });
        setProperties(mappedProperties);
        setFilteredProperties(mappedProperties);
      }
    } catch (error) {
      console.error("Failed to load properties:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllProperties();
    // Fetch user wishlist if logged in
    const token = localStorage.getItem("accessToken");
    if (token) {
      fetchUserWishlist();
    }
  }, []);

  // Update filters if URL search param changes
  useEffect(() => {
    if (urlSearch !== filters.search) {
      setFilters((prev) => ({ ...prev, search: urlSearch }));
    }
  }, [urlSearch]);

  const fetchUserWishlist = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/wishlist`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      const data = await res.json();
      if (data.success) {
        // We only need the IDs of properties in the favorites array
        const likedIds = data.data.map((item) => item.propertyId?._id);
        setFavorites(likedIds);
      }
    } catch (error) {
      console.error("Failed to fetch wishlist:", error);
    }
  };

  // Apply filters whenever filter state changes
  useEffect(() => {
    let result = [...properties];

    // Property type filter
    if (filters.propertyType !== "all") {
      result = result.filter(
        (p) => p.type?.toLowerCase() === filters.propertyType.toLowerCase(),
      );
    }

    // Global Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter((p) => {
        const titleMatch = p.title?.toLowerCase().includes(searchLower);
        const locationStr =
          typeof p.location === "object"
            ? `${p.location.area}, ${p.location.city}`
            : p.location;
        const locationMatch = locationStr?.toLowerCase().includes(searchLower);
        return titleMatch || locationMatch;
      });
    }

    // Location filter (Specific field)
    if (filters.location) {
      result = result.filter((p) => {
        const locationStr =
          typeof p.location === "object"
            ? `${p.location.area}, ${p.location.city}`
            : p.location;
        return locationStr
          ?.toLowerCase()
          .includes(filters.location.toLowerCase());
      });
    }

    // Price range filter
    result = result.filter((p) => {
      const price = parseFloat(p.price);
      const numericPrice = isNaN(price) ? 0 : price;
      return (
        numericPrice >= filters.minPrice && numericPrice <= filters.maxPrice
      );
    });

    // Area range filter
    result = result.filter((p) => {
      const area = parseFloat(p.area_sqm);
      const numericArea = isNaN(area) ? 0 : area;
      return numericArea >= filters.minArea && numericArea <= filters.maxArea;
    });

    // Bedrooms filter
    if (filters.bedrooms !== "all") {
      result = result.filter((p) => p.beds === parseInt(filters.bedrooms));
    }

    // Bathrooms filter
    if (filters.bathrooms !== "all") {
      result = result.filter((p) => p.baths === parseInt(filters.bathrooms));
    }

    // Sorting
    switch (filters.sortBy) {
      case "price-low":
        result.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
        break;
      case "price-high":
        result.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
        break;
      case "area-low":
        result.sort((a, b) => parseFloat(a.area_sqm) - parseFloat(b.area_sqm));
        break;
      case "area-high":
        result.sort((a, b) => parseFloat(b.area_sqm) - parseFloat(a.area_sqm));
        break;
      default:
        // newest - keep original order
        break;
    }

    setFilteredProperties(result);
  }, [filters, properties]);

  // Toggle favorite with Backend API
  const toggleFavorite = async (propertyId) => {
    const token = localStorage.getItem("accessToken");

    if (!token) {
      alert("Please login to save properties to your wishlist!");
      navigate("/auth"); // Redirect to login page
      return;
    }

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/wishlist/toggle/${propertyId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      const data = await res.json();

      if (data.success) {
        // Update local state based on what server says
        if (data.data.liked) {
          setFavorites((prev) => [...prev, propertyId]);
        } else {
          setFavorites((prev) => prev.filter((id) => id !== propertyId));
        }
      } else {
        alert(data.message || "Failed to update wishlist");
      }
    } catch (error) {
      console.error("Wishlist toggle error:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  // Reset filters
  const resetFilters = () => {
    setFilters({
      search: "",
      propertyType: "all",
      location: "",
      minPrice: "0",
      maxPrice: "30000",
      minArea: "0",
      maxArea: "10000",
      bedrooms: "all",
      bathrooms: "all",
      sortBy: "newest",
    });
  };

  const propertyTypes = [
    { id: "all", icon: FaHome, label: "All Properties" },
    { id: "house", icon: FaHome, label: "Houses" },
    { id: "apartment", icon: MdApartment, label: "Apartments" },
    { id: "commercial", icon: FaWarehouse, label: "Commercial" },
    { id: "land", icon: FaTree, label: "Land" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-orange-50/20 to-gray-50 md:mt-20">
      <SEO
        title="Properties List"
        description="Browse through our wide range of properties in Bangalore. Find apartments, houses, commercial spaces, and land."
        keywords="properties in Bangalore, buy property, real estate listings"
      />
      {/* Hero Section */}
      {/* <section className="relative bg-gradient-to-r from-orange-600 to-orange-700 pt-24 md:pt-32 pb-16 overflow-hidden"> */}
      {/* Animated background pattern */}
      {/* <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse"></div>
          <div
            className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "1s" }}
          ></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center animate-[fadeInUp_0.6s_ease-out]">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
              Find Your Dream Property
            </h1>
            <p className="text-lg md:text-xl text-orange-100 max-w-2xl mx-auto">
              Explore our extensive collection of premium properties
            </p>
          </div>
        </div> */}
      {/* </section> */}

      {/* Search  - Mobile Only */}
      <section className="lg:hidden pt-4 pb-4 bg-white border-b border-gray-100 sticky top-16 z-40 transition-all duration-300">
        <div className="px-4 h-12">
          <div className="relative group">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
            <input
              type="text"
              placeholder="Search properties by location..."
              value={filters.search}
              onChange={(e) =>
                setFilters({ ...filters, search: e.target.value })
              }
              className="w-full h-12 pl-11 pr-4 rounded-xl bg-white border border-gray-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all text-sm font-medium shadow-sm outline-none"
            />
          </div>
        </div>
      </section>

      {/* Property Type Categories */}
      {/* <section className="py-2 md:py-4 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto md:px-6 lg:px-8">
          <div className="flex gap-4 overflow-x-auto px-4 py-3 no-scrollbar">
            {propertyTypes.map((type, index) => (
              <button
                key={type.id}
                onClick={() =>
                  setFilters({ ...filters, propertyType: type.id })
                }
                className={`flex items-center gap-1 md:gap-2.5 px-3 md:px-6 py-2 md:py-3.5 rounded-lg md:rounded-2xl font-bold whitespace-nowrap transition-all duration-300 active:scale-95 animate-[slideUp_${
                  0.3 + index * 0.1
                }s_ease-out] border ${
                  filters.propertyType === type.id
                    ? "bg-[#1B0F05] border-[#1B0F05] text-white shadow-lg shadow-[#1B0F05]/10 scale-105"
                    : "bg-white border-gray-100 text-gray-500 hover:border-gray-200"
                }`}
              >
                <type.icon
                  className={`text-base md:text-lg ${filters.propertyType === type.id ? "text-orange-500" : ""}`}
                />
                <span className="text-xs md:text-sm tracking-tight">
                  {type.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      </section> */}

      {/* Main Content */}
      <section className="py-2 md:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters Sidebar - Hidden on Mobile */}
            <aside className="hidden lg:block lg:w-80 animate-[fadeInLeft_0.5s_ease-out]">
              <div className="sticky top-24 space-y-6">
                {/* Filter Header */}
                <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                      <FaFilter className="text-orange-600" />
                      Filters
                    </h3>
                    <button
                      onClick={resetFilters}
                      className="text-sm text-orange-600 hover:text-orange-700 font-semibold transition-colors duration-300"
                    >
                      Reset All
                    </button>
                  </div>

                  {/* Search Properties */}
                  <div className="mb-6">
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Search
                    </label>
                    <div className="relative group">
                      <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
                      <input
                        type="text"
                        placeholder="Property name or location..."
                        value={filters.search}
                        onChange={(e) =>
                          setFilters({ ...filters, search: e.target.value })
                        }
                        className="w-full h-11 pl-11 pr-4 rounded-xl bg-gray-50 border-0 focus:ring-2 focus:ring-orange-500/20 transition-all text-sm font-medium"
                      />
                    </div>
                  </div>

                  {/* Price Range */}
                  <div className="mb-6">
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Price Range (₹)
                    </label>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                        <span className="font-medium">
                          ₹{filters.minPrice.toLocaleString()}
                        </span>
                        <span className="font-medium">
                          ₹{filters.maxPrice.toLocaleString()}
                        </span>
                      </div>
                      <div className="relative">
                        <input
                          type="range"
                          min="0"
                          max="30000"
                          step="500"
                          value={filters.minPrice}
                          onChange={(e) =>
                            setFilters({
                              ...filters,
                              minPrice: Math.min(
                                Number(e.target.value),
                                filters.maxPrice - 500,
                              ),
                            })
                          }
                          className="absolute w-full h-2 bg-transparent appearance-none pointer-events-none z-10"
                          style={{
                            background: "transparent",
                          }}
                        />
                        <input
                          type="range"
                          min="0"
                          max="30000"
                          step="500"
                          value={filters.maxPrice}
                          onChange={(e) =>
                            setFilters({
                              ...filters,
                              maxPrice: Math.max(
                                Number(e.target.value),
                                filters.minPrice + 500,
                              ),
                            })
                          }
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                          style={{
                            background: `linear-gradient(to right, #e5e7eb 0%, #e5e7eb ${(filters.minPrice / 30000) * 100
                              }%, #ea580c ${(filters.minPrice / 30000) * 100
                              }%, #ea580c ${(filters.maxPrice / 30000) * 100
                              }%, #e5e7eb ${(filters.maxPrice / 30000) * 100
                              }%, #e5e7eb 100%)`,
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Area Range */}
                  <div className="mb-6">
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Area Range (sq.ft)
                    </label>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                        <span className="font-medium">
                          {filters.minArea.toLocaleString()} sqft
                        </span>
                        <span className="font-medium">
                          {filters.maxArea.toLocaleString()} sqft
                        </span>
                      </div>
                      <div className="relative">
                        <input
                          type="range"
                          min="0"
                          max="10000"
                          step="100"
                          value={filters.minArea}
                          onChange={(e) =>
                            setFilters({
                              ...filters,
                              minArea: Math.min(
                                Number(e.target.value),
                                filters.maxArea - 100,
                              ),
                            })
                          }
                          className="absolute w-full h-2 bg-transparent appearance-none pointer-events-none z-10"
                          style={{
                            background: "transparent",
                          }}
                        />
                        <input
                          type="range"
                          min="0"
                          max="10000"
                          step="100"
                          value={filters.maxArea}
                          onChange={(e) =>
                            setFilters({
                              ...filters,
                              maxArea: Math.max(
                                Number(e.target.value),
                                filters.minArea + 100,
                              ),
                            })
                          }
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                          style={{
                            background: `linear-gradient(to right, #e5e7eb 0%, #e5e7eb ${(filters.minArea / 10000) * 100
                              }%, #ea580c ${(filters.minArea / 10000) * 100
                              }%, #ea580c ${(filters.maxArea / 10000) * 100
                              }%, #e5e7eb ${(filters.maxArea / 10000) * 100
                              }%, #e5e7eb 100%)`,
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Bedrooms */}
                  <div className="mb-6">
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Bedrooms
                    </label>
                    <select
                      value={filters.bedrooms}
                      onChange={(e) =>
                        setFilters({ ...filters, bedrooms: e.target.value })
                      }
                      className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300"
                    >
                      <option value="all">Any</option>
                      <option value="1">1 Bed</option>
                      <option value="2">2 Beds</option>
                      <option value="3">3 Beds</option>
                      <option value="4">4+ Beds</option>
                    </select>
                  </div>

                  {/* Bathrooms */}
                  <div className="mb-6">
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Bathrooms
                    </label>
                    <select
                      value={filters.bathrooms}
                      onChange={(e) =>
                        setFilters({ ...filters, bathrooms: e.target.value })
                      }
                      className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300"
                    >
                      <option value="all">Any</option>
                      <option value="1">1 Bath</option>
                      <option value="2">2 Baths</option>
                      <option value="3">3 Baths</option>
                      <option value="4">4+ Baths</option>
                    </select>
                  </div>

                  {/* Sort By */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Sort By
                    </label>
                    <select
                      value={filters.sortBy}
                      onChange={(e) =>
                        setFilters({ ...filters, sortBy: e.target.value })
                      }
                      className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300"
                    >
                      <option value="newest">Newest First</option>
                      <option value="price-low">Price: Low to High</option>
                      <option value="price-high">Price: High to Low</option>
                      <option value="area-low">Area: Low to High</option>
                      <option value="area-high">Area: High to Low</option>
                    </select>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="bg-white border border-gray-100 rounded-2xl shadow-xl p-6">
                  <h4 className="text-lg font-black text-gray-900 mb-5 flex items-center gap-2">
                    <div className="w-1.5 h-6 bg-orange-500 rounded-full"></div>
                    Quick Stats
                  </h4>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center bg-gray-50 p-4 rounded-xl">
                      <span className="text-gray-500 font-bold text-sm">
                        Total Properties
                      </span>
                      <span className="text-2xl font-black text-gray-900">
                        {properties.length}
                      </span>
                    </div>
                    <div className="flex justify-between items-center bg-orange-50 p-4 rounded-xl">
                      <span className="text-orange-600 font-bold text-sm">
                        Showing
                      </span>
                      <span className="text-2xl font-black text-orange-600">
                        {filteredProperties.length}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </aside>

            {/* Properties Grid */}
            <div className="flex-1 pb-20 md:pb-0">
              {/* Results Header */}
              <div
                className={`sticky top-20 md:top-20 z-30 md:static transition-all duration-300 ${isHeaderScrolled ? "" : "bg-transparent py-0"
                  } -mx-4 px-4 mb-6 flex items-center justify-between animate-[fadeInUp_0.5s_ease-out]`}
              >
                <h2
                  className={`text-xl md:text-2xl font-black text-gray-900 transition-all duration-300 ${isHeaderScrolled ? "opacity-0" : "opacity-100"
                    } md:opacity-100 md:visible md:w-auto md:translate-x-0`}
                >
                  {filteredProperties.length} Properties
                </h2>

                {/* View Toggle Buttons - All Screens */}
                <div className="flex items-center gap-2 bg-white rounded-xl p-1 shadow-md border border-gray-200 ">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`flex items-center gap-2 px-3 md:px-4 py-2 rounded-lg font-semibold transition-all duration-300 text-sm md:text-base ${viewMode === "grid"
                        ? "bg-orange-600 text-white shadow-md"
                        : "text-gray-600 hover:bg-gray-100"
                      }`}
                  >
                    <FaThLarge />
                    <span className="hidden sm:inline">Grid</span>
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`flex items-center gap-2 px-3 md:px-4 py-2 rounded-lg font-semibold transition-all duration-300 text-sm md:text-base ${viewMode === "list"
                        ? "bg-orange-600 text-white shadow-md"
                        : "text-gray-600 hover:bg-gray-100"
                      }`}
                  >
                    <FaList />
                    <span className="hidden sm:inline">List</span>
                  </button>
                </div>
              </div>

              {/* Loading State */}
              {loading && (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div
                      key={i}
                      className="bg-white rounded-2xl shadow-lg overflow-hidden animate-pulse"
                    >
                      <div className="h-64 bg-gray-300"></div>
                      <div className="p-6 space-y-4">
                        <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                        <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                        <div className="h-4 bg-gray-300 rounded w-full"></div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Empty State */}
              {!loading && filteredProperties.length === 0 && (
                <div className="text-center py-16 animate-[fadeInUp_0.6s_ease-out]">
                  <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <FaHome className="text-5xl text-orange-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    No Properties Found
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Try adjusting your filters to see more results
                  </p>
                  <button
                    onClick={resetFilters}
                    className="bg-orange-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-orange-700 transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg"
                  >
                    Reset Filters
                  </button>
                </div>
              )}

              {/* Properties Grid/List */}
              {!loading && filteredProperties.length > 0 && (
                <div
                  className={`grid gap-6 ${viewMode === "grid"
                      ? "grid-cols-1 md:grid-cols-2 xl:grid-cols-3"
                      : "grid-cols-1"
                    }`}
                >
                  {filteredProperties.map((property, index) => (
                    <article
                      key={property.id}
                      onClick={() => navigate(`/property/${property.id}`)}
                      className={`group bg-white rounded-b-3xl rounded-t-xl shadow-[0_10px_30px_rgba(0,0,0,0.03)] border border-gray-50 transition-all duration-500 overflow-hidden animate-[fadeInUp_${0.3 + index * 0.05
                        }s_ease-out] cursor-pointer active:scale-[0.98] ${viewMode === "grid"
                          ? "md:hover:scale-[1.000] md:hover:-translate-y-1"
                          : "md:hover:scale-[1.003]"
                        }`}
                    >
                      <div
                        className={viewMode === "list" ? "flex flex-row" : ""}
                      >
                        {/* Image */}
                        <div
                          className={`relative overflow-hidden ${viewMode === "grid"
                              ? "h-64"
                              : "w-[120px] md:w-80 h-auto md:h-full"
                            }`}
                        >
                          <ProgressiveImage
                            src={property.imageWebp}
                            thumbnailSrc={property.imageThumbnail}
                            alt={property.title}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                          {/* Badges Container */}
                          <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
                            {property.featured && (
                              <div
                                className={`bg-orange-600 text-white px-2 py-0.5 rounded-full font-black shadow-md ${viewMode === "list"
                                    ? "text-[8px]"
                                    : "text-[10px]"
                                  }`}
                              >
                                Featured
                              </div>
                            )}
                            {property.isNewLaunch && (
                              <div
                                className={`bg-emerald-500 text-white px-2 py-0.5 rounded-full font-black shadow-md flex items-center gap-1 ${viewMode === "list"
                                    ? "text-[8px]"
                                    : "text-[10px]"
                                  }`}
                              >
                                <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span>
                                New Launch
                              </div>
                            )}
                          </div>

                          {/* Favorite Button */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleFavorite(property.id);
                            }}
                            className={`absolute top-3 right-3 bg-white/90 backdrop-blur-md rounded-xl flex items-center justify-center shadow-md md:hover:scale-110 active:scale-75 transition-all duration-300 z-10 ${viewMode === "list" ? "w-6 h-6" : "w-8 h-8"
                              }`}
                          >
                            <FaHeart
                              className={`transition-colors duration-300 ${favorites.includes(property.id)
                                  ? "text-red-500"
                                  : "text-gray-300"
                                } ${viewMode === "list" ? "text-[10px]" : "text-xs"}`}
                            />
                          </button>

                          {/* Type Badge */}
                          <div
                            className={`absolute bottom-3 left-3 bg-white/95 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center gap-1.5 shadow-sm z-10 ${viewMode === "list"
                                ? "scale-90 origin-bottom-left"
                                : ""
                              }`}
                          >
                            <FaHome className="text-orange-600 text-[10px]" />
                            <span className="text-[10px] font-black text-gray-700">
                              {property.type}
                            </span>
                          </div>

                          {/* Quick View Button - Hidden on mobile */}
                          <button className="hidden md:block absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm p-2 rounded-lg shadow-md opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110">
                            <FaExpand className="text-orange-600" />
                          </button>
                        </div>

                        {/* Content */}
                        <div
                          className={`${viewMode === "list"
                              ? "flex-1 p-2.5 flex flex-col justify-between"
                              : "p-3 md:px-1 md:py-1"
                            }`}
                        >
                          <div>
                            {/* Title */}
                            <h3
                              className={`font-black text-gray-900 mb-1 group-hover:text-[#1B0F05] transition-colors duration-300 ${viewMode === "grid"
                                  ? "text-lg line-clamp-2"
                                  : "text-sm md:text-xl line-clamp-2"
                                }`}
                            >
                              {property.title}
                            </h3>

                            {/* Location */}
                            <div className="flex items-center gap-1.5 text-gray-500 mb-2">
                              <FaMapMarkerAlt className="text-orange-600 flex-shrink-0 text-[10px] md:text-sm" />
                              <span
                                className={`font-bold line-clamp-1 ${viewMode === "list"
                                    ? "text-[10px] md:text-sm"
                                    : "text-sm"
                                  }`}
                              >
                                {typeof property.location === "object"
                                  ? `${property.location.area}, ${property.location.city}`
                                  : property.location}
                              </span>
                            </div>

                            {/* Features */}
                            <div
                              className={`flex items-center gap-2 md:gap-4 mb-2 text-gray-500`}
                            >
                              <div className="flex items-center gap-1">
                                <FaBed className="text-orange-600 text-[10px] md:text-base" />
                                <span className="text-[10px] md:text-sm font-bold">
                                  {property.beds}
                                </span>
                              </div>
                              <div className="flex items-center gap-1">
                                <FaBath className="text-orange-600 text-[10px] md:text-base" />
                                <span className="text-[10px] md:text-sm font-bold">
                                  {property.baths}
                                </span>
                              </div>
                              <div className="flex items-center gap-1">
                                <FaRulerCombined className="text-orange-600 text-[10px] md:text-base" />
                                <span className="text-[10px] md:text-sm font-bold">
                                  {property.area_sqm}{" "}
                                  <span className="hidden md:inline">sqft</span>
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Price & Button */}
                          <div
                            className={`flex items-center justify-between pt-3 border-t border-gray-100 ${viewMode === "list" ? "mt-0" : "pt-1"
                              }`}
                          >
                            <div>
                              <p
                                className={`text-gray-500 mb-1 ${viewMode === "list"
                                    ? "text-xxs sm:text-xs"
                                    : "text-xs"
                                  }`}
                              >
                                Starting from
                              </p>
                              <p
                                className={`font-black text-gray-900 ${viewMode === "list"
                                    ? "text-base md:text-2xl"
                                    : "text-2xl"
                                  }`}
                              >
                                ₹{property.price}
                                <span
                                  className={`font-bold text-gray-500 ${viewMode === "list"
                                      ? "text-[10px]"
                                      : "text-lg"
                                    }`}
                                >
                                  K
                                </span>
                              </p>
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/property/${property.id}`);
                              }}
                              className={`bg-[#1B0F05] text-white rounded-xl font-black md:hover:bg-orange-600 transition-all duration-300 md:hover:scale-105 active:scale-90 shadow-lg ${viewMode === "list"
                                  ? "px-3 py-1.5 text-[10px] md:text-base"
                                  : "px-6 py-3 text-sm"
                                }`}
                            >
                              Details
                            </button>
                          </div>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Mobile Filter Button - Floating */}
      <button
        onClick={() => setShowMobileFilters(true)}
        className="lg:hidden fixed bottom-6 right-6 z-40 bg-[#1B0F05] text-white px-6 py-4 rounded-3xl shadow-2xl active:scale-90 transition-all flex items-center gap-3 border border-white/10 backdrop-blur-md"
      >
        <FaFilter className="text-orange-500 text-lg" />
        <span className="font-black tracking-tight">Filters</span>
        {filteredProperties.length !== properties.length && (
          <span className="w-6 h-6 bg-orange-600 text-white text-[10px] rounded-full flex items-center justify-center font-black">
            {filteredProperties.length}
          </span>
        )}
      </button>

      {/* Mobile Filter Modal */}
      {showMobileFilters && (
        <div className="lg:hidden fixed inset-0 z-50 animate-[fadeIn_0.3s_ease-out]">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowMobileFilters(false)}
          ></div>

          {/* Modal Content */}
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl max-h-[85vh] overflow-y-auto animate-[slideInUp_0.3s_ease-out]">
            {/* Header */}
            <div className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-gray-100 px-6 py-5 rounded-t-[2.5rem] z-10">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-black text-gray-900">Filters</h3>
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">
                    Refine Search
                  </p>
                </div>
                <button
                  onClick={() => setShowMobileFilters(false)}
                  className="w-11 h-11 bg-gray-50 border border-gray-100 rounded-2xl flex items-center justify-center active:scale-75 transition-transform"
                >
                  <FaTimes className="text-gray-600" />
                </button>
              </div>
            </div>

            {/* Filter Content */}
            <div className="p-6 space-y-6">
              {/* Search Properties */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Search
                </label>
                <div className="relative group">
                  <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Property name or location..."
                    value={filters.search}
                    onChange={(e) =>
                      setFilters({ ...filters, search: e.target.value })
                    }
                    className="w-full h-12 pl-11 pr-4 rounded-2xl bg-gray-50 border-0 focus:ring-2 focus:ring-orange-500/20 transition-all text-sm font-medium"
                  />
                </div>
              </div>
              {/* Price Range */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Price Range (₹)
                </label>
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                    <span className="font-medium">
                      ₹{filters.minPrice.toLocaleString()}
                    </span>
                    <span className="font-medium">
                      ₹{filters.maxPrice.toLocaleString()}
                    </span>
                  </div>
                  <div className="relative">
                    <input
                      type="range"
                      min="0"
                      max="30000"
                      step="500"
                      value={filters.minPrice}
                      onChange={(e) =>
                        setFilters({
                          ...filters,
                          minPrice: Math.min(
                            Number(e.target.value),
                            filters.maxPrice - 500,
                          ),
                        })
                      }
                      className="absolute w-full h-2 bg-transparent appearance-none pointer-events-none z-10"
                      style={{
                        background: "transparent",
                      }}
                    />
                    <input
                      type="range"
                      min="0"
                      max="30000"
                      step="500"
                      value={filters.maxPrice}
                      onChange={(e) =>
                        setFilters({
                          ...filters,
                          maxPrice: Math.max(
                            Number(e.target.value),
                            filters.minPrice + 500,
                          ),
                        })
                      }
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      style={{
                        background: `linear-gradient(to right, #e5e7eb 0%, #e5e7eb ${(filters.minPrice / 30000) * 100
                          }%, #ea580c ${(filters.minPrice / 30000) * 100
                          }%, #ea580c ${(filters.maxPrice / 30000) * 100
                          }%, #e5e7eb ${(filters.maxPrice / 30000) * 100
                          }%, #e5e7eb 100%)`,
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Area Range */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Area Range (sq.ft)
                </label>
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                    <span className="font-medium">
                      {filters.minArea.toLocaleString()} sqft
                    </span>
                    <span className="font-medium">
                      {filters.maxArea.toLocaleString()} sqft
                    </span>
                  </div>
                  <div className="relative">
                    <input
                      type="range"
                      min="0"
                      max="10000"
                      step="100"
                      value={filters.minArea}
                      onChange={(e) =>
                        setFilters({
                          ...filters,
                          minArea: Math.min(
                            Number(e.target.value),
                            filters.maxArea - 100,
                          ),
                        })
                      }
                      className="absolute w-full h-2 bg-transparent appearance-none pointer-events-none z-10"
                      style={{
                        background: "transparent",
                      }}
                    />
                    <input
                      type="range"
                      min="0"
                      max="10000"
                      step="100"
                      value={filters.maxArea}
                      onChange={(e) =>
                        setFilters({
                          ...filters,
                          maxArea: Math.max(
                            Number(e.target.value),
                            filters.minArea + 100,
                          ),
                        })
                      }
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      style={{
                        background: `linear-gradient(to right, #e5e7eb 0%, #e5e7eb ${(filters.minArea / 10000) * 100
                          }%, #ea580c ${(filters.minArea / 10000) * 100
                          }%, #ea580c ${(filters.maxArea / 10000) * 100
                          }%, #e5e7eb ${(filters.maxArea / 10000) * 100
                          }%, #e5e7eb 100%)`,
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Bedrooms */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Bedrooms
                </label>
                <select
                  value={filters.bedrooms}
                  onChange={(e) =>
                    setFilters({ ...filters, bedrooms: e.target.value })
                  }
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300"
                >
                  <option value="all">Any</option>
                  <option value="1">1 Bed</option>
                  <option value="2">2 Beds</option>
                  <option value="3">3 Beds</option>
                  <option value="4">4+ Beds</option>
                </select>
              </div>

              {/* Bathrooms */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Bathrooms
                </label>
                <select
                  value={filters.bathrooms}
                  onChange={(e) =>
                    setFilters({ ...filters, bathrooms: e.target.value })
                  }
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300"
                >
                  <option value="all">Any</option>
                  <option value="1">1 Bath</option>
                  <option value="2">2 Baths</option>
                  <option value="3">3 Baths</option>
                  <option value="4">4+ Baths</option>
                </select>
              </div>

              {/* Sort By */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Sort By
                </label>
                <select
                  value={filters.sortBy}
                  onChange={(e) =>
                    setFilters({ ...filters, sortBy: e.target.value })
                  }
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300"
                >
                  <option value="newest">Newest First</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="area-low">Area: Low to High</option>
                  <option value="area-high">Area: High to Low</option>
                </select>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 flex gap-3">
              <button
                onClick={resetFilters}
                className="flex-1 bg-gray-100 text-gray-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-all duration-300"
              >
                Reset
              </button>
              <button
                onClick={() => setShowMobileFilters(false)}
                className="flex-[2] bg-[#1B0F05] text-white px-6 py-4 rounded-[1.4rem] font-black hover:bg-black transition-all duration-300 shadow-xl"
              >
                Apply Filters ({filteredProperties.length})
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeInLeft {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideInUp {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }

        /* Range Slider Styling */
        input[type="range"] {
          -webkit-appearance: none;
          appearance: none;
        }

        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: #ea580c;
          cursor: pointer;
          border: 3px solid white;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
          position: relative;
          z-index: 20;
        }

        input[type="range"]::-moz-range-thumb {
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: #ea580c;
          cursor: pointer;
          border: 3px solid white;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
        }

        input[type="range"]::-webkit-slider-thumb:hover {
          transform: scale(1.2);
        }

        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }

        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }

        .line-clamp-1 {
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
      <Footer />
    </div>
  );
};

export default Properties;
