import { Link } from "react-router-dom";
import {
  FaShieldAlt,
  FaLock,
  FaUserShield,
  FaDatabase,
  FaCookie,
  FaEnvelope,
} from "react-icons/fa";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-orange-50/20 to-gray-50 pt-20 md:pt-24 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12 animate-[fadeInUp_0.5s_ease-out]">
          <div className="w-20 h-20 bg-gradient-to-br from-orange-600 to-orange-700 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <FaShieldAlt className="text-4xl text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Privacy Policy
          </h1>
          <p className="text-gray-600 text-lg">
            Last updated: December 18, 2024
          </p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 space-y-8 animate-[fadeInUp_0.6s_ease-out]">
          {/* Introduction */}
          <section>
            <p className="text-gray-700 leading-relaxed">
              At Globes Properties, we are committed to protecting your privacy
              and ensuring the security of your personal information. This
              Privacy Policy explains how we collect, use, disclose, and
              safeguard your information when you use our website and services.
            </p>
          </section>

          {/* Information We Collect */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                <FaDatabase className="text-orange-600 text-xl" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">
                Information We Collect
              </h2>
            </div>
            <div className="space-y-4 ml-15">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Personal Information
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  We collect information that you provide directly to us,
                  including:
                </p>
                <ul className="list-disc list-inside text-gray-700 mt-2 space-y-1 ml-4">
                  <li>Name and contact information (email, phone number)</li>
                  <li>Account credentials (username, password)</li>
                  <li>Property preferences and search history</li>
                  <li>Communication preferences</li>
                  <li>Payment information (for premium services)</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Automatically Collected Information
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  When you use our services, we automatically collect:
                </p>
                <ul className="list-disc list-inside text-gray-700 mt-2 space-y-1 ml-4">
                  <li>
                    Device information (IP address, browser type, operating
                    system)
                  </li>
                  <li>Usage data (pages viewed, time spent, click patterns)</li>
                  <li>Location data (with your permission)</li>
                  <li>Cookies and similar tracking technologies</li>
                </ul>
              </div>
            </div>
          </section>

          {/* How We Use Your Information */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                <FaUserShield className="text-orange-600 text-xl" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">
                How We Use Your Information
              </h2>
            </div>
            <div className="ml-15">
              <p className="text-gray-700 leading-relaxed mb-3">
                We use the collected information for the following purposes:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>To provide and maintain our services</li>
                <li>
                  To personalize your experience and property recommendations
                </li>
                <li>To process your transactions and send notifications</li>
                <li>
                  To communicate with you about updates, offers, and promotions
                </li>
                <li>To improve our website and services</li>
                <li>To detect and prevent fraud and security issues</li>
                <li>To comply with legal obligations</li>
              </ul>
            </div>
          </section>

          {/* Data Security */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                <FaLock className="text-orange-600 text-xl" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">
                Data Security
              </h2>
            </div>
            <div className="ml-15">
              <p className="text-gray-700 leading-relaxed">
                We implement appropriate technical and organizational security
                measures to protect your personal information against
                unauthorized access, alteration, disclosure, or destruction.
                These measures include:
              </p>
              <ul className="list-disc list-inside text-gray-700 mt-3 space-y-1 ml-4">
                <li>SSL/TLS encryption for data transmission</li>
                <li>Secure password hashing and storage</li>
                <li>Regular security audits and updates</li>
                <li>Access controls and authentication mechanisms</li>
                <li>Employee training on data protection</li>
              </ul>
            </div>
          </section>

          {/* Cookies */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                <FaCookie className="text-orange-600 text-xl" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">
                Cookies and Tracking
              </h2>
            </div>
            <div className="ml-15">
              <p className="text-gray-700 leading-relaxed mb-3">
                We use cookies and similar tracking technologies to enhance your
                browsing experience. You can control cookie preferences through
                your browser settings. Types of cookies we use:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                <li>
                  <strong>Essential Cookies:</strong> Required for basic website
                  functionality
                </li>
                <li>
                  <strong>Performance Cookies:</strong> Help us understand how
                  visitors use our site
                </li>
                <li>
                  <strong>Functional Cookies:</strong> Remember your preferences
                  and settings
                </li>
                <li>
                  <strong>Marketing Cookies:</strong> Track your activity to
                  show relevant ads
                </li>
              </ul>
            </div>
          </section>

          {/* Third-Party Sharing */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Information Sharing
            </h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              We do not sell your personal information. We may share your
              information with:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>
                <strong>Property Owners/Agents:</strong> When you inquire about
                a property
              </li>
              <li>
                <strong>Service Providers:</strong> Who help us operate our
                business
              </li>
              <li>
                <strong>Legal Authorities:</strong> When required by law or to
                protect our rights
              </li>
              <li>
                <strong>Business Transfers:</strong> In case of merger,
                acquisition, or sale
              </li>
            </ul>
          </section>

          {/* Your Rights */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Your Rights
            </h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              You have the following rights regarding your personal information:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>
                <strong>Access:</strong> Request a copy of your personal data
              </li>
              <li>
                <strong>Correction:</strong> Update or correct inaccurate
                information
              </li>
              <li>
                <strong>Deletion:</strong> Request deletion of your personal
                data
              </li>
              <li>
                <strong>Opt-out:</strong> Unsubscribe from marketing
                communications
              </li>
              <li>
                <strong>Data Portability:</strong> Receive your data in a
                portable format
              </li>
              <li>
                <strong>Object:</strong> Object to certain processing of your
                data
              </li>
            </ul>
          </section>

          {/* Children's Privacy */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Children's Privacy
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Our services are not intended for individuals under the age of 18.
              We do not knowingly collect personal information from children. If
              you believe we have collected information from a child, please
              contact us immediately.
            </p>
          </section>

          {/* Changes to Policy */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Changes to This Policy
            </h2>
            <p className="text-gray-700 leading-relaxed">
              We may update this Privacy Policy from time to time. We will
              notify you of any changes by posting the new policy on this page
              and updating the "Last updated" date. We encourage you to review
              this policy periodically.
            </p>
          </section>

          {/* Contact */}
          <section className="bg-gradient-to-br from-orange-50 to-orange-100/50 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-md">
                <FaEnvelope className="text-orange-600 text-xl" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Contact Us</h2>
            </div>
            <p className="text-gray-700 leading-relaxed mb-4">
              If you have any questions about this Privacy Policy or our data
              practices, please contact us:
            </p>
            <div className="space-y-2 text-gray-700">
              <p>
                <strong>Email:</strong> privacy@globesproperties.com
              </p>
              <p>
                <strong>Phone:</strong> +91 98765 43210
              </p>
              <p>
                <strong>Address:</strong> Globes Properties, Bangalore, India
              </p>
            </div>
          </section>

          {/* Back Button */}
          <div className="text-center pt-6">
            <Link
              to="/"
              className="inline-block bg-gradient-to-r from-orange-600 to-orange-700 text-white px-8 py-3 rounded-xl font-semibold hover:from-orange-700 hover:to-orange-800 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
