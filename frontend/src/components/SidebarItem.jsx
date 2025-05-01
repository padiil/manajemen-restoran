import React from "react";
import { NavLink } from "react-router-dom";

const SidebarItem = ({ path, label, icon }) => {
  return (
    <li>
      <NavLink
        to={path}
        className={({ isActive }) =>
          `flex items-center gap-3 p-3 rounded-lg transition-all duration-200 group ${
            isActive
              ? "bg-blue-700 text-white shadow-md"
              : "text-blue-300 hover:bg-blue-800 hover:text-white hover:shadow-sm"
          }`
        }
      >
        <span className="w-6 h-6 text-lg group-hover:scale-110 transition-transform duration-200">
          {icon}
        </span>
        <span className="font-medium text-sm">{label}</span>
      </NavLink>
    </li>
  );
};

export default SidebarItem;
