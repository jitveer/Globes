import React, { useEffect, useRef } from "react";
import { FaHome, FaTrophy, FaCalendarAlt, FaBullseye } from "react-icons/fa";
import Footer from "../../components/Footer";
import { useNavigate } from "react-router-dom";
import SEO from "../../components/SEO";

export default function AboutUs() {
  const navigate = useNavigate();
  // simple reusable hook to animate elements on scroll (adds "in-view" class)
  useEffect(() => {
    const els = document.querySelectorAll(".scroll-animate");
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
          }
        });
      },
      { threshold: 0.12 },
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-white text-gray-800 antialiased mt-20">
      <SEO 
        title="About Us" 
        description="Learn more about Globes Properties, your trusted real estate partner in Bangalore." 
        keywords="About Globes Properties, real estate Bangalore, property dealers in Bangalore" 
      />
      {/* HERO */}
      <header className="max-w-7xl mx-auto px-6 py-12 lg:py-20">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <div className="space-y-6">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-800">
              About Us <br />
              <span className="text-orange-600"> Globes Properties</span>
            </h1>
            <p className="text-gray-600 max-w-xl">
              Globes Properties is a trusted real estate company in Bangalore,
              dedicated to helping you find the perfect home or investment.
              Whether you're buying, selling, or exploring property options, our
              expert team is here to guide you.
            </p>

            <div className="flex gap-4 flex-wrap">
              <button
                className="inline-flex items-center gap-2 bg-gray-600 hover:bg-orange-700 text-white px-5 py-2 rounded-lg shadow-md transition"
                onClick={() => navigate("/contact")}
              >
                Contact Us
              </button>
              <button
                className="inline-flex items-center gap-2 border border-gray-600 text-orange-600 px-5 py-2 rounded-lg hover:bg-orange-50 transition"
                onClick={() => navigate("/properties")}
              >
                View Listings
              </button>
            </div>

            <div className="grid grid-cols-3 gap-4 mt-6">
              <div className="flex flex-col items-start gap-2">
                <div className="p-3 bg-orange-50 rounded-full text-orange-600 shadow-sm">
                  <FaHome />
                </div>
                <div className="text-sm font-semibold">Residential</div>
                <div className="text-xs text-gray-500">Prime locations</div>
              </div>

              <div className="flex flex-col items-start gap-2">
                <div className="p-3 bg-orange-50 rounded-full text-orange-600 shadow-sm">
                  <FaTrophy />
                </div>
                <div className="text-sm font-semibold">Trusted</div>
                <div className="text-xs text-gray-500">Quality & value</div>
              </div>

              <div className="flex flex-col items-start gap-2">
                <div className="p-3 bg-orange-50 rounded-full text-orange-600 shadow-sm">
                  <FaCalendarAlt />
                </div>
                <div className="text-sm font-semibold">On Time</div>
                <div className="text-xs text-gray-500">Transparent process</div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="rounded-2xl overflow-hidden shadow-xl transform hover:scale-105 transition duration-500">
              <img
                src="https://mnmenterprises.ltd/wp-content/uploads/2026/02/Evolving-South-India-Business-Excellence-Award-2026-1024x768.webp"
                alt="Bangalore skyline"
                className="w-full h-72 sm:h-96 object-cover"
              />
            </div>
          </div>
        </div>
      </header>

      {/* MISSION & VALUES */}
      <section className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-2 gap-10 items-start">
          <div className="scroll-animate opacity-0 translate-y-6 transition duration-700">
            <h2 className="text-2xl font-bold mb-3">Our Mission</h2>
            <p className="text-gray-600">
              At Globes Properties, our mission is simple yet profound: to
              empower individuals and families in Bangalore to achieve their
              real estate goals with confidence and peace of mind. We strive to
              exceed expectations by delivering personalized service, fostering
              transparent communication, and upholding the highest standards of
              integrity and professionalism in every interaction.
            </p>
          </div>

          <div className="scroll-animate opacity-0 translate-y-6 transition duration-700 delay-75">
            <h2 className="text-2xl font-bold mb-3">Our Values</h2>
            <ul className="space-y-3 text-gray-600">
              <li className="flex gap-3 items-start">
                <div className="text-orange-600 mt-1">
                  <FaBullseye />
                </div>
                <div>
                  <div className="font-semibold">Integrity</div>
                  <div className="text-sm text-gray-500">
                    We uphold the highest standards of honesty, transparency,
                    and ethical conduct.
                  </div>
                </div>
              </li>

              <li className="flex gap-3 items-start">
                <div className="text-orange-600 mt-1">
                  <FaHome />
                </div>
                <div>
                  <div className="font-semibold">Customer Focus</div>
                  <div className="text-sm text-gray-500">
                    Personalized service and expert advice for every client.
                  </div>
                </div>
              </li>

              <li className="flex gap-3 items-start">
                <div className="text-orange-600 mt-1">
                  <FaTrophy />
                </div>
                <div>
                  <div className="font-semibold">Expertise</div>
                  <div className="text-sm text-gray-500">
                    Deep knowledge of the Bangalore market to guide confident
                    decisions.
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="bg-gray-50 py-12">
        <div className="max-w-6xl mx-auto px-6">
          <h3 className="text-2xl font-bold text-center mb-8">Our Services</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <article className="scroll-animate p-6 bg-white rounded-2xl shadow hover:shadow-lg transition">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-orange-50 rounded-xl text-orange-600">
                  <FaHome />
                </div>
                <div>
                  <h4 className="font-semibold">Buyer Representation</h4>
                  <p className="text-sm text-gray-500">
                    Expert support from property search to final deal.
                  </p>
                </div>
              </div>
              <img
                src="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=1200&auto=format&fit=crop"
                alt="agent"
                className="w-full h-40 object-cover rounded-lg"
              />
            </article>

            <article className="scroll-animate p-6 bg-white rounded-2xl shadow hover:shadow-lg transition">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-orange-50 rounded-xl text-orange-600">
                  <FaTrophy />
                </div>
                <div>
                  <h4 className="font-semibold">Property Valuation</h4>
                  <p className="text-sm text-gray-500">
                    Accurate & reliable market valuations.
                  </p>
                </div>
              </div>
              <img
                src="https://images.unsplash.com/photo-1582407947304-fd86f028f716?q=80&w=1200&auto=format&fit=crop"
                alt="aerial"
                className="w-full h-40 object-cover rounded-lg"
              />
            </article>

            <article className="scroll-animate p-6 bg-white rounded-2xl shadow hover:shadow-lg transition">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-orange-50 rounded-xl text-orange-600">
                  <FaBullseye />
                </div>
                <div>
                  <h4 className="font-semibold">Seller Representation</h4>
                  <p className="text-sm text-gray-500">
                    Marketing & negotiation for best terms.
                  </p>
                </div>
              </div>
              <img
                src="https://images.unsplash.com/photo-1494526585095-c41746248156?q=80&w=1200&auto=format&fit=crop"
                alt="site visit"
                className="w-full h-40 object-cover rounded-lg"
              />
            </article>
          </div>
        </div>
      </section>

      {/* CTA FOOTER */}
      <footer className="bg-white py-10">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h4 className="text-xl font-bold">
            Ready to find your property in Bangalore?
          </h4>
          <p className="text-gray-600 mt-2 mb-6">
            Contact our expert team for personalized assistance.
          </p>
          <div className="flex justify-center gap-4">
            <button
              className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg shadow"
              onClick={() => navigate("/properties")}
            >
              Get Started
            </button>
            <button className="border border-orange-600 text-orange-600 px-6 py-3 rounded-lg hover:bg-orange-50">
              Learn More
            </button>
          </div>
          <p className="text-xs text-gray-400 mt-6">
            © {new Date().getFullYear()} Globes Properties. All rights reserved.
          </p>
        </div>
      </footer>

      {/* small style tweaks for animation states - uses Tailwind utility classes, no external lib */}
      <style>{`
        .scroll-animate { will-change: transform, opacity; }
        .scroll-animate.in-view { opacity: 1 !important; transform: translateY(0) !important; }
        .scroll-animate.opacity-0 { opacity: 0; transform: translateY(18px); }
      `}</style>
      <Footer />
    </div>
  );
}
