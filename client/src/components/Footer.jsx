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

          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>© 2024 Globes Properties. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </>
  );
}

export default Footer;
