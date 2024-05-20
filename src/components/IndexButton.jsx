import React from "react";

const IndexButton = ({ handleButtonClick }) => {
  return (
      <button
        onClick={handleButtonClick}
        className="hover:scale-105  ring-1 ring-sky-700  w-16 h-16 bg-transparent border-2 border-r-gray-950 border-t-gray-950 border-l-slate-600 border-b-slate-600 rounded-full"
      >
        <span className="text-lg">Index</span>
      </button>
  );
};

export default IndexButton;