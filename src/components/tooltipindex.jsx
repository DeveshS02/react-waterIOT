import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";

const Tooltipindex = ({ isVisible, targetRef, onClose }) => {
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
      className="welcome fixed z-50 px-2 py-5 bg-white border border-gray-200 rounded shadow-md"
      style={{
        top: `${tooltipPosition.top + -190}px`,
        left: `${tooltipPosition.left + 200}px`,
        transform: "translateX(-50%)",
        whiteSpace: "nowrap",
      }}
    >
      <div className="flex flex-col gap-0 justify-center items-center text-black text-xl font-normal">
        <h2>
          Click on <span className="font-semibold">Index</span> to select
        </h2>
        <h2>nodes and filter</h2>
        <h2>devices to be shown</h2>
      </div>
      <div
        className="absolute rotate-45"
        style={{
          top: "10%",
          left: "2%",
          transform: "translateX(-50%)",
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          version="1.1"
          xmlnsXlink="http://www.w3.org/1999/xlink"
          viewBox="0 0 800 800"
          height="60%"
          width="60%"
        >
          <g
            strokeWidth="20"
            stroke="hsl(0, 0%, 0%)"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            transform="matrix(-0.1736481776669303,0.984807753012208,-0.984807753012208,-0.1736481776669303,929.3823722716553,125.53616986188888)"
          >
            <path
              d="M259.5 259.3338928222656Q265.5 550.3338928222656 540.5 540.3338928222656 "
              markerEnd="url(#SvgjsMarker7498)"
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
              id="SvgjsMarker7498"
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

Tooltipindex.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  targetRef: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default Tooltipindex;