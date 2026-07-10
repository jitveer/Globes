import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FaBed,
  FaBath,
  FaRulerCombined,
  FaMapMarkerAlt,
  FaHeart,
  FaShare,
  FaPhone,
  FaEnvelope,
  FaCalendar,
  FaChevronLeft,
  FaChevronRight,
  FaChevronDown,
  FaChevronUp,
  FaHome,
  FaParking,
  FaSwimmingPool,
  FaDumbbell,
  FaTree,
  FaStar,
  FaCheck,
  FaQuestionCircle,
  FaGraduationCap,
  FaShoppingCart,
  FaBus,
  FaHospital,
  FaPlane,
  FaStore,
  FaShieldAlt,
  FaBolt,
  FaChild,
  FaUtensils,
  FaDownload,
  FaWhatsapp,
  FaMapMarkedAlt,
  FaDirections,
  FaExpand,
  FaPaperPlane,
  FaCalendarAlt,
  FaClock,
  FaTimes,
  FaRupeeSign,
} from "react-icons/fa";
import Popup from "../../components/Popup";
import SEO from "../../components/SEO";
import WhatsAppButton from "../../components/WhatsAppButton";


const iconMap = {
  FaBed,
  FaBath,
  FaRulerCombined,
  FaMapMarkerAlt,
  FaHeart,
  FaShare,
  FaPhone,
  FaEnvelope,
  FaCalendar,
  FaChevronLeft,
  FaChevronRight,
  FaChevronDown,
  FaChevronUp,
  FaHome,
  FaParking,
  FaSwimmingPool,
  FaDumbbell,
  FaTree,
  FaStar,
  FaCheck,
  FaQuestionCircle,
  FaGraduationCap,
  FaShoppingCart,
  FaBus,
  FaHospital,
  FaPlane,
  FaStore,
  FaShieldAlt,
  FaBolt,
  FaChild,
  FaUtensils,
  FaDownload,
  FaWhatsapp,
  FaMapMarkedAlt,
  FaDirections,
  FaExpand,
};

const PropertyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [selectedBhkGroup, setSelectedBhkGroup] = useState("");
  const [activeFaq, setActiveFaq] = useState(-1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showContactForm, setShowContactForm] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [isAmenitiesExpanded, setIsAmenitiesExpanded] = useState(false);
  const [isAroundProjectExpanded, setIsAroundProjectExpanded] = useState(false);
  const [isVisitModalOpen, setIsVisitModalOpen] = useState(false);
  const [isSubmittingVisit, setIsSubmittingVisit] = useState(false);
  const [visitPopupData, setVisitPopupData] = useState({
    isOpen: false,
    type: "success",
    title: "",
    message: "",
  });
  const [showVisitOtpField, setShowVisitOtpField] = useState(false);
  const [visitOtp, setVisitOtp] = useState("");
  const [isVerifyingVisit, setIsVerifyingVisit] = useState(false);
  const [popup, setPopup] = useState({
    isOpen: false,
    type: "success",
    title: "",
    message: "",
  });

  const showPopup = (type, title, message) => {
    setPopup({ isOpen: true, type, title, message });
  };
  const [meetingData, setMeetingData] = useState({
    name: "",
    email: "",
    phone: "",
    date: "",
    time: "",
    message: "",
  });

  // Form state init
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  // Helper function to format image URLs
  const getImageUrl = (imageInput) => {
    const placeholder = "https://via.placeholder.com/800x600?text=No+Image";
    if (!imageInput) return placeholder;

    // Support both old string format and new optimized object format
    const url = typeof imageInput === "string"
      ? imageInput
      : (imageInput.url || imageInput.webp || imageInput.original);

    if (!url) return placeholder;
    if (url.startsWith("http")) return url;

    // Ensure base URL doesn't have trailing slash and path has leading slash
    const baseUrl = (import.meta.env.VITE_API_BASE_URL || "").replace(
      /\/$/,
      "",
    );
    const path = url.startsWith("/") ? url : `/${url}`;

    return `${baseUrl}${path}`;
  };

  const getWhatsAppNumber = (phone) => {
    const fallbackNumber = import.meta.env.VITE_WHATSAPP_PHONE_NUMBER || "919945739702";
    const targetPhone = phone || fallbackNumber;
    const cleaned = targetPhone.replace(/\D/g, "");
    return cleaned.startsWith("91") || cleaned.length > 10 ? cleaned : `91${cleaned}`;
  };

  // Carousel drag state
  const carouselRef = useRef(null);
  const contactFormRef = useRef(null);
  const sidebarRef = useRef(null);
  const lastScrollY = useRef(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);

  // Fetch property details from API
  useEffect(() => {
    const fetchProperty = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/v1/properties/${id}`,
        );
        const result = await response.json();

        if (result.success) {
          const prop = result.data;

          // Ensure objects and arrays exist with defaults to prevent mapping or rendering errors
          prop.title = prop.title || "Property Details";
          prop.builder = prop.builder || "Developer";
          prop.description = prop.description || "";
          prop.type = prop.type || "Property";
          prop.images = prop.images || [];
          prop.plans = prop.plans || [];
          prop.features = prop.features || [];
          prop.amenities = prop.amenities || [];
          prop.surroundings = prop.surroundings || [];
          prop.faqs = prop.faqs || [];
          prop.agent = prop.agent || {
            name: "Agent",
            phone: "",
            email: "",
            image: "https://via.placeholder.com/150",
          };
          prop.location = prop.location || {
            address: "Contact Developer for details",
            city: "",
            area: "",
          };

          // Normalize images format to objects { url, alt } with absolute URLs
          prop.images = prop.images && prop.images.length > 0
            ? prop.images.map((img) => {
              if (typeof img === "string") return { url: getImageUrl(img), alt: "" };
              return {
                url: getImageUrl(img.url || img.webp || img.original || ""),
                alt: img.alt || "",
                webp: img.webp ? getImageUrl(img.webp) : "",
                thumbnail: img.thumbnail ? getImageUrl(img.thumbnail) : "",
                original: img.original ? getImageUrl(img.original) : ""
              };
            })
            : [{ url: "https://via.placeholder.com/800x600?text=No+Image", alt: "" }];

          // Map icons from iconName strings to components
          prop.features = prop.features.map((f) => ({
            ...f,
            icon: iconMap[f.iconName] || FaCheck,
          }));
          prop.amenities = prop.amenities.map((a) => ({
            ...a,
            icon: iconMap[a.iconName] || FaCheck,
          }));
          prop.surroundings = prop.surroundings.map((s) => ({
            ...s,
            icon: iconMap[s.iconName] || FaCheck,
          }));

          setProperty(prop);
          if (prop.plans.length > 0) {
            const firstPlan = prop.plans[0];
            setSelectedPlan(firstPlan);

            let firstGroup = "Other";
            const match = firstPlan.label.match(/^(\d+(\.\d+)?)\s*BHK/i);
            if (match) {
              firstGroup = `${match[1]} BHK`;
            } else {
              firstGroup = firstPlan.label;
            }
            setSelectedBhkGroup(firstGroup);
          } else {
            // Provide a dummy plan if none exists to prevent rendering crashes
            setSelectedPlan({
              id: "default",
              label: "Contact for Plan",
              price: "Ask Price",
              pricePerSqft: "",
              beds: 0,
              baths: 0,
              area_sqm: 0,
            });
            setSelectedBhkGroup("Other");
          }
        } else {
          setError(result.message || "Property not found");
        }
      } catch (err) {
        console.error("Error fetching property:", err);
        setError("Failed to load property details");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProperty();
      window.scrollTo(0, 0);
    }
  }, [id]);

  // Update message when plan changes
  useEffect(() => {
    if (selectedPlan && property) {
      setFormData((prev) => ({
        ...prev,
        message: `I'm interested in the ${selectedPlan.label} configuration of ${property.title}. Please contact me.`,
      }));
    }
  }, [selectedPlan, property]);

  // Helper functions
  const nextImage = () => {
    if (!property) return;
    setCurrentImageIndex((prev) => (prev + 1) % property.images.length);
  };

  const prevImage = () => {
    if (!property) return;
    setCurrentImageIndex(
      (prev) => (prev - 1 + property.images.length) % property.images.length,
    );
  };

  const onDragStart = (e) => {
    setIsDragging(true);
    setStartX(e.type.includes("touch") ? e.touches[0].clientX : e.clientX);
  };

  const onDragMove = (e) => {
    if (!isDragging) return;
    const currentX = e.type.includes("touch")
      ? e.touches[0].clientX
      : e.clientX;
    const offset = currentX - startX;
    setDragOffset(offset);
  };

  const onDragEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);
    if (dragOffset > 50) {
      prevImage();
    } else if (dragOffset < -50) {
      nextImage();
    }
    setDragOffset(0);
  };

  // OTP & Bot Protection States
  const [showOtpField, setShowOtpField] = useState(false);
  const [otp, setOtp] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [botField, setBotField] = useState(""); // Honeypot field

  // Dynamic sticky sidebar effect for tall content
  useEffect(() => {
    const handleScroll = () => {
      if (!sidebarRef.current) return;
      const sidebar = sidebarRef.current;
      const sidebarHeight = sidebar.offsetHeight;
      const viewportHeight = window.innerHeight;
      const currentScrollY = window.scrollY;

      // Header offset (e.g. 96px for desktop navbar)
      const topOffset = 96;

      if (sidebarHeight + topOffset + 24 <= viewportHeight) {
        sidebar.style.position = "sticky";
        sidebar.style.top = `${topOffset}px`;
        return;
      }

      sidebar.style.position = "sticky";
      if (currentScrollY > lastScrollY.current) {
        // Scrolling Down: stick to the bottom
        sidebar.style.top = `${viewportHeight - sidebarHeight - 24}px`;
      } else {
        // Scrolling Up: stick to the top
        sidebar.style.top = `${topOffset}px`;
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });
    // Run once after render to set initial state
    const timer = setTimeout(handleScroll, 100);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
      clearTimeout(timer);
    };
  }, [property]); // Re-calculate when property details load or change

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1. Bot Protection
    if (botField) return;

    // 2. Client-side Validation
    const nameRegex = /^[a-zA-Z\s]{2,50}$/;
    const phoneRegex = /^[6-9]\d{9}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!showOtpField) {
      if (!nameRegex.test(formData.name)) {
        showPopup("warning", "Invalid Name", "Please enter your name.");
        return;
      }
      if (!emailRegex.test(formData.email)) {
        showPopup("warning", "Invalid Email", "Please enter a valid email address.");
        return;
      }
      if (!phoneRegex.test(formData.phone)) {
        showPopup("warning", "Invalid Phone", "Please enter a valid 10-digit mobile number starting with 6-9.");
        return;
      }
    }

    setIsVerifying(true);

    try {
      if (!showOtpField) {
        // STEP 1: Request OTP
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
          showPopup("success", "OTP Sent", "Validation code sent to your mobile number");
        } else {
          showPopup("error", "Error", data.message || "Failed to send OTP.");
        }
      } else {
        // STEP 2: Verify OTP and Submit
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
          showPopup("success", "Success", "Thank you! Your inquiry has been submitted successfully.");
          setFormData({ name: "", email: "", phone: "", message: "" });
          setOtp("");
          setShowOtpField(false);
        } else {
          showPopup("error", "Verification Failed", data.message || "Incorrect OTP!");
        }
      }
    } catch (err) {
      showPopup("error", "Server Error", "Server error. Please verify if the backend is running.");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendOtp = async () => {
    try {
      showPopup("success", "Sending...", "Resending OTP to your mobile number");
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/otp/resend`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ recipient: formData.phone }),
        },
      );
      const data = await res.json();
      if (data.success) {
        showPopup("success", "OTP Resent", "A new validation code has been sent to your mobile number");
      } else {
        showPopup("error", "Error", data.message || "Failed to resend OTP.");
      }
    } catch (err) {
      showPopup("error", "Server Error", "Server error. Please try again.");
    }
  };

  const handleVisitSubmit = async (e) => {
    e.preventDefault();
    setIsVerifyingVisit(true);

    try {
      if (!showVisitOtpField) {
        // Send OTP
        const res = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/v1/otp/send`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ recipient: meetingData.phone, type: "sms" }),
          },
        );
        const data = await res.json();
        if (data.success) {
          setShowVisitOtpField(true);
          setVisitPopupData({
            isOpen: true,
            type: "success",
            title: "OTP Sent",
            message: "Validation code sent to your mobile number",
          });
        } else {
          setVisitPopupData({
            isOpen: true,
            type: "error",
            title: "Error",
            message: data.message || "Something went wrong.",
          });
        }
      } else {
        // Verify OTP
        const verifyRes = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/v1/otp/verify`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ recipient: meetingData.phone, otp: visitOtp }),
          },
        );
        const verifyData = await verifyRes.json();
        if (!verifyData.success) {
          setVisitPopupData({
            isOpen: true,
            type: "error",
            title: "Verification Failed",
            message: verifyData.message || "Invalid OTP!",
          });
          setIsVerifyingVisit(false);
          return;
        }

        // Submit Schedule Visit
        setIsSubmittingVisit(true);
        const res = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/v1/schedule-visit`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              ...meetingData,
              message: meetingData.message + ` (Property: ${property.title})`,
            }),
          },
        );
        const data = await res.json();
        if (data.success) {
          setIsVisitModalOpen(false);
          setMeetingData({
            name: "",
            email: "",
            phone: "",
            date: "",
            time: "",
            message: "",
          });
          setVisitOtp("");
          setShowVisitOtpField(false);
          setVisitPopupData({
            isOpen: true,
            type: "success",
            title: "Visit Scheduled!",
            message: "We'll contact you soon to confirm.",
          });
        } else {
          setVisitPopupData({
            isOpen: true,
            type: "error",
            title: "Booking Failed",
            message: data.message || "Try again.",
          });
        }
        setIsSubmittingVisit(false);
      }
    } catch (err) {
      setVisitPopupData({
        isOpen: true,
        type: "error",
        title: "Server Error",
        message: "Server issue, please try later.",
      });
    } finally {
      setIsVerifyingVisit(false);
    }
  };

  const handleVisitResendOtp = async () => {
    try {
      setVisitPopupData({ isOpen: true, type: "success", title: "Sending...", message: "Resending OTP..." });
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/otp/resend`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ recipient: meetingData.phone }),
        },
      );
      const data = await res.json();
      if (data.success) {
        setVisitPopupData({ isOpen: true, type: "success", title: "OTP Resent", message: "A new validation code has been sent." });
      } else {
        setVisitPopupData({ isOpen: true, type: "error", title: "Error", message: data.message || "Failed to resend OTP." });
      }
    } catch (err) {
      setVisitPopupData({ isOpen: true, type: "error", title: "Server Error", message: "Server error. Please try again." });
    }
  };

  const toggleFavorite = () => setIsFavorite(!isFavorite);

  // Group plans by clean BHK prefix
  const bhkGroups = {};
  if (property && property.plans) {
    property.plans.forEach(plan => {
      let groupName = "Other";
      const match = plan.label.match(/^(\d+(\.\d+)?)\s*BHK/i);
      if (match) {
        groupName = `${match[1]} BHK`;
      } else {
        groupName = plan.label;
      }
      if (!bhkGroups[groupName]) {
        bhkGroups[groupName] = [];
      }
      bhkGroups[groupName].push(plan);
    });
  }

  const groupKeys = Object.keys(bhkGroups);

  const handleBhkGroupSelect = (groupName) => {
    setSelectedBhkGroup(groupName);
    if (bhkGroups[groupName] && bhkGroups[groupName].length > 0) {
      setSelectedPlan(bhkGroups[groupName][0]);
    }
  };

  // Early returns for loading and error states
  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          {error || "Property not found"}
        </h2>
        <button
          onClick={() => navigate("/properties")}
          className="bg-orange-600 text-white px-6 py-2 rounded-lg"
        >
          Back to Properties
        </button>
      </div>
    );
  }

  const priceStr = String(selectedPlan?.price || "").trim().toLowerCase();
  const isPriceAvailable =
    priceStr &&
    priceStr !== "n/a" &&
    priceStr !== "ask price" &&
    priceStr !== "contact for price" &&
    priceStr !== "for price";

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-orange-50/20 to-gray-50 pt-4 md:pt-24 pb-12">
      <SEO
        title={property.seoTitle || property.title}
        description={property.seoDescription || (property.description ? property.description.substring(0, 150) : "View details of this amazing property on Globes Properties.")}
        keywords={property.seoKeywords || ""}
        image={property.images && property.images.length > 0 ? property.images[0].url : undefined}
        imageAlt={(property.images && property.images.length > 0 ? property.images[0].alt : "") || property.featuredImageAlt || property.title}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-6 hidden md:flex items-center gap-2 text-gray-600 hover:text-orange-600 transition-colors duration-300 group"
        >
          <FaChevronLeft className="group-hover:-translate-x-1 transition-transform duration-300" />
          <span className="font-semibold">Back to Properties</span>
        </button>

        {/* Property Header Section - DESKTOP ONLY */}
        <div className="mb-4 md:mb-5 hidden md:flex flex-col md:flex-row md:items-end justify-between gap-4 md:gap-5 animate-[fadeInUp_0.4s_ease-out]">
          <div className="space-y-1.5 md:space-y-1.5">
            <div className="flex flex-wrap items-center gap-2 md:gap-2.5">
              <h1 className="text-xl md:text-2xl font-semibold text-gray-900 leading-tight">
                {property.title}
              </h1>
              {property.isNewLaunch && (
                <span className="bg-emerald-500 text-white px-2 py-0.5 rounded-full text-[10px] md:text-[11px] font-bold flex items-center gap-1 shadow-sm">
                  <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span>
                  New Launch
                </span>
              )}
              {property.rera && (
                <span className="bg-blue-50 text-blue-600 border border-blue-200 px-1.5 py-0.5 rounded text-[9px] md:text-[9px] font-bold uppercase tracking-wider">
                  ✓ RERA
                </span>
              )}
            </div>

            <p className="text-[12px] md:text-xs font-semibold text-orange-600 uppercase tracking-wide">
              By {property.builder}
            </p>

            <div className="flex items-center gap-1.5 text-gray-500">
              <FaMapMarkerAlt className="text-orange-600 shrink-0 text-xs md:text-sm" />
              <span className="text-xs md:text-sm font-medium line-clamp-1">
                {typeof property.location === "object"
                  ? `${property.location.area}, ${property.location.city}`
                  : property.location}
              </span>
            </div>
          </div>

          <div className="flex flex-col items-start md:items-end gap-2 md:gap-2.5">
            <div className="text-left md:text-right">
              <div className="flex items-baseline gap-2 justify-start md:justify-end">
                <span className="text-xl md:text-xl font-extrabold text-gray-900 whitespace-nowrap">
                  {property.priceRange || property.price ? `₹${property.priceRange || property.price}` : "Contact for Price"}
                </span>
                {isPriceAvailable && selectedPlan?.pricePerSqft && selectedPlan.pricePerSqft !== "N/A" && (
                  <span className="text-gray-400 text-[10px] md:text-xs font-medium border-l border-gray-300 pl-2">
                    ₹{selectedPlan.pricePerSqft}/sq.ft
                  </span>
                )}
              </div>
              <p className="text-orange-600 text-xs md:text-xs font-bold mt-0.5">
                {isPriceAvailable && selectedPlan?.emi ? `EMI starts at ₹${selectedPlan.emi}` : ""}
              </p>
            </div>

            <button
              // onClick={() => navigate("/contact", { state: { scrollTo: "contact" } })}
              onClick={() => navigate("/contact")}
              className="w-full md:w-auto px-4 py-2 bg-gradient-to-r from-orange-600 to-orange-700 text-white rounded-lg md:rounded-lg font-bold text-xs md:text-xs shadow-lg hover:shadow-orange-200 md:hover:-translate-y-0.5 transition-all duration-300 active:scale-95"
            >
              Connect With Us
            </button>
          </div>
        </div>

        {/* Image Gallery */}
        <div className="mb-8 animate-[fadeInUp_0.5s_ease-out]">
          <div
            ref={carouselRef}
            onMouseDown={onDragStart}
            onMouseMove={onDragMove}
            onMouseUp={onDragEnd}
            onMouseLeave={onDragEnd}
            onTouchStart={onDragStart}
            onTouchMove={onDragMove}
            onTouchEnd={onDragEnd}
            className="relative w-full aspect-[4/3] md:aspect-auto md:h-[600px] rounded-2xl overflow-hidden shadow-2xl group cursor-grab active:cursor-grabbing"
          >
            <div
              className={`flex h-full w-full ${!isDragging ? "transition-transform duration-500 ease-out" : ""
                }`}
              style={{
                transform: `translateX(calc(-${currentImageIndex * 100
                  }% + ${dragOffset}px))`,
              }}
            >
              {property.images.map((image, index) => (
                <img
                  key={index}
                  src={image.url}
                  alt={image.alt || property.title}
                  className="w-full h-full object-cover flex-shrink-0 select-none"
                  draggable="false"
                />
              ))}
            </div>

            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none"></div>

            {/* Navigation Buttons */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                prevImage();
              }}
              className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm p-2 md:p-3 rounded-full shadow-lg hover:bg-white transition-all duration-300 md:hover:scale-110 active:scale-95 flex items-center justify-center opacity-40 md:opacity-100 hover:opacity-100 z-10"
            >
              <FaChevronLeft className="text-gray-800 text-sm md:text-base" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                nextImage();
              }}
              className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm p-2 md:p-3 rounded-full shadow-lg hover:bg-white transition-all duration-300 md:hover:scale-110 active:scale-95 flex items-center justify-center opacity-40 md:opacity-100 hover:opacity-100 z-10"
            >
              <FaChevronRight className="text-gray-800 text-sm md:text-base" />
            </button>

            {/* Image Counter */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-sm px-3 py-1 rounded-full text-white text-xs font-semibold">
              {currentImageIndex + 1} / {property.images.length}
            </div>

            {/* Action Buttons */}
            <div className="absolute top-4 right-4 flex gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsFavorite(!isFavorite);
                }}
                className="bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-lg hover:bg-white transition-all duration-300 md:hover:scale-110 active:scale-95"
              >
                <FaHeart
                  className={`${isFavorite ? "text-red-500" : "text-gray-600"
                    } transition-colors duration-300`}
                />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (navigator.share) {
                    navigator.share({
                      title: property?.title || "Globes Properties",
                      text: `Check out this amazing property: ${property?.title || ""} by ${property?.builder || "Developer"}`,
                      url: window.location.href,
                    })
                      .catch((err) => console.log("Error sharing:", err));
                  } else {
                    navigator.clipboard.writeText(window.location.href)
                      .then(() => setPopup({ isOpen: true, type: "success", title: "Copied", message: "Property link copied to clipboard!" }))
                      .catch((err) => console.error("Clipboard copy failed:", err));
                  }
                }}
                className="bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-lg hover:bg-white transition-all duration-300 md:hover:scale-110 active:scale-95"
              >
                <FaShare className="text-gray-600" />
              </button>
            </div>
          </div>

          {/* Thumbnail Gallery - Horizontally Scrollable */}
          <div className="overflow-x-auto no-scrollbar mt-2 md:mt-4">
            <div
              className={`flex gap-2 md:gap-4 py-2 px-4 md:p-4 w-max min-w-full md:justify-center ${property.images.length <= 5 ? "justify-center" : "justify-start"
                }`}
            >
              {property.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`flex-shrink-0 w-[45px] md:w-[56px] h-[34px] md:h-[36px] rounded-md md:rounded overflow-hidden transition-all duration-300 ${currentImageIndex === index
                    ? "ring-1 md:ring-2 ring-orange-600 scale-105"
                    : "hover:scale-105 opacity-70 hover:opacity-100"
                    }`}
                >
                  <img
                    src={image.thumbnail || image.url}
                    alt={image.alt || `View ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Property Header Section - MOBILE ONLY */}
        <div className="mb-6 flex md:hidden flex-col gap-4 animate-[fadeInUp_0.4s_ease-out]">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl font-bold text-gray-900 leading-tight">
                {property.title}
              </h1>
              {property.isNewLaunch && (
                <span className="bg-emerald-500 text-white px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 shadow-sm">
                  <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span>
                  New Launch
                </span>
              )}
              {property.rera && (
                <span className="bg-blue-50 text-blue-600 border border-blue-200 px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider">
                  ✓ RERA
                </span>
              )}
            </div>

            <p className="text-[12px] font-semibold text-orange-600 uppercase tracking-wide">
              By {property.builder}
            </p>

            <div className="flex items-center gap-1.5 text-gray-500">
              <FaMapMarkerAlt className="text-orange-600 shrink-0 text-xs font-bold" />
              <span className="text-xs font-medium line-clamp-1">
                {typeof property.location === "object"
                  ? `${property.location.area}, ${property.location.city}`
                  : property.location}
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <div className="text-left">
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-extrabold text-gray-900 whitespace-nowrap">
                  {property.priceRange || property.price ? `₹${property.priceRange || property.price}` : "Contact for Price"}
                </span>
                {isPriceAvailable && selectedPlan?.pricePerSqft && selectedPlan.pricePerSqft !== "N/A" && (
                  <span className="text-gray-400 text-[10px] font-medium border-l border-gray-300 pl-2">
                    ₹{selectedPlan.pricePerSqft}/sq.ft
                  </span>
                )}
              </div>
              <p className="text-orange-600 text-xs font-bold mt-0.5">
                {isPriceAvailable && selectedPlan?.emi ? `EMI starts at ₹${selectedPlan.emi}` : ""}
              </p>
            </div>

            <button
              // onClick={() => navigate("/contact", { state: { scrollTo: "contact" } })}
              onClick={() => navigate("/contact")}
              className="w-full px-5 py-2.5 bg-gradient-to-r from-orange-600 to-orange-700 text-white rounded-lg font-bold text-xs shadow-lg hover:shadow-orange-200 active:scale-95 md:hover:scale-105 transition-all duration-300"
            >
              Connect With Us
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-4 md:space-y-6">
            {/* Plan Selection Tabs */}
            <div className="mb-4 md:mb-6 animate-[fadeInUp_0.6s_ease-out] flex flex-col items-center gap-3 w-full">
              {/* Primary BHK Groups */}
              <div className="flex flex-wrap items-center justify-center gap-1.5 md:gap-2 p-1 md:p-1.5 bg-white rounded-xl md:rounded-2xl shadow-sm border border-gray-100 w-fit">
                {groupKeys.map((groupName) => (
                  <button
                    key={groupName}
                    onClick={() => handleBhkGroupSelect(groupName)}
                    className={`px-4 md:px-8 py-1.5 md:py-2.5 rounded-lg md:rounded-xl font-bold text-[11px] md:text-sm transition-all duration-300 ${selectedBhkGroup === groupName
                      ? "bg-gradient-to-r from-orange-600 to-orange-700 text-white shadow-md shadow-orange-200"
                      : "text-gray-500 hover:bg-orange-50 hover:text-orange-600"
                      }`}
                  >
                    {groupName}
                  </button>
                ))}
              </div>

              {/* Secondary Sub-configs (Specific Options) */}
              {bhkGroups[selectedBhkGroup] && bhkGroups[selectedBhkGroup].length > 0 && (
                <div className="flex flex-wrap items-center justify-center gap-1.5 md:gap-2 max-w-full px-2">
                  {bhkGroups[selectedBhkGroup].map((plan, index) => (
                    <button
                      key={`${plan.id || "plan"}-${plan.label}-${plan.area_sqm}-${index}`}
                      onClick={() => setSelectedPlan(plan)}
                      className={`px-3 py-1.5 md:px-4 md:py-2 rounded-lg border text-[10px] md:text-xs font-bold transition-all duration-300 ${selectedPlan === plan
                        ? "bg-orange-50 border-orange-500 text-orange-600 shadow-sm"
                        : "bg-white border-gray-200 text-gray-500 hover:border-orange-300 hover:text-orange-600"
                        }`}
                    >
                      {plan.label} {plan.area_sqm ? `(${plan.area_sqm} Sq.Ft)` : ""}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Property Highlights */}
            <div className="bg-white rounded-xl md:rounded-2xl shadow-lg p-4 md:p-8 animate-[fadeInUp_0.6s_ease-out]">
              {/* <div className="flex flex-wrap items-center justify-between gap-3 md:gap-4 mb-4 md:mb-8 pb-4 md:pb-6 border-b border-gray-100">
                <div className="flex flex-wrap items-center gap-2 md:gap-3">
                  <span className="bg-orange-100 text-orange-600 px-3 md:px-4 py-1 md:py-1.5 rounded-full text-[11px] md:text-sm font-bold shadow-sm">
                    {property.type}
                  </span>
                  <div className="flex items-center gap-1 bg-yellow-50 px-2 md:px-3 py-1 md:py-1.5 rounded-full shadow-sm">
                    <FaStar className="text-yellow-500 text-xs md:text-base" />
                    <span className="font-bold text-[11px] md:text-base text-gray-700">
                      {property.rating}
                    </span>
                    <span className="text-gray-400 text-[10px] md:text-sm">
                      ({property.reviews})
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 md:gap-4">
                  <button className="flex items-center gap-1.5 md:gap-2 text-gray-500 hover:text-orange-600 transition-colors font-semibold text-xs md:text-base">
                    <FaShare className="text-xs md:text-lg" /> Share
                  </button>
                  <button
                    onClick={() => setIsFavorite(!isFavorite)}
                    className={`flex items-center gap-1.5 md:gap-2 font-semibold transition-colors text-xs md:text-base ${
                      isFavorite
                        ? "text-red-500"
                        : "text-gray-500 hover:text-red-500"
                    }`}
                  >
                    <FaHeart className="text-xs md:text-lg" />{" "}
                    {isFavorite ? "Saved" : "Save"}
                  </button>
                </div>
              </div> */}

              {/* Key Features based on selected plan */}
              <div className={`grid ${isPriceAvailable ? "grid-cols-4" : "grid-cols-3"} gap-2 md:gap-8`}>
                <div className="flex flex-col items-center text-center group">
                  <div className="flex items-center justify-center w-10 md:w-14 h-10 md:h-14 bg-orange-50 group-hover:bg-orange-100 rounded-xl md:rounded-2xl mb-2 md:mb-3 shadow-sm transition-colors duration-300">
                    <FaBed className="text-orange-600 text-base md:text-2xl" />
                  </div>
                  <p className="text-sm md:text-xl font-extrabold text-gray-900 leading-none">
                    {selectedPlan?.beds || 0}
                  </p>
                  <p className="text-[9px] md:text-xs text-gray-500 font-bold uppercase tracking-wider mt-1">
                    Bedrooms
                  </p>
                </div>
                <div className="flex flex-col items-center text-center group border-x border-gray-100">
                  <div className="flex items-center justify-center w-10 md:w-14 h-10 md:h-14 bg-orange-50 group-hover:bg-orange-100 rounded-xl md:rounded-2xl mb-2 md:mb-3 shadow-sm transition-colors duration-300">
                    <FaBath className="text-orange-600 text-base md:text-2xl" />
                  </div>
                  <p className="text-sm md:text-xl font-extrabold text-gray-900 leading-none">
                    {selectedPlan?.baths || 0}
                  </p>
                  <p className="text-[9px] md:text-xs text-gray-500 font-bold uppercase tracking-wider mt-1">
                    Bathrooms
                  </p>
                </div>
                <div className="flex flex-col items-center text-center group">
                  <div className="flex items-center justify-center w-10 md:w-14 h-10 md:h-14 bg-orange-50 group-hover:bg-orange-100 rounded-xl md:rounded-2xl mb-2 md:mb-3 shadow-sm transition-colors duration-300">
                    <FaRulerCombined className="text-orange-600 text-base md:text-2xl" />
                  </div>
                  <p className="text-sm md:text-xl font-extrabold text-gray-900 leading-none">
                    {selectedPlan?.area_sqm || 0}
                  </p>
                  <p className="text-[9px] md:text-xs text-gray-500 font-bold uppercase tracking-wider mt-1">
                    Sq.Ft
                  </p>
                </div>
                {isPriceAvailable && (
                  <div className="flex flex-col items-center text-center group border-l border-gray-100">
                    <div className="flex items-center justify-center w-10 md:w-14 h-10 md:h-14 bg-orange-50 group-hover:bg-orange-100 rounded-xl md:rounded-2xl mb-2 md:mb-3 shadow-sm transition-colors duration-300">
                      <FaRupeeSign className="text-orange-600 text-base md:text-2xl" />
                    </div>
                    <p className="text-sm md:text-xl font-extrabold text-gray-900 leading-none">
                      ₹{selectedPlan?.price}
                    </p>
                    <p className="text-[9px] md:text-xs text-gray-500 font-bold uppercase tracking-wider mt-1">
                      Price
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-xl md:rounded-2xl shadow-lg p-5 md:p-8 animate-[fadeInUp_0.7s_ease-out]">
              <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-3 md:mb-4">
                Description
              </h2>
              <div className="relative">
                <p className="text-sm md:text-md text-gray-600 leading-relaxed whitespace-pre-line">
                  {isDescriptionExpanded
                    ? property.description
                    : `${property.description.slice(0, window.innerWidth < 768 ? 168 : 335)}${property.description.length > (window.innerWidth < 768 ? 168 : 335) ? "..." : ""}`}
                </p>
                {property.description.length >
                  (window.innerWidth < 768 ? 168 : 335) && (
                    <button
                      onClick={() =>
                        setIsDescriptionExpanded(!isDescriptionExpanded)
                      }
                      className="text-orange-600 font-bold text-sm mt-2 hover:text-orange-700 transition-colors duration-300"
                    >
                      {isDescriptionExpanded ? "Read Less" : "Read More"}
                    </button>
                  )}
              </div>
            </div>

            {/* Property Details */}
            <div className="bg-white rounded-xl md:rounded-2xl shadow-lg p-5 md:p-8 animate-[fadeInUp_0.8s_ease-out]">
              <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-4 md:mb-6">
                Property Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
                <div className="flex justify-between py-2 md:py-3 border-b border-gray-100">
                  <span className="text-xs md:text-sm text-gray-500 font-medium">
                    Property Type
                  </span>
                  <span className="text-xs md:text-base text-gray-900 font-semibold">
                    {property.type}
                  </span>
                </div>
                <div className="flex justify-between py-2 md:py-3 border-b border-gray-100">
                  <span className="text-xs md:text-sm text-gray-500 font-medium">
                    Launch Date
                  </span>
                  <span className="text-xs md:text-base text-gray-900 font-semibold">
                    {property.launchDate}
                  </span>
                </div>
                <div className="flex justify-between py-2 md:py-3 border-b border-gray-100">
                  <span className="text-xs md:text-sm text-gray-500 font-medium">
                    Furnished
                  </span>
                  <span className="text-xs md:text-base text-gray-900 font-semibold">
                    {property.furnished}
                  </span>
                </div>
                <div className="flex justify-between py-2 md:py-3 border-b border-gray-100">
                  <span className="text-xs md:text-sm text-gray-500 font-medium">
                    Availability
                  </span>
                  <span className="text-xs md:text-base text-green-600 font-bold">
                    {property.availability}
                  </span>
                </div>
                <div className="flex justify-between py-2 md:py-3 border-b border-gray-100">
                  <span className="text-xs md:text-sm text-gray-500 font-medium">
                    Total Floors
                  </span>
                  <span className="text-xs md:text-base text-gray-900 font-semibold">
                    {property.totalFloors}
                  </span>
                </div>
                <div className="flex justify-between py-2 md:py-3 border-b border-gray-100">
                  <span className="text-xs md:text-sm text-gray-500 font-medium">
                    Total Units
                  </span>
                  <span className="text-xs md:text-base text-gray-900 font-semibold">
                    {property.totalUnits}
                  </span>
                </div>
              </div>
            </div>

            {/* Features & Amenities */}
            <div className="bg-white rounded-xl md:rounded-2xl shadow-lg p-5 md:p-8 animate-[fadeInUp_0.9s_ease-out]">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-6 md:mb-8">
                <h2 className="text-lg md:text-xl font-black text-gray-900">
                  Amenities
                </h2>
                {/* <span className="text-[10px] md:text-xs bg-orange-50 text-orange-600 px-3 py-1 rounded-full font-bold uppercase tracking-wider">
                  Premium Quality
                </span> */}
              </div>

              <div className="grid grid-cols-3 md:grid-cols-4 gap-2 md:gap-4">
                {/* Render Features & Amenities combined with colorful style */}
                {[
                  ...(property.features || []),
                  ...(property.amenities || []),
                ].map((item, index) => {
                  const colors = [
                    "from-blue-400 to-indigo-600",
                    "from-emerald-400 to-teal-600",
                    "from-orange-400 to-red-600",
                    "from-purple-400 to-pink-600",
                    "from-sky-400 to-blue-600",
                    "from-rose-400 to-red-600",
                    "from-amber-400 to-orange-600",
                  ];
                  const itemColor = item.color || colors[index % colors.length];

                  let visibilityClass = "block";
                  if (!isAmenitiesExpanded) {
                    if (index >= 8) {
                      visibilityClass = "hidden";
                    } else if (index >= 6) {
                      visibilityClass = "hidden md:block";
                    }
                  }

                  return (
                    <div
                      key={index}
                      className={`${visibilityClass} group relative bg-white border border-gray-100 rounded-2xl md:rounded-[2rem] p-3 md:p-5 transition-all duration-500 hover:shadow-2xl hover:shadow-orange-200/50 hover:-translate-y-2 cursor-pointer overflow-hidden text-center`}
                    >
                      {/* Premium Glassmorphism Background Effect */}
                      <div
                        className={`absolute -top-10 -right-10 w-24 md:w-32 h-24 md:h-32 bg-gradient-to-br ${itemColor} opacity-[0.03] group-hover:opacity-10 rounded-full transition-opacity duration-500`}
                      ></div>

                      <div className="relative z-10 flex flex-col items-center">
                        {/* Icon with 3D shadow and gradient */}
                        <div
                          className={`w-10 h-10 md:w-16 md:h-16 mb-3 md:mb-4 rounded-xl md:rounded-2xl bg-gradient-to-br ${itemColor} flex items-center justify-center text-white shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 ease-out p-2.5 md:p-4`}
                        >
                          <item.icon className="text-xl md:text-3xl drop-shadow-[0_4px_4px_rgba(0,0,0,0.25)]" />
                        </div>

                        <h4 className="text-[10px] md:text-sm font-black text-gray-800 leading-tight group-hover:text-orange-600 transition-colors">
                          {item.label}
                        </h4>

                        <div className="mt-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <span className="text-[8px] md:text-[10px] font-bold text-orange-500 uppercase tracking-widest">
                            Available
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Show More / Show Less Button */}
              {((property.features || []).length + (property.amenities || []).length) > 6 && (
                <div className={`mt-6 text-center ${((property.features || []).length + (property.amenities || []).length) <= 8 ? "block md:hidden" : "block"}`}>
                  <button
                    onClick={() => setIsAmenitiesExpanded(!isAmenitiesExpanded)}
                    className="inline-flex items-center gap-2 px-6 py-2.5 border border-orange-600 hover:bg-orange-50 text-orange-600 rounded-xl font-bold text-xs md:text-sm transition-all duration-300 hover:shadow-md active:scale-95"
                  >
                    <span>{isAmenitiesExpanded ? "Show Less" : "Show More"}</span>
                    {isAmenitiesExpanded ? <FaChevronUp className="text-xs" /> : <FaChevronDown className="text-xs" />}
                  </button>
                </div>
              )}
            </div>

            {/* Around the Project - NEW SECTION */}
            <div className="bg-white rounded-xl md:rounded-2xl shadow-lg p-5 md:p-8 animate-[fadeInUp_0.95s_ease-out]">
              <div className="flex items-center justify-between mb-6 md:mb-8">
                <div>
                  <h2 className="text-lg md:text-xl font-black text-gray-900">
                    Around the Project
                  </h2>
                  <p className="text-[10px] md:text-xs text-gray-400 font-bold uppercase tracking-[0.2em] mt-1">
                    Nearby Facilities & Landmarks
                  </p>
                </div>
                <div className="hidden md:flex items-center gap-2 bg-orange-50 px-3 py-1.5 rounded-full">
                  <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                  <span className="text-xs font-black text-orange-600 uppercase">
                    Live View
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6">
                {property.surroundings?.map((item, index) => {
                  let visibilityClass = "block";
                  if (!isAroundProjectExpanded) {
                    if (index >= 6) {
                      visibilityClass = "hidden";
                    } else if (index >= 4) {
                      visibilityClass = "hidden md:block";
                    }
                  }

                  return (
                    <div
                      key={index}
                      className={`${visibilityClass} group relative bg-white border border-gray-100 rounded-2xl md:rounded-[2rem] p-3 md:p-5 transition-all duration-500 hover:shadow-2xl hover:shadow-orange-200/50 hover:-translate-y-2 cursor-pointer overflow-hidden`}
                    >
                      {/* 3D Background Gradient Effect */}
                      <div
                        className={`absolute -top-10 -right-10 w-24 md:w-32 h-24 md:h-32 bg-gradient-to-br ${item.color} opacity-[0.03] group-hover:opacity-10 rounded-full transition-opacity duration-500`}
                      ></div>

                      <div className="relative z-10 flex flex-col items-center text-center">
                        {/* Icon with 3D shadow effect */}
                        <div
                          className={`w-10 h-10 md:w-16 md:h-16 mb-3 md:mb-4 rounded-xl md:rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-500 ease-out p-2.5 md:p-4`}
                        >
                          <item.icon className="text-xl md:text-3xl drop-shadow-[0_4px_4px_rgba(0,0,0,0.25)]" />
                        </div>

                        <div className="space-y-0.5 md:space-y-1">
                          <p className="text-[9px] md:text-[10px] text-gray-400 font-black uppercase tracking-wider">
                            {item.type}
                          </p>
                          <h4 className="text-[11px] md:text-base font-black text-gray-900 line-clamp-1 group-hover:text-orange-600 transition-colors">
                            {item.label}
                          </h4>
                          <div className="flex items-center justify-center gap-1 mt-1 md:mt-2">
                            <div className="w-1 md:w-1.5 h-1 md:h-1.5 bg-green-500 rounded-full"></div>
                            <span className="text-[10px] md:text-sm font-bold text-gray-500">
                              {item.distance}{" "}
                              <span className="text-[8px] md:text-[10px] text-gray-300 font-medium">
                                approx.
                              </span>
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Bottom accent line */}
                      <div
                        className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r ${item.color} w-0 group-hover:w-full transition-all duration-500`}
                      ></div>
                    </div>
                  );
                })}
              </div>

              {/* Show More / Show Less Button */}
              {(property.surroundings || []).length > 4 && (
                <div className={`mt-6 text-center ${((property.surroundings || []).length) <= 6 ? "block md:hidden" : "block"}`}>
                  <button
                    onClick={() => setIsAroundProjectExpanded(!isAroundProjectExpanded)}
                    className="inline-flex items-center gap-2 px-6 py-2.5 border border-orange-600 hover:bg-orange-50 text-orange-600 rounded-xl font-bold text-xs md:text-sm transition-all duration-300 hover:shadow-md active:scale-95"
                  >
                    <span>{isAroundProjectExpanded ? "Show Less" : "Show More"}</span>
                    {isAroundProjectExpanded ? <FaChevronUp className="text-xs" /> : <FaChevronDown className="text-xs" />}
                  </button>
                </div>
              )}
            </div>

            {/* Project Location Section */}
            <div className="bg-white rounded-xl md:rounded-2xl shadow-lg p-5 md:p-8 animate-[fadeInUp_0.97s_ease-out]">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-0 md:mb-0">
                <div>
                  <h2 className="text-lg md:text-xl font-black text-gray-900 flex items-center gap-3">
                    <FaMapMarkedAlt className="text-orange-600" />
                    Project Location
                  </h2>
                  <p className="text-[10px] md:text-xs text-gray-400 font-bold uppercase tracking-[0.2em] mt-1">
                    Explore the neighborhood
                  </p>
                </div>
                <a
                  href={
                    property.location.mapUrl ||
                    `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(typeof property.location === "object" ? `${property.location.address}, ${property.location.area}, ${property.location.city}` : property.location)}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-orange-50 text-orange-600 rounded-lg font-bold text-xs md:text-sm hover:bg-orange-100 transition-all duration-300"
                >
                  <FaDirections className="text-base" />
                  Get Directions
                </a>
              </div>

              {/* Map Container */}
              <div className="relative w-full h-[250px] md:h-[400px] rounded-2xl md:rounded-[2rem] overflow-hidden border border-gray-100 shadow-inner group mt-6">
                <iframe
                  src={
                    property.location?.mapUrl?.includes("google.com/maps/embed")
                      ? property.location.mapUrl
                      : `https://maps.google.com/maps?q=${encodeURIComponent(
                        typeof property.location === "object"
                          ? `${property.location?.address}, ${property.location?.area}, ${property.location?.city}`
                          : property.location || "",
                      )}&t=&z=13&ie=UTF8&iwloc=&output=embed`
                  }
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  className="grayscale-[20%] contrast-[1.1] brightness-[0.95] group-hover:grayscale-0 transition-all duration-700"
                ></iframe>

                {/* Overlay Address Bar */}
                <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md p-3 md:p-4 rounded-xl md:rounded-2xl shadow-xl border border-white/50 flex items-center gap-3 md:gap-4 animate-[fadeInUp_0.5s_ease-out_0.5s_both]">
                  <div className="w-10 h-10 rounded-full bg-orange-600 flex items-center justify-center text-white shrink-0 shadow-lg shadow-orange-600/30">
                    <FaMapMarkerAlt />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] md:text-xs text-gray-400 font-bold uppercase tracking-wider mb-0.5">
                      Project Address
                    </p>
                    <p className="text-[11px] md:text-sm font-black text-gray-900 truncate">
                      {typeof property.location === "object"
                        ? property.location.address
                        : property.location}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Download Brochure Section */}
            {property.brochure && (
              <div className="bg-gradient-to-r from-[#1B0F05] to-[#3d2511] rounded-xl md:rounded-2xl shadow-xl p-6 md:p-10 animate-[fadeInUp_0.98s_ease-out] relative overflow-hidden group">
                {/* Decorative Background Elements */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl group-hover:bg-orange-500/20 transition-all duration-700"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-orange-500/5 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl"></div>

                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="text-center md:text-left">
                    <h3 className="text-xl md:text-3xl font-black text-white mb-2">
                      Project Brochure
                    </h3>
                    <p className="text-gray-400 text-xs md:text-base font-medium max-w-md">
                      Want to know more about the project? Download our detailed
                      brochure with all floor plans and amenities.
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      if (property.brochure) {
                        const baseUrl = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/$/, "");
                        const path = property.brochure.startsWith("/") ? property.brochure : `/${property.brochure}`;
                        const url = property.brochure.startsWith("http")
                          ? property.brochure
                          : `${baseUrl}${path}`;
                        window.open(url, "_blank");
                      } else {
                        setPopup({ isOpen: true, type: "warning", title: "Not Available", message: "Brochure not available at the moment." });
                      }
                    }}
                    className="flex items-center gap-3 px-8 py-4 bg-orange-600 hover:bg-orange-500 text-white rounded-xl font-black text-sm md:text-base shadow-lg hover:shadow-orange-500/30 transition-all duration-300 hover:-translate-y-1 active:scale-95 group/btn"
                  >
                    <FaDownload className="text-lg animate-bounce group-hover/btn:animate-none" />
                    <span>Download Now</span>
                  </button>
                </div>
              </div>
            )}

            {/* Frequently Asked Questions */}
            <div className="bg-white rounded-xl md:rounded-2xl shadow-lg p-5 md:p-8 animate-[fadeInUp_1s_ease-out]">
              <div className="flex items-center gap-2 md:gap-3 mb-6 md:mb-8">
                <div className="flex items-center justify-center w-8 md:w-10 h-8 md:h-10 bg-orange-100 rounded-lg md:rounded-xl shrink-0">
                  <FaQuestionCircle className="text-orange-600 text-sm md:text-xl" />
                </div>
                <h2 className="text-lg md:text-xl font-bold text-gray-900">
                  Frequently Asked Questions
                </h2>
              </div>

              <div className="space-y-3 md:space-y-4">
                {property.faqs.map((faq, index) => (
                  <div
                    key={index}
                    className={`border rounded-xl md:rounded-2xl transition-all duration-300 ${activeFaq === index
                      ? "border-orange-500 bg-orange-50/30"
                      : "border-gray-100 hover:border-orange-200"
                      }`}
                  >
                    <button
                      onClick={() =>
                        setActiveFaq(activeFaq === index ? -1 : index)
                      }
                      className="w-full flex items-center justify-between p-3.5 md:p-5 text-left"
                    >
                      <span
                        className={`font-bold text-[13px] md:text-base ${activeFaq === index
                          ? "text-orange-600"
                          : "text-gray-800"
                          }`}
                      >
                        {faq.question}
                      </span>
                      <div
                        className={`shrink-0 ml-2 md:ml-4 transition-transform duration-300 ${activeFaq === index ? "rotate-180" : ""
                          }`}
                      >
                        <FaChevronDown
                          className={`text-xs md:text-base ${activeFaq === index ? "text-orange-600" : "text-gray-400"}`}
                        />
                      </div>
                    </button>

                    {activeFaq === index && (
                      <div className="px-4 md:px-5 pb-4 md:pb-5 animate-[fadeIn_0.3s_ease-out]">
                        <p className="text-gray-600 text-xs md:text-base leading-relaxed border-t border-orange-100 pt-3 md:pt-4">
                          {faq.answer}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div ref={sidebarRef} className="space-y-6">
              {/* Contact Agent Card */}
              <div className="bg-white rounded-xl md:rounded-2xl shadow-lg p-5 md:p-6 animate-[fadeInUp_0.6s_ease-out]">
                <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-4">
                  Contact Agent
                </h3>
                <div className="flex items-center gap-3 md:gap-4 mb-5 md:mb-6">
                  <img
                    src={
                      property.agent?.image || "https://via.placeholder.com/150"
                    }
                    alt={property.agent?.name || "Agent"}
                    className="w-12 h-12 md:w-16 md:h-16 rounded-full object-cover ring-4 ring-orange-100"
                  />
                  <div>
                    <h4 className="font-bold text-sm md:text-base text-gray-900">
                      {property.agent?.name || "Agent"}
                    </h4>
                    <p className="text-[11px] md:text-sm text-gray-600">
                      Property Agent
                    </p>
                  </div>
                </div>

                <div className="space-y-2 md:space-y-3 mb-5 md:mb-6">
                  <a
                    href={`tel:${property.agent?.phone || ""}`}
                    className="flex items-center gap-2 md:gap-3 p-2.5 md:p-3 bg-gray-50 rounded-lg md:rounded-xl hover:bg-orange-50 transition-colors duration-300 group"
                  >
                    <FaPhone className="text-orange-600 group-hover:scale-110 transition-transform duration-300 text-xs md:text-base" />
                    <span className="text-gray-700 font-medium text-[13px] md:text-base">
                      {property.agent?.phone || "N/A"}
                    </span>
                  </a>
                  <a
                    href={`mailto:${property.agent?.email || ""}`}
                    className="flex items-center gap-2 md:gap-3 p-2.5 md:p-3 bg-gray-50 rounded-lg md:rounded-xl hover:bg-orange-50 transition-colors duration-300 group"
                  >
                    <FaEnvelope className="text-orange-600 group-hover:scale-110 transition-transform duration-300 text-xs md:text-base" />
                    <span className="text-gray-700 font-medium text-[13px] md:text-base text-wrap break-all">
                      {property.agent?.email || "N/A"}
                    </span>
                  </a>
                  <a
                    href={`https://wa.me/${getWhatsAppNumber(property.agent?.phone)}?text=Hello%20${encodeURIComponent(property.agent?.name || "Agent")},%20I'm%20interested%20in%20your%20property%20"${encodeURIComponent(property.title)}".%20Please%20share%20more%20details.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 md:gap-3 p-2.5 md:p-3 bg-[#25D366]/10 rounded-lg md:rounded-xl hover:bg-[#25D366]/20 transition-colors duration-300 group"
                  >
                    <FaWhatsapp className="text-[#25D366] group-hover:scale-110 transition-transform duration-300 text-xs md:text-base" />
                    <span className="text-gray-700 font-bold text-[13px] md:text-base">
                      WhatsApp Chat
                    </span>
                  </a>
                </div>
              </div>

              {/* Schedule Visit */}
              <div className="bg-gradient-to-br from-orange-600 to-orange-700 rounded-2xl shadow-lg p-6 text-white animate-[fadeInUp_0.7s_ease-out]">
                <div className="flex items-center gap-3 mb-4">
                  <FaCalendar className="text-2xl" />
                  <h3 className="text-xl font-bold">Schedule a Visit</h3>
                </div>
                <p className="text-orange-100 mb-4">
                  Book a property tour at your convenience
                </p>
                <button
                  onClick={() => setIsVisitModalOpen(true)}
                  className="w-full bg-white text-orange-600 py-3 rounded-xl font-semibold hover:bg-orange-50 transition-all duration-300 shadow-lg hover:shadow-xl md:hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
                >
                  <FaCalendarAlt />
                  Book Visit
                </button>
              </div>

              {/* Contact Form */}
              <div className="bg-white rounded-xl md:rounded-2xl shadow-lg p-5 md:p-6 animate-[fadeInUp_0.3s_ease-out]">
                <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-4">
                  Send Inquiry
                </h3>
                <form
                  onSubmit={handleSubmit}
                  className="space-y-3 md:space-y-4"
                >
                  <input
                    type="text"
                    value={botField}
                    onChange={(e) => setBotField(e.target.value)}
                    className="hidden"
                    tabIndex="-1"
                    autoComplete="off"
                  />
                  <input
                    type="text"
                    placeholder="Your Name"
                    disabled={showOtpField}
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full px-4 py-2.5 md:py-3 border-2 border-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300 text-xs md:text-sm disabled:bg-gray-50"
                    required
                  />
                  <input
                    type="email"
                    placeholder="Your Email"
                    disabled={showOtpField}
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full px-4 py-2.5 md:py-3 border-2 border-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300 text-xs md:text-sm disabled:bg-gray-50"
                    required
                  />

                  {!showOtpField && (
                    <div className="space-y-3 md:space-y-4 animate-[fadeIn_0.3s_ease-out]">
                      <input
                        type="tel"
                        placeholder="Your Phone"
                        maxLength="10"
                        inputMode="numeric"
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            phone: e.target.value.replace(/\D/g, ""),
                          })
                        }
                        className="w-full px-4 py-2.5 md:py-3 border-2 border-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300 text-xs md:text-sm"
                        required
                      />
                      <textarea
                        placeholder="Your Message"
                        value={formData.message}
                        onChange={(e) =>
                          setFormData({ ...formData, message: e.target.value })
                        }
                        rows="3"
                        className="w-full px-4 py-2.5 md:py-3 border-2 border-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300 resize-none text-xs md:text-sm"
                        required
                      ></textarea>
                    </div>
                  )}

                  {showOtpField && (
                    <div className="animate-[slideUp_0.4s_ease-out] bg-orange-50 p-4 border-2 border-orange-200 rounded-xl">
                      <label className="block text-center text-[10px] font-bold text-orange-600 mb-2 uppercase tracking-widest">
                        Mobile Verification OTP
                      </label>
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
                        className="w-full px-4 py-2 border-2 border-orange-500 rounded-lg focus:ring-4 focus:ring-orange-500/10 outline-none bg-white text-center text-2xl font-black tracking-[8px] placeholder:tracking-normal"
                      />
                    </div>
                  )}

                  <div className="flex flex-col gap-3">
                    <button
                      type="submit"
                      disabled={isVerifying}
                      className="w-full bg-gradient-to-r from-orange-600 to-orange-700 text-white py-2.5 md:py-3 rounded-lg md:rounded-xl font-bold text-xs md:text-sm hover:from-orange-700 hover:to-orange-800 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {isVerifying ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <FaPaperPlane className="text-xs" />
                      )}
                      {showOtpField
                        ? "Verify & Submit"
                        : "Submit"}
                    </button>
                    {showOtpField && (
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => setShowOtpField(false)}
                          className="text-[10px] font-bold text-gray-400 hover:text-orange-600 transition-colors uppercase tracking-wider"
                        >
                          Edit Information
                        </button>
                        <span className="text-gray-300">|</span>
                        <button
                          type="button"
                          onClick={handleResendOtp}
                          className="text-[10px] font-bold text-gray-400 hover:text-orange-600 transition-colors uppercase tracking-wider"
                        >
                          Resend OTP
                        </button>
                      </div>
                    )}
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      <WhatsAppButton
        phone={property.agent?.phone}
        text={`Hello Globes Properties, I'm interested in "${property.title}". Please provide more details.`}
      />
      {/* Schedule Visit Modal */}
      {isVisitModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-[fadeIn_0.3s_ease-out]">
          <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-sm overflow-hidden relative animate-[scaleIn_0.3s_ease-out]">
            <button
              onClick={() => setIsVisitModalOpen(false)}
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
                  Property: {property.title}
                </p>
              </div>

              <form
                onSubmit={handleVisitSubmit}
                className="space-y-3"
              >
                <input
                  type="text"
                  required
                  disabled={showVisitOtpField}
                  placeholder="Full Name"
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent focus:border-orange-500 rounded-2xl outline-none text-sm font-medium disabled:bg-gray-100"
                  value={meetingData.name}
                  onChange={(e) =>
                    setMeetingData({ ...meetingData, name: e.target.value })
                  }
                />
                <input
                  type="tel"
                  required
                  disabled={showVisitOtpField}
                  maxLength="10"
                  placeholder="Phone Number"
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent focus:border-orange-500 rounded-2xl outline-none text-sm font-medium disabled:bg-gray-100"
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
                  disabled={showVisitOtpField}
                  placeholder="Email Address"
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent focus:border-orange-500 rounded-2xl outline-none text-sm font-medium disabled:bg-gray-100"
                  value={meetingData.email}
                  onChange={(e) =>
                    setMeetingData({ ...meetingData, email: e.target.value })
                  }
                />

                {!showVisitOtpField && (
                  <>
                    <div className="grid grid-cols-2 gap-3 animate-[fadeIn_0.3s_ease-out]">
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
                      className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent focus:border-orange-500 rounded-2xl outline-none text-sm font-medium resize-none animate-[fadeIn_0.3s_ease-out]"
                      value={meetingData.message}
                      onChange={(e) =>
                        setMeetingData({ ...meetingData, message: e.target.value })
                      }
                    />
                  </>
                )}

                {showVisitOtpField && (
                  <div className="animate-[slideUp_0.4s_ease-out] bg-orange-50 p-4 border-2 border-orange-200 rounded-xl">
                    <label className="block text-center text-[10px] font-bold text-orange-600 mb-2 uppercase tracking-widest">
                      Mobile Verification OTP
                    </label>
                    <input
                      type="text"
                      required
                      maxLength="4"
                      inputMode="numeric"
                      value={visitOtp}
                      onChange={(e) =>
                        setVisitOtp(e.target.value.replace(/\D/g, ""))
                      }
                      placeholder="••••"
                      className="w-full px-4 py-2 border-2 border-orange-500 rounded-lg focus:ring-4 focus:ring-orange-500/10 outline-none bg-white text-center text-2xl font-black tracking-[8px] placeholder:tracking-normal"
                    />
                  </div>
                )}

                <div className="flex flex-col gap-3">
                  <button
                    type="submit"
                    disabled={isVerifyingVisit || isSubmittingVisit}
                    className="w-full bg-orange-500 text-white py-4 rounded-2xl font-black text-sm shadow-lg shadow-orange-500/20 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isVerifyingVisit || isSubmittingVisit ? (
                      <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <>
                        <FaPaperPlane /> {showVisitOtpField ? "Verify & Schedule" : "Schedule Now"}
                      </>
                    )}
                  </button>
                  {showVisitOtpField && (
                    <div className="flex items-center justify-center gap-3">
                      <button
                        type="button"
                        onClick={() => setShowVisitOtpField(false)}
                        className="text-[10px] font-bold text-gray-400 hover:text-orange-600 transition-colors uppercase tracking-wider"
                      >
                        Edit Information
                      </button>
                      <span className="text-gray-300">|</span>
                      <button
                        type="button"
                        onClick={handleVisitResendOtp}
                        className="text-[10px] font-bold text-gray-400 hover:text-orange-600 transition-colors uppercase tracking-wider"
                      >
                        Resend OTP
                      </button>
                    </div>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Visit Success/Error Popup */}
      <Popup
        isOpen={visitPopupData.isOpen}
        onClose={() => setVisitPopupData({ ...visitPopupData, isOpen: false })}
        type={visitPopupData.type}
        title={visitPopupData.title}
        message={visitPopupData.message}
      />
      <Popup
        isOpen={popup.isOpen}
        onClose={() => setPopup({ ...popup, isOpen: false })}
        type={popup.type}
        title={popup.title}
        message={popup.message}
      />
    </div>
  );
};



export default PropertyDetails;