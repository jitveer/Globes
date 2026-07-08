import React, { useEffect, useRef, useState } from "react";
// EditorJS Core and Official Tools
import EditorJS from "@editorjs/editorjs";
import Header from "@editorjs/header";
import List from "@editorjs/list";
import ImageTool from "@editorjs/image";
import Checklist from "@editorjs/checklist";
import Quote from "@editorjs/quote";
import Table from "@editorjs/table";
import Embed from "@editorjs/embed";
import Code from "@editorjs/code";
import LinkTool from "@editorjs/link";
import InlineCode from "@editorjs/inline-code";
import Marker from "@editorjs/marker";
import Warning from "@editorjs/warning";
import Delimiter from "@editorjs/delimiter";

// Routing and UI Icons
import { useNavigate, useParams } from "react-router-dom";
import {
  FaSave,
  FaArrowLeft,
  FaImage,
  FaTimes,
  FaGlobe,
  FaEdit,
} from "react-icons/fa";
import Popup from "../../../../../components/Popup";

/**
 * BlogEditor Component
 * handles creating and editing blog posts using Editor.js
 */
const BlogEditor = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // URL se ID fetch karte hain edit mode ke liye
  const isEditMode = !!id;
  const editorRef = useRef(null); // EditorJS instance hold karne ke liye ref
  const [loading, setLoading] = useState(false);

  const [popupData, setPopupData] = useState({
    isOpen: false,
    type: "success",
    title: "",
    message: "",
    onClose: null,
  });

  const showPopup = (type, title, message, onClose = null) => {
    setPopupData({
      isOpen: true,
      type,
      title,
      message,
      onClose,
    });
  };

  const [blogData, setBlogData] = useState({
    title: "",
    featuredImage: "",
    featuredImageAlt: "",
    seoTitle: "",
    seoDescription: "",
    seoKeywords: "",
    tags: "",
    status: "draft",
  });

  // Flag to ensure editor initializes only after data is ready
  const [isReady, setIsReady] = useState(false);

  /**
   * EditorJS Initialization
   * Yeh effect tab chalta hai jab component mount hota hai aur 'isReady' true hota hai
   */
  useEffect(() => {
    if (!isReady) return;

    if (!editorRef.current) {
      // New Editor Instance create karte hain
      editorRef.current = new EditorJS({
        holder: "editorjs", // HTML element id jahan editor render hoga
        tools: {
          // Tool configuration: Kaun kaun se features editor mein honge
          header: {
            class: Header,
            inlineToolbar: ["link"],
            config: {
              placeholder: "Enter a header",
              levels: [2, 3, 4],
              defaultLevel: 2,
            },
          },
          list: {
            class: List,
            inlineToolbar: true,
            config: {
              defaultStyle: "unordered",
            },
          },
          checklist: {
            class: Checklist,
            inlineToolbar: true,
          },
          quote: {
            class: Quote,
            inlineToolbar: true,
            shortcut: "CMD+SHIFT+O",
            config: {
              quotePlaceholder: "Enter a quote",
              captionPlaceholder: "Quote's author",
            },
          },
          table: {
            class: Table,
            inlineToolbar: true,
            config: {
              rows: 2,
              cols: 3,
            },
          },
          image: {
            class: ImageTool,
            config: {
              // Image upload endpoint aur auth headers
              endpoints: {
                byFile: `${import.meta.env.VITE_API_BASE_URL}/api/v1/blogs/upload`,
              },
              additionalRequestHeaders: {
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
              },
            },
          },
          embed: {
            class: Embed,
            config: {
              services: {
                youtube: true,
                instagram: true,
                twitter: true,
                facebook: true,
              },
            },
          },
          code: Code,
          linkTool: {
            class: LinkTool,
            config: {
              // URL preview fetch karne ke liye endpoint
              endpoint: `${import.meta.env.VITE_API_BASE_URL}/api/v1/blogs/fetchUrl`,
            },
          },
          warning: {
            class: Warning,
            inlineToolbar: true,
            shortcut: "CMD+SHIFT+W",
            config: {
              titlePlaceholder: "Title",
              messagePlaceholder: "Message",
            },
          },
          delimiter: Delimiter,
          inlineCode: {
            class: InlineCode,
            shortcut: "CMD+SHIFT+M",
          },
          marker: {
            class: Marker,
            shortcut: "CMD+SHIFT+H",
          },
        },
        placeholder: "Start writing your amazing story...",
        data: blogData.content || {}, // Agar edit mode hai, to existing content load karega
        onReady: () => {
          console.log("Editor.js is ready to work!");
        },
      });
    }

    // Cleanup: Component unmount hote waqt editor instance destroy karte hain
    return () => {
      if (
        editorRef.current &&
        typeof editorRef.current.destroy === "function"
      ) {
        editorRef.current.destroy();
        editorRef.current = null;
      }
    };
  }, [isReady]);

  /**
   * Data Fetching for Edit Mode
   * Agar URL mein 'id' hai, to server se blog ki details mangwate hain
   */
  useEffect(() => {
    const fetchBlog = async () => {
      if (!isEditMode) {
        setIsReady(true);
        return;
      }

      try {
        setLoading(true);
        const res = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/v1/blogs/id/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          },
        );
        const data = await res.json();
        if (data.success) {
          // Blog data ko state mein set karte hain
          setBlogData({
            ...data.data,
            tags: data.data.tags?.join(", ") || "",
          });
        }
      } catch (error) {
        console.error("Error fetching blog:", error);
      } finally {
        setLoading(false);
        setIsReady(true); // Data fetch hone ke baad editor initialize hone dega
      }
    };

    fetchBlog();
  }, [id, isEditMode]);

  /**
   * Input Change Handler
   * Text fields aur selectivity handle karne ke liye
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setBlogData((prev) => ({ ...prev, [name]: value }));
  };

  /**
   * Blog Saving Logic
   * Naya blog create karne ya purane ko update karne ke liye
   */
  const handleSave = async (statusOverride = null) => {
    // Validation: Title hona zaroori hai
    if (!blogData.title) {
      showPopup("warning", "Required Field", "Please enter a blog title");
      return;
    }

    try {
      setLoading(true);
      // EditorJS instance se saara content (blocks) fetch karte hain
      const content = await editorRef.current.save();

      // Final object jo server par jayega
      const payload = {
        ...blogData,
        content,
        status: statusOverride || blogData.status,
        // Tags ko string se array mein convert karte hain
        tags: (blogData.tags || "")
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag !== ""),
      };

      const url = isEditMode
        ? `${import.meta.env.VITE_API_BASE_URL}/api/v1/blogs/${id}`
        : `${import.meta.env.VITE_API_BASE_URL}/api/v1/blogs`;

      // API call to save/update
      const res = await fetch(url, {
        method: isEditMode ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        showPopup(
          "success",
          "Success",
          `Blog ${isEditMode ? "updated" : "published"} successfully!`,
          () => navigate("/admin")
        );
      } else {
        showPopup("error", "Error", "Error: " + data.message);
      }
    } catch (error) {
      console.error("Error saving blog:", error);
      showPopup("error", "Error", "Failed to save blog");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Featured Image Upload Handler
   * Sidebar mein main blog image upload karne ke liye
   */
  const handleFeaturedImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    try {
      setLoading(true);
      // Backend upload API call
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/blogs/upload`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
          body: formData,
        },
      );
      const data = await res.json();
      if (data.success) {
        // State mein uploaded image ka URL save karte hain
        setBlogData((prev) => ({ ...prev, featuredImage: data.file.url }));
      }
    } catch (error) {
      console.error("Error uploading featured image:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* --- Page Header / Toolbar --- */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-50 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600"
          >
            <FaArrowLeft />
          </button>
          <h1 className="text-xl font-bold text-gray-800">
            {isEditMode ? "Edit Post" : "Create New Post"}
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => handleSave("draft")}
            disabled={loading}
            className="px-5 py-2 text-gray-600 font-medium hover:bg-gray-100 rounded-lg transition-all disabled:opacity-50"
          >
            Save Draft
          </button>
          <button
            onClick={() => handleSave("published")}
            disabled={loading}
            className="flex items-center gap-2 bg-gradient-to-r from-orange-600 to-orange-700 text-white px-6 py-2 rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50"
          >
            <FaGlobe />
            {loading ? "Saving..." : isEditMode ? "Update" : "Publish"}
          </button>
        </div>
      </header>

      {/* --- Main Contents Section --- */}
      <main className="flex-1 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-8 p-6">
        {/* WRITING AREA: Title aur EditorJS canvas */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 space-y-6">
            {/* Title Input: Yeh blog ka main heading hai */}
            <input
              type="text"
              name="title"
              value={blogData.title}
              onChange={handleChange}
              placeholder="Enter post title..."
              className="w-full text-4xl font-extrabold text-gray-900 placeholder:text-gray-300 border-none focus:ring-0 p-0"
            />

            <div className="h-px bg-gray-100" />

            {/* Editor Canvas: Yahan Editor.js render hota hai */}
            <div
              id="editorjs"
              className="prose prose-lg max-w-none min-h-[500px]"
            />
          </div>
        </div>

        {/* SIDEBAR: Metadata aur Featured image settings */}
        <aside className="space-y-6">
          {/* Featured Image Box */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 space-y-4">
            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <FaImage className="text-orange-600" />
              Featured Image
            </h3>

            <div
              className={`relative aspect-video rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center overflow-hidden transition-all group ${blogData.featuredImage ? "border-none" : "hover:border-orange-300 bg-gray-50"}`}
            >
              {blogData.featuredImage ? (
                <>
                  <img
                    src={blogData.featuredImage}
                    alt="Featured"
                    className="w-full h-full object-cover"
                  />
                  {/* Hover Actions: Image change ya delete karne ke liye */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                    <label className="cursor-pointer bg-white text-gray-800 p-2 rounded-lg hover:bg-orange-600 hover:text-white transition-all">
                      <FaEdit />
                      <input
                        type="file"
                        className="hidden"
                        onChange={handleFeaturedImageUpload}
                        accept="image/*"
                      />
                    </label>
                    <button
                      onClick={() =>
                        setBlogData((prev) => ({ ...prev, featuredImage: "" }))
                      }
                      className="bg-white text-red-600 p-2 rounded-lg hover:bg-red-600 hover:text-white transition-all"
                    >
                      <FaTimes />
                    </button>
                  </div>
                </>
              ) : (
                // Empty state: Upload prompt
                <label className="cursor-pointer flex flex-col items-center gap-2 p-6 w-full h-full text-center">
                  <div className="w-12 h-12 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center">
                    <FaImage size={24} />
                  </div>
                  <div className="text-sm font-medium text-gray-600">
                    Click to upload featured image
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    onChange={handleFeaturedImageUpload}
                    accept="image/*"
                  />
                </label>
              )}
            </div>
          </div>

          {/* Settings Section: Tags aur Excerpt */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Tags (comma separated)
              </label>
              <input
                type="text"
                name="tags"
                value={blogData.tags}
                onChange={handleChange}
                placeholder="luxury, bangalore, villas..."
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500 transition-all outline-none"
              />
            </div>
          </div>

          {/* SEO Section */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 space-y-4">
            <h3 className="text-lg font-bold text-gray-800">SEO Settings</h3>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Featured Image Alt Text
              </label>
              <input
                type="text"
                name="featuredImageAlt"
                value={blogData.featuredImageAlt || ""}
                onChange={handleChange}
                placeholder="Descriptive text for image"
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500 transition-all outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                SEO Title
              </label>
              <input
                type="text"
                name="seoTitle"
                value={blogData.seoTitle || ""}
                onChange={handleChange}
                placeholder="Custom title for search engines"
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500 transition-all outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                SEO Description
              </label>
              <textarea
                name="seoDescription"
                value={blogData.seoDescription || ""}
                onChange={handleChange}
                placeholder="Custom description for search engines"
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500 transition-all outline-none min-h-[80px]"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                SEO Keywords
              </label>
              <input
                type="text"
                name="seoKeywords"
                value={blogData.seoKeywords || ""}
                onChange={handleChange}
                placeholder="seo, tags, keywords"
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500 transition-all outline-none"
              />
            </div>
          </div>

          {/* Stats Bar (Sirf edit mode mein dikhta hai) */}
          {isEditMode && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500 font-medium">
                  Current Status
                </span>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${blogData.status === "published" ? "bg-green-100 text-green-600" : "bg-yellow-100 text-yellow-600"}`}
                >
                  {blogData.status}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm mt-3">
                <span className="text-gray-500 font-medium">Views</span>
                <span className="text-gray-900 font-bold">
                  {blogData.views}
                </span>
              </div>
            </div>
          )}
        </aside>
      </main>
      <Popup
        isOpen={popupData.isOpen}
        type={popupData.type}
        title={popupData.title}
        message={popupData.message}
        onClose={() => {
          if (popupData.onClose) {
            popupData.onClose();
          }
          setPopupData({ ...popupData, isOpen: false });
        }}
      />
    </div>
  );
};

export default BlogEditor;
