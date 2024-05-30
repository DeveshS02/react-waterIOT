import React, { useState } from "react";
const ImageDisplay = ({ imageSrc, altText }) => {
  const [isVisible, setIsVisible] = useState(true);

  const handleClose = () => {
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="relative">
        <img src={imageSrc} alt={altText} className="h-auto object-contain" />
        <button
          onClick={handleClose}
          className="absolute top-20 right-10 m-2 p-1 bg-gray-100 rounded-full border-4 border-gray-00 hover:bg-gray-200 z-50"
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
    </div>
  );
};

export default ImageDisplay;