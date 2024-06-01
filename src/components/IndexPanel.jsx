import React from "react";

const IndexPanel = ({
  isOpen,
  handleClose,
  options,
  selectedOptions,
  toggleOption,
}) => {
  return (
    <div className="indexpanel mt-2 mb-1 p-3 rounded-lg">
      <div className="flex justify-between items-center mb-3">
        <h1></h1>
        <h2 className="text-xl text-cyan-950 font-bold">Index</h2>
        <button
          onClick={handleClose}
          className="text-cyan-950 hover:text-cyan-800"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 mr-1"
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
      <div className="mt-2 mx-2 pb-1 grid grid-cols-2 gap-3">
        {options.map((option) => (
          <div
            key={option.id}
            className={`custom-button ${
              selectedOptions.includes(option.id) ? "custom-button-checked" : ""
            }`}
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

export default IndexPanel;