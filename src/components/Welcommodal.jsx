import React, { useEffect } from "react";
import PropTypes from "prop-types";

const WelcomeContainer = ({ isOpen, onClose }) => {
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isOpen) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="welcome relative min-h-fit min-w-fit h-[25%] w-[40%] bg-white border flex items-center justify-center p-4">
        <div className="flex flex-col gap-2 justify-center items-center">
          <h1 style={{ color: "#2D6ABA" }} className="text-2xl font-bold">
            Welcome Back!
          </h1>
          <h2 className="text-black text-2xl font-normal">
            Your dashboard is ready!
          </h2>
          <h2 className="text-black text-2xl font-normal">
            Click on the <span className="font-semibold">beacons</span> to
            explore more.
          </h2>
        </div>
        <svg
          className="absolute"
          style={{
            bottom: "-38%",
            left: "50%",
            transform: "translateX(-50%)",
            width: "60%",
            height: "60%",
          }}
          xmlns="http://www.w3.org/2000/svg"
          version="1.1"
          xmlnsXlink="http://www.w3.org/1999/xlink"
          viewBox="0 0 800 800"
        >
          <g
            strokeWidth="20"
            stroke="hsl(0, 0%, 0%)"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            transform="matrix(1,0,0,1,66,50)"
          >
            <path
              d="M259.5 259.5Q265.5 493.5 540.5 540.5 "
              markerEnd="url(#SvgjsMarker7664)"
            ></path>
          </g>
          <defs>
            <marker
              markerWidth="10"
              markerHeight="10"
              refX="5"
              refY="5"
              viewBox="0 0 10 10"
              orient="auto"
              id="SvgjsMarker7664"
            >
              <polyline
                points="0,5 5,2.5 0,0"
                fill="none"
                strokeWidth="1"
                stroke="hsl(0, 0%, 0%)"
                strokeLinecap="round"
                transform="matrix(1,0,0,1,1.6666666666666667,2.5)"
                strokeLinejoin="round"
              ></polyline>
            </marker>
          </defs>
        </svg>
      </div>
    </div>
  );
};

WelcomeContainer.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default WelcomeContainer;