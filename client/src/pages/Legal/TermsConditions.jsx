import { Link } from "react-router-dom";
import {
  FaFileContract,
  FaCheckCircle,
  FaExclamationTriangle,
  FaGavel,
  FaEnvelope,
} from "react-icons/fa";

const TermsConditions = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-orange-50/20 to-gray-50 pt-20 md:pt-24 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12 animate-[fadeInUp_0.5s_ease-out]">
          <div className="w-20 h-20 bg-gradient-to-br from-orange-600 to-orange-700 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <FaFileContract className="text-4xl text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Terms & Conditions
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
              Welcome to Globes Properties. By accessing and using our website
              and services, you agree to be bound by these Terms and Conditions.
              Please read them carefully before using our platform.
            </p>
          </section>

          {/* Acceptance of Terms */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                <FaCheckCircle className="text-orange-600 text-xl" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">
                Acceptance of Terms
              </h2>
            </div>
            <div className="ml-15">
              <p className="text-gray-700 leading-relaxed mb-3">
                By accessing or using Globes Properties, you acknowledge that
                you have read, understood, and agree to be bound by these Terms
                and Conditions, including our Privacy Policy. If you do not
                agree with any part of these terms, you must not use our
                services.
              </p>
            </div>
          </section>

          {/* Use of Services */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Use of Services
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Eligibility
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  You must be at least 18 years old to use our services. By
                  using our platform, you represent and warrant that you meet
                  this age requirement and have the legal capacity to enter into
                  these Terms.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Account Registration
                </h3>
                <p className="text-gray-700 leading-relaxed mb-2">
                  To access certain features, you may need to create an account.
                  You agree to:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                  <li>Provide accurate and complete information</li>
                  <li>Maintain the security of your account credentials</li>
                  <li>Notify us immediately of any unauthorized access</li>
                  <li>
                    Accept responsibility for all activities under your account
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Prohibited Activities
                </h3>
                <p className="text-gray-700 leading-relaxed mb-2">
                  You agree not to:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                  <li>
                    Use the service for any illegal or unauthorized purpose
                  </li>
                  <li>Violate any laws in your jurisdiction</li>
                  <li>Transmit viruses, malware, or harmful code</li>
                  <li>Attempt to gain unauthorized access to our systems</li>
                  <li>Harass, abuse, or harm other users</li>
                  <li>Post false, misleading, or fraudulent information</li>
                  <li>Scrape or copy content without permission</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Property Listings */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Property Listings
            </h2>
            <div className="space-y-3">
              <p className="text-gray-700 leading-relaxed">
                <strong>Accuracy:</strong> While we strive to ensure the
                accuracy of property listings, we do not guarantee that all
                information is complete, accurate, or up-to-date. Property
                details, prices, and availability are subject to change without
                notice.
              </p>
              <p className="text-gray-700 leading-relaxed">
                <strong>Verification:</strong> We recommend that you
                independently verify all property information before making any
                decisions or commitments.
              </p>
              <p className="text-gray-700 leading-relaxed">
                <strong>Third-Party Content:</strong> Some listings may be
                provided by third-party property owners or agents. We are not
                responsible for the accuracy or quality of third-party content.
              </p>
            </div>
          </section>

          {/* Intellectual Property */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Intellectual Property Rights
            </h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              All content on Globes Properties, including but not limited to
              text, graphics, logos, images, videos, and software, is the
              property of Globes Properties or its licensors and is protected by
              copyright, trademark, and other intellectual property laws.
            </p>
            <p className="text-gray-700 leading-relaxed">
              You may not reproduce, distribute, modify, or create derivative
              works from our content without our express written permission.
            </p>
          </section>

          {/* Limitation of Liability */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                <FaExclamationTriangle className="text-orange-600 text-xl" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">
                Limitation of Liability
              </h2>
            </div>
            <div className="ml-15">
              <p className="text-gray-700 leading-relaxed mb-3">
                To the fullest extent permitted by law, Globes Properties shall
                not be liable for:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>
                  Any indirect, incidental, special, or consequential damages
                </li>
                <li>Loss of profits, data, or business opportunities</li>
                <li>
                  Damages arising from your use or inability to use our services
                </li>
                <li>Errors, omissions, or inaccuracies in property listings</li>
                <li>
                  Actions or omissions of third-party property owners or agents
                </li>
                <li>Unauthorized access to or alteration of your data</li>
              </ul>
            </div>
          </section>

          {/* Disclaimer */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Disclaimer of Warranties
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Our services are provided "as is" and "as available" without
              warranties of any kind, either express or implied. We do not
              warrant that our services will be uninterrupted, error-free, or
              secure. You use our services at your own risk.
            </p>
          </section>

          {/* Indemnification */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                <FaGavel className="text-orange-600 text-xl" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">
                Indemnification
              </h2>
            </div>
            <div className="ml-15">
              <p className="text-gray-700 leading-relaxed">
                You agree to indemnify, defend, and hold harmless Globes
                Properties, its officers, directors, employees, and agents from
                any claims, liabilities, damages, losses, or expenses arising
                from:
              </p>
              <ul className="list-disc list-inside text-gray-700 mt-2 space-y-1 ml-4">
                <li>Your use of our services</li>
                <li>Your violation of these Terms</li>
                <li>Your violation of any rights of another party</li>
                <li>Any content you submit or transmit through our services</li>
              </ul>
            </div>
          </section>

          {/* Termination */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Termination
            </h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              We reserve the right to suspend or terminate your access to our
              services at any time, without notice, for any reason, including
              but not limited to:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
              <li>Violation of these Terms and Conditions</li>
              <li>Fraudulent or illegal activity</li>
              <li>Requests by law enforcement or government agencies</li>
              <li>Discontinuation or modification of our services</li>
            </ul>
          </section>

          {/* Governing Law */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Governing Law and Jurisdiction
            </h2>
            <p className="text-gray-700 leading-relaxed">
              These Terms shall be governed by and construed in accordance with
              the laws of India. Any disputes arising from these Terms or your
              use of our services shall be subject to the exclusive jurisdiction
              of the courts in Bangalore, India.
            </p>
          </section>

          {/* Changes to Terms */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Changes to Terms
            </h2>
            <p className="text-gray-700 leading-relaxed">
              We reserve the right to modify these Terms at any time. We will
              notify you of any changes by posting the updated Terms on this
              page and updating the "Last updated" date. Your continued use of
              our services after such changes constitutes your acceptance of the
              new Terms.
            </p>
          </section>

          {/* Severability */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Severability
            </h2>
            <p className="text-gray-700 leading-relaxed">
              If any provision of these Terms is found to be invalid or
              unenforceable, the remaining provisions shall continue in full
              force and effect.
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
              If you have any questions about these Terms and Conditions, please
              contact us:
            </p>
            <div className="space-y-2 text-gray-700">
              <p>
                <strong>Email:</strong> legal@globesproperties.com
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

export default TermsConditions;
