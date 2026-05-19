import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { FaCalendarAlt, FaUser, FaTag, FaChevronLeft } from "react-icons/fa";
import SEO from "../../components/SEO";

// Helper component to render Editor.js blocks
const EditorBlockRenderer = ({ blocks }) => {
  if (!blocks) return null;

  return (
    <div className="prose prose-lg max-w-none space-y-6">
      {blocks.map((block, index) => {
        switch (block.type) {
          case "header":
            const HeaderTag = `h${block.data.level}`;
            return (
              <HeaderTag
                key={index}
                className="font-bold text-gray-900 mt-8 mb-4"
                dangerouslySetInnerHTML={{ __html: block.data.text }}
              />
            );
          case "paragraph":
            return (
              <p
                key={index}
                className="text-gray-700 leading-relaxed mb-4 text-justify"
                dangerouslySetInnerHTML={{ __html: block.data.text }}
              />
            );
          case "list":
            const ListTag = block.data.style === "ordered" ? "ol" : "ul";
            const renderListItems = (items) => {
              return items.map((item, i) => {
                const content = typeof item === "string" ? item : item.content;
                const nestedItems = typeof item === "object" && item.items ? item.items : [];
                return (
                  <li key={i}>
                    <span dangerouslySetInnerHTML={{ __html: content }} />
                    {nestedItems.length > 0 && (
                      <ListTag className={`list-${block.data.style === "ordered" ? "decimal" : "disc"} ml-6 space-y-2 mt-2`}>
                        {renderListItems(nestedItems)}
                      </ListTag>
                    )}
                  </li>
                );
              });
            };
            return (
              <ListTag
                key={index}
                className={`list-${block.data.style === "ordered" ? "decimal" : "disc"} ml-6 space-y-2 text-gray-700 mb-6`}
              >
                {renderListItems(block.data.items)}
              </ListTag>
            );
          case "image":
            return (
              <figure
                key={index}
                className="my-8 rounded-2xl overflow-hidden shadow-lg border border-gray-100"
              >
                <img
                  src={block.data.file.url}
                  alt={block.data.caption || ""}
                  className="w-full object-cover"
                />
                {block.data.caption && (
                  <figcaption className="p-3 bg-gray-50 text-sm text-gray-500 text-center italic">
                    {block.data.caption}
                  </figcaption>
                )}
              </figure>
            );
          case "quote":
            return (
              <blockquote
                key={index}
                className="border-l-4 border-orange-600 bg-orange-50/50 p-6 my-8 rounded-r-2xl italic"
              >
                <p
                  className="text-xl text-gray-800 mb-2"
                  dangerouslySetInnerHTML={{ __html: block.data.text }}
                />
                {block.data.caption && (
                  <footer className="text-sm font-semibold text-orange-600">
                    — {block.data.caption}
                  </footer>
                )}
              </blockquote>
            );
          case "checklist":
            return (
              <div key={index} className="space-y-2 mb-6">
                {block.data.items.map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={item.checked}
                      readOnly
                      className="mt-1.5 h-4 w-4 rounded border-gray-300 text-orange-600 focus:ring-orange-600"
                    />
                    <span
                      className={
                        item.checked
                          ? "text-gray-500 line-through"
                          : "text-gray-700 font-medium"
                      }
                      dangerouslySetInnerHTML={{ __html: item.text }}
                    />
                  </div>
                ))}
              </div>
            );
          case "table":
            return (
              <div
                key={index}
                className="overflow-x-auto my-8 border border-gray-200 rounded-xl shadow-sm"
              >
                <table className="min-w-full divide-y divide-gray-200">
                  <tbody className="bg-white divide-y divide-gray-200">
                    {block.data.content.map((row, i) => (
                      <tr key={i}>
                        {row.map((cell, j) => (
                          <td
                            key={j}
                            className="px-6 py-4 text-sm text-gray-700 border-r border-gray-100 last:border-r-0"
                            dangerouslySetInnerHTML={{ __html: cell }}
                          />
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          case "warning":
            return (
              <div
                key={index}
                className="p-6 bg-red-50 border-l-4 border-red-500 rounded-lg my-6 flex gap-4"
              >
                <div className="text-red-500 font-bold text-2xl">⚠</div>
                <div>
                  <h4
                    className="font-bold text-red-900 mb-1"
                    dangerouslySetInnerHTML={{ __html: block.data.title }}
                  />
                  <p
                    className="text-red-700 text-sm"
                    dangerouslySetInnerHTML={{ __html: block.data.message }}
                  />
                </div>
              </div>
            );
          case "delimiter":
            return (
              <div
                key={index}
                className="py-8 flex justify-center text-gray-300 text-4xl tracking-[1em]"
              >
                ***
              </div>
            );
          case "code":
            return (
              <pre
                key={index}
                className="bg-gray-900 text-gray-100 p-6 rounded-xl my-6 overflow-x-auto text-sm font-mono shadow-inner"
              >
                <code>{block.data.code}</code>
              </pre>
            );
          case "embed":
            return (
              <div
                key={index}
                className="my-8 aspect-video rounded-2xl overflow-hidden shadow-xl"
              >
                <iframe
                  src={block.data.embed}
                  title={block.data.caption || "EditorJS Embed"}
                  className="w-full h-full border-none"
                  allowFullScreen
                />
                {block.data.caption && (
                  <p className="p-3 bg-gray-50 text-xs text-gray-500 text-center font-medium">
                    {block.data.caption}
                  </p>
                )}
              </div>
            );
          case "linkTool":
            return (
              <div
                key={index}
                className="border border-gray-200 rounded-xl p-4 my-6 hover:shadow-md transition-all group flex gap-4 items-center"
              >
                {block.data.meta?.image?.url && (
                  <img
                    src={block.data.meta.image.url}
                    alt=""
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-gray-900 mb-1 truncate group-hover:text-orange-600 transition-colors">
                    {block.data.meta?.title || block.data.link}
                  </h4>
                  <p className="text-sm text-gray-500 line-clamp-2">
                    {block.data.meta?.description}
                  </p>
                  <a
                    href={block.data.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-orange-600 font-bold mt-2 inline-block"
                  >
                    Visit Link →
                  </a>
                </div>
              </div>
            );
          default:
            return null;
        }
      })}
    </div>
  );
};

function Post() {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [relatedBlogs, setRelatedBlogs] = useState([]);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/v1/blogs/${slug}`,
        );
        const data = await res.json();
        if (data.success) {
          setBlog(data.data);
          // Fetch related blogs from the same category
          fetchRelatedBlogs(data.data.category, data.data._id);
        }
      } catch (error) {
        console.error("Error fetching blog:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchRelatedBlogs = async (category, currentId) => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/v1/blogs?category=${category}`,
        );
        const data = await res.json();
        if (data.success) {
          setRelatedBlogs(
            data.data.filter((b) => b._id !== currentId).slice(0, 3),
          );
        }
      } catch (error) {
        console.error("Error fetching related blogs:", error);
      }
    };

    fetchBlog();
    // Scroll to top when slug changes
    window.scrollTo(0, 0);
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-orange-600 shadow-lg"></div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-6">
        <div className="text-9xl mb-4 grayscale opacity-20">🌍</div>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Blog Post Not Found
        </h2>
        <p className="text-gray-600 mb-8 max-w-md text-center">
          Sorry, we couldn't find the article you're looking for. It might have
          been removed or moved.
        </p>
        <Link
          to="/blogs"
          className="bg-orange-600 text-white px-8 py-3 rounded-full font-bold shadow-lg hover:bg-orange-700 transition-all flex items-center gap-2"
        >
          <FaChevronLeft /> Back to Blogs
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      <SEO
        title={blog.seoTitle || blog.title}
        description={
          blog.seoDescription ||
          blog.content?.blocks
            ?.find((b) => b.type === "paragraph")
            ?.data?.text?.replace(/<[^>]*>?/gm, "")
            ?.substring(0, 150) ||
          "Read this amazing blog on Globes Properties."
        }
        image={blog.featuredImage || undefined}
        keywords={blog.seoKeywords || (blog.tags ? blog.tags.join(", ") : undefined)}
      />
      {/* <!-- HERO SECTION --> */}
      <section className="relative h-[60vh] min-h-[400px] overflow-hidden">
        <img
          src={
            blog.featuredImage ||
            "https://images.unsplash.com/photo-1570129477492-45c003edd2be?q=80&w=1200&auto=format&fit=crop"
          }
          alt={blog.featuredImageAlt || blog.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent"></div>
        <div className="absolute inset-x-0 bottom-0 max-w-5xl mx-auto px-6 pb-12">
          <Link
            to="/blogs"
            className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 text-sm font-semibold transition-colors"
          >
            <FaChevronLeft /> Back to Articles
          </Link>
          <div className="flex flex-wrap gap-3 mb-6"></div>
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-8 drop-shadow-2xl">
            {blog.title}
          </h1>
          <div className="flex flex-wrap items-center gap-6 text-white/90 text-sm font-medium">
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full ring-1 ring-white/20">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-bold text-xs ring-2 ring-white/30">
                {blog.author?.name?.[0] || "A"}
              </div>
              <span>{blog.author?.name || "Globes Properties Team"}</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full ring-1 ring-white/20">
              <FaCalendarAlt className="text-orange-400" />
              <span>
                {new Date(blog.createdAt).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full ring-1 ring-white/20 uppercase tracking-widest text-[10px] font-black">
              {blog.views} Views
            </div>
          </div>
        </div>
      </section>

      {/* <!-- MAIN CONTENT AREA --> */}
      <div className="max-w-5xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-16">
          {/* <!-- MAIN ARTICLE --> */}
          <article className="animate-[fadeInUp_0.6s_ease-out]">
            {/* <!-- Content Blocks --> */}
            <div className="blog-content">
              <EditorBlockRenderer blocks={blog.content?.blocks} />
            </div>

            {/* <!-- Tags & Share --> */}
            {blog.tags && blog.tags.length > 0 && (
              <div className="mt-16 pt-8 border-t border-gray-100">
                <div className="flex flex-wrap gap-2 items-center">
                  <FaTag className="text-gray-400 mr-2" />
                  {blog.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="bg-gray-100 text-gray-600 text-xs font-bold px-4 py-2 rounded-lg hover:bg-orange-50 hover:text-orange-600 transition-all cursor-pointer"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </article>

          {/* <!-- SIDEBAR --> */}
          <aside className="space-y-12">
            {/* <!-- Author Profile Mini --> */}
            <div className="bg-gray-50 rounded-3xl p-8 border border-gray-100 shadow-sm text-center">
              <img
                src="https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=400&auto=format&fit=crop"
                alt="Author"
                className="w-24 h-24 rounded-full mx-auto object-cover mb-4 ring-4 ring-white shadow-md"
              />
              <h4 className="font-bold text-gray-900 text-lg">
                {blog.author?.name || "Globes Properties"}
              </h4>
              <p className="text-sm text-gray-500 mb-6 font-medium mt-1 uppercase tracking-wider">
                Property Specialist
              </p>
              <p className="text-sm text-gray-600 leading-relaxed italic mb-6">
                Expert in Indian Real Estate markets and luxury property
                investment strategies.
              </p>
              <div className="pt-6 border-t border-gray-200">
                <Link
                  to="/contact"
                  className="text-orange-600 font-extrabold text-sm uppercase tracking-widest hover:text-orange-700 transition-colors"
                >
                  Contact Expert →
                </Link>
              </div>
            </div>

            {/* <!-- Related Posts --> */}
            {relatedBlogs.length > 0 && (
              <div className="space-y-6">
                <h3 className="text-xl font-black text-gray-900 uppercase tracking-widest border-b-2 border-orange-600 pb-3 inline-block">
                  Recommended
                </h3>
                <div className="space-y-6 mt-4">
                  {relatedBlogs.map((rBlog) => (
                    <Link
                      key={rBlog._id}
                      to={`/blog/${rBlog.slug}`}
                      className="group block space-y-3"
                    >
                      <div className="aspect-video rounded-2xl overflow-hidden bg-gray-100 shadow-sm">
                        <img
                          src={rBlog.featuredImage}
                          alt={rBlog.title}
                          className="w-full h-full object-cover transition-transform group-hover:scale-110"
                        />
                      </div>
                      <h4 className="font-bold text-gray-900 group-hover:text-orange-600 transition-colors line-clamp-2 leading-snug">
                        {rBlog.title}
                      </h4>
                      <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">
                        {new Date(rBlog.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* <!-- CTA Box --> */}
            <div className="bg-gradient-to-br from-orange-600 to-orange-700 rounded-3xl p-8 text-white shadow-xl shadow-orange-200 overflow-hidden relative group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-white/20 transition-all"></div>
              <h4 className="text-2xl font-black mb-4 relative z-10 leading-tight">
                Find Your Ideal Home Today!
              </h4>
              <p className="text-white/80 text-sm mb-8 relative z-10 font-medium">
                Get personalized site visits and exclusive pricing for
                Bangalore's best properties.
              </p>
              <a
                href="tel:+919945739702"
                className="block w-full bg-white text-orange-700 py-4 rounded-xl font-black text-center shadow-lg hover:bg-gray-50 transition-all transform active:scale-95 relative z-10 uppercase tracking-widest text-xs"
              >
                Schedule Call
              </a>
            </div>
          </aside>
        </div>
      </div>

      <style>{`
        .blog-content h1 { font-size: 2.25rem; line-height: 2.5rem; font-weight: 900; color: #111827; margin-bottom: 1.5rem; }
        .blog-content h2 { font-size: 1.875rem; line-height: 2.25rem; font-weight: 900; color: #111827; margin-bottom: 1.25rem; }
        .blog-content h3 { font-size: 1.5rem; line-height: 2rem; font-weight: 700; color: #111827; margin-bottom: 1rem; }
        .blog-content p { font-size: 1.125rem; line-height: 1.75rem; color: #374151; margin-bottom: 1.5rem; text-align: justify; }
        .blog-content a { color: #ea580c; font-weight: 700; text-decoration: underline; transition: color 0.3s; }
        .blog-content a:hover { color: #c2410c; }
        .blog-content ul { list-style-type: disc; margin-left: 1.5rem; margin-bottom: 1.5rem; }
        .blog-content ol { list-style-type: decimal; margin-left: 1.5rem; margin-bottom: 1.5rem; }
        .blog-content li { margin-bottom: 0.5rem; color: #374151; }
        
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

export default Post;
