import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ChangeNavCase, FindIconName } from "../../utils";

const Dropdown = ({ label, items, isOpen, toggleDropdown, closeDropdown }) => {
  return (
    <div className="relative w-full">
      <button
        onClick={toggleDropdown}
        className="dropdown-button flex items-center space-x-2 text-white hover:text-yellow-600 focus:outline-none transition-colors duration-300"
        aria-haspopup="true"
        aria-expanded={isOpen ? "true" : "false"}
        aria-controls="dropdown-menu"
      >
        <FontAwesomeIcon icon={FindIconName(label)} />
        <span>{label}</span>
      </button>
      {isOpen && (
        <div
          id="dropdown-menu"
          className="mt-2 rounded-md shadow-lg z-10 w-full"
          role="menu"
        >
          {items.map((item, index) => (
            <Link
              key={index}
              to={`/admin/${ChangeNavCase(label)}/${ChangeNavCase(item)}`}
              className="block px-4 py-2 hover:bg-gray-200 hover:text-blue-500 transition-colors duration-300 text-white"
              onClick={closeDropdown}
              role="menuitem"
            >
              {item}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dropdown;
