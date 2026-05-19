import React, { useEffect, useState } from "react";
import { FaBlog, FaPlus, FaEdit, FaTrash, FaEye } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const BlogsTab = () => {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/v1/blogs`,
        );
        const data = await res.json();
        if (data.success) {
          setBlogs(data.data);
        }
      } catch (error) {
        console.error("Error fetching blogs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      const newStatus = currentStatus === "published" ? "draft" : "published";
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/blogs/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
          body: JSON.stringify({ status: newStatus }),
        },
      );
      const data = await res.json();
      if (data.success) {
        setBlogs(
          blogs.map((blog) =>
            blog._id === id ? { ...blog, status: newStatus } : blog,
          ),
        );
      }
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this blog?")) return;

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/blogs/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        },
      );
      const data = await res.json();
      if (data.success) {
        setBlogs(blogs.filter((blog) => blog._id !== id));
        alert("Blog deleted successfully");
      }
    } catch (error) {
      console.error("Error deleting blog:", error);
    }
  };

  return (
    <div className="space-y-6 animate-[fadeInUp_0.5s_ease-out]">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Blog Management
          </h2>
          <p className="text-gray-600">
            Create, edit and manage your blog posts
          </p>
        </div>
        <button
          className="flex items-center gap-2 bg-gradient-to-r from-orange-600 to-orange-700 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
          onClick={() => navigate("/admin/add-blog")}
        >
          <FaPlus /> Create New Post
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
          </div>
        ) : blogs.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="px-6 py-4 text-sm font-bold text-gray-700">
                    Image
                  </th>
                  <th className="px-6 py-4 text-sm font-bold text-gray-700">
                    Title
                  </th>
                  <th className="px-6 py-4 text-sm font-bold text-gray-700">
                    Status Toggle
                  </th>
                  <th className="px-6 py-4 text-sm font-bold text-gray-700 text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {blogs.map((blog) => (
                  <tr
                    key={blog._id}
                    className="hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="w-16 h-10 rounded-lg overflow-hidden bg-gray-100">
                        {blog.featuredImage ? (
                          <img
                            src={blog.featuredImage}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <FaBlog />
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-gray-900 line-clamp-1">
                        {blog.title}
                      </div>
                      <div className="text-xs text-gray-400">
                        {new Date(blog.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() =>
                            handleToggleStatus(blog._id, blog.status)
                          }
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                            blog.status === "published"
                              ? "bg-orange-600"
                              : "bg-gray-200"
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              blog.status === "published"
                                ? "translate-x-6"
                                : "translate-x-1"
                            }`}
                          />
                        </button>
                        <span
                          className={`text-xs font-semibold capitalize ${
                            blog.status === "published"
                              ? "text-green-600"
                              : "text-gray-400"
                          }`}
                        >
                          {blog.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() =>
                            window.open(`/blog/${blog.slug}`, "_blank")
                          }
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="View Live"
                        >
                          <FaEye />
                        </button>
                        <button
                          onClick={() =>
                            navigate(`/admin/edit-blog/${blog._id}`)
                          }
                          className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDelete(blog._id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-20">
            <FaBlog className="text-6xl text-gray-200 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              No Blogs Found
            </h3>
            <p className="text-gray-500 mb-6">
              Start by creating your first blog post
            </p>
            <button
              className="inline-flex items-center gap-2 text-orange-600 font-semibold hover:underline"
              onClick={() => navigate("/admin/add-blog")}
            >
              <FaPlus size={14} /> Create New Post
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogsTab;
