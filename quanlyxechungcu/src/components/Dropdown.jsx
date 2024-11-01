import React from "react";
import { Link } from "react-router-dom";
import { ChangeNavCase } from "../utils/index";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FindIconName } from "../utils/index";

const Dropdown = ({ label, items, isOpen, toggleDropdown, closeDropdown }) => {
  return (
    <div className="relative pl-5">
      <button
        onClick={toggleDropdown}
        className="dropdown-button flex flex-col items-center text-white hover:text-gray-600 focus:outline-none transition-colors duration-300"
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
          className="absolute mt-2 w-48 bg-white rounded-md shadow-lg z-10"
          role="menu"
        >
          {items.map((item, index) => (
            <Link
              key={index}
              to={`${ChangeNavCase(label)}/${ChangeNavCase(item)}`}
              className="block px-4 py-2 text-gray-800 hover:bg-gray-200 hover:text-blue-500 transition-colors duration-300"
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
