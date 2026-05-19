import React from "react";

const SettingsTab = () => {
  return (
    <div className="space-y-6 animate-[fadeInUp_0.5s_ease-out]">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Settings</h2>
        <p className="text-gray-600">
          Manage website settings and configurations
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* General Settings */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            General Settings
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Website Name
              </label>
              <input
                type="text"
                defaultValue="Globes Properties"
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Contact Email
              </label>
              <input
                type="email"
                defaultValue="info@globesproperties.com"
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Contact Phone
              </label>
              <input
                type="tel"
                defaultValue="+91 98765 43210"
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            Notification Settings
          </h3>
          <div className="space-y-4">
            {[
              {
                label: "New Inquiry Alerts",
                desc: "Get notified for new inquiries",
                checked: true,
              },
              {
                label: "New User Registration",
                desc: "Get notified for new users",
                checked: true,
              },
              {
                label: "Property Updates",
                desc: "Get notified for property changes",
                checked: false,
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-xl"
              >
                <div>
                  <h4 className="font-semibold text-gray-900">{item.label}</h4>
                  <p className="text-sm text-gray-600">{item.desc}</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    defaultChecked={item.checked}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button className="bg-gradient-to-r from-orange-600 to-orange-700 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg transition-all">
          Save Settings
        </button>
      </div>
    </div>
  );
};

export default SettingsTab;
