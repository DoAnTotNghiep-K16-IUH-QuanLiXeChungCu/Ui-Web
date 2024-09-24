import React from "react";
import { Link } from "react-router-dom";
import ChangeNavCase from "../utils/ChangeNavCase";

const Dropdown = ({ label, items, isOpen, toggleDropdown }) => {
  return (
    <div className="relative pl-5 hover:bg-orange-500">
      <button
        onClick={toggleDropdown}
        className="text-white hover:text-gray-600 focus:outline-none transition-colors duration-300"
      >
        {label}
      </button>
      {isOpen && (
        <div className="absolute mt-2 w-48 bg-white rounded-md shadow-lg z-10">
          {items.map((item, index) => (
            <Link
              key={index}
              to={`${ChangeNavCase(label)}/${ChangeNavCase(item)}`}
              className="block px-4 py-2 text-gray-800 hover:bg-gray-200 hover:text-blue-500 transition-colors duration-300"
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
