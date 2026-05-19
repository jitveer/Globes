import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Footer from "../../components/Footer";
import SEO from "../../components/SEO";

const Blogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(false);

  // fetching all blogs when page load first time
  const fetchAllBlogs = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/blogs?status=published`,
      );
      const data = await res.json();
      if (data.success) {
        setBlogs(data.data);
      }
      console.log("data", data);
    } catch (error) {
      console.log("Error fetching blogs: ", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllBlogs();
  }, []);

  return (
    <>
      <SEO 
        title="Blogs & News" 
        description="Read the latest news and blogs about Bangalore real estate, market trends, and property buying tips." 
        keywords="real estate blogs, property news Bangalore, real estate market trends" 
      />
      <section className="antialiased bg-gradient-to-br from-gray-50 via-orange-50/20 to-gray-50 text-gray-800 md:mt-20">
        {/* HERO */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 animate-[fadeInUp_0.6s_ease-out]">
          <div className="rounded-2xl overflow-hidden shadow-2xl group">
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1570129477492-45c003edd2be?q=80&w=1200&auto=format&fit=crop"
                alt="hero"
                className="w-full h-56 sm:h-72 md:h-96 object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60"></div>
              <div className="absolute left-6 bottom-6 text-white animate-[fadeInUp_0.8s_ease-out]">
                <h1 className="text-2xl sm:text-3xl md:text-5xl font-extrabold leading-tight mb-2">
                  Discover Your Dream Home with Us
                </h1>
                <p className="text-sm sm:text-base md:text-lg text-gray-200">
                  Expert insights, market trends, and property tips
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION: Title + Filters */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 animate-[fadeInUp_0.8s_ease-out]">
          <div className="text-center">
            <h2 className="text-2xl sm:text-4xl font-bold text-gray-900">
              Our Latest News & Blogs
            </h2>
            <p className="text-gray-600 mt-3 text-sm md:text-lg max-w-2xl mx-auto">
              Stay updated with market insights, home selling tips and trending
              property news.
            </p>
          </div>
        </section>

        {/* BLOG LIST */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pb-16">
          {loading ? (
            // Loading skeleton
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl overflow-hidden shadow-lg animate-pulse"
                >
                  <div className="w-full h-48 bg-gray-300"></div>
                  <div className="p-6 space-y-4">
                    <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                    <div className="h-4 bg-gray-300 rounded w-full"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogs.map((blog, index) => (
                <article
                  key={blog._id}
                  className={`group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:-translate-y-2 animate-[fadeInUp_${
                    0.3 + index * 0.1
                  }s_ease-out]`}
                >
                  <Link to={`/blog/${blog.slug}`}>
                    <div className="relative h-48 overflow-hidden bg-gray-100">
                      <img
                        src={
                          blog.featuredImage ||
                          "https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1000&auto=format&fit=crop"
                        }
                        alt={blog.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      {/* <span className="absolute left-4 top-4 bg-white/90 backdrop-blur-sm text-xs font-semibold text-gray-700 px-3 py-1.5 rounded-full shadow-md">
                      {blog.category}
                    </span> */}
                    </div>

                    <div className="p-6">
                      <div className="text-xs text-orange-600 font-semibold mb-2">
                        {blog.tags?.[0] || "Article"} •{" "}
                        {new Date(blog.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </div>
                      <h3 className="font-bold text-lg md:text-xl text-gray-900 mb-3 line-clamp-2 group-hover:text-orange-600 transition-colors duration-300">
                        {blog.title}
                      </h3>

                      {/* <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-bold shadow-sm ring-2 ring-white">
                          {blog.author?.name?.[0] || "A"}
                        </div>
                        <div className="text-sm font-medium text-gray-700">
                          {blog.author?.name || "Admin"}
                        </div>
                      </div>

                      <Link
                        to={`/blog/${blog.slug}`}
                        className="px-4 py-2 rounded-lg bg-orange-600 text-white text-sm font-semibold hover:bg-orange-700 transition-all duration-300 hover:scale-105 active:scale-95 shadow-md"
                      >
                        Read
                      </Link>
                    </div> */}
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!loading && blogs.length === 0 && (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">📝</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                No Blogs Found
              </h3>
              <p className="text-gray-600">
                Check back later for new articles and insights.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Custom Animations */}
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

        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
      <Footer />
    </>
  );
};

export default Blogs;
