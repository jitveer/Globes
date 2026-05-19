import React from "react";
import { FaSignOutAlt } from "react-icons/fa";

const Sidebar = ({ activeTab, setActiveTab, handleLogout, menuItems }) => {
  return (
    <aside className="fixed left-0 top-20 bottom-0 w-64 bg-white shadow-lg overflow-y-auto">
      <nav className="p-4 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all duration-300 ${
              activeTab === item.id
                ? "bg-gradient-to-r from-orange-600 to-orange-700 text-white shadow-lg"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <item.icon className="text-lg" />
            <span>{item.label}</span>
          </button>
        ))}

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-red-600 hover:bg-red-50 transition-all duration-300 mt-4"
        >
          <FaSignOutAlt className="text-lg" />
          <span>Logout</span>
        </button>
      </nav>
    </aside>
  );
};

export default Sidebar;
