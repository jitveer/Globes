import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
const domainName = import.meta.env.VITE_DOMAIN;

import {
  FaSearch,
  FaMapMarkerAlt,
  FaHome,
  FaBuilding,
  FaWarehouse,
  FaTree,
  FaBed,
  FaBath,
  FaRulerCombined,
  FaHeart,
  FaStar,
  FaPhone,
  FaEnvelope,
  FaCheckCircle,
  FaUsers,
  FaAward,
  FaHandshake,
  FaChevronRight,
  FaPlay,
  FaWhatsapp,
  FaChevronDown,
  FaPaperPlane,
  FaTimes,
  FaCalendarAlt,
  FaClock,
} from "react-icons/fa";
import { MdApartment } from "react-icons/md";
import Footer from "../../../components/Footer";
import Popup from "../../../components/Popup";
import { useRef } from "react";

const CountUp = ({ end, duration = 2000, suffix = "", decimals = 0 }) => {
  const [count, setCount] = useState(0);
  const countRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 },
    );

    if (countRef.current) {
      observer.observe(countRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      setCount(progress * end);
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }, [isVisible, end, duration]);

  return (
    <span ref={countRef}>
      {count.toFixed(decimals)}
      {suffix}
    </span>
  );
};

const getYouTubeEmbedUrl = (url) => {
  if (!url) return "";
  let videoId = "";
  try {
    if (url.includes("youtu.be/")) {
      videoId = url.split("youtu.be/")[1].split(/[?#]/)[0];
    } else if (url.includes("youtube.com/watch")) {
      const urlParams = new URLSearchParams(new URL(url).search);
      videoId = urlParams.get("v");
    } else if (url.includes("youtube.com/embed/")) {
      videoId = url.split("youtube.com/embed/")[1].split(/[?#]/)[0];
    } else if (url.includes("youtube.com/shorts/")) {
      videoId = url.split("youtube.com/shorts/")[1].split(/[?#]/)[0];
    } else {
      videoId = url;
    }
  } catch (e) {
    videoId = url;
  }
  if (!videoId) return "";
  return `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&controls=0&playlist=${videoId}&playsinline=1&showinfo=0&rel=0&modestbranding=1`;
};

const DesktopHomeLayout = () => {
  const getWhatsAppNumber = () => {
    const rawNumber = import.meta.env.VITE_WHATSAPP_PHONE_NUMBER || "919945739702";
    const cleanNumber = rawNumber.replace(/\D/g, "");
    return cleanNumber.startsWith("91") || cleanNumber.length > 10 ? cleanNumber : `91${cleanNumber}`;
  };
  const whatsappPhone = getWhatsAppNumber();

  const [showVideoAd, setShowVideoAd] = useState(true);
  const [adVideoUrl, setAdVideoUrl] = useState("https://www.youtube.com/watch?v=dQw4w9WgXcQ"); // Add your YouTube video URL here
  const [showPopupAd, setShowPopupAd] = useState(false);
  const [popupAdImageUrl, setPopupAdImageUrl] = useState("");
  const [popupAdRedirectUrl, setPopupAdRedirectUrl] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [favorites, setFavorites] = useState([]);
  const [latestRealProperties, setLatestRealProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [activeFaq, setActiveFaq] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmittingVisit, setIsSubmittingVisit] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [popupData, setPopupData] = useState({
    isOpen: false,
    type: "success",
    title: "",
    message: "",
  });
  const [meetingData, setMeetingData] = useState({
    name: "",
    email: "",
    phone: "",
    date: "",
    time: "",
    message: "",
  });
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/properties?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate("/properties");
    }
  };

  const testimonials = [
    {
      name: "Shreeshail Manami",
      role: "Homeowner",
      image:
        "https://lh3.googleusercontent.com/a/ACg8ocJTHue4lq6qXnsy4ZFV3mM3uhjoI53tzSZxXKOMly9-xSLqxg=w40-h40-p-rp-mo-br100",
      rating: 5,
      text: "Absolutely delighted! From the first call to the property visit, everything was handled with professionalism. Their team helped me understand the local market, and I found a flat that ticks all my boxes. Highly recommend. thank You team..",
    },
    {
      name: "Akshatha Arthanur P",
      role: "Investor",
      image:
        "https://lh3.googleusercontent.com/a/ACg8ocKLny0hSt1Ee1C7Fu4pW0W3GSjo67rR1q2vR4xLcYxKoHKTZbI=w40-h40-p-rp-mo-br100",
      rating: 5,
      text: "Buying property in Bangalore was overwhelming, but Globes Properties made it easy with virtual tours and constant updates. Thank you, team, and all the best...",
    },
    {
      name: "Adarsh Adarsh",
      role: "First-time Buyer",
      image:
        "https://lh3.googleusercontent.com/a/ACg8ocKBxCc4PerTSr0stJU5ZLPlXHK3-wSql9f-tyGkjdiTF3d_pA=w79-h79-p-rp-mo-br100",
      rating: 5,
      text: "MNM MB ELEGANT has one of the best 3BHK layouts I’ve seen. Excellent utilization of every sq.ft. thank u globes properties",
    },
    {
      name: "Vishwanath Hiremath",
      role: "Property Seller",
      image:
        "https://lh3.googleusercontent.com/a-/ALV-UjW-41xGHzCZFo1KEfptJc1Nuu8BF1v0sAo0O4q5ecnOYuiSiA1O=w40-h40-p-rp-mo-br100",
      rating: 5,
      text: "MNM SHREEVARI SANNIDHI has a very premium vibe. From 24/7 security to power backup, every detail is carefully taken care of. Thank u globes properties",
    },
    {
      name: "Rakesh Nuchchi",
      role: "Commercial Buyer",
      image:
        "https://lh3.googleusercontent.com/a/ACg8ocJxJdtPOZo54btQ8iNl-ulMPDL8NusIgzQObDYiMIJb3rC2pw=w40-h40-p-rp-mo-br100",
      rating: 5,
      text: "Nice selection of properties and easy communication with the team. Some projects were under construction, but they gave us full clarity. Thank u globes properties",
    },
    {
      name: "Supriya Hiremath",
      role: "Apartment Buyer",
      image:
        "https://lh3.googleusercontent.com/a/ACg8ocIPgwa4W_xlZnWKSpjnW_SrWBXfs93ti6SlYC9v90RGXnIfKw=w40-h40-p-rp-mo-br100",
      rating: 5,
      text: "My 3BHK flat in Ashoka Nagar at MNM MB ELEGANT was a great investment. Beautifully planned with an open kitchen and lots of ventilation. Thank u globes properties",
    },
  ];

  // --- OTP & Bot Protection States ---
  const [showOtpField, setShowOtpField] = useState(false);
  const [otp, setOtp] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [botField, setBotField] = useState(""); // Honeypot field

  // Hero slider images
  const heroSlides = [
    {
      image:
        "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920&h=800&fit=crop",
      title: "Find Your Dream Home",
      subtitle: "Discover the perfect property that matches your lifestyle",
    },
    {
      image:
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1920&h=800&fit=crop",
      title: "Luxury Living Spaces",
      subtitle: "Experience premium properties in prime locations",
    },
    {
      image:
        "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1920&h=800&fit=crop",
      title: "Your Perfect Investment",
      subtitle: "Smart real estate choices for a better future",
    },
  ];

  // Auto-slide hero
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const categories = [
    { id: "all", icon: FaHome, label: "All Properties", count: "500+" },
    { id: "house", icon: FaHome, label: "Houses", count: "150+" },
    { id: "apartment", icon: MdApartment, label: "Apartments", count: "200+" },
    { id: "warehouse", icon: FaWarehouse, label: "Commercial", count: "100+" },
    { id: "land", icon: FaTree, label: "Land", count: "50+" },
  ];

  const stats = [
    { icon: FaHome, end: 3000, suffix: "+", label: "Properties Listed" },
    { icon: FaUsers, end: 700, suffix: "+", label: "Happy Clients" },
    { icon: FaAward, end: 10, suffix: "+", label: "Awards Won" },
    { icon: FaHandshake, end: 100, suffix: "%", label: "Satisfaction" },
  ];

  const features = [
    {
      icon: FaCheckCircle,
      title: "Verified Properties",
      description: "All properties are verified and authenticated",
    },
    {
      icon: FaUsers,
      title: "Expert Agents",
      description: "Professional agents to guide you",
    },
    {
      icon: FaAward,
      title: "Best Prices",
      description: "Competitive pricing and great deals",
    },
    {
      icon: FaHandshake,
      title: "Trusted Service",
      description: "Reliable and transparent process",
    },
  ];

  const toggleFavorite = (id) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((fav) => fav !== id) : [...prev, id],
    );
  };

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

  const fetchLatestProperties = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/properties`,
      );
      const data = await res.json();
      if (data.success) {
        // Sort by newest first and take 6
        const sorted = data.data
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 6);

        setLatestRealProperties(sorted);
      }
    } catch (error) {
      console.error("Failed to load latest properties:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSettings = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/settings`
      );
      const data = await res.json();
      if (data.success && data.data) {
        if (data.data.homePageAdVideoUrl) {
          setAdVideoUrl(data.data.homePageAdVideoUrl);
        }
        if (data.data.popupAdImage) {
          setPopupAdImageUrl(getImageUrl(data.data.popupAdImage));
          if (data.data.popupAdUrl) {
            setPopupAdRedirectUrl(data.data.popupAdUrl);
          }
          setTimeout(() => {
            setShowPopupAd(true);
          }, 5000);
        }
      }
    } catch (error) {
      console.error("Failed to load settings:", error);
    }
  };

  useEffect(() => {
    fetchLatestProperties();
    fetchSettings();
  }, []);

  const filteredProperties =
    activeCategory === "all"
      ? latestRealProperties
      : latestRealProperties.filter(
        (p) => p.property_type?.toLowerCase() === activeCategory,
      );

  // Search Suggestions Logic
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

      setSuggestions(matched.slice(0, 8));
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
    <div className="min-h-screen bg-white mt-1 md:mt-20">
      {/* Hero Section with Slider */}
      <section className="relative h-[400px] md:h-[600px] lg:h-[700px] z-20">
        {/* Slides */}
        {heroSlides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${index === currentSlide ? "opacity-100" : "opacity-0"
              }`}
          >
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent"></div>
          </div>
        ))}

        {/* Content */}
        <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center py-10 md:py-0">
          <div className="w-full max-w-2xl animate-[fadeInUp_1s_ease-out]">
            <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-4 sm:mb-6 leading-tight">
              {heroSlides[currentSlide].title}
            </h1>
            <p className="text-sm sm:text-lg md:text-xl text-gray-200 mb-6 sm:mb-8">
              {heroSlides[currentSlide].subtitle}
            </p>

            {/* Search Bar */}
            <div className="bg-white/95 backdrop-blur-md rounded-2xl p-4 md:p-6 shadow-2xl">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
                <div className="relative md:col-span-2">
                  <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search properties or locations..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    onFocus={() =>
                      searchQuery.length > 1 && setShowSuggestions(true)
                    }
                    className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300 text-sm sm:text-base"
                  />

                  {/* Suggestions Dropdown */}
                  {showSuggestions && suggestions.length > 0 && (
                    <div
                      className="absolute left-0 right-0 mt-2 bg-white/95 backdrop-blur-md rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-[1000] animate-[fadeIn_0.2s_ease-out]"
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
                            className="w-full px-4 py-3 flex items-center gap-4 md:hover:bg-orange-50 transition-colors group border-b border-gray-50 last:border-0"
                          >
                            <div
                              className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${item.type === "property" ? "bg-orange-100 text-orange-600" : "bg-blue-100 text-blue-600"}`}
                            >
                              {item.type === "property" ? (
                                <FaHome />
                              ) : (
                                <FaMapMarkerAlt />
                              )}
                            </div>
                            <div className="text-left">
                              <p className="font-semibold text-gray-900 group-hover:text-orange-600 transition-colors">
                                {item.label}
                              </p>
                              {item.sub && (
                                <p className="text-xs text-gray-500 flex items-center gap-1">
                                  <FaMapMarkerAlt className="text-[10px]" />{" "}
                                  {item.sub}
                                </p>
                              )}
                              <p className="text-[10px] text-gray-400 uppercase tracking-wider font-bold mt-0.5">
                                {item.type}
                              </p>
                            </div>
                            <FaChevronRight className="ml-auto text-gray-300 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                <button
                  onClick={handleSearch}
                  className="bg-orange-600 text-white py-3 px-6 rounded-xl md:hover:bg-orange-700 transition-all duration-300 md:hover:scale-[1.02] active:scale-95 shadow-lg md:hover:shadow-orange-600/30 text-sm sm:text-base"
                >
                  Search Properties
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Slide Indicators */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-2 rounded-full transition-all duration-300 ${index === currentSlide ? "w-8 bg-orange-600" : "w-2 bg-white/50"
                }`}
            />
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-8 md:py-12 bg-gradient-to-r from-orange-600 to-orange-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-4 md:grid-cols-4 gap-6 md:gap-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                className={`text-center text-white animate-[fadeInUp_${0.5 + index * 0.1
                  }s_ease-out] md:hover:scale-110 transition-transform duration-300`}
              >
                <stat.icon className="text-xl md:text-4xl mx-auto mb-3 opacity-90" />
                <div className="text-base font-bold mb-2 md:text-4xl">
                  <CountUp end={stat.end} suffix={stat.suffix} />
                </div>
                <div className="text-orange-100 text-xs md:text-base">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      {/* <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 animate-[fadeInUp_0.6s_ease-out]">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Browse by Category
            </h2>
            <p className="text-lg text-gray-600">
              Find the perfect property type for your needs
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {categories.map((category, index) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`p-6 rounded-2xl transition-all duration-300 md:hover:scale-105 md:hover:shadow-xl group
                  ${
                    activeCategory === category.id
                      ? "bg-orange-600 text-white shadow-lg shadow-orange-600/30"
                      : "bg-white text-gray-700 shadow-md md:hover:shadow-lg"
                  }
                  animate-[slideUp_${0.7 + index * 0.1}s_ease-out]
                `}
              >
                <category.icon
                  className={`text-4xl mx-auto mb-3 transition-transform duration-300 group-hover:scale-110 ${
                    activeCategory === category.id
                      ? "text-white"
                      : "text-orange-600"
                  }`}
                />
                <h3 className="font-semibold mb-1">{category.label}</h3>
                <p
                  className={`text-sm ${
                    activeCategory === category.id
                      ? "text-orange-100"
                      : "text-gray-500"
                  }`}
                >
                  {category.count}
                </p>
              </button>
            ))}
          </div>
        </div>
      </section> */}

      {/* Featured Properties */}
      <section className="py-12 pb-4 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-row sm:flex-row justify-betwee  items-start sm:items-center gap-2 md:gap-6 mb-4 md:mb-10 md:mb-16 animate-[fadeInUp_0.6s_ease-out]">
            <div className="">
              <h2 className="text-xl md:text-3xl font-extrabold text-gray-900 mb-2 tracking-tight">
                Featured Properties
              </h2>
              <p className="text-xs md:text-base text-gray-600 font-medium">
                Handpicked premium properties just for you
              </p>
            </div>
            <button
              onClick={() => navigate("/properties")}
              className="flex sm:hidden items-center gap-1 md:gap-2 text-xs md:text-sm text-orange-600 font-bold md:bg-orange-50 px-1 md:px-4 py-2 rounded-full text-sm self-center md:self-end"
            >
              View All
              <FaChevronRight className="text-xs" />
            </button>
            <button
              onClick={() => navigate("/properties")}
              className="hidden sm:flex items-center gap-2 text-orange-600 font-bold md:hover:text-orange-700 transition-colors duration-300 group bg-orange-50 px-4 py-2 rounded-full"
            >
              View All
              <FaChevronRight className="group-hover:translate-x-1 transition-transform duration-300" />
            </button>
          </div>

          {/* Mobile/Tablet: horizontal scroll | Desktop: 3-col grid */}
          <div className="no-scrollbar flex lg:grid lg:grid-cols-3 gap-4 lg:gap-8 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0">
            {latestRealProperties.map((property, index) => (
              <div
                key={property._id}
                onClick={() => navigate(`/property/${property._id}`)}
                className={`bg-white rounded-2xl shadow-lg md:hover:shadow-2xl transition-all duration-500 md:hover:scale-105 md:hover:-translate-y-2 group overflow-hidden cursor-pointer animate-[fadeInUp_${0.8 + index * 0.1
                  }s_ease-out] flex-shrink-0 w-[78vw] sm:w-[42vw] lg:w-auto`}
              >
                {/* Image */}
                <div className="relative overflow-hidden h-48 md:h-64">
                  <img
                    src={getImageUrl(property.images?.[0])}
                    alt={property.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                  {/* Badges */}
                  <div className="absolute top-2 left-2 bg-orange-600 text-white px-3 py-1 rounded-full text-xs md:text-sm font-medium md:font-semibold shadow-lg">
                    Featured
                  </div>

                  {/* Favorite */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(property._id);
                    }}
                    className="absolute top-2 right-2 w-7 md:w-10 h-7 md:h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg md:hover:scale-110 transition-all duration-300 active:scale-95"
                  >
                    <FaHeart
                      className={`transition-colors duration-300 ${favorites.includes(property._id)
                        ? "text-red-500"
                        : "text-gray-400"
                        }`}
                    />
                  </button>

                  {/* Type Badge */}
                  <div className="absolute bottom-2 left-2 md:bottom-4 md:left-4 bg-white/90 backdrop-blur-sm px-1.5 md:px-3 py-0.5 md:py-1.5 rounded-lg flex items-center gap-1 md:gap-2 shadow-md">
                    <FaHome className="text-orange-600 text-sm" />
                    <span className="md:text-sm text-xs font-semibold text-gray-700">
                      {property.type}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="pt-1 px-2 md:px-4  md:p-2">
                  {/* Title */}
                  <h3 className="text-base md:text-xl font-bold text-gray-900 mb-1 md:mb-2 line-clamp-1 group-hover:text-orange-600 transition-colors">
                    {property.title}
                  </h3>

                  {/* Location & Rating */}
                  <div className="flex justify-between items-start mb-1 md:mb-4">
                    <div className="flex items-center gap-2 text-gray-600">
                      <FaMapMarkerAlt className="text-orange-600" />
                      <span className=" md:font-medium text-xs md:text-sm">
                        {typeof property.location === "object"
                          ? `${property.location.area}, ${property.location.city}`
                          : property.location}
                      </span>
                    </div>
                    <div className="flex items-start gap-1 bg-orange-50 px-2 py-1 rounded-lg self-start">
                      <FaStar className="text-orange-600 text-sm" />
                      <span className="font-semibold text-sm md:text-base md:text-gray-700">
                        {property.rating || "4.5"}
                      </span>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="flex gap-4 mb-4 text-gray-600">
                    <div className="flex items-center gap-2">
                      <FaBed className="text-orange-600" />
                      <span className="md:font-medium text-xs md:text-sm">
                        {property.beds || property.plans?.[0]?.beds || 0} Beds
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaBath className="text-orange-600" />
                      <span className="md:font-medium text-xs md:text-sm">
                        {property.baths || property.plans?.[0]?.baths || 0} Baths
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaRulerCombined className="text-orange-600" />
                      <span className="md:font-medium text-xs md:text-sm">
                        {property.area_sqm ||
                          property.plans?.[0]?.area_sqm ||
                          0}{" "}
                        sqft
                      </span>
                    </div>
                  </div>

                  {/* Price & Button */}
                  {/* <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-1 md:pt-4 border-t border-gray-100">
                    <div>
                      <p className="text-xs sm:text-sm text-gray-500 mb-0.5">
                        Starting from
                      </p>
                      <p className="text-sm md:text-xl font-black text-gray-900">
                        ₹{property.priceRange || property.price || "Contact"}
                        {property.priceRange && (
                          <span className="text-base sm:text-lg font-normal text-gray-500 ml-1">
                            K
                          </span>
                        )}
                      </p>
                    </div>
                    <button className="w-full sm:w-auto bg-orange-600 text-white px-6 py-2.5 rounded-xl font-bold md:hover:bg-orange-700 transition-all duration-300 md:hover:scale-[1.02] active:scale-95 shadow-md md:hover:shadow-orange-600/20 text-sm">
                      View Details
                    </button>
                  </div> */}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 md:mt-12 text-center">
            <button
              onClick={() => navigate("/properties")}
              className="inline-flex items-center gap-2 bg-orange-600 text-white px-2 md:px-6 sm:px-10 py-3 md:py-3.5 sm:py-4 rounded-xl font-medium md:font-bold text-xs md:text-base sm:text-lg md:hover:bg-orange-700 transition-all duration-300 md:hover:scale-[1.05] active:scale-95 shadow-xl md:hover:shadow-orange-600/30 hidden md:block"
            >
              View All Properties
            </button>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-0 md:py-20 bg-gradient-to-br from-gray-50 to-orange-50/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-4 md:mb-12 md:mb-16 animate-[fadeInUp_0.6s_ease-out]">
            <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-4 tracking-tight">
              Why Choose Globes Properties
            </h2>
            <p className="text-sm md:text-base text-gray-600">
              Your trusted partner in finding the perfect property
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 ">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`bg-white p-4 md:p-8 rounded-2xl shadow-lg md:hover:shadow-2xl transition-all duration-500 md:hover:scale-105 md:hover:-translate-y-2 group animate-[fadeInUp_${0.8 + index * 0.1
                  }s_ease-out]`}
              >
                <div className="w-8 h-8 md:w-16 md:h-16 bg-orange-100 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-orange-600 transition-colors duration-300">
                  <feature.icon className="text-3xl text-orange-600 group-hover:text-white transition-colors duration-300" />
                </div>
                <h3 className="text-md md:text-xl font-bold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-xs md:text-sm">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Video Section */}
      {/* <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="animate-[fadeInLeft_0.8s_ease-out]">
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Experience Virtual Tours
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                Explore properties from the comfort of your home with our
                immersive virtual tours. Get a real feel of the space before you
                visit.
              </p>
              <ul className="space-y-4 mb-8">
                {[
                  "360° Virtual Property Tours",
                  "HD Quality Images & Videos",
                  "Detailed Floor Plans",
                  "Neighborhood Insights",
                ].map((item, index) => (
                  <li
                    key={index}
                    className="flex items-center gap-3 text-gray-700"
                  >
                    <FaCheckCircle className="text-orange-600 text-xl" />
                    <span className="font-medium">{item}</span>
                  </li>
                ))}
              </ul>
              <button className="bg-orange-600 text-white px-8 py-3 rounded-lg font-semibold md:hover:bg-orange-700 transition-all duration-300 md:hover:scale-105 active:scale-95 shadow-lg md:hover:shadow-xl">
                Start Virtual Tour
              </button>
            </div>

            <div className="relative animate-[fadeInRight_0.8s_ease-out]">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl group">
                <img
                  src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=600&fit=crop"
                  alt="Virtual Tour"
                  className="w-full h-96 object-cover"
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors duration-300"></div>
                <button className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-2xl md:hover:scale-110 transition-transform duration-300 group">
                  <FaPlay className="text-orange-600 text-2xl ml-1" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section> */}

      {/* Testimonials Section */}
      <section className="py-12 md:py-20 bg-white hidden md:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 md:mb-16 animate-[fadeInUp_0.6s_ease-out]">
            <h2 className="text-3xl md:text-3xl font-extrabold text-gray-900 mb-4 tracking-tight">
              What Our Clients Say
            </h2>
            <p className="text-base md:text-base text-gray-600">
              Don't just take our word for it - hear from our satisfied clients
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className={`bg-gradient-to-br from-white to-orange-50/30 p-8 rounded-2xl shadow-lg md:hover:shadow-2xl transition-all duration-500 md:hover:scale-105 md:hover:-translate-y-2 group animate-[fadeInUp_${0.8 + index * 0.1
                  }s_ease-out] border border-gray-100`}
              >
                {/* Quote Icon */}
                <div className="text-6xl text-orange-200 font-serif leading-none mb-4 group-hover:text-orange-300 transition-colors duration-300">
                  "
                </div>

                {/* Rating */}
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <FaStar
                      key={i}
                      className="text-orange-500 text-lg animate-[pulse_2s_ease-in-out_infinite]"
                      style={{ animationDelay: `${i * 0.1}s` }}
                    />
                  ))}
                </div>

                {/* Testimonial Text */}
                <p className="text-gray-700 mb-6 leading-relaxed italic">
                  {testimonial.text}
                </p>

                {/* Client Info */}
                <div className="flex items-center gap-4 pt-6 border-t border-gray-200">
                  <div className="relative">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-14 h-14 rounded-full object-cover ring-4 ring-orange-100 group-hover:ring-orange-200 transition-all duration-300"
                    />
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white"></div>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 group-hover:text-orange-600 transition-colors duration-300">
                      {testimonial.name}
                    </h4>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Trust Indicators */}
          <div className="mt-12 pt-12 border-t border-gray-200">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div className="animate-[fadeInUp_1s_ease-out]">
                <div className="text-4xl font-bold text-orange-600 mb-2">
                  <CountUp end={4.8} decimals={1} suffix="/5" />
                </div>
                <p className="text-gray-600">Average Rating</p>
              </div>
              <div className="animate-[fadeInUp_1.1s_ease-out]">
                <div className="text-4xl font-bold text-orange-600 mb-2">
                  <CountUp end={400} suffix="+" />
                </div>
                <p className="text-gray-600">Happy Clients</p>
              </div>
              <div className="animate-[fadeInUp_1.2s_ease-out]">
                <div className="text-4xl font-bold text-orange-600 mb-2">
                  <CountUp end={20} suffix="+" />
                </div>
                <p className="text-gray-600">5-Star Reviews</p>
              </div>
              <div className="animate-[fadeInUp_1.3s_ease-out]">
                <div className="text-4xl font-bold text-orange-600 mb-2">
                  <CountUp end={100} suffix="%" />
                </div>
                <p className="text-gray-600">Satisfaction</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-gradient-to-br from-gray-50 to-orange-50/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 animate-[fadeInUp_0.6s_ease-out]">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-sm md:text-base text-gray-600">
              Find answers to common questions about buying, selling, and
              renting properties
            </p>
          </div>

          <div className="space-y-4">
            {[
              {
                question: "How do I start the home buying process?",
                answer:
                  "Starting your home buying journey is easy! First, determine your budget and get pre-approved for a mortgage. Then, browse our extensive property listings and schedule viewings for homes that interest you. Our expert agents will guide you through every step, from making an offer to closing the deal.",
              },
              {
                question: "What documents do I need to buy a property?",
                answer:
                  "You'll typically need: Valid ID proof (Aadhar, PAN card), Address proof, Income proof (salary slips, ITR), Bank statements for the last 6 months, and Pre-approved loan letter (if applicable). Our team will provide you with a complete checklist based on your specific situation.",
              },
              {
                question: "How long does it take to sell a property?",
                answer:
                  "The timeline varies based on market conditions, property location, and pricing. On average, properties listed with us sell within 30-60 days. We use advanced marketing strategies, professional photography, and virtual tours to attract serious buyers quickly.",
              },
              {
                question: "Do you charge any fees for property search?",
                answer:
                  "Browsing properties and initial consultations are completely free! We only charge a commission when a successful transaction is completed. Our transparent pricing ensures you know exactly what to expect with no hidden fees.",
              },
              {
                question: "Can I schedule a virtual tour of properties?",
                answer:
                  "Absolutely! We offer high-quality 360° virtual tours for most of our properties. You can explore homes from the comfort of your current location. Simply click on the 'Virtual Tour' button on any property listing or contact our team to schedule a live video walkthrough.",
              },
              {
                question: "What areas do you cover?",
                answer:
                  "We have extensive coverage across Bangalore, Mumbai, Delhi, and surrounding areas. Our network includes prime residential and commercial locations. If you're looking for properties in other cities, our partner network can assist you.",
              },
              {
                question: "How do I know if a property is verified?",
                answer:
                  "All properties on our platform undergo rigorous verification. We check legal documents, ownership records, and property history. Verified properties are marked with a 'Verified' badge. Our legal team ensures all documentation is authentic and up-to-date.",
              },
              {
                question: "What is your refund policy for booking amounts?",
                answer:
                  "Booking amounts are refundable as per the agreement terms. Typically, if the seller backs out, you receive a full refund. If you cancel, refund terms depend on the stage of the transaction. We always recommend reviewing the agreement carefully before making any payments.",
              },
            ].map((faq, index) => (
              <div
                key={index}
                className={`bg-white rounded-2xl shadow-md md:hover:shadow-xl transition-all duration-300 overflow-hidden animate-[fadeInUp_${0.7 + index * 0.05
                  }s_ease-out]`}
              >
                <button
                  onClick={() =>
                    setActiveFaq(activeFaq === index ? null : index)
                  }
                  className="w-full px-6 py-5 flex justify-between items-center text-left md:hover:bg-orange-50/50 transition-colors duration-300 group"
                >
                  <h3 className="text-sm md:text-lg font-semibold text-gray-900 pr-8 group-hover:text-orange-600 transition-colors duration-300">
                    {faq.question}
                  </h3>
                  <FaChevronDown
                    className={`text-orange-600 text-xl flex-shrink-0 transition-transform duration-300 ${activeFaq === index ? "rotate-180" : ""
                      }`}
                  />
                </button>
                <div
                  className={`overflow-hidden transition-all duration-500 ease-in-out ${activeFaq === index
                    ? "max-h-96 opacity-100"
                    : "max-h-0 opacity-0"
                    }`}
                >
                  <div className="px-6 pb-5 pt-2">
                    <p className="text-xs md:text-base text-gray-600 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Still have questions CTA */}
          <div className="mt-12 text-center bg-white rounded-2xl p-8 shadow-lg animate-[fadeInUp_1.2s_ease-out]">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
              Still Have Questions?
            </h3>
            <p className="text-gray-600 mb-6 text-sm md:text-base">
              Our team is here to help! Reach out to us anytime.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="tel:+919945739702"
                className="bg-orange-600 text-white px-3 md:px-8 py-3.5 rounded-xl font-bold md:hover:bg-orange-700 transition-all duration-300 md:hover:scale-105 active:scale-95 shadow-lg flex items-center justify-center gap-2 flex-1 sm:flex-initial"
              >
                <FaPhone />
                Call Us Now
              </a>
              <a
                href={`https://wa.me/${whatsappPhone}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-green-500 text-white px-3 md:px-8 py-3.5 rounded-xl font-bold md:hover:bg-green-600 transition-all duration-300 md:hover:scale-105 active:scale-95 shadow-lg flex items-center justify-center gap-2 flex-1 sm:flex-initial"
              >
                <FaWhatsapp />
                WhatsApp Us
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 md:mb-16 animate-[fadeInUp_0.6s_ease-out]">
            <h2 className="text-3xl md:text-3xl font-extrabold text-gray-900 mb-4 tracking-tight">
              Get In Touch
            </h2>
            <p className="text-base md:text-base text-gray-600">
              Fill out the form below and our team will get back to you within
              24 hours
            </p>
          </div>

          <div className="bg-gradient-to-br from-white to-orange-50/30 rounded-3xl shadow-2xl p-6 sm:p-8 md:p-12 border border-gray-100 animate-[fadeInUp_0.8s_ease-out]">
            <form
              onSubmit={async (e) => {
                e.preventDefault();

                // 1. Bot Protection: Check Honeypot (Silent rejection for bots)
                if (botField) return;

                // 2. Client-side Validation Logic
                const nameRegex = /^[a-zA-Z\s]{2,50}$/;
                const phoneRegex = /^[6-9]\d{9}$/;
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

                if (!showOtpField) {
                  if (!nameRegex.test(formData.name)) {
                    setPopupData({
                      isOpen: true,
                      type: "warning",
                      title: "Invalid Name",
                      message: "Please enter a valid name (only letters are allowed).",
                    });
                    return;
                  }
                  if (!emailRegex.test(formData.email)) {
                    setPopupData({
                      isOpen: true,
                      type: "warning",
                      title: "Invalid Email",
                      message: "Please enter a valid email address.",
                    });
                    return;
                  }
                  if (!phoneRegex.test(formData.phone)) {
                    setPopupData({
                      isOpen: true,
                      type: "warning",
                      title: "Invalid Phone",
                      message: "Please enter a valid 10-digit mobile number starting with 6-9.",
                    });
                    return;
                  }
                }

                setIsVerifying(true);

                try {
                  if (!showOtpField) {
                    // STEP 1: Request OTP from Backend
                    const res = await fetch(
                      `${import.meta.env.VITE_API_BASE_URL}/api/v1/inquiries/request-otp`,
                      {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(formData),
                      },
                    );
                    const data = await res.json();

                    if (data.success) {
                      setShowOtpField(true);
                      setPopupData({
                        isOpen: true,
                        type: "success",
                        title: "OTP Sent",
                        message: "OTP Sent successfully! Please check your email.",
                      });
                    } else {
                      setPopupData({
                        isOpen: true,
                        type: "error",
                        title: "Error",
                        message: data.message || "There was a problem sending the OTP. Please try again.",
                      });
                    }
                  } else {
                    // STEP 2: Verify OTP and Submit Inquiry
                    const res = await fetch(
                      `${import.meta.env.VITE_API_BASE_URL}/api/v1/inquiries/verify-otp`,
                      {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ email: formData.email, otp }),
                      },
                    );
                    const data = await res.json();

                    if (data.success) {
                      setPopupData({
                        isOpen: true,
                        type: "success",
                        title: "Success",
                        message: "Thank you! Your inquiry has been submitted successfully.",
                      });
                      setFormData({
                        name: "",
                        email: "",
                        phone: "",
                        message: "",
                      });
                      setOtp("");
                      setShowOtpField(false);
                    } else {
                      setPopupData({
                        isOpen: true,
                        type: "error",
                        title: "Verification Failed",
                        message: data.message || "Incorrect OTP! Please enter the correct OTP.",
                      });
                    }
                  }
                } catch (err) {
                  setPopupData({
                    isOpen: true,
                    type: "error",
                    title: "Server Error",
                    message: "Server error. Please verify if the backend is running.",
                  });
                } finally {
                  setIsVerifying(false);
                }
              }}
              className="space-y-6"
            >
              {/* Invisible Bot Protection (Honeypot) */}
              <input
                type="text"
                value={botField}
                onChange={(e) => setBotField(e.target.value)}
                className="hidden"
                tabIndex="-1"
                autoComplete="off"
              />

              {/* Name and Email Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wider">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    disabled={showOtpField}
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="Enter your name"
                    className="w-full px-4 py-3 border-2 border-gray-100 rounded-2xl focus:border-orange-500 outline-none transition-all disabled:bg-gray-50 text-gray-800"
                  />
                </div>
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wider">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    disabled={showOtpField}
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    placeholder="example@mail.com"
                    className="w-full px-4 py-3 border-2 border-gray-100 rounded-2xl focus:border-orange-500 outline-none transition-all disabled:bg-gray-50 text-gray-800"
                  />
                </div>
              </div>

              {/* Phone and Message - Only visible before OTP */}
              {!showOtpField && (
                <div className="space-y-6 animate-[fadeIn_0.5s_ease-out]">
                  <div className="group">
                    <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wider">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      maxLength="10"
                      pattern="[6-9][0-9]{9}"
                      inputMode="numeric"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          phone: e.target.value.replace(/\D/g, ""),
                        })
                      }
                      placeholder="e.g. 9876543210"
                      className="w-full px-4 py-3 border-2 border-gray-100 rounded-2xl focus:border-orange-500 outline-none transition-all text-gray-800"
                    />
                  </div>
                  <div className="group">
                    <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wider">
                      Your Message *
                    </label>
                    <textarea
                      required
                      value={formData.message}
                      onChange={(e) =>
                        setFormData({ ...formData, message: e.target.value })
                      }
                      placeholder="I am interested in..."
                      rows="3"
                      className="w-full px-4 py-3 border-2 border-gray-100 rounded-2xl focus:border-orange-500 outline-none transition-all resize-none text-gray-800"
                    ></textarea>
                  </div>
                </div>
              )}

              {/* OTP Input - Highly Professional Layout */}
              {showOtpField && (
                <div className="animate-[slideUp_0.5s_ease-out] bg-orange-50 border-2 border-orange-200 rounded-3xl p-8 shadow-inner">
                  <label className="block text-center text-xs font-black text-orange-600 mb-6 uppercase tracking-[5px]">
                    Verification Required
                  </label>
                  <div className="flex flex-col items-center gap-6">
                    <div className="relative">
                      <input
                        type="text"
                        required
                        maxLength="4"
                        inputMode="numeric"
                        value={otp}
                        onChange={(e) =>
                          setOtp(e.target.value.replace(/\D/g, ""))
                        }
                        placeholder="••••"
                        className="w-full max-w-[280px] px-4 py-5 border-2 border-orange-500 rounded-2xl focus:ring-8 focus:ring-orange-500/10 outline-none bg-white text-center text-4xl font-black tracking-[15px] placeholder:tracking-normal placeholder:opacity-30"
                      />
                    </div>
                    <p className="text-gray-500 text-sm font-medium text-center">
                      A special OTP has been sent to{" "}
                      <span className="text-orange-600 font-bold">
                        {formData.phone}
                      </span>.
                    </p>
                  </div>
                </div>
              )}

              {/* Submission Controls */}
              <div className="flex flex-col items-center gap-5 pt-4">
                <button
                  type="submit"
                  disabled={isVerifying}
                  className="w-auto min-w-[200px] md:min-w-[300px] bg-gradient-to-r from-orange-600 to-orange-700 text-white px-2 md:px-12 py-4 rounded-2xl font-black text-base md:text-lg shadow-2xl md:hover:from-orange-700 md:hover:to-orange-800 transition-all duration-300 transform md:hover:scale-105 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3"
                >
                  {isVerifying ? (
                    <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <FaPaperPlane className="text-xl" />
                  )}
                  {showOtpField ? "VERIFY & SUBMIT" : "SUBMIT"}
                </button>

                {showOtpField && (
                  <button
                    type="button"
                    onClick={() => setShowOtpField(false)}
                    className="text-gray-500 md:hover:text-orange-600 text-sm font-bold transition-colors underline underline-offset-4"
                  >
                    Not your email? Edit Details
                  </button>
                )}
              </div>
            </form>

            {/* Contact Info */}
            <div className="mt-10 pt-10 border-t border-gray-200">
              <div className="grid grid-cols-3 md:grid-cols-1 md:grid-cols-3 gap-3 md:gap-6 text-center">
                <a
                  href="tel:+919945739702"
                  className="group md:hover:scale-105 transition-transform duration-300"
                >
                  <div className="w-14 h-14 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-orange-600 transition-colors duration-300">
                    <FaPhone className="text-orange-600 text-xl group-hover:text-white transition-colors duration-300" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-1">Phone</h4>
                  <p className="text-gray-600 text-xs md:text-base">
                    +91 9945739702
                  </p>
                </a>
                <a
                  href="https://mail.google.com/mail/?view=cm&fs=1&to=contact@globesproperties.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group md:hover:scale-105 transition-transform duration-300"
                >
                  <div className="w-14 h-14 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-orange-600 transition-colors duration-300">
                    <FaEnvelope className="text-orange-600 text-xl group-hover:text-white transition-colors duration-300" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-1">Email</h4>
                  <p className="text-gray-600 break-all text-xs md:text-sm ">
                    contact@globesproperties.com
                  </p>
                </a>
                <a
                  href="https://maps.app.goo.gl/tYdi1ASnkGYgqUre7"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group md:hover:scale-105 transition-transform duration-300"
                >
                  <div className="w-14 h-14 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-orange-600 transition-colors duration-300">
                    <FaMapMarkerAlt className="text-orange-600 text-xl group-hover:text-white transition-colors duration-300" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-1">Location</h4>
                  <p className="text-gray-600 text-xs">Bangalore, India</p>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-8 md:py-24 bg-gradient-to-r from-orange-600 to-orange-700 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[60%] rounded-full bg-white blur-3xl"></div>
          <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[60%] rounded-full bg-white blur-3xl"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="animate-[fadeInUp_0.6s_ease-out]">
            <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-6 tracking-tight">
              Ready to Find Your Dream Home?
            </h2>
            <p className="text-sm md:text-base text-orange-100 mb-10 max-w-2xl mx-auto font-medium">
              Let our expert team help you find the perfect property that
              matches your needs and budget.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6">
              <a
                href="tel:+919945739702"
                className="bg-white text-orange-600 px-10 py-4 rounded-xl font-bold md:hover:bg-gray-50 transition-all duration-300 md:hover:scale-105 active:scale-95 shadow-xl flex items-center justify-center gap-2"
              >
                <FaPhone />
                Contact Us Now
              </a>
              <button
                onClick={() => setIsModalOpen(true)}
                className="bg-transparent border-2 border-white text-white px-10 py-4 rounded-xl font-bold md:hover:bg-white md:hover:text-orange-600 transition-all duration-300 md:hover:scale-105 active:scale-95 flex items-center justify-center gap-2 shadow-lg"
              >
                <FaCalendarAlt />
                Schedule a Visit
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Quick Links</h2>
          <div className="flex flex-wrap justify-center gap-4">
            {[
              { title: 'Apartments in Rachenahalli', url: 'https://globesproperties.com/apartments-in-rachenahalli/' },
              { title: 'Apartments in Yelahanka', url: 'https://globesproperties.com/apartments-in-yelahanka' },
              { title: 'Apartments in Thanisandra', url: 'https://globesproperties.com/apartments-in-thanisandra/' },
            ].map((link, index) => (
              <a
                key={index}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white border border-gray-200 text-gray-700 hover:text-orange-600 hover:border-orange-600 hover:shadow-md transition-all duration-300 px-6 py-3 rounded-full font-medium text-sm md:text-base"
              >
                {link.title}
              </a>
            ))}
          </div>
        </div>
      </section>

      <Footer />

      {/* Animations */}
      <style>{`
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

        @keyframes fadeInRight {
          from {
            opacity: 0;
            transform: translateX(30px);
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
      `}</style>

      {/* Advertisement Popup Modal */}
      {showPopupAd && popupAdImageUrl && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-[fadeIn_0.3s_ease-out]">
          <div className="relative bg-white rounded-2xl shadow-2xl overflow-hidden max-w-4xl w-full aspect-[4/3] animate-[scaleIn_0.3s_ease-out] flex justify-center items-center">
            <button
              onClick={() => setShowPopupAd(false)}
              className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center bg-black/50 text-white md:hover:bg-orange-600 rounded-full transition-all duration-300 z-20"
            >
              <FaTimes />
            </button>
            {popupAdRedirectUrl ? (
              <a href={popupAdRedirectUrl} target="_blank" rel="noopener noreferrer" className="w-full h-full block" onClick={() => setShowPopupAd(false)}>
                <img
                  src={popupAdImageUrl}
                  alt="Advertisement"
                  className="w-full h-full object-cover"
                />
              </a>
            ) : (
              <img
                src={popupAdImageUrl}
                alt="Advertisement"
                className="w-full h-full object-cover"
              />
            )}
          </div>
        </div>
      )}

      {/* Meeting Schedule Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-[fadeIn_0.3s_ease-out]">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden relative animate-[scaleIn_0.3s_ease-out]">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center bg-gray-100 md:hover:bg-orange-600 md:hover:text-white rounded-full transition-all duration-300 z-10"
            >
              <FaTimes />
            </button>

            <div className="p-6 sm:p-8">
              <div className="text-center mb-6 sm:mb-8">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <FaCalendarAlt className="text-2xl sm:text-3xl text-orange-600" />
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-gray-900">
                  Schedule a Visit
                </h3>
                <p className="text-sm sm:text-base text-gray-600">
                  Pick a convenient time to discuss your dream property
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
                        message:
                          "Your visit has been scheduled successfully. Our team will contact you soon to confirm.",
                      });
                    } else {
                      setPopupData({
                        isOpen: true,
                        type: "error",
                        title: "Booking Failed",
                        message:
                          data.message ||
                          "Something went wrong. Please try again.",
                      });
                    }
                  } catch (err) {
                    setPopupData({
                      isOpen: true,
                      type: "error",
                      title: "Server Error",
                      message:
                        "Unable to connect to server. Please check your connection and try again.",
                    });
                  } finally {
                    setIsSubmittingVisit(false);
                  }
                }}
                className="space-y-4"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] sm:text-xs font-bold text-gray-500 uppercase tracking-wider">
                      Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={meetingData.name}
                      onChange={(e) =>
                        setMeetingData({ ...meetingData, name: e.target.value })
                      }
                      placeholder="Your Name"
                      className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent focus:border-orange-500 rounded-xl outline-none transition-all text-sm"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] sm:text-xs font-bold text-gray-500 uppercase tracking-wider">
                      Phone *
                    </label>
                    <input
                      type="tel"
                      required
                      maxLength="10"
                      inputMode="numeric"
                      value={meetingData.phone}
                      onChange={(e) =>
                        setMeetingData({
                          ...meetingData,
                          phone: e.target.value.replace(/\D/g, ""),
                        })
                      }
                      placeholder="e.g. 9876543210"
                      className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent focus:border-orange-500 rounded-xl outline-none transition-all text-sm"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] sm:text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={meetingData.email}
                    onChange={(e) =>
                      setMeetingData({ ...meetingData, email: e.target.value })
                    }
                    placeholder="example@mail.com"
                    className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent focus:border-orange-500 rounded-xl outline-none transition-all text-sm"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] sm:text-xs font-bold text-gray-500 uppercase tracking-wider">
                      Preferred Date *
                    </label>
                    <div className="relative">
                      <FaCalendarAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="date"
                        required
                        value={meetingData.date}
                        min={new Date().toISOString().split("T")[0]}
                        onChange={(e) =>
                          setMeetingData({
                            ...meetingData,
                            date: e.target.value,
                          })
                        }
                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border-2 border-transparent focus:border-orange-500 rounded-xl outline-none transition-all text-sm"
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] sm:text-xs font-bold text-gray-500 uppercase tracking-wider">
                      Preferred Time *
                    </label>
                    <div className="relative">
                      <FaClock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="time"
                        required
                        value={meetingData.time}
                        onChange={(e) =>
                          setMeetingData({
                            ...meetingData,
                            time: e.target.value,
                          })
                        }
                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border-2 border-transparent focus:border-orange-500 rounded-xl outline-none transition-all text-sm"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] sm:text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Message (Optional)
                  </label>
                  <textarea
                    rows="2"
                    value={meetingData.message}
                    onChange={(e) =>
                      setMeetingData({
                        ...meetingData,
                        message: e.target.value,
                      })
                    }
                    placeholder="Any specific property you're interested in?"
                    className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent focus:border-orange-500 rounded-xl outline-none transition-all resize-none text-sm"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={isSubmittingVisit}
                  className="w-full bg-orange-600 text-white py-4 rounded-xl font-bold md:hover:bg-orange-700 transition-all duration-300 shadow-lg md:hover:shadow-orange-600/30 flex items-center justify-center gap-2 mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmittingVisit ? (
                    <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <FaPaperPlane />
                  )}
                  {isSubmittingVisit ? "Scheduling..." : "Book Visit Now"}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Schedule Visit Popup */}
      <Popup
        isOpen={popupData.isOpen}
        onClose={() => setPopupData({ ...popupData, isOpen: false })}
        type={popupData.type}
        title={popupData.title}
        message={popupData.message}
      />

      {/* Floating Video Ad Popup (Desktop Only, above WhatsApp button) */}
      {showVideoAd && (
        <div className="fixed bottom-32 right-8 z-50 hidden lg:block w-80 bg-white/95 backdrop-blur-md p-1.5 rounded-2xl shadow-2xl border border-gray-200/50 animate-[slideInRight_1.5s_cubic-bezier(0.19,1,0.22,1)]">
          <div className="relative w-full aspect-video rounded-xl overflow-hidden">
            {/* Close Button */}
            <button
              onClick={() => setShowVideoAd(false)}
              className="absolute top-2 right-2 w-8 h-8 bg-black/70 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-all duration-300 z-[60] shadow-md backdrop-blur-sm cursor-pointer"
              title="Close Ad"
            >
              <FaTimes className="text-xs" />
            </button>
            <iframe
              src={getYouTubeEmbedUrl(adVideoUrl)}
              title="Advertisement"
              className="w-full h-full rounded-xl border-0 pointer-events-none"
              allow="autoplay; encrypted-media"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      )}

      {/* Add new animations for modal */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(100px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
};

export default DesktopHomeLayout;