import React, { useState, useEffect } from "react";

const AdvertisementTab = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [popupImageFile, setPopupImageFile] = useState(null);
  const [previewImage, setPreviewImage] = useState("");
  const [popupAdUrl, setPopupAdUrl] = useState("");
  const [removePopupImage, setRemovePopupImage] = useState(false);
  const [adVideoUrl, setAdVideoUrl] = useState("");

  const getImageUrl = (imageInput) => {
    const placeholder = "https://via.placeholder.com/800x600?text=No+Image";
    if (!imageInput) return placeholder;
    const url = typeof imageInput === "string" ? imageInput : imageInput.webp;
    if (!url) return placeholder;
    if (url.startsWith("http")) return url;
    const baseUrl = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/$/, "");
    const path = url.startsWith("/") ? url : `/${url}`;
    return `${baseUrl}${path}`;
  };

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/v1/settings`);
        const data = await res.json();
        if (data.success && data.data) {
          if (data.data.popupAdImage) {
            setPreviewImage(getImageUrl(data.data.popupAdImage));
          }
          if (data.data.popupAdUrl) {
            setPopupAdUrl(data.data.popupAdUrl);
          }
          if (data.data.homePageAdVideoUrl) {
            setAdVideoUrl(data.data.homePageAdVideoUrl);
          }
        }
      } catch (error) {
        console.error("Failed to load settings:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPopupImageFile(file);
      setRemovePopupImage(false);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setPopupImageFile(null);
    setPreviewImage("");
    setRemovePopupImage(true);
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage({ type: "", text: "" });
    try {
      const token = localStorage.getItem("accessToken");
      const formData = new FormData();
      formData.append("homePageAdVideoUrl", adVideoUrl);
      formData.append("popupAdUrl", popupAdUrl);
      if (removePopupImage) {
        formData.append("removePopupImage", "true");
      }
      if (popupImageFile) {
        formData.append("popupAdImage", popupImageFile);
      }

      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/v1/settings`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData, // Sending form data to support file upload
      });

      const data = await res.json();
      if (data.success) {
        setMessage({ type: "success", text: "Advertisement settings saved successfully!" });
        if (data.data.popupAdImage) {
          setPreviewImage(getImageUrl(data.data.popupAdImage));
        }
      } else {
        setMessage({ type: "error", text: data.message || "Failed to save settings." });
      }
    } catch (error) {
      console.error("Failed to save settings:", error);
      setMessage({ type: "error", text: "Something went wrong. Please try again." });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-10 h-10 border-4 border-orange-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-[fadeInUp_0.5s_ease-out]">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Advertisement Settings</h2>
        <p className="text-gray-600">Manage popup ads and video ads on your website.</p>
      </div>

      {message.text && (
        <div
          className={`p-4 rounded-xl text-sm font-semibold ${message.type === "success"
            ? "bg-green-50 text-green-700 border border-green-200"
            : "bg-red-50 text-red-700 border border-red-200"
            }`}
        >
          {message.text}
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Popup Advertisement</h3>
        <p className="text-sm text-gray-500 mb-4">
          This image will show up as a popup on the home page 5 seconds after it loads. It is recommended to use a 4:3 aspect ratio image.
        </p>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Popup Redirect URL</label>
            <input
              type="text"
              value={popupAdUrl}
              onChange={(e) => setPopupAdUrl(e.target.value)}
              placeholder="https://example.com/promotion"
              className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 mb-4"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Upload Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          {previewImage && (
            <div className="mt-4">
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-semibold text-gray-700">Preview (4:3 Ratio display)</label>
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="text-red-500 hover:text-red-700 text-sm font-semibold px-3 py-1 bg-red-50 rounded-lg"
                >
                  Remove Image
                </button>
              </div>
              <div className="w-full max-w-sm aspect-[4/3] bg-gray-100 rounded-xl overflow-hidden shadow-inner flex justify-center items-center">
                <img src={previewImage} alt="Popup Preview" className="w-full h-full object-cover" />
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Video Advertisement</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Home Page Video Ad URL</label>
            <input
              type="text"
              value={adVideoUrl}
              onChange={(e) => setAdVideoUrl(e.target.value)}
              placeholder="Enter YouTube URL"
              className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              Enter any valid YouTube video link. It will automatically autoplay, loop, and be muted on the homepage.
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-gradient-to-r from-orange-600 to-orange-700 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Advertisement"}
        </button>
      </div>
    </div>
  );
};

export default AdvertisementTab;
