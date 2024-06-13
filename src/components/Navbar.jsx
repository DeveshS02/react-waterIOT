import React, { useState, useEffect } from "react";
import image from "../images/iiit-new.png";
import image2 from "../images/hydrowfinal.png";
import imagedrop from "../images/Hydrowlogo.png";
import Dropdown from "./Dropdown";
import StatusNode from "./status_node";

const Navbar = ({
  dropdownLabel,
  options,
  selectedOptions,
  toggleOption,
  data,
  nodes,
  isNavClosing,
  isNavOpening,
  setNavOpening,
  setNavClosing,
  statusButtonRef,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showContainer, setShowContainer] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false); // Track if the user has interacted with the menu

  useEffect(() => {
    if (hasInteracted) {
      if (!isMenuOpen) {
        setIsAnimating(true);
        const timer = setTimeout(() => {
          setIsAnimating(false);
        }, 550);
        return () => clearTimeout(timer);
      }
    }
  }, [isMenuOpen, hasInteracted]);

  const handleButtonClick = () => {
    setShowContainer(true);
    setIsMenuOpen(false);
  };

  const handleCloseButtonClick = () => {
    setShowContainer(false);
  };

  const handleMenuToggle = () => {
    setHasInteracted(true); // Mark that the user has interacted with the menu
    setIsMenuOpen(!isMenuOpen);
  };

  const dropdownItems = options.map((option) => option.label);

  return (
    <div className="z-20 w-screen h-fit fixed inset-0 mt-2">
      <nav
        className={`navbar-glassmorphism nav-text w-[98%] m-auto shadow-lg ${
          isMenuOpen || isAnimating ? "rounded" : "rounded-full"
        } ${isNavClosing ? "goUp" : ""} ${isNavOpening ? "goDown" : ""}`}
      >
        <div className="py-3 flex justify-between items-center right-2 width-[100%]">
          <div className="flex min-w-[80%] md:min-w-min">
            <div className="pl-5 md:pl-8 flex items-center">
              <a href="/">
                <img
                  src={image}
                  alt="IIIT Logo"
                  className="h-8 md:h-10 mr-2 md:mr-1"
                />
              </a>
              <a href="http://hydrowverse.com/">
                <img
                  src={image2}
                  alt="hydrow Logo"
                  className=" hidden md:block h-10 md:mr-4"
                />
              </a>
              <a href="http://hydrowverse.com/">
                <img
                  src={imagedrop}
                  alt="hydrow Logo"
                  className="h-10 md:hidden"
                />
              </a>
            </div>
            <div className="flex min-w-[60%] md:min-w-fit justify-center">
              <h1 className="text-3xl tracking-wide font-sans">WaterIoT</h1>
            </div>
          </div>
          <div className="flex items-center justify-center gap-5 md:hidden">
            <div className="mr-6">
              <button
                className="text-white focus:outline-none"
                onClick={handleMenuToggle}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                  />
                </svg>
              </button>
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-11 mr-7 text-lg">
            <a href="https://www.iiit.ac.in/" className="hover:text-blue-300">
              IIIT
            </a>
            <a href="https://spcrc.iiit.ac.in/" className="hover:text-blue-300">
              SPCRC
            </a>
            <button
              ref={statusButtonRef}
              onClick={handleButtonClick}
              className="hover:text-blue-300"
            >
              Status of Node
            </button>
            <div>
              <Dropdown
                label={dropdownLabel}
                items={dropdownItems}
                selectedOptions={selectedOptions}
                toggleOption={toggleOption}
              />
            </div>
          </div>
        </div>
        <div
          className={`navbar-menu ${
            isMenuOpen
              ? "navbar-open"
              : isAnimating
              ? "navbar-closed"
              : "hidden"
          }`}
        >
          {(isMenuOpen || isAnimating) && (
            <div className="md:hidden mt-2 pb-2 pl-2 text-white">
              <a href="https://www.iiit.ac.in/" className="block px-4 py-2">
                IIIT
              </a>
              <a
                href="https://spcrc.iiit.ac.in/"
                className="block px-4 py-2 hover:text-blue-300"
              >
                SPCRC
              </a>
              <button
                onClick={handleButtonClick}
                className="block px-4 py-2 hover:text-blue-300"
              >
                Status of Node
              </button>
              <div className="mr-4">
                <Dropdown
                  label={dropdownLabel}
                  items={dropdownItems}
                  selectedOptions={selectedOptions}
                  toggleOption={toggleOption}
                />
              </div>
            </div>
          )}
        </div>
      </nav>
      {showContainer && (
        <StatusNode
          onClose={handleCloseButtonClick}
          data={data}
          nodes={nodes}
          setNavClosing={setNavClosing}
          setNavOpening={setNavOpening}
        />
      )}
    </div>
  );
};

export default Navbar;