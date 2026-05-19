import { useState } from "react";
import {
  FaClock,
  FaEnvelope,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaPaperPlane,
} from "react-icons/fa";
import Footer from "../../components/Footer";
import SEO from "../../components/SEO";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const [showOtpField, setShowOtpField] = useState(false);
  const [otp, setOtp] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [botField, setBotField] = useState(""); // Honeypot field

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1. Bot Protection
    if (botField) return;

    // 2. Validation
    const nameRegex = /^[a-zA-Z\s]{2,50}$/;
    const phoneRegex = /^[6-9]\d{9}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!showOtpField) {
      if (!nameRegex.test(formData.name)) {
        alert("Kripya sahi naam bharein (sirf characters allow hain).");
        return;
      }
      if (!emailRegex.test(formData.email)) {
        alert("Kripya ek valid email address bharein.");
        return;
      }
      if (!phoneRegex.test(formData.phone)) {
        alert("Kripya 10-digit ka mobile number bharein.");
        return;
      }
    }

    setIsVerifying(true);

    try {
      if (!showOtpField) {
        // Step 1: Request OTP
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
          alert("OTP Sent");
        } else {
          alert(data.message || "Something went wrong.");
        }
      } else {
        // Step 2: Verify OTP
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
          alert("Thank you! Your inquiry has been submitted successfully.");
          setFormData({ name: "", email: "", phone: "", message: "" });
          setOtp("");
          setShowOtpField(false);
        } else {
          alert(data.message || "Invalid OTP!");
        }
      }
    } catch (err) {
      alert("Server error. Please try again.");
    } finally {
      setIsVerifying(false);
    }
  };
  return (
    <>
      <SEO 
        title="Contact Us" 
        description="Get in touch with Globes Properties. Contact us for any real estate inquiries in Bangalore." 
        keywords="Contact Globes Properties, real estate contact, property inquiry Bangalore" 
      />
      <div className="bg-gray-50 text-gray-800 antialiased"></div>
      <section className="relative">
        <div className="w-full h-56 sm:h-72 md:h-96 lg:h-[360px] overflow-hidden relative md:mt-20">
          <img
            src="https://images.unsplash.com/photo-1552581234-26160f608093?q=80&w=1200&auto=format&fit=crop"
            alt="hero"
            className="w-full h-full object-cover brightness-50"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center px-4">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white">
                Contact
              </h1>
            </div>
          </div>
        </div>
        <main className="relative mt-10 max-w-7xl mx-auto -mt-12 px-4 sm:px-6 lg:px-8 ">
          <div className=" relative flex justify-center">
            <span className="bg-white rounded-full px-4 py-1 text-xs text-gray-600 shadow-lg">
              CONTACT INFO
            </span>
          </div>

          <div className="text-center mt-4">
            <h2 className="text-3xl sm:text-4xl font-bold text-orange-600">
              Contact & <span className="text-gray-800">Join Together</span>
            </h2>
            <p className="mt-3 text-gray-600 max-w-2xl mx-auto">
              At Globes Properties, we unite builders, buyers, sellers, and
              investors across Bangalore real estate.
            </p>
          </div>

          {/* <!-- info cards --> */}
          <section className="mt-8 grid grid-cols-1 gap-0 sm:grid-cols-2 lg:grid-cols-4 md:gap-6">
            <div className="bg-gray-100 rounded-2xl p-5 shadow-xl">
              <div className="flex items-start gap-3">
                <div className="w-11 h-11 rounded-lg bg-orange-600/10 flex items-center justify-center">
                  {/* <!-- location icon --> */}
                  <FaMapMarkerAlt size={18} className="text-orange-600" />
                </div>
                <div>
                  <div className="text-xs text-gray-500">Location</div>
                  <div className="font-semibold">Visit Us At</div>
                  <div className="text-sm text-gray-500 mt-1">
                    Kalyan Nagar, Bangalore — 560043
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-100 rounded-2xl p-5 shadow-xl">
              <div className="flex items-start gap-3">
                <div className="w-11 h-11 rounded-lg bg-orange-600/10 flex items-center justify-center">
                  <FaPhoneAlt size={20} className="text-orange-600" />
                </div>
                <div>
                  <div className="text-xs text-gray-500">24/7 Service</div>
                  <div className="font-semibold">Call Us On</div>
                  <div className="text-sm text-gray-500 mt-1">
                    +91 99457 39702
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-100 rounded-2xl p-5 shadow-xl">
              <div className="flex items-start gap-3">
                <div className="w-11 h-11 rounded-lg bg-orange-600/10 flex items-center justify-center">
                  <FaEnvelope size={18} className="text-orange-600" />
                </div>
                <div>
                  <div className="text-xs text-gray-500">Drop A Line</div>
                  <div className="font-semibold">Mail Address</div>
                  <div className="text-sm text-gray-500 mt-1">
                    support@globesproperties.com
                    <br />
                    contact@globesproperties.com
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-100 rounded-2xl p-5 shadow-xl">
              <div className="flex items-start gap-3">
                <div className="w-11 h-11 rounded-lg bg-orange-600/10 flex items-center justify-center">
                  <FaClock size={18} className="text-orange-600" />
                </div>
                <div>
                  <div className="text-xs text-gray-500">Office Hours</div>
                  <div className="font-semibold">Opening Time</div>
                  <div className="text-sm text-gray-500 mt-1">
                    Mon - Sat : 10am - 6:30pm
                    <br />
                    Sunday (Closed)
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* <!-- big section: agent image left + form right --> */}
          <section
            className="mt-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center "
            id="contact"
          >
            {/* <div className="lg:col-span-5 flex justify-center lg:justify-end">
              <div className="w-full max-w-md bg-white rounded-2xl overflow-hidden shadow-card p-4">
                <img
                  src="https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=800&auto=format&fit=crop"
                  alt="agent"
                  className="hidden lg:block w-full h-96 object-cover rounded-lg"
                />
              </div>
            </div> */}

            <div className="lg:col-span-8 lg:col-start-3">
              <div className="bg-white rounded-2xl p-8 shadow-card w-full">
                <div className="flex flex-col items-center text-center justify-between">
                  <div>
                    <div className="text-xs text-gray-500">CONTACT US</div>
                    <h3 className="text-2xl sm:text-3xl font-bold mt-1">
                      Reach & Get In Touch With Us!
                    </h3>
                  </div>
                  <div className="hidden sm:block text-sm text-gray-500">
                    We will respond within 24 hours
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                  <input
                    type="text"
                    value={botField}
                    onChange={(e) => setBotField(e.target.value)}
                    className="hidden"
                    tabIndex="-1"
                    autoComplete="off"
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input
                      placeholder="Your Name*"
                      required
                      disabled={showOtpField}
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="border rounded-full px-5 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:bg-gray-100 placeholder:text-gray-400"
                    />
                    <input
                      type="email"
                      placeholder="Your Email*"
                      required
                      disabled={showOtpField}
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="border rounded-full px-5 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:bg-gray-100 placeholder:text-gray-400"
                    />
                  </div>

                  {!showOtpField && (
                    <div className="space-y-4 animate-[fadeInUp_0.3s_ease-out]">
                      <input
                        placeholder="Your 10-digit number*"
                        required
                        maxLength="10"
                        inputMode="numeric"
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            phone: e.target.value.replace(/\D/g, ""),
                          })
                        }
                        className="w-full border rounded-full px-5 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 placeholder:text-gray-400"
                      />
                      <textarea
                        rows="4"
                        placeholder="Tell us about your requirements..."
                        required
                        value={formData.message}
                        onChange={(e) =>
                          setFormData({ ...formData, message: e.target.value })
                        }
                        className="w-full border rounded-2xl px-5 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 placeholder:text-gray-400 resize-none"
                      ></textarea>
                    </div>
                  )}

                  {showOtpField && (
                    <div className="animate-[slideUp_0.4s_ease-out] bg-orange-50 p-6 rounded-2xl border-2 border-orange-200">
                      <label className="block text-center text-xs font-bold text-orange-600 mb-3 uppercase tracking-widest">
                        Verify Email OTP
                      </label>
                      <input
                        type="text"
                        required
                        maxLength="6"
                        inputMode="numeric"
                        value={otp}
                        onChange={(e) =>
                          setOtp(e.target.value.replace(/\D/g, ""))
                        }
                        placeholder="••••••"
                        className="w-full border-2 border-orange-500 rounded-2xl px-5 py-4 text-center text-3xl font-black tracking-[10px] focus:outline-none bg-white placeholder:tracking-normal"
                      />
                      <p className="text-center text-xs text-gray-500 mt-2 italic">
                        Validation code sent to your inbox
                      </p>
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <button
                      type="submit"
                      disabled={isVerifying}
                      className="w-full sm:w-auto bg-orange-600 text-white px-8 py-3 rounded-full font-bold hover:bg-orange-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {isVerifying ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <FaPaperPlane />
                      )}
                      {showOtpField
                        ? "Verify & Submit"
                        : "Send Verification OTP"}
                    </button>
                    {showOtpField && (
                      <button
                        type="button"
                        onClick={() => setShowOtpField(false)}
                        className="text-sm font-bold text-gray-400 hover:text-orange-600 transition-colors"
                      >
                        Edit Details
                      </button>
                    )}
                  </div>
                </form>

                <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm text-gray-600 justify-items-center">
                  <div className="flex items-start gap-2">
                    <div className="text-green-800 ">✔</div>
                    <div>Verified Listings Only</div>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="text-green-800">✔</div>
                    <div>Site Visit Support</div>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="text-green-800">✔</div>
                    <div>Expert Consultation</div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* <!-- map strip: embedded google maps (replace coordinates if needed) --> */}
          <section className="mt-12 mb-16">
            <div className="rounded-xl overflow-hidden">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d19849.44138692748!2d77.5951155!3d12.9923411!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae1666c5b3b0b1%3A0xf7fb0a6c1e9f2c4f!2sKalyan%20Nagar%2C%20Bengaluru%2C%20Karnataka!5e0!3m2!1sen!2sin!4v1692860000000!5m2!1sen!2sin"
                width="100%"
                height="450"
                style={{ border: "0" }}
                allowFullScreen=""
                loading="lazy"
                title="Google Maps Location" // Added title for accessibility
              ></iframe>
            </div>
          </section>
        </main>
      </section>
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
      <Footer />
    </>
  );
};

export default Contact;
