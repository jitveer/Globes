import {
  FaListUl,
  FaFacebook,
  FaTwitter,
  FaBell,
  FaPenNib,
  FaSignOutAlt,
  FaInfoCircle,
  FaPhone,
  FaInstagram,
  FaLinkedin,
  FaUser,
  FaMapMarkerAlt,
  FaCheck,
  FaChevronDown,
  FaTags,
  FaBullhorn,
  FaHome as FaHomeIcon,
  FaExternalLinkAlt,
} from "react-icons/fa";
import { useState, useEffect, useRef } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Popup from "./Popup";

const Navbar = () => {
  const { user, logout, notifications, unreadCount, markNotificationAsRead } =
    useAuth();
  const [menubar, setMenubar] = useState(false);
  const [locationDropdown, setLocationDropdown] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState("South Bangalore");
  const [isScrolled, setIsScrolled] = useState(false);
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [visible, setVisible] = useState(true);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const notifTimeoutRef = useRef(null);

  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleLogout = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = () => {
    logout();
    navigate("/login");
  };

  const locations = [
    { id: 1, name: "South Bangalore", area: "Koramangala, HSR, BTM" },
    { id: 2, name: "North Bangalore", area: "Hebbal, Yelahanka, Manyata" },
    {
      id: 3,
      name: "East Bangalore",
      area: "Whitefield, Marathahalli, KR Puram",
    },
    {
      id: 4,
      name: "West Bangalore",
      area: "Rajajinagar, Malleshwaram, Yeshwanthpur",
    },
    {
      id: 5,
      name: "Central Bangalore",
      area: "MG Road, Indiranagar, Jayanagar",
    },
  ];

  // Sidebar Open & closed
  const menubarmenu = () => {
    setMenubar((prev) => !prev);
  };

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (menubar) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [menubar]);

  // Handle scroll to show/hide navbar
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.pageYOffset;

      // Show navbar when scrolling up or at top
      // Hide navbar when scrolling down and not at top
      const isVisible =
        prevScrollPos > currentScrollPos || currentScrollPos < 10;

      setVisible(isVisible);
      setPrevScrollPos(currentScrollPos);
      setIsScrolled(currentScrollPos > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [prevScrollPos]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setLocationDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLocationSelect = (locationName) => {
    setSelectedLocation(locationName);
    setLocationDropdown(false);
  };

  // Mobile sidebar menu classes
  const navLinkClassesMobile = ({ isActive }) =>
    [
      "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300",
      isActive
        ? "bg-orange-50 text-orange-600 font-semibold"
        : "text-gray-700 hover:bg-gray-50",
    ].join(" ");

  // Desktop navbar menu classes
  const navLinkClassesDesktop = ({ isActive }) =>
    [
      "px-4 py-2 rounded-lg transition-all duration-300 font-medium",
      isActive
        ? "text-orange-600 bg-orange-50"
        : "text-gray-700 hover:text-orange-600 hover:bg-orange-50/50",
    ].join(" ");

  return (
    <>
      {/* Mobile Header (visible on mobile only) - Always Sticky */}
      <header
        className={`lg:hidden sticky top-0 z-50 w-full px-4 py-3 bg-white flex justify-between items-center transition-shadow duration-300 ${
          isScrolled ? "shadow-lg" : "shadow-md"
        }`}
      >
        {/* Hamburger Menu Button */}
        <div
          className={`flex justify-center items-center p-2 rounded-full cursor-pointer transition-all duration-300 ${
            menubar ? "bg-orange-100" : "hover:bg-orange-50"
          }`}
          onClick={menubarmenu}
        >
          <div className="relative w-6 h-6 flex items-center justify-center">
            <span
              className={`absolute h-0.5 w-5 bg-orange-600 transition-all duration-300 ease-in-out ${
                menubar ? "rotate-45 translate-y-0" : "-translate-y-1.5"
              }`}
            ></span>
            <span
              className={`absolute h-0.5 w-5 bg-orange-600 transition-all duration-300 ease-in-out ${
                menubar ? "opacity-0 scale-0" : "opacity-100 scale-100"
              }`}
            ></span>
            <span
              className={`absolute h-0.5 w-5 bg-orange-600 transition-all duration-300 ease-in-out ${
                menubar ? "-rotate-45 translate-y-0" : "translate-y-1.5"
              }`}
            ></span>
          </div>
        </div>

        {/* Location Selector - Custom Dropdown (Mobile) */}
        <div className="relative">
          {/* <button
            onClick={() => setLocationDropdown(!locationDropdown)}
            className="flex flex-col items-center justify-center px-2 py-1 rounded-lg hover:bg-orange-50 transition-all duration-300"
          >
            <div className="text-[9px] uppercase tracking-wider text-gray-500 font-medium mb-0.5">
              Location
            </div>
            <div className="flex items-center gap-1">
              <FaMapMarkerAlt className="text-orange-600 text-xs" />
              <span className="text-sm font-bold text-gray-900">
                {selectedLocation.split(" ")[0]}
              </span>
              <FaChevronDown
                className={`text-[12px] text-orange-600 transition-transform duration-300 ${
                  locationDropdown ? "rotate-180" : ""
                }`}
              />
            </div>
          </button> */}

          <img
            src="https://globesproperties.com/wp-content/uploads/2024/10/globes_properties_logo.png"
            alt="globesproperties_logo"
            onClick={() => navigate("/")}
            className="h-7"
          />

          {/* Mobile Dropdown Menu - Full Screen Overlay */}
          {locationDropdown && (
            <>
              {/* Backdrop */}
              <div
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] animate-[fadeIn_0.3s_ease-out]"
                onClick={() => setLocationDropdown(false)}
              ></div>

              {/* Dropdown Panel */}
              <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl z-[61] animate-[slideUp_0.3s_ease-out] max-h-[70vh] overflow-hidden">
                {/* Header */}
                <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">
                      Select Location
                    </h3>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Choose your preferred area
                    </p>
                  </div>
                  <button
                    onClick={() => setLocationDropdown(false)}
                    className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
                  >
                    <svg
                      className="w-4 h-4 text-gray-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>

                {/* Locations List */}
                <div
                  className="overflow-y-auto px-4 py-3"
                  style={{ maxHeight: "calc(70vh - 80px)" }}
                >
                  {locations.map((location, index) => (
                    <button
                      key={location.id}
                      onClick={() => handleLocationSelect(location.name)}
                      className={`w-full text-left px-4 py-4 rounded-xl mb-2 transition-all duration-200 ${
                        selectedLocation === location.name
                          ? "bg-orange-50 border-2 border-orange-500"
                          : "bg-gray-50 border-2 border-transparent hover:border-orange-200"
                      } animate-[slideIn_${0.3 + index * 0.05}s_ease-out]`}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                            selectedLocation === location.name
                              ? "bg-orange-500"
                              : "bg-white"
                          }`}
                        >
                          <FaMapMarkerAlt
                            className={`text-lg ${
                              selectedLocation === location.name
                                ? "text-white"
                                : "text-orange-600"
                            }`}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <h4
                              className={`font-bold text-base ${
                                selectedLocation === location.name
                                  ? "text-orange-600"
                                  : "text-gray-900"
                              }`}
                            >
                              {location.name}
                            </h4>
                            {selectedLocation === location.name && (
                              <FaCheck className="text-orange-600 text-base shrink-0 animate-[scaleIn_0.2s_ease-out]" />
                            )}
                          </div>
                          <p className="text-sm text-gray-500 leading-relaxed">
                            {location.area}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Notification Icon */}
        <Link
          to="/notifications"
          className="relative p-2 rounded-full hover:bg-orange-50 transition-all duration-300 cursor-pointer hover:scale-110 group"
        >
          <FaBell
            size={20}
            className="text-gray-700 group-hover:text-orange-600 transition-colors duration-300 group-hover:animate-[swing_0.6s_ease-in-out]"
          />
          {unreadCount > 0 && (
            <div className="absolute -top-0.5 -right-0.5 bg-gradient-to-r from-red-500 to-pink-500 text-white text-[10px] font-bold h-5 w-5 flex items-center justify-center rounded-full shadow-lg animate-pulse">
              {unreadCount}
            </div>
          )}
        </Link>
      </header>

      {/* Desktop/Tablet Header (visible on tablet and desktop) - Smooth Hide/Show */}
      <header
        className={`hidden lg:block fixed top-0 left-0 right-0 z-50 w-full bg-white transition-all duration-500 ease-in-out ${
          visible ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
        } ${isScrolled ? "shadow-lg" : "shadow-md"}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <img
                src="https://globesproperties.com/wp-content/uploads/2024/10/globes_properties_logo.png"
                alt="Globes Properties"
                className="h-12 object-contain transition-transform duration-300 group-hover:scale-105"
              />
            </Link>

            {/* Navigation Links */}
            <nav className="flex items-center gap-1">
              <NavLink to="/" end className={navLinkClassesDesktop}>
                Home
              </NavLink>
              <NavLink to="/properties" className={navLinkClassesDesktop}>
                Properties
              </NavLink>
              <NavLink to="/blogs" className={navLinkClassesDesktop}>
                Blogs
              </NavLink>
              <NavLink to="/about" className={navLinkClassesDesktop}>
                About
              </NavLink>
              <NavLink to="/contact" className={navLinkClassesDesktop}>
                Contact
              </NavLink>
            </nav>

            {/* Right Side Actions */}
            <div className="flex items-center gap-4">
              {/* Location Selector - Custom Dropdown */}
              <div className="hidden xl:block relative">
                {/* <button
                  onClick={() => setLocationDropdown(!locationDropdown)}
                  className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 rounded-lg hover:bg-orange-50 transition-all duration-300 group"
                >
                  <FaMapMarkerAlt className="text-orange-600 group-hover:scale-110 transition-transform duration-300" />
                  <span className="text-sm font-medium text-gray-900">
                    {selectedLocation}
                  </span>
                  <FaChevronDown
                    className={`text-xs text-gray-500 transition-transform duration-300 ${
                      locationDropdown ? "rotate-180" : ""
                    }`}
                  />
                </button> */}

                {/* Dropdown Menu */}
                {locationDropdown && (
                  <div className="absolute top-full mt-2 right-0 w-80 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-50 animate-[slideDown_0.3s_ease-out]">
                    <div className="p-2 max-h-96 overflow-y-auto">
                      {locations.map((location) => (
                        <button
                          key={location.id}
                          onClick={() => handleLocationSelect(location.name)}
                          className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 hover:bg-orange-50 group ${
                            selectedLocation === location.name
                              ? "bg-orange-50"
                              : ""
                          }`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-start gap-3 flex-1">
                              <FaMapMarkerAlt
                                className={`text-xl mt-0.5 transition-colors duration-200 ${
                                  selectedLocation === location.name
                                    ? "text-orange-600"
                                    : "text-gray-400 group-hover:text-orange-600"
                                }`}
                              />
                              <div className="flex-1">
                                <div
                                  className={`font-semibold text-base mb-1 ${
                                    selectedLocation === location.name
                                      ? "text-orange-600"
                                      : "text-gray-900"
                                  }`}
                                >
                                  {location.name}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {location.area}
                                </div>
                              </div>
                            </div>
                            {selectedLocation === location.name && (
                              <FaCheck className="text-orange-600 text-base mt-1 animate-[scaleIn_0.2s_ease-out]" />
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Notification */}
              <div
                className="relative"
                onMouseEnter={() => {
                  if (unreadCount > 0) {
                    clearTimeout(notifTimeoutRef.current);
                    setShowNotifDropdown(true);
                  }
                }}
                onMouseLeave={() => {
                  notifTimeoutRef.current = setTimeout(() => {
                    setShowNotifDropdown(false);
                  }, 300);
                }}
              >
                <Link
                  to="/notifications"
                  className="relative p-2 rounded-full hover:bg-orange-50 transition-all duration-300 group block"
                >
                  <FaBell
                    size={20}
                    className="text-gray-700 group-hover:text-orange-600 transition-colors duration-300"
                  />
                  {unreadCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 bg-gradient-to-r from-red-500 to-pink-500 text-white text-[10px] font-bold h-5 w-5 flex items-center justify-center rounded-full shadow-lg animate-pulse">
                      {unreadCount}
                    </span>
                  )}
                </Link>

                {/* Desktop Notification Dropdown */}
                {showNotifDropdown && unreadCount > 0 && (
                  <div className="absolute top-full mt-2 right-0 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-[100] animate-[slideDown_0.3s_ease-out]">
                    <div className="p-4 border-b border-gray-50 flex items-center justify-between bg-orange-50/30">
                      <h3 className="font-bold text-gray-900">New Alerts</h3>
                      <span className="bg-orange-600 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
                        {unreadCount}
                      </span>
                    </div>
                    <div className="max-h-[350px] overflow-y-auto">
                      {notifications
                        .filter((n) => !n.readBy.includes(user.id || user._id))
                        .slice(0, 5)
                        .map((notif) => (
                          <div
                            key={notif._id}
                            onClick={() => {
                              markNotificationAsRead(notif._id);
                              navigate(`/notifications?id=${notif._id}`);
                              setShowNotifDropdown(false);
                            }}
                            className="p-4 hover:bg-orange-50/50 border-b border-gray-50 transition-colors cursor-pointer group/item"
                          >
                            <div className="flex gap-3">
                              <div className="shrink-0 mt-1">
                                <NotificationIcon type={notif.type} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="text-sm font-bold text-gray-900 group-hover/item:text-orange-600 transition-colors line-clamp-1">
                                  {notif.title}
                                </h4>
                                <p className="text-xs text-gray-500 line-clamp-2 mt-0.5">
                                  {notif.message}
                                </p>
                                <span className="text-[10px] text-gray-400 mt-2 block font-medium">
                                  Just now
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                    <Link
                      to="/notifications"
                      onClick={() => setShowNotifDropdown(false)}
                      className="block text-center py-3 bg-gray-50 text-orange-600 text-xs font-bold hover:bg-orange-100 transition-colors"
                    >
                      View All Notifications
                    </Link>
                  </div>
                )}
              </div>

              {/* Auth Button */}
              {user ? (
                <div className="flex items-center gap-3">
                  <Link
                    to="/user_dashboard"
                    className="flex items-center gap-2 px-6 py-2.5 bg-orange-600 text-white rounded-lg font-bold hover:bg-orange-700 transition-all shadow-md hover:shadow-lg hover:scale-105 active:scale-95"
                  >
                    <FaUser size={14} />
                    <span>My Account</span>
                  </Link>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg font-medium hover:bg-orange-700 transition-all duration-300 hover:scale-105 active:scale-95 shadow-md hover:shadow-lg"
                >
                  <FaUser size={14} />
                  <span>Login</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Sidebar Menu */}
      <div
        className={`lg:hidden fixed top-0 left-0 h-screen w-full z-[55] transition-all duration-500 ${
          menubar
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="min-h-screen flex items-start">
          {/* Backdrop */}
          <div
            className={`fixed w-full inset-0 bg-black/30 backdrop-blur-sm transition-all duration-500 ${
              menubar ? "opacity-100" : "opacity-0"
            }`}
            onClick={menubarmenu}
          ></div>

          {/* Sidebar Panel */}
          <aside
            className={`relative z-10 w-72 bg-white h-screen shadow-2xl p-6 transform transition-all duration-500 ease-out ${
              menubar ? "translate-x-0" : "-translate-x-full"
            }`}
          >
            {/* Header with Logo */}
            <div className="flex items-start justify-between mb-8">
              <a href="/" className="flex flex-col gap-2">
                <img
                  src="https://globesproperties.com/wp-content/uploads/2024/10/globes_properties_logo.png"
                  alt="Globes Properties Logo"
                  className="h-10 object-contain"
                />
              </a>

              {/* Close Button */}
              <button
                onClick={menubarmenu}
                aria-label="Close menu"
                className="p-2 rounded-lg hover:bg-gray-100 transition-all duration-300"
              >
                <div className="relative w-5 h-5 flex items-center justify-center">
                  <span className="absolute h-0.5 w-5 bg-gray-600 rotate-45"></span>
                  <span className="absolute h-0.5 w-5 bg-gray-600 -rotate-45"></span>
                </div>
              </button>
            </div>

            {/* Navigation Section */}
            <div className="mb-4">
              <div className="text-xs text-gray-400 uppercase tracking-wide font-semibold mb-3">
                Menu
              </div>
            </div>

            {/* Navigation Links */}
            <nav className="space-y-1 mb-6">
              <NavLink
                to="/"
                end
                className={navLinkClassesMobile}
                onClick={menubarmenu}
              >
                <FaHomeIcon size={18} className="shrink-0" />
                <span className="text-sm">Home</span>
              </NavLink>

              <NavLink
                to="/properties"
                className={navLinkClassesMobile}
                onClick={menubarmenu}
              >
                <FaListUl size={18} className="shrink-0" />
                <span className="text-sm">Properties</span>
              </NavLink>

              <NavLink
                to="/blogs"
                className={navLinkClassesMobile}
                onClick={menubarmenu}
              >
                <FaPenNib size={18} className="shrink-0" />
                <span className="text-sm">Blogs</span>
              </NavLink>

              <NavLink
                to="/about"
                className={navLinkClassesMobile}
                onClick={menubarmenu}
              >
                <FaInfoCircle size={18} className="shrink-0" />
                <span className="text-sm">About Us</span>
              </NavLink>

              <NavLink
                to="/contact"
                className={navLinkClassesMobile}
                onClick={menubarmenu}
              >
                <FaPhone size={18} className="shrink-0" />
                <span className="text-sm">Contact Us</span>
              </NavLink>

              <NavLink
                to="/notifications"
                className={navLinkClassesMobile}
                onClick={menubarmenu}
              >
                <div className="relative">
                  <FaBell size={18} className="shrink-0" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[9px] font-bold h-4 w-4 flex items-center justify-center rounded-full">
                      {unreadCount}
                    </span>
                  )}
                </div>
                <span className="text-sm">Notifications</span>
              </NavLink>
            </nav>

            {/* Divider */}
            <div className="border-t border-gray-200 my-4"></div>

            {/* Bottom Actions */}
            <div className="flex flex-col gap-3">
              {user ? (
                <Link
                  to="/user_dashboard"
                  className="flex items-center gap-3 px-4 py-3 rounded-xl bg-orange-600 text-white font-bold transition-all shadow-lg text-center justify-center"
                  onClick={menubarmenu}
                >
                  <FaUser size={18} className="shrink-0" />
                  <span className="text-sm">Go to Dashboard</span>
                </Link>
              ) : (
                <Link
                  to="/login"
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50 transition-all duration-300"
                  onClick={menubarmenu}
                >
                  <FaSignOutAlt size={18} className="shrink-0" />
                  <span className="text-sm font-medium">Log In</span>
                </Link>
              )}

              {/* Social Media Icons */}
              <div className="flex items-center justify-center gap-3 mt-2">
                <button className="p-2 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-all duration-300">
                  <a
                    href="https://www.facebook.com/globesproperties"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FaFacebook size={18} />
                  </a>
                </button>
                {/* <button className="p-2 rounded-lg text-gray-400 hover:text-sky-500 hover:bg-sky-50 transition-all duration-300">
                  <a
                    href="https://www.instagram.com/globesproperties/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FaTwitter size={18} />
                  </a>
                </button> */}
                <button className="p-2 rounded-lg text-gray-400 hover:text-pink-600 hover:bg-pink-50 transition-all duration-300">
                  <a
                    href="https://www.instagram.com/globesproperties/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FaInstagram size={18} />
                  </a>
                </button>
                {/* <button className="p-2 rounded-lg text-gray-400 hover:text-blue-700 hover:bg-blue-50 transition-all duration-300">
                  <a
                    href="https://www.instagram.com/globesproperties/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FaLinkedin size={18} />
                  </a>
                </button> */}
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* Animations */}
      {/* <style>{`
        @keyframes swing {
          0%,
          100% {
            transform: rotate(0deg);
          }
          10% {
            transform: rotate(15deg);
          }
          20% {
            transform: rotate(-15deg);
          }
          30% {
            transform: rotate(10deg);
          }
          40% {
            transform: rotate(-10deg);
          }
          50% {
            transform: rotate(5deg);
          }
          60% {
            transform: rotate(-5deg);
          }
          70% {
            transform: rotate(0deg);
          }
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(100%);
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

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-10px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style> */}
      <Popup
        isOpen={showLogoutConfirm}
        type="warning"
        title="Logout"
        message="Are you sure you want to log out?"
        onConfirm={confirmLogout}
        onClose={() => setShowLogoutConfirm(false)}
      />
    </>
  );
};

const NotificationIcon = ({ type }) => {
  switch (type) {
    case "offer":
      return <FaTags size={14} className="text-red-500" />;
    case "new_property":
      return <FaHomeIcon size={14} className="text-green-500" />;
    case "system":
      return <FaBullhorn size={14} className="text-blue-500" />;
    default:
      return <FaInfoCircle size={14} className="text-orange-500" />;
  }
};

export default Navbar;
