import React from "react";

const IndexPanel = ({
  isOpen,
  handleClose,
  options,
  selectedOptions,
  toggleOption,
}) => {
  return (
    <div
      style={{ width: "338px", height: "270px" }}
      className="ring-2 ring-yellow-500 mt-2 bg-white p-4 rounded-lg shadow-lg"
    >
      <div className="flex justify-between items-center mb-2">
        <h1></h1>
        <h2 className="text-xl text-gray-800 font-semibold">INDEX</h2>
        <button
          onClick={handleClose}
          className="text-gray-600 hover:text-gray-800"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2">
        {options.map((option) => (
          <div
            key={option.id}
            // className="flex items-center cursor-pointer"
            // className={flex items-center rounded-lg cursor-pointer ${selectedOptions.includes(option.id) ? "bg-slate-200  " : ""}}
            className={`custom-button ${selectedOptions.includes(option.id) ? "custom-button-checked" : ""}`}
            onClick={() => toggleOption(option.id)}
          >
            <input
              type="checkbox"
              id={`option-${option.id}`}
              checked={selectedOptions.includes(option.id)}
              onChange={() => toggleOption(option.id)}
              className="hidden"
            />
            <label
              htmlFor={`option-${option.id}`}
              className="flex items-center space-x-2 cursor-pointer p-2 rounded transition"
            >
              <img
                src={option.image}
                alt={option.label}
                className="w-11 h-11"
                style={
                  option.id === 6 ? { width: "50px", height: "20px" } : null
                }
              />
              <span>{option.label}</span>
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default IndexPanel;