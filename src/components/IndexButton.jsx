import React from "react";


const IndexButton = ({ handleButtonClick, indexButtonRef }) => {
  return (
      <button
        onClick={handleButtonClick}
        ref={indexButtonRef}
        className="hover:scale-105 indexbtn w-16 h-16 rounded-full"
      >
        <span className="text-lg">Index</span>
      </button>
  );
};

export default IndexButton;