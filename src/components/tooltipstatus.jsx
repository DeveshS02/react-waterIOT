import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";

const TooltipContainer = ({ isVisible, targetRef, onClose }) => {
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    const updateTooltipPosition = () => {
      if (targetRef.current) {
        const { top, left, width, height } =
          targetRef.current.getBoundingClientRect();
        setTooltipPosition({
          top: top + height + 10,
          left: left + width / 2,
        });
      }
    };

    updateTooltipPosition();
    window.addEventListener("resize", updateTooltipPosition);

    return () => {
      window.removeEventListener("resize", updateTooltipPosition);
    };
  }, [targetRef]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (targetRef.current && !targetRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose, targetRef]);

  if (!isVisible || !targetRef.current) return null;

  return (
    <div
      className="md:block hidden welcome fixed z-50 px-2 py-5 bg-white border border-gray-200 rounded shadow-md"
      style={{
        top: `${tooltipPosition.top + 55}px`,
        left: `${tooltipPosition.left + -32}px`,
        transform: "translateX(-50%)",
        whiteSpace: "nowrap",
      }}
    >
      <div className="flex flex-col gap-0 justify-center items-center text-black text-xl font-normal">
        <h2>
          Click on <span className="font-semibold">Status of Node</span>
        </h2>
        <h2>to view working</h2>
        <h2>condition of all devices</h2>
      </div>
      <div
        className="absolute"
        style={{
          top: "-71%",
          left: "50%",
          transform: "translateX(-50%)",
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          version="1.1"
          xmlnsXlink="http://www.w3.org/1999/xlink"
          viewBox="0 0 800 800"
          width="110%"
          height="110%"
        >
          <g
            strokeWidth="20"
            stroke="hsl(0, 0%, 0%)"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            transform="matrix(-0.17364817766693033,-0.984807753012208,0.984807753012208,-0.17364817766693033,141.53616986188894,856.3823722716554)"
          >
            <path
              d="M259.5 259.5Q504.5 323.5 540.5 540.5 "
              markerEnd="url(#SvgjsMarker3902)"
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
              id="SvgjsMarker3902"
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

TooltipContainer.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  targetRef: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default TooltipContainer;