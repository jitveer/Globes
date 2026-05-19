import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  FaPlus,
  FaTimes,
  FaSave,
  FaArrowLeft,
  FaCheck,
  FaCode,
  FaFilePdf,
} from "react-icons/fa";

const BANGALORE_AREAS = [
  "Whitefield",
  "Electronic City",
  "Sarjapur Road",
  "HSR Layout",
  "Koramangala",
  "Bellandur",
  "Marathahalli",
  "Panathur",
  "Varthur",
  "Gunjur",
  "Hebbal",
  "Hennur",
  "Thanisandra",
  "Yelahanka",
  "Jakkur",
  "Devanahalli",
  "Bagalur",
  "Budigere Cross",
  "Mysore Road",
  "Kanakapura Road",
  "Bannerghatta Road",
  "JP Nagar",
  "Jayanagar",
  "Banashankari",
  "Rajajinagar",
  "Malleshwaram",
  "Indiranagar",
  "Frazer Town",
  "Kalyan Nagar",
  "Kammanahalli",
].sort();

const AddEditProperty = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;

  const [loading, setLoading] = useState(false);
  const [showJsonPreview, setShowJsonPreview] = useState(false);

  // Helper function to format image URLs
  const getImageUrl = (imageInput) => {
    const placeholder = "https://via.placeholder.com/800x600?text=No+Image";
    if (!imageInput) return placeholder;

    // Support both old string format and new optimized object format
    const url = typeof imageInput === "string" ? imageInput : imageInput.webp;

    if (!url) return placeholder;
    if (url.startsWith("http") || url.startsWith("data:")) return url;

    // Ensure base URL doesn't have trailing slash and path has leading slash
    const baseUrl = (import.meta.env.VITE_API_BASE_URL || "").replace(
      /\/$/,
      "",
    );
    const path = url.startsWith("/") ? url : `/${url}`;

    return `${baseUrl}${path}`;
  };

  // Main property state
  const [formData, setFormData] = useState({
    title: "",
    builder: "",
    rera: "",
    isNewLaunch: false,
    type: "Apartment",
    location: {
      address: "",
      city: "Bangalore",
      area: "",
      landmark: "",
      pincode: "",
      mapUrl: "",
    },
    totalFloors: "",
    totalUnits: "",
    launchDate: "",
    priceRange: "",
    description: "",
    images: [""],
    rating: 4.5,
    reviews: 0,
    furnished: "Unfurnished",
    availability: "Under Construction",
    featured: false,
    brochure: "",
  });

  // Track raw files for Multer
  const [imageFiles, setImageFiles] = useState([null]);
  const [brochureFile, setBrochureFile] = useState(null);

  // Plans state
  const [plans, setPlans] = useState([
    {
      id: "1bhk",
      label: "1 BHK",
      price: "",
      pricePerSqft: "",
      emi: "",
      beds: 1,
      baths: 1,
      area_sqm: 0,
    },
  ]);

  // Available features list
  const AVAILABLE_FEATURES = [
    {
      label: "Swimming Pool",
      iconName: "FaSwimmingPool",
      color: "from-blue-400 to-cyan-500",
    },
    {
      label: "Gym / Fitness",
      iconName: "FaDumbbell",
      color: "from-orange-400 to-red-500",
    },
    {
      label: "Car Parking",
      iconName: "FaParking",
      color: "from-gray-500 to-slate-600",
    },
    {
      label: "Garden / Park",
      iconName: "FaTree",
      color: "from-green-400 to-emerald-500",
    },
    {
      label: "24/7 Security",
      iconName: "FaShieldAlt",
      color: "from-red-400 to-pink-500",
    },
    {
      label: "Power Backup",
      iconName: "FaBolt",
      color: "from-yellow-400 to-orange-500",
    },
    {
      label: "Kids Play Area",
      iconName: "FaChild",
      color: "from-purple-400 to-indigo-500",
    },
    {
      label: "Clubhouse",
      iconName: "FaHome",
      color: "from-blue-600 to-indigo-700",
    },
    {
      label: "Cafeteria",
      iconName: "FaUtensils",
      color: "from-orange-400 to-red-500",
    },
    {
      label: "Shopping Center",
      iconName: "FaShoppingCart",
      color: "from-purple-400 to-indigo-500",
    },
    {
      label: "School Nearby",
      iconName: "FaGraduationCap",
      color: "from-blue-500 to-indigo-600",
    },
    {
      label: "Hospital Nearby",
      iconName: "FaHospital",
      color: "from-red-500 to-rose-600",
    },
    {
      label: "Bus Station",
      iconName: "FaBus",
      color: "from-yellow-500 to-amber-600",
    },
    {
      label: "Airport Nearby",
      iconName: "FaPlane",
      color: "from-sky-400 to-blue-500",
    },
    {
      label: "Market",
      iconName: "FaStore",
      color: "from-teal-400 to-green-500",
    },
  ];

  // Features state
  const [features, setFeatures] = useState([]);

  const toggleFeature = (feature) => {
    setFeatures((prev) => {
      const exists = prev.find((f) => f.label === feature.label);
      if (exists) {
        return prev.filter((f) => f.label !== feature.label);
      } else {
        return [...prev, feature];
      }
    });
  };

  // Available amenities list
  const AVAILABLE_AMENITIES = [
    { label: "24/7 Water Supply", iconName: "FaCheck" },
    { label: "CCTV Cameras", iconName: "FaShieldAlt" },
    { label: "Gated Community", iconName: "FaHome" },
    { label: "Lift", iconName: "FaBolt" },
    { label: "Fire Safety", iconName: "FaShieldAlt" },
    { label: "Rain Water Harvesting", iconName: "FaTree" },
    { label: "Maintenance Staff", iconName: "FaCheck" },
    { label: "Intercom", iconName: "FaPhone" },
  ];

  const AVAILABLE_SURROUNDINGS = [
    {
      label: "Metro Station",
      iconName: "FaBus",
      type: "Transport",
      color: "from-blue-500 to-indigo-600",
    },
    {
      label: "Hospital",
      iconName: "FaHospital",
      type: "Healthcare",
      color: "from-red-500 to-rose-600",
    },
    {
      label: "School",
      iconName: "FaGraduationCap",
      type: "Education",
      color: "from-blue-500 to-indigo-600",
    },
    {
      label: "Shopping Mall",
      iconName: "FaShoppingCart",
      type: "Shopping",
      color: "from-purple-400 to-indigo-500",
    },
    {
      label: "Airport",
      iconName: "FaPlane",
      type: "Transport",
      color: "from-sky-400 to-blue-500",
    },
    {
      label: "Super Market",
      iconName: "FaStore",
      type: "Shopping",
      color: "from-teal-400 to-green-500",
    },
    {
      label: "Park",
      iconName: "FaTree",
      type: "Recreation",
      color: "from-green-400 to-emerald-500",
    },
  ];

  // Amenities state
  const [amenities, setAmenities] = useState([]);

  const toggleAmenity = (amenity) => {
    setAmenities((prev) => {
      const exists = prev.find((a) => a.label === amenity.label);
      if (exists) {
        return prev.filter((a) => a.label !== amenity.label);
      } else {
        return [...prev, amenity];
      }
    });
  };

  // Surroundings state
  const [surroundings, setSurroundings] = useState([]);

  const toggleSurrounding = (item) => {
    setSurroundings((prev) => {
      const exists = prev.find((s) => s.label === item.label);
      if (exists) {
        return prev.filter((s) => s.label !== item.label);
      } else {
        // For surroundings we default distance to empty when toggling suggested ones
        return [...prev, { ...item, distance: "" }];
      }
    });
  };

  // FAQs state
  const [faqs, setFaqs] = useState([{ question: "", answer: "" }]);

  // Default agent configuration
  const DEFAULT_AGENT = {
    name: "Globes Properties Team",
    phone: "+91 98765 43210",
    email: "contact@globesproperties.com",
    image:
      "https://ui-avatars.com/api/?name=Globes+Properties&background=f97316&color=fff",
  };

  // Agent state
  const [useDefaultAgent, setUseDefaultAgent] = useState(false);
  const [agent, setAgent] = useState({
    name: "",
    phone: "",
    email: "",
    image: "https://i.pravatar.cc/150?img=12",
  });

  // Fetch property data if in edit mode
  useEffect(() => {
    const fetchPropertyData = async () => {
      if (!isEditMode) return;

      try {
        setLoading(true);
        const res = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/v1/properties/${id}`,
        );
        const data = await res.json();

        if (data.success) {
          const prop = data.data;
          setFormData({
            title: prop.title || "",
            builder: prop.builder || "",
            rera: prop.rera || "",
            isNewLaunch: prop.isNewLaunch || false,
            type: prop.type || "Apartment",
            location: prop.location || {
              address: "",
              city: "Bangalore",
              area: "",
              landmark: "",
              pincode: "",
              mapUrl: "",
            },
            totalFloors: prop.totalFloors || "",
            totalUnits: prop.totalUnits || "",
            launchDate: prop.launchDate || "",
            priceRange: prop.priceRange || "",
            description: prop.description || "",
            images: prop.images || [""],
            rating: prop.rating || 4.5,
            reviews: prop.reviews || 0,
            furnished: prop.furnished || "Unfurnished",
            availability: prop.availability || "Under Construction",
            featured: prop.featured || false,
            brochure: prop.brochure || "",
          });

          if (prop.plans?.length > 0) setPlans(prop.plans);
          if (prop.features?.length > 0) setFeatures(prop.features);
          if (prop.amenities?.length > 0) setAmenities(prop.amenities);
          if (prop.surroundings?.length > 0) setSurroundings(prop.surroundings);
          if (prop.faqs?.length > 0) setFaqs(prop.faqs);
          if (prop.agent) setAgent(prop.agent);

          // Initialize input types for images
          if (prop.images?.length > 0) {
            setImageInputTypes(prop.images.map(() => "url"));
            setImageFiles(prop.images.map(() => null));
          }
        }
      } catch (error) {
        console.error("Error fetching property:", error);
        alert("Failed to load property details.");
      } finally {
        setLoading(false);
      }
    };

    fetchPropertyData();
  }, [id, isEditMode]);

  // Handle agent toggle
  const toggleDefaultAgent = (checked) => {
    setUseDefaultAgent(checked);
    if (checked) {
      setAgent(DEFAULT_AGENT);
    } else {
      // Reset to empty for manual entry
      setAgent({
        name: "",
        phone: "",
        email: "",
        image: "https://i.pravatar.cc/150?img=12",
      });
    }
  };

  // Handle main form changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleLocationChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      location: {
        ...prev.location,
        [name]: value,
      },
    }));
  };

  // Image input types state ('url' or 'file')
  const [imageInputTypes, setImageInputTypes] = useState(["url"]);

  // Handle image changes
  const handleImageChange = (index, value) => {
    const newImages = [...formData.images];
    newImages[index] = value;
    setFormData((prev) => ({ ...prev, images: newImages }));
  };

  const handleFileChange = (index, e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (limit to 5MB to prevent huge payloads)
      if (file.size > 5 * 1024 * 1024) {
        alert("File size too large! Please select an image under 5MB.");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        handleImageChange(index, reader.result);
      };
      reader.readAsDataURL(file);

      // Store raw file for Multer
      const newFiles = [...imageFiles];
      newFiles[index] = file;
      setImageFiles(newFiles);
    }
  };

  const handleInputTypeToggle = (index, type) => {
    const newTypes = [...imageInputTypes];
    newTypes[index] = type;
    setImageInputTypes(newTypes);
    // Clear the value when switching types to avoid confusion
    handleImageChange(index, "");
    const newFiles = [...imageFiles];
    newFiles[index] = null;
    setImageFiles(newFiles);
  };

  const addImage = () => {
    setFormData((prev) => ({ ...prev, images: [...prev.images, ""] }));
    setImageInputTypes((prev) => [...prev, "url"]);
    setImageFiles((prev) => [...prev, null]);
  };

  const removeImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
    setImageInputTypes((prev) => prev.filter((_, i) => i !== index));
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // Handle brochure upload
  const handleBrochureUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type !== "application/pdf") {
        alert("Please upload a PDF file only!");
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        alert("File size too large! Please select a PDF under 10MB.");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, brochure: reader.result }));
      };
      reader.readAsDataURL(file);
      setBrochureFile(file);
    }
  };

  const removeBrochure = () => {
    setFormData((prev) => ({ ...prev, brochure: "" }));
    setBrochureFile(null);
  };

  // Handle plans
  const addPlan = () => {
    setPlans([
      ...plans,
      {
        id: "1bhk",
        label: "1 BHK",
        price: "",
        pricePerSqft: "",
        emi: "",
        beds: 1,
        baths: 1,
        area_sqm: 0,
      },
    ]);
  };

  const removePlan = (index) => {
    setPlans(plans.filter((_, i) => i !== index));
  };

  const handlePlanChange = (index, field, value) => {
    const newPlans = [...plans];
    newPlans[index][field] = value;
    setPlans(newPlans);
  };

  // Features handlers (using toggleFeature now)

  // Handle amenities
  const addAmenity = () => {
    setAmenities([...amenities, { label: "", iconName: "FaParking" }]);
  };

  const removeAmenity = (index) => {
    setAmenities(amenities.filter((_, i) => i !== index));
  };

  const handleAmenityChange = (index, field, value) => {
    const newAmenities = [...amenities];
    newAmenities[index][field] = value;
    setAmenities(newAmenities);
  };

  // Handle surroundings
  const addSurrounding = () => {
    setSurroundings([
      ...surroundings,
      {
        label: "",
        iconName: "FaGraduationCap",
        distance: "",
        type: "Education",
        color: "from-blue-500 to-indigo-600",
      },
    ]);
  };

  const removeSurrounding = (index) => {
    setSurroundings(surroundings.filter((_, i) => i !== index));
  };

  const handleSurroundingChange = (index, field, value) => {
    const newSurroundings = [...surroundings];
    newSurroundings[index][field] = value;
    setSurroundings(newSurroundings);
  };

  // Handle FAQs
  const addFAQ = () => {
    setFaqs([...faqs, { question: "", answer: "" }]);
  };

  const removeFAQ = (index) => {
    setFaqs(faqs.filter((_, i) => i !== index));
  };

  const handleFAQChange = (index, field, value) => {
    const newFaqs = [...faqs];
    newFaqs[index][field] = value;
    setFaqs(newFaqs);
  };

  // Handle agent changes
  const handleAgentChange = (field, value) => {
    setAgent((prev) => ({ ...prev, [field]: value }));
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const propertyData = {
      ...formData,
      plans,
      features,
      amenities,
      surroundings,
      faqs,
      agent,
    };

    // Use FormData for Multer support
    const submitData = new FormData();

    // Filter out base64 images from JSON to save bandwidth, keeping URLs
    const filteredPropertyData = {
      ...propertyData,
      images: propertyData.images.filter((img) => !img.startsWith("data:")),
      brochure: propertyData.brochure.startsWith("data:")
        ? ""
        : propertyData.brochure,
    };

    // Append JSON data as a string FIRST so Multer can read it
    submitData.append("data", JSON.stringify(filteredPropertyData));

    // Append files AFTER data
    imageFiles.forEach((file) => {
      if (file) submitData.append("images", file);
    });
    if (brochureFile) submitData.append("brochure", brochureFile);

    console.log("Sending FormData with Files");

    try {
      const token = localStorage.getItem("accessToken");
      const url = isEditMode
        ? `${import.meta.env.VITE_API_BASE_URL}/api/v1/properties/${id}`
        : `${import.meta.env.VITE_API_BASE_URL}/api/v1/properties`;

      const response = await fetch(url, {
        method: isEditMode ? "PUT" : "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: submitData,
      });

      const data = await response.json();

      if (data.success) {
        alert(
          isEditMode
            ? "Property updated successfully!"
            : "Property added successfully!",
        );
        navigate("/admin");
      } else {
        alert("Error: " + data.message);
      }
    } catch (error) {
      console.error(
        isEditMode ? "Error updating property:" : "Error adding property:",
        error,
      );
      alert(
        isEditMode
          ? "Failed to update property. Please try again."
          : "Failed to add property. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const iconOptions = [
    "FaHome",
    "FaParking",
    "FaSwimmingPool",
    "FaDumbbell",
    "FaTree",
    "FaShieldAlt",
    "FaBolt",
    "FaChild",
    "FaUtensils",
    "FaGraduationCap",
    "FaShoppingCart",
    "FaBus",
    "FaHospital",
    "FaPlane",
    "FaStore",
  ];

  const colorOptions = [
    "from-blue-400 to-cyan-500",
    "from-green-400 to-emerald-500",
    "from-orange-400 to-red-500",
    "from-blue-600 to-indigo-700",
    "from-yellow-400 to-orange-500",
    "from-red-400 to-pink-500",
    "from-purple-400 to-indigo-500",
    "from-gray-500 to-slate-600",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-orange-50/20 to-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate(-1)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <FaArrowLeft className="text-gray-600" />
              </button>
              <h1 className="text-3xl font-bold text-gray-900">
                {isEditMode ? "Edit Property" : "Add New Property"}
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setShowJsonPreview(true)}
                className="flex items-center gap-2 bg-gray-100 text-gray-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-all shadow-sm"
              >
                <FaCode />
                Preview JSON
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="flex items-center gap-2 bg-gradient-to-r from-orange-600 to-orange-700 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50"
              >
                <FaSave />
                {loading
                  ? isEditMode
                    ? "Updating..."
                    : "Saving..."
                  : isEditMode
                    ? "Update Property"
                    : "Save Property"}
              </button>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Project Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Project Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="e.g., Luxury Villa in Whitefield"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Builder Name
                </label>
                <input
                  type="text"
                  name="builder"
                  value={formData.builder}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="e.g., ABC Constructions"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  RERA Number
                </label>
                <input
                  type="text"
                  name="rera"
                  value={formData.rera}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="e.g., PRM/KA/RERA/1251/446/PR/210219/003923"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Property Type *
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="Apartment">Apartment</option>
                  <option value="Villa">Villa</option>
                  <option value="Plot">Plot</option>
                  <option value="Commercial">Commercial</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Price Range
                </label>
                <input
                  type="text"
                  name="priceRange"
                  value={formData.priceRange}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="e.g., 1.25 Cr - 2.45 Cr"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows="4"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Describe the property..."
                />
              </div>

              <div
                className="relative group cursor-pointer"
                onClick={() =>
                  document
                    .querySelector('input[name="launchDate"]')
                    ?.showPicker?.()
                }
              >
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Launch Date
                </label>
                <input
                  type="date"
                  name="launchDate"
                  value={formData.launchDate}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Total Floors
                </label>
                <input
                  type="number"
                  name="totalFloors"
                  value={formData.totalFloors}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="e.g., 24"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Total Units
                </label>
                <input
                  type="number"
                  name="totalUnits"
                  value={formData.totalUnits}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="e.g., 450"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Furnished Status
                </label>
                <select
                  name="furnished"
                  value={formData.furnished}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="Unfurnished">Unfurnished</option>
                  <option value="Semi-Furnished">Semi-Furnished</option>
                  <option value="Fully Furnished">Fully Furnished</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Availability
                </label>
                <select
                  name="availability"
                  value={formData.availability}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="Under Construction">Under Construction</option>
                  <option value="Ready to Move">Ready to Move</option>
                </select>
              </div>

              <div className="flex items-center gap-4 py-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="isNewLaunch"
                    checked={formData.isNewLaunch}
                    onChange={handleChange}
                    className="w-5 h-5 text-orange-600 rounded focus:ring-orange-500"
                  />
                  <span className="text-sm font-semibold text-gray-700">
                    New Launch
                  </span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="featured"
                    checked={formData.featured}
                    onChange={handleChange}
                    className="w-5 h-5 text-orange-600 rounded focus:ring-orange-500"
                  />
                  <span className="text-sm font-semibold text-gray-700">
                    Featured Property
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* Location Details */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Location Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Full Address
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.location.address}
                  onChange={handleLocationChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="e.g. Silver Oaks Main Road, Panathur"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  City
                </label>
                <select
                  name="city"
                  value={formData.location.city}
                  onChange={handleLocationChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="Bangalore">Bangalore</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Area
                </label>
                <select
                  name="area"
                  value={formData.location.area}
                  onChange={handleLocationChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="">Select Area</option>
                  {BANGALORE_AREAS.map((area) => (
                    <option key={area} value={area}>
                      {area}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Landmark
                </label>
                <input
                  type="text"
                  name="landmark"
                  value={formData.location.landmark}
                  onChange={handleLocationChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="e.g. Near St. Joseph's School"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Pincode
                </label>
                <input
                  type="text"
                  name="pincode"
                  value={formData.location.pincode}
                  onChange={handleLocationChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="e.g. 560103"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Google Map URL
                </label>
                <input
                  type="url"
                  name="mapUrl"
                  value={formData.location.mapUrl}
                  onChange={handleLocationChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Paste Google Maps link here..."
                />
              </div>
            </div>
          </div>

          {/* Images */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Property Images
              </h2>
              <button
                type="button"
                onClick={addImage}
                className="flex items-center gap-2 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors"
              >
                <FaPlus /> Add Image
              </button>
            </div>
            <div className="space-y-4">
              {formData.images.map((image, index) => (
                <div
                  key={index}
                  className="flex flex-col gap-2 p-4 border border-gray-100 rounded-xl bg-gray-50"
                >
                  <div className="flex items-center gap-4 mb-2">
                    <span className="text-sm font-semibold text-gray-600">
                      Image {index + 1}
                    </span>
                    <div className="flex bg-gray-200 rounded-lg p-1">
                      <button
                        type="button"
                        onClick={() => handleInputTypeToggle(index, "url")}
                        className={`px-3 py-1 rounded-md text-sm font-medium transition-all ${
                          imageInputTypes[index] === "url"
                            ? "bg-white text-orange-600 shadow-sm"
                            : "text-gray-600 hover:text-gray-800"
                        }`}
                      >
                        Link
                      </button>
                      <button
                        type="button"
                        onClick={() => handleInputTypeToggle(index, "file")}
                        className={`px-3 py-1 rounded-md text-sm font-medium transition-all ${
                          imageInputTypes[index] === "file"
                            ? "bg-white text-orange-600 shadow-sm"
                            : "text-gray-600 hover:text-gray-800"
                        }`}
                      >
                        Upload
                      </button>
                    </div>
                    {formData.images.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="ml-auto text-red-500 hover:text-red-700 text-sm flex items-center gap-1"
                      >
                        <FaTimes /> Remove
                      </button>
                    )}
                  </div>

                  <div className="flex gap-2">
                    {imageInputTypes[index] === "url" ? (
                      <input
                        type="url"
                        value={image}
                        onChange={(e) =>
                          handleImageChange(index, e.target.value)
                        }
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="https://example.com/image.jpg"
                      />
                    ) : (
                      <div className="flex-1">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileChange(index, e)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 bg-white"
                        />
                        {image && image.startsWith("data:") && (
                          <p className="text-xs text-green-600 mt-1">
                            Image selected successfully!
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Preview if available */}
                  {image && (
                    <div className="mt-2 w-24 h-24 rounded-lg overflow-hidden border border-gray-200 relative bg-gray-100">
                      <img
                        src={getImageUrl(image)}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Floor Plans */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Floor Plans</h2>
              <button
                type="button"
                onClick={addPlan}
                className="flex items-center gap-2 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors"
              >
                <FaPlus /> Add Plan
              </button>
            </div>
            <div className="space-y-6">
              {plans.map((plan, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-lg p-4"
                >
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-semibold text-gray-700">
                      Plan {index + 1}
                    </h3>
                    {plans.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removePlan(index)}
                        className="text-red-600 hover:bg-red-50 p-2 rounded-lg transition-colors"
                      >
                        <FaTimes />
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-1">
                      <select
                        value={plan.id}
                        onChange={(e) => {
                          const val = e.target.value;
                          const beds = parseInt(val.charAt(0));
                          const label = val
                            .toUpperCase()
                            .replace("BHK", " BHK");
                          handlePlanChange(index, "id", val);
                          handlePlanChange(index, "label", label);
                          handlePlanChange(index, "beds", beds);
                          // Default baths to same as beds if not set, or leave blank?
                          // User said blank, so maybe let them fill baths.
                        }}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 font-bold"
                      >
                        <option value="1bhk">1 BHK</option>
                        <option value="2bhk">2 BHK</option>
                        <option value="3bhk">3 BHK</option>
                        <option value="4bhk">4 BHK</option>
                        <option value="5bhk">5 BHK</option>
                      </select>
                    </div>
                    <input
                      type="text"
                      value={plan.price}
                      onChange={(e) =>
                        handlePlanChange(index, "price", e.target.value)
                      }
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                      placeholder="Price"
                    />
                    <input
                      type="text"
                      value={plan.pricePerSqft}
                      onChange={(e) =>
                        handlePlanChange(index, "pricePerSqft", e.target.value)
                      }
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                      placeholder="Price/sqft"
                    />
                    <input
                      type="text"
                      value={plan.emi}
                      onChange={(e) =>
                        handlePlanChange(index, "emi", e.target.value)
                      }
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                      placeholder="EMI"
                    />
                    <input
                      type="number"
                      value={plan.beds}
                      onChange={(e) =>
                        handlePlanChange(
                          index,
                          "beds",
                          parseInt(e.target.value),
                        )
                      }
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                      placeholder="Beds"
                    />
                    <input
                      type="number"
                      value={plan.baths}
                      onChange={(e) =>
                        handlePlanChange(
                          index,
                          "baths",
                          parseInt(e.target.value),
                        )
                      }
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                      placeholder="Baths"
                    />
                    <input
                      type="number"
                      value={plan.area_sqm}
                      onChange={(e) =>
                        handlePlanChange(
                          index,
                          "area_sqm",
                          parseInt(e.target.value),
                        )
                      }
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                      placeholder="Area (sqm)"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Amenities */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Amenities</h2>
              <button
                type="button"
                onClick={() =>
                  setAmenities([
                    ...amenities,
                    { label: "", iconName: "FaCheck" },
                  ])
                }
                className="flex items-center gap-2 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors"
              >
                <FaPlus /> Add Custom
              </button>
            </div>

            {/* Selection Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 pb-6 border-b border-gray-100">
              {AVAILABLE_AMENITIES.map((amenity, index) => {
                const isSelected = amenities.some(
                  (a) => a.label === amenity.label,
                );
                return (
                  <div
                    key={index}
                    onClick={() => toggleAmenity(amenity)}
                    className={`cursor-pointer p-4 rounded-xl border-2 transition-all duration-200 flex items-center gap-3 ${
                      isSelected
                        ? "border-orange-500 bg-orange-50 shadow-md"
                        : "border-gray-100 hover:border-orange-200 hover:bg-gray-50"
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded border ${
                        isSelected
                          ? "bg-orange-500 border-orange-500"
                          : "border-gray-300 bg-white"
                      } flex items-center justify-center`}
                    >
                      {isSelected && <FaCheck className="text-white text-xs" />}
                    </div>
                    <span
                      className={`font-semibold text-sm ${
                        isSelected ? "text-orange-700" : "text-gray-600"
                      }`}
                    >
                      {amenity.label}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Custom Amenities List */}
            <div className="space-y-4">
              {amenities
                .filter(
                  (a) =>
                    !AVAILABLE_AMENITIES.some(
                      (avail) => avail.label === a.label,
                    ),
                )
                .map((amenity, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={amenity.label}
                      onChange={(e) => {
                        const newAmenities = [...amenities];
                        const actualIndex = amenities.findIndex(
                          (a) => a === amenity,
                        );
                        newAmenities[actualIndex].label = e.target.value;
                        setAmenities(newAmenities);
                      }}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                      placeholder="Custom amenity name"
                    />
                    <select
                      value={amenity.iconName}
                      onChange={(e) => {
                        const newAmenities = [...amenities];
                        const actualIndex = amenities.findIndex(
                          (a) => a === amenity,
                        );
                        newAmenities[actualIndex].iconName = e.target.value;
                        setAmenities(newAmenities);
                      }}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                    >
                      {iconOptions.map((icon) => (
                        <option key={icon} value={icon}>
                          {icon}
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={() =>
                        setAmenities(amenities.filter((a) => a !== amenity))
                      }
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <FaTimes />
                    </button>
                  </div>
                ))}
            </div>
          </div>

          {/* Surroundings */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Around the Project
              </h2>
              <button
                type="button"
                onClick={addSurrounding}
                className="flex items-center gap-2 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors"
              >
                <FaPlus /> Add Custom
              </button>
            </div>

            {/* Selection Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 pb-6 border-b border-gray-100">
              {AVAILABLE_SURROUNDINGS.map((item, index) => {
                const isSelected = surroundings.some(
                  (s) => s.label === item.label,
                );
                return (
                  <div
                    key={index}
                    onClick={() => toggleSurrounding(item)}
                    className={`cursor-pointer p-4 rounded-xl border-2 transition-all duration-200 flex items-center gap-3 ${
                      isSelected
                        ? "border-orange-500 bg-orange-50 shadow-md"
                        : "border-gray-100 hover:border-orange-200 hover:bg-gray-50"
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded border ${
                        isSelected
                          ? "bg-orange-500 border-orange-500"
                          : "border-gray-300 bg-white"
                      } flex items-center justify-center`}
                    >
                      {isSelected && <FaCheck className="text-white text-xs" />}
                    </div>
                    <span
                      className={`font-semibold text-sm ${
                        isSelected ? "text-orange-700" : "text-gray-600"
                      }`}
                    >
                      {item.label}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* List for distances */}
            <div className="space-y-4 shadow-inner bg-gray-50 p-4 rounded-xl">
              <h3 className="text-sm font-bold text-gray-500 mb-2 uppercase tracking-wider">
                Specify Distances
              </h3>
              {surroundings.map((item, index) => (
                <div
                  key={index}
                  className="flex gap-2 items-center bg-white p-3 rounded-lg border border-gray-100 shadow-sm"
                >
                  <div
                    className={`p-2 rounded bg-gradient-to-br ${item.color || "from-gray-100 to-gray-200"} text-white`}
                  >
                    <FaCheck />
                  </div>
                  <input
                    type="text"
                    value={item.label}
                    onChange={(e) =>
                      handleSurroundingChange(index, "label", e.target.value)
                    }
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                    placeholder="Name e.g. Central Metro"
                  />
                  <input
                    type="text"
                    value={item.distance}
                    onChange={(e) =>
                      handleSurroundingChange(index, "distance", e.target.value)
                    }
                    className="w-24 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                    placeholder="1.2 km"
                  />
                  <select
                    value={item.type}
                    onChange={(e) =>
                      handleSurroundingChange(index, "type", e.target.value)
                    }
                    className="w-32 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="Education">Education</option>
                    <option value="Healthcare">Healthcare</option>
                    <option value="Transport">Transport</option>
                    <option value="Shopping">Shopping</option>
                    <option value="Recreation">Recreation</option>
                  </select>
                  <button
                    type="button"
                    onClick={() => removeSurrounding(index)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <FaTimes />
                  </button>
                </div>
              ))}
              {surroundings.length === 0 && (
                <p className="text-sm text-gray-400 text-center py-2">
                  No surroundings added yet. Click above to select or add.
                </p>
              )}
            </div>
          </div>

          {/* FAQs */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">FAQs</h2>
              <button
                type="button"
                onClick={addFAQ}
                className="flex items-center gap-2 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors"
              >
                <FaPlus /> Add FAQ
              </button>
            </div>
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className="p-4 border border-gray-200 rounded-xl bg-gray-50 space-y-3"
                >
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-gray-500">
                      FAQ #{index + 1}
                    </span>
                    {faqs.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeFAQ(index)}
                        className="text-red-500 hover:text-red-700 text-sm"
                      >
                        <FaTimes /> Remove
                      </button>
                    )}
                  </div>
                  <input
                    type="text"
                    value={faq.question}
                    onChange={(e) =>
                      handleFAQChange(index, "question", e.target.value)
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                    placeholder="Question"
                  />
                  <textarea
                    value={faq.answer}
                    onChange={(e) =>
                      handleFAQChange(index, "answer", e.target.value)
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                    placeholder="Answer"
                    rows="2"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Agent Information */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Agent Information
            </h2>
            <div className="flex items-center gap-4 mb-6">
              <label className="flex items-center gap-2 cursor-pointer bg-orange-50 px-4 py-2 rounded-lg border border-orange-100 hover:bg-orange-100 transition-colors">
                <input
                  type="checkbox"
                  checked={useDefaultAgent}
                  onChange={(e) => toggleDefaultAgent(e.target.checked)}
                  className="w-5 h-5 text-orange-600 rounded focus:ring-orange-500"
                />
                <span className="text-sm font-semibold text-gray-800">
                  Use Default Company Agent
                </span>
              </label>
            </div>

            {useDefaultAgent ? (
              // Default Agent Preview Card
              <div className="flex items-center gap-4 p-4 border border-gray-200 rounded-xl bg-gray-50">
                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-orange-200">
                  <img
                    src={agent.image}
                    alt={agent.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">{agent.name}</h3>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>{agent.phone}</p>
                    <p>{agent.email}</p>
                  </div>
                </div>
                <div className="ml-auto px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">
                  DEFAULT SELECTED
                </div>
              </div>
            ) : (
              // Manual Agent Entry Form
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-[fadeIn_0.3s_ease-out]">
                <input
                  type="text"
                  value={agent.name}
                  onChange={(e) => handleAgentChange("name", e.target.value)}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  placeholder="Agent Name"
                />
                <input
                  type="tel"
                  value={agent.phone}
                  onChange={(e) => handleAgentChange("phone", e.target.value)}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  placeholder="Phone"
                />
                <input
                  type="email"
                  value={agent.email}
                  onChange={(e) => handleAgentChange("email", e.target.value)}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  placeholder="Email"
                />
                <input
                  type="url"
                  value={agent.image}
                  onChange={(e) => handleAgentChange("image", e.target.value)}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  placeholder="Image URL"
                />
              </div>
            )}
          </div>

          {/* Brochure Upload */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <FaFilePdf className="text-red-500" />
              Property Brochure
            </h2>
            <div className="p-8 border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50 flex flex-col items-center justify-center text-center">
              {!formData.brochure ? (
                <div className="space-y-4">
                  <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto">
                    <FaFilePdf className="text-2xl" />
                  </div>
                  <div>
                    <p className="text-lg font-bold text-gray-900">
                      Upload Brochure (PDF Only)
                    </p>
                    <p className="text-sm text-gray-500">
                      Max file size: 10MB. Only PDF format is supported.
                    </p>
                  </div>
                  <input
                    type="file"
                    accept=".pdf,application/pdf"
                    onChange={handleBrochureUpload}
                    className="hidden"
                    id="brochure-upload"
                  />
                  <label
                    htmlFor="brochure-upload"
                    className="inline-block bg-gray-900 text-white px-8 py-3 rounded-xl font-semibold cursor-pointer hover:bg-gray-800 transition-all"
                  >
                    Select PDF File
                  </label>
                </div>
              ) : (
                <div className="w-full flex items-center gap-4 p-4 bg-white border border-green-100 rounded-xl">
                  <div className="w-12 h-12 bg-green-100 text-green-600 rounded-lg flex items-center justify-center">
                    <FaFilePdf className="text-xl" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-bold text-gray-900">Brochure Selected</p>
                    <p className="text-xs text-green-600">
                      PDF Document is ready to upload
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={removeBrochure}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <FaTimes />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-6 py-3 border border-gray-300 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="flex items-center gap-2 bg-gradient-to-r from-orange-600 to-orange-700 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50"
            >
              <FaSave />
              {loading
                ? isEditMode
                  ? "Updating..."
                  : "Saving..."
                : isEditMode
                  ? "Update Property"
                  : "Save Property"}
            </button>
          </div>
        </form>
      </div>
      {/* JSON Preview Modal */}
      {showJsonPreview && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-[fadeIn_0.2s_ease-out]">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 text-orange-600 rounded-lg">
                  <FaCode className="text-xl" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    JSON Data Preview
                  </h3>
                  <p className="text-sm text-gray-500">
                    This is the data that will be sent to the server
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowJsonPreview(false)}
                className="p-2 hover:bg-gray-200 rounded-lg transition-colors text-gray-500"
              >
                <FaTimes size={20} />
              </button>
            </div>
            <div className="flex-1 overflow-auto p-6 bg-gray-900">
              <pre className="text-green-400 font-mono text-sm leading-relaxed">
                {JSON.stringify(
                  {
                    ...formData,
                    plans,
                    features,
                    amenities,
                    surroundings,
                    faqs,
                    agent,
                  },
                  null,
                  2,
                )}
              </pre>
            </div>
            <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end">
              <button
                onClick={() => setShowJsonPreview(false)}
                className="px-6 py-2 bg-gray-900 text-white rounded-xl font-semibold hover:bg-gray-800 transition-all"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddEditProperty;
