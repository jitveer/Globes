import {
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
} from "react-icons/fa";

function Footer() {
  const domainName = import.meta.env.VITE_DOMAIN;

  return (
    <>
      {/* Footer */}
      <footer className="bg-gray-900 text-white py-6 md:py-12 text-xs md:text-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-8 mb-8">
            <div className="text-left md:text-left">
              <img
                src="https://globesproperties.com/wp-content/uploads/2024/10/globes_properties_logo.png"
                alt="logo"
                className="my-4 w-36 md:w-48 md:mt-0"
              />
              <p className="text-gray-400 mb-4">
                Your trusted partner in finding the perfect property.
              </p>
              <div className="flex gap-4">
                {[
                  {
                    Icon: FaFacebook,
                    link: "https://www.facebook.com/share/18Dj7yP11n/",
                  },
                  {
                    Icon: FaInstagram,
                    link: "https://www.instagram.com/globesproperties?igsh=a2Q0OG12bHVlMnM3",
                  },
                  {
                    Icon: FaLinkedin,
                    link: "https://www.linkedin.com/company/globes-properties/",
                  },
                ].map(({ Icon, link }, index) => (
                  <a
                    key={index}
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-orange-600 transition-colors duration-300"
                  >
                    <Icon />
                  </a>
                ))}
              </div>
            </div>

            <div className="text-left md:text-left">
              <h4 className="font-semibold mb-4 mt-6 md:mt-0">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                {["Home", "Properties", "About", "Contact"].map((link) => (
                  <li key={link}>
                    <a
                      href={
                        link === "Home"
                          ? domainName
                          : `${domainName}/${link.toLowerCase().replace(/\s+/g, "-")}`
                      }
                      className="hover:text-orange-600 transition-colors duration-300"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4 mt-6 md:mt-0">
                Property Types
              </h4>
              <ul className="space-y-2 text-gray-400">
                {["Houses", "Apartments", "Commercial", "Land"].map((type) => (
                  <li key={type}>
                    <a
                      href="/"
                      // href={`${domainName}${type.toLowerCase().replace(/\s+/g, "-")}`}
                      className="hover:text-orange-600 transition-colors duration-300"
                    >
                      {type}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4 mt-6 md:mt-0">Contact Info</h4>
              <ul className="space-y-2 text-gray-400">
                <li className="flex items-center gap-2">
                  <FaPhone className="text-orange-600" />
                  <a
                    href="tel:+919945739702"
                    className="hover:text-orange-600 transition-colors"
                  >
                    +91 9945739702
                  </a>
                </li>
                <li className="flex items-center gap-2">
                  <FaEnvelope className="text-orange-600" />
                  <a
                    href="https://mail.google.com/mail/?view=cm&fs=1&to=contact@globesproperties.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-orange-600 transition-colors break-all"
                  >
                    contact@globesproperties.com
                  </a>
                </li>
                <li className="flex items-center gap-2">
                  <FaMapMarkerAlt className="text-orange-600" />
                  <a
                    href="https://maps.app.goo.gl/tYdi1ASnkGYgqUre7"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-orange-600 transition-colors"
                  >
                    Bangalore, India
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* About & Disclaimer Section */}
          <div className="border-t border-gray-800 pt-8 mt-8 space-y-6 text-left">
            {/* <div>
              <h4 className="font-semibold text-white mb-3 text-sm md:text-base">About GlobesProperties.in</h4>
              <div className="text-gray-400 space-y-3 leading-relaxed text-xs md:text-sm">
                <p>
                  GlobesProperties.in is a comprehensive real estate platform dedicated to helping buyers, investors, and property seekers discover residential and commercial properties across India.
                </p>
                <p>
                  Our platform provides access to a wide range of real estate opportunities, including apartments, villas, independent houses, plots, commercial spaces, and newly launched projects. Users can explore under-construction developments, ready-to-move properties, investment opportunities, and resale listings through a user-friendly and organized interface.
                </p>
                <p>
                  At GlobesProperties.in, we strive to simplify property discovery by presenting essential project information such as location insights, pricing details, floor plans, amenities, builder profiles, project highlights, and neighborhood information in a clear and structured format.
                </p>
                <p>
                  Our goal is to connect property seekers with reliable information, helping them make informed real estate decisions while promoting transparency and accessibility within the property market.
                </p>
                <p>
                  We are committed to continuously enhancing our platform, expanding our property database, and providing users with an efficient and trustworthy property search experience.
                </p>
              </div>
            </div> */}

            <div className="border-t border-gray-800/60 pt-6">
              <h4 className="font-semibold text-gray-400 mb-3 text-xs md:text-sm uppercase tracking-wider">Disclaimer</h4>
              <div className="text-gray-500 space-y-3 leading-relaxed text-[11px] md:text-xs">
                <p>
                  The information, images, specifications, pricing, floor plans, amenities, and other project details displayed on GlobesProperties.in are compiled from various publicly available sources, developer communications, project brochures, official websites, site visits, and information shared by property owners, builders, or authorized representatives.
                </p>
                <p>
                  While we make every reasonable effort to ensure the accuracy and relevance of the information presented, certain details may be subject to change without prior notice. Some information may still be under verification and should not be considered as a final representation of the property, project, land parcel, ownership status, approvals, or regulatory compliance.
                </p>
                <p>
                  Property ownership details, project approvals, RERA registrations, pricing, availability, and specifications are provided based on information obtained from sources believed to be reliable. However, GlobesProperties.in does not independently guarantee or warrant the completeness, authenticity, or accuracy of such information.
                </p>
                <p>
                  Users are strongly advised to conduct their own due diligence and verify all relevant documents, approvals, legal clearances, specifications, and other property-related information directly with the developer, owner, or concerned authorities before making any purchase, investment, booking, or financial decision.
                </p>
                <p>
                  GlobesProperties.in acts solely as an information and discovery platform designed to help users access property-related information in a structured and convenient manner. We continuously review and update our listings to maintain the highest possible level of accuracy and transparency.
                </p>
                <p>
                  By using this website, you acknowledge that the information provided is for general informational purposes only and should not be construed as legal, financial, or investment advice.
                </p>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 text-center text-gray-400 mt-8">
            <p>© 2024 Globes Properties. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </>
  );
}

export default Footer;
