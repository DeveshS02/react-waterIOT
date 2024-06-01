import React, { useState, useEffect } from "react";

const Dropdown = ({ label, items, selectedOptions, toggleOption }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
    } else {
      const timer = setTimeout(() => setShouldRender(false), 400);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (isOpen && !event.target.closest(".dropdown")) {
        setIsOpen(false);
      }
    };
    document.addEventListener("click", handleOutsideClick);
    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, [isOpen]);

  return (
    <div className="relative border-solid border-2 border-gray-100 rounded-full dropdown">
      <button
        aria-expanded={isOpen}
        className="hover:text-blue-300"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="py-1.5 flex items-center">
          <span className="mr-1 ml-4">{label}</span>
          <div className="ml-1 mr-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="bi bi-caret-down-fill"
              viewBox="0 0 16 16"
            >
              <path d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z" />
            </svg>
          </div>
        </span>
      </button>
      {shouldRender && (
        <ul
          className={`dropdown-menu z-20 absolute right-0 mt-2 w-48 bg-white bg-opacity-30 backdrop-blur-lg text-black rounded-md shadow-lg ${
            isOpen ? "dropdown-open" : "dropdown-closed"
          }`}
        >
          {items.map((item, index) => (
            <li key={index}>
              <div
                className={`flex items-center cursor-pointer p-2  hover:bg-white hover:bg-opacity-70 ${
                  selectedOptions.includes(index + 1) ? "bg-white bg-opacity-70" : ""
                }`}
                onClick={() => toggleOption(index + 1)}
              >
                <input
                  type="checkbox"
                  id={`dropdown-option-${index + 1}`}
                  checked={selectedOptions.includes(index + 1)}
                  onChange={() => toggleOption(index + 1)}
                  className="hidden"
                />
                <label
                  htmlFor={`dropdown-option-${index + 1}`}
                  className="flex items-center space-x-2 cursor-pointer"
                >
                  <span>{item}</span>
                </label>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Dropdown;