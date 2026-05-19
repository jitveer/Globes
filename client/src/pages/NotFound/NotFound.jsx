import { Link } from "react-router-dom";
import { FaHome, FaArrowLeft } from "react-icons/fa";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 flex items-center justify-center px-4 mt-10 md:mt-">
      <div className="max-w-2xl w-full text-center animate-[fadeInUp_0.6s_ease-out]">
        {/* 404 Illustration */}
        <div className="mb-8">
          <h1 className="text-[150px] md:text-[200px] font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-orange-700 leading-none">
            404
          </h1>
        </div>

        {/* Error Message */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12">
          <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <FaHome className="text-5xl text-orange-600" />
          </div>

          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Page Not Found
          </h2>

          <p className="text-lg text-gray-600 mb-8">
            Oops! The page you're looking for doesn't exist. It might have been
            moved or deleted.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/"
              className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-orange-600 to-orange-700 text-white px-8 py-4 rounded-xl font-semibold hover:from-orange-700 hover:to-orange-800 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
            >
              <FaHome />
              Go to Homepage
            </Link>

            <button
              onClick={() => window.history.back()}
              className="inline-flex items-center justify-center gap-2 bg-white border-2 border-gray-200 text-gray-700 px-8 py-4 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-300 hover:scale-105 active:scale-95"
            >
              <FaArrowLeft />
              Go Back
            </button>
          </div>

          {/* Quick Links */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <p className="text-sm text-gray-600 mb-4">
              You might be looking for:
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link
                to="/properties"
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-orange-100 hover:text-orange-600 transition-all duration-300 font-semibold"
              >
                Properties
              </Link>
              <Link
                to="/blogs"
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-orange-100 hover:text-orange-600 transition-all duration-300 font-semibold"
              >
                Blogs
              </Link>
              <Link
                to="/about"
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-orange-100 hover:text-orange-600 transition-all duration-300 font-semibold"
              >
                About Us
              </Link>
              <Link
                to="/contact"
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-orange-100 hover:text-orange-600 transition-all duration-300 font-semibold"
              >
                Contact
              </Link>
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-orange-200 rounded-full blur-3xl opacity-50 animate-pulse"></div>
        <div
          className="absolute bottom-20 right-10 w-32 h-32 bg-orange-300 rounded-full blur-3xl opacity-50 animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
      </div>
    </div>
  );
};

export default NotFound;
