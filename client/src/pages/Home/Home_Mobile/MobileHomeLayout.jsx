import { MdApartment, MdNotifications } from "react-icons/md";
import { GiTreehouse } from "react-icons/gi";
import {
  FaSearch,
  FaSlidersH,
  FaWarehouse,
  FaHome,
  FaMapMarkerAlt,
  FaStar,
  FaBed,
  FaBath,
  FaHeart,
  FaCalendarAlt,
  FaClock,
  FaTimes,
  FaPaperPlane,
} from "react-icons/fa";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Popup from "../../../components/Popup";

const MobileHomeLayout = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [favorites, setFavorites] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmittingVisit, setIsSubmittingVisit] = useState(false);
  const [popupData, setPopupData] = useState({
    isOpen: false,
    type: "success",
    title: "",
    message: "",
  });
  const navigate = useNavigate();
  const [latestRealProperties, setLatestRealProperties] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const [meetingData, setMeetingData] = useState({
    name: "",
    email: "",
    phone: "",
    date: "",
    time: "",
    message: "",
  });

  const categories = [
    { id: "all", icon: FaHome, label: "All", color: "text-orange-600" },
    { id: "house", icon: FaHome, label: "House", color: "text-blue-500" },
    {
      id: "apartment",
      icon: MdApartment,
      label: "Apartments",
      color: "text-orange-500",
    },
    {
      id: "warehouse",
      icon: FaWarehouse,
      label: "Warehouse",
      color: "text-emerald-500",
    },
    { id: "land", icon: GiTreehouse, label: "Land", color: "text-amber-600" },
  ];

  // Helper function to format image URLs
  const getImageUrl = (imageInput) => {
    const placeholder = "https://via.placeholder.com/800x600?text=No+Image";
    if (!imageInput) return placeholder;

    // Support both old string format and new optimized object format
    const url = typeof imageInput === "string" ? imageInput : imageInput.webp;

    if (!url) return placeholder;
    if (url.startsWith("http")) return url;

    const baseUrl = (import.meta.env.VITE_API_BASE_URL || "").replace(
      /\/$/,
      "",
    );
    const path = url.startsWith("/") ? url : `/${url}`;
    return `${baseUrl}${path}`;
  };

  const toggleFavorite = (e, id) => {
    e.stopPropagation();
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((fav) => fav !== id) : [...prev, id],
    );
  };

  const filteredProperties = latestRealProperties.filter(
    (p) =>
      activeCategory === "all" ||
      p.property_type?.toLowerCase().includes(activeCategory.toLowerCase()),
  );

  // --- Fetching Logic ---
  const fetchLatestProperties = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/properties`,
      );
      const data = await res.json();
      if (data.success) {
        const mappedData = data.data.map((p) => ({
          ...p,
          id: p._id,
          image: getImageUrl(p.images?.[0]),
          price: p.priceRange || p.price || "Contact",
          beds: p.beds || p.plans?.[0]?.beds || 0,
          baths: p.baths || p.plans?.[0]?.baths || 0,
        }));
        setLatestRealProperties(mappedData);
      }
    } catch (error) {
      console.error("Failed to load properties:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLatestProperties();
  }, []);

  // --- Search & Suggestions Logic ---
  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/properties?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate("/properties");
    }
    setShowSuggestions(false);
  };

  useEffect(() => {
    if (searchQuery.trim().length > 1) {
      const searchLower = searchQuery.toLowerCase();
      const allSearchable = [...latestRealProperties];
      const matched = [];
      const seenLabels = new Set();

      allSearchable.forEach((p) => {
        // Match Property Title
        if (p.title?.toLowerCase().includes(searchLower)) {
          if (!seenLabels.has(p.title)) {
            matched.push({
              type: "property",
              label: p.title,
              id: p._id || p.id,
              sub:
                typeof p.location === "object"
                  ? `${p.location.area}, ${p.location.city}`
                  : p.location,
            });
            seenLabels.add(p.title);
          }
        }

        // Match Location
        const locStr =
          typeof p.location === "object"
            ? `${p.location.area}, ${p.location.city}`
            : p.location;

        if (locStr?.toLowerCase().includes(searchLower)) {
          if (!seenLabels.has(locStr)) {
            matched.push({ type: "location", label: locStr });
            seenLabels.add(locStr);
          }
        }
      });

      setSuggestions(matched.slice(0, 6)); // 6 is enough for mobile
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [searchQuery, latestRealProperties]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setShowSuggestions(false);
    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <div className="min-h-screen bg-[#FDFDFF] pb-24 font-sans antialiased text-gray-900 overflow-x-hidden">
      {/* Premium Header */}
      <div className="px-5 pt-8 pb-4 animate-[fadeInDown_0.6s_ease-out]">
        {/* <div className="flex justify-between items-start mb-6">
          <div className="space-y-1">
            <h2 className="text-gray-500 text-sm font-medium">Location</h2>
            <div className="flex items-center gap-1">
              <FaMapMarkerAlt className="text-orange-600 text-sm" />
              <span className="text-base font-bold text-gray-900">
                Surabaya, Indonesia
              </span>
              <button className="ml-1 text-orange-600 text-xs font-bold">
                Change
              </button>
            </div>
          </div>
          <button className="relative w-11 h-11 bg-white border border-gray-100 rounded-2xl flex items-center justify-center shadow-sm active:scale-90 transition-transform">
            <MdNotifications className="text-2xl text-gray-600" />
            <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-orange-600 border-2 border-white rounded-full"></span>
          </button>
        </div> */}

        <div className="mb-6">
          <h1 className="text-2xl font-black leading-tight">
            Find the perfect <br />
            <span className="text-orange-600">Dream Home</span> for you
          </h1>
        </div>
      </div>

      {/* Search & Filter Section */}
      <div className="px-5 mb-8 sticky top-2 z-20 animate-[fadeIn_0.8s_ease-out]">
        <div className="flex gap-3 h-14">
          <div className="flex-1 relative group">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-600 transition-colors" />
            <input
              type="text"
              placeholder="Search properties..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              onFocus={() => searchQuery.length > 1 && setShowSuggestions(true)}
              className="w-full h-full pl-11 pr-4 rounded-2xl bg-white border-0 shadow-[0_8px_30px_rgb(0,0,0,0.04)] focus:ring-2 focus:ring-orange-500/20 transition-all text-sm font-medium text-gray-700"
            />

            {/* Suggestions Dropdown */}
            {showSuggestions && suggestions.length > 0 && (
              <div
                className="absolute left-0 right-0 mt-2 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-[2000] animate-[fadeIn_0.2s_ease-out]"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="py-2">
                  {suggestions.map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        if (item.type === "property") {
                          navigate(`/property/${item.id}`);
                        } else {
                          setSearchQuery(item.label);
                          navigate(
                            `/properties?search=${encodeURIComponent(item.label)}`,
                          );
                        }
                        setShowSuggestions(false);
                      }}
                      className="w-full px-4 py-3 flex items-center gap-3 active:bg-orange-50 transition-colors border-b border-gray-50 last:border-0"
                    >
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${item.type === "property" ? "bg-orange-100 text-orange-600" : "bg-blue-100 text-blue-600"}`}
                      >
                        {item.type === "property" ? (
                          <FaHome className="text-sm" />
                        ) : (
                          <FaMapMarkerAlt className="text-sm" />
                        )}
                      </div>
                      <div className="text-left overflow-hidden">
                        <p className="font-bold text-gray-900 text-sm truncate">
                          {item.label}
                        </p>
                        <p className="text-[10px] text-gray-400 uppercase font-black">
                          {item.type}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          <button
            onClick={handleSearch}
            className="h-full w-14 flex items-center justify-center bg-orange-500 rounded-2xl shadow-lg shadow-orange-500/30 text-white active:scale-90 transition-transform"
          >
            <FaSlidersH className="text-xl" />
          </button>
        </div>
      </div>

      {/* Modern Categories */}
      <div className="mb-8 animate-[slideUp_0.7s_ease-out]">
        <div className="flex gap-4 overflow-x-auto px-5 no-scrollbar">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`flex items-center gap-2 px-5 py-3 rounded-2xl whitespace-nowrap transition-all duration-300 border ${
                activeCategory === category.id
                  ? "bg-gray-900 border-gray-900 text-white shadow-xl shadow-gray-900/10 scale-105"
                  : "bg-white border-gray-100 text-gray-500 hover:border-gray-200"
              }`}
            >
              <category.icon
                className={`text-lg ${activeCategory === category.id ? "text-orange-500" : ""}`}
              />
              <span className="text-sm font-bold tracking-tight">
                {category.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Recommended Section (Horizontal Cards) */}
      <div className="mb-10 animate-[fadeIn_1s_ease-out]">
        <div className="px-5 flex justify-between items-center mb-5">
          <h2 className="text-xl font-black text-gray-900">Recommended</h2>
          <button className="bg-orange-50 text-orange-600 px-3 py-1.5 rounded-xl text-xs font-black tracking-wider uppercase hover:bg-orange-100 transition-colors">
            See All
          </button>
        </div>

        <div className="flex gap-6 overflow-x-auto px-5 pb-6 no-scrollbar">
          {filteredProperties.slice(0, 3).map((property, index) => (
            <div
              key={`rec-${property.id}`}
              className="relative min-w-[280px] w-72 bg-white rounded-[2rem] p-3 shadow-[0_15px_40px_rgba(0,0,0,0.06)] border border-gray-50 group hover:-translate-y-2 transition-transform duration-500"
            >
              <div className="relative h-48 rounded-[1.6rem] overflow-hidden mb-4">
                <img
                  src={property.image}
                  alt={property.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl flex items-center gap-1.5 border border-white/20 shadow-lg">
                  <FaStar className="text-orange-500 text-[10px]" />
                  <span className="text-xs font-black text-gray-900">
                    {property.rating}
                  </span>
                </div>
                <button
                  onClick={(e) => toggleFavorite(e, property.id)}
                  className="absolute top-3 right-3 w-10 h-10 bg-white/90 backdrop-blur-md rounded-2xl flex items-center justify-center shadow-lg active:scale-75 transition-transform"
                >
                  <FaHeart
                    className={`text-base transition-colors ${favorites.includes(property.id) ? "text-red-500" : "text-gray-300"}`}
                  />
                </button>

                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <h3 className="text-lg font-bold leading-tight line-clamp-1">
                    {property.title}
                  </h3>
                  <div className="flex items-center gap-1 opacity-90">
                    <FaMapMarkerAlt className="text-[10px]" />
                    <span className="text-xs font-medium">
                      {typeof property.location === "object"
                        ? property.location.area
                        : property.location?.split(",")[0]}
                    </span>
                  </div>
                </div>
              </div>

              <div className="px-2 pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex gap-4">
                    <div className="flex items-center gap-1.5 text-gray-500">
                      <FaBed className="text-sm text-gray-400" />
                      <span className="text-sm font-bold text-gray-700">
                        {property.beds}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-gray-500">
                      <FaBath className="text-sm text-gray-400" />
                      <span className="text-sm font-bold text-gray-700">
                        {property.baths}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-baseline gap-0.5">
                    <span className="text-xs font-bold text-orange-600">₹</span>
                    <span className="text-xl font-black text-gray-900">
                      {property.price}
                    </span>
                    <span className="text-[10px] font-bold text-gray-400">
                      /mo
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Featured Properties (Vertical List) */}
      <div className="px-5 animate-[fadeInUp_1.2s_ease-out]">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-black text-gray-900">Nearby You</h2>
          <button className="text-gray-400 text-sm font-bold hover:text-orange-600">
            View All
          </button>
        </div>

        <div className="space-y-4">
          {filteredProperties.map((property) => (
            <div
              key={`list-${property.id}`}
              className="bg-white p-3 rounded-[1.8rem] flex gap-4 shadow-[0_10px_30px_rgba(0,0,0,0.03)] border border-gray-50 active:scale-[0.98] transition-all group"
            >
              <div className="relative w-28 h-28 rounded-2xl overflow-hidden shrink-0">
                <img
                  src={property.image}
                  alt={property.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-1.5 left-1.5 bg-orange-500 text-white px-2 py-0.5 rounded-lg text-[8px] font-black uppercase tracking-tighter">
                  New
                </div>
              </div>

              <div className="flex flex-col justify-between py-1 flex-1">
                <div>
                  <h3 className="text-base font-black text-gray-900 line-clamp-1 mb-0.5">
                    {property.title}
                  </h3>
                  <div className="flex items-center gap-1 text-gray-400">
                    <FaMapMarkerAlt className="text-[10px]" />
                    <span className="text-xs font-medium">
                      {typeof property.location === "object"
                        ? `${property.location.area}, ${property.location.city}`
                        : property.location}
                    </span>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex gap-3">
                    <span className="text-[11px] font-black text-gray-600 flex items-center gap-1">
                      <FaBed className="text-orange-600/50" /> {property.beds}
                    </span>
                    <span className="text-[11px] font-black text-gray-600 flex items-center gap-1">
                      <FaBath className="text-orange-600/50" /> {property.baths}
                    </span>
                  </div>
                  <div className="text-base font-black text-orange-600">
                    ₹{property.price}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="px-5 mt-10 mb-6 animate-[fadeInUp_1.4s_ease-out]">
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-[2.5rem] p-8 text-center shadow-2xl shadow-gray-900/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
          <div className="relative z-10">
            <h3 className="text-xl font-bold text-white mb-2">
              Ready to visit?
            </h3>
            <p className="text-gray-400 text-sm mb-6 px-4">
              Schedule a meeting with our experts to see your dream home.
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-black py-4 rounded-2xl shadow-lg shadow-orange-500/30 transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              <FaCalendarAlt />
              Schedule a Visit
            </button>
          </div>
        </div>
      </div>

      {/* Meeting Schedule Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-[fadeIn_0.3s_ease-out]">
          <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-sm overflow-hidden relative animate-[scaleIn_0.3s_ease-out]">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center bg-gray-50 hover:bg-orange-600 hover:text-white rounded-full transition-all duration-300 z-10"
            >
              <FaTimes />
            </button>

            <div className="p-6">
              <div className="text-center mb-6">
                <div className="w-14 h-14 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <FaCalendarAlt className="text-2xl text-orange-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">
                  Schedule a Visit
                </h3>
                <p className="text-xs text-gray-500">
                  Pick a time to see the property
                </p>
              </div>

              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  setIsSubmittingVisit(true);

                  try {
                    const res = await fetch(
                      `${import.meta.env.VITE_API_BASE_URL}/api/v1/schedule-visit`,
                      {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(meetingData),
                      },
                    );
                    const data = await res.json();

                    if (data.success) {
                      setIsModalOpen(false);
                      setMeetingData({
                        name: "",
                        email: "",
                        phone: "",
                        date: "",
                        time: "",
                        message: "",
                      });
                      setPopupData({
                        isOpen: true,
                        type: "success",
                        title: "Visit Scheduled!",
                        message: "We'll contact you soon to confirm.",
                      });
                    } else {
                      setPopupData({
                        isOpen: true,
                        type: "error",
                        title: "Booking Failed",
                        message: data.message || "Try again.",
                      });
                    }
                  } catch (err) {
                    setPopupData({
                      isOpen: true,
                      type: "error",
                      title: "Server Error",
                      message: "Server issue, please try later.",
                    });
                  } finally {
                    setIsSubmittingVisit(false);
                  }
                }}
                className="space-y-3"
              >
                <input
                  type="text"
                  required
                  placeholder="Full Name"
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent focus:border-orange-500 rounded-2xl outline-none text-sm font-medium"
                  value={meetingData.name}
                  onChange={(e) =>
                    setMeetingData({ ...meetingData, name: e.target.value })
                  }
                />
                <input
                  type="tel"
                  required
                  maxLength="10"
                  placeholder="Phone Number"
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent focus:border-orange-500 rounded-2xl outline-none text-sm font-medium"
                  value={meetingData.phone}
                  onChange={(e) =>
                    setMeetingData({
                      ...meetingData,
                      phone: e.target.value.replace(/\D/g, ""),
                    })
                  }
                />
                <input
                  type="email"
                  required
                  placeholder="Email Address"
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent focus:border-orange-500 rounded-2xl outline-none text-sm font-medium"
                  value={meetingData.email}
                  onChange={(e) =>
                    setMeetingData({ ...meetingData, email: e.target.value })
                  }
                />
                <div className="grid grid-cols-2 gap-3">
                  <div className="relative">
                    <FaCalendarAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
                    <input
                      type="date"
                      required
                      min={new Date().toISOString().split("T")[0]}
                      className="w-full pl-9 pr-3 py-3 bg-gray-50 border-2 border-transparent focus:border-orange-500 rounded-2xl outline-none text-xs font-medium"
                      value={meetingData.date}
                      onChange={(e) =>
                        setMeetingData({ ...meetingData, date: e.target.value })
                      }
                    />
                  </div>
                  <div className="relative">
                    <FaClock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
                    <input
                      type="time"
                      required
                      className="w-full pl-9 pr-3 py-3 bg-gray-50 border-2 border-transparent focus:border-orange-500 rounded-2xl outline-none text-xs font-medium"
                      value={meetingData.time}
                      onChange={(e) =>
                        setMeetingData({ ...meetingData, time: e.target.value })
                      }
                    />
                  </div>
                </div>
                <textarea
                  placeholder="Message (Optional)"
                  rows="2"
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent focus:border-orange-500 rounded-2xl outline-none text-sm font-medium resize-none"
                  value={meetingData.message}
                  onChange={(e) =>
                    setMeetingData({ ...meetingData, message: e.target.value })
                  }
                />

                <button
                  type="submit"
                  disabled={isSubmittingVisit}
                  className="w-full bg-orange-500 text-white py-4 rounded-2xl font-black text-sm shadow-lg shadow-orange-500/20 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isSubmittingVisit ? (
                    <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <FaPaperPlane /> Schedule Now
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Global Success/Error Popup */}
      <Popup
        isOpen={popupData.isOpen}
        onClose={() => setPopupData({ ...popupData, isOpen: false })}
        type={popupData.type}
        title={popupData.title}
        message={popupData.message}
      />

      {/* Animations & Styles */}
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        
        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default MobileHomeLayout;
