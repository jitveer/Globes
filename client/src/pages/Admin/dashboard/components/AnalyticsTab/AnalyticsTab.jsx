import React from "react";
import { FaChartLine } from "react-icons/fa";

const AnalyticsTab = () => {
  return (
    <div className="space-y-6 animate-[fadeInUp_0.5s_ease-out]">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Analytics & Reports
        </h2>
        <p className="text-gray-600">View detailed analytics and insights</p>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="text-center py-12">
          <FaChartLine className="text-6xl text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Analytics Dashboard Coming Soon
          </h3>
          <p className="text-gray-600">
            Advanced analytics and reporting features are under development
          </p>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsTab;
