import React, { useState } from 'react';
import image from '../images/iiit-new.png';
import Dropdown from './Dropdown';
import StatusNode from "./status_node";

const Navbar = ({ dropdownLabel, options, selectedOptions, toggleOption }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [showContainer, setShowContainer] = useState(false);
  const handleButtonClick = () => {
    setShowContainer(true);
  };
  const handleCloseButtonClick = () => {
    setShowContainer(false);
  };
  const dropdownItems = options.map(option => option.label);

  return (
    <div className="z-20 w-screen h-fit fixed inset-0 mt-2">
      <nav
        className={`navbar-glassmorphism nav-text w-[98%] m-auto shadow-lg ${isMenuOpen ? 'rounded' : 'rounded-full'}`}
      >
        <div className="container py-3 flex justify-between items-center">
          <div className="pl-10 flex items-center">
            <a href="/">
            <img src={image} alt="IIIT Logo" className="h-10 mr-8" />
            </a>
            <h1 className="ml-1 text-3xl tracking-wide font-sans">WaterIoT</h1>
          </div>
          <div className="mr-5 md:hidden">
            <button
              className="text-white focus:outline-none"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
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
          <div className="hidden md:flex items-center space-x-16 mr-7 text-lg">
            <a href="https://www.iiit.ac.in/" className="hover:text-blue-300">IIIT</a>
            <a href="https://spcrc.iiit.ac.in/" className="hover:text-blue-300">SPCRC</a>
            <button onClick={handleButtonClick} className="hover:text-blue-300">Status of Node</button>
            {showContainer && <StatusNode onClose={handleCloseButtonClick} />}

            <div className="mr-4">
              <Dropdown label={dropdownLabel} items={dropdownItems} selectedOptions={selectedOptions} toggleOption={toggleOption} />
            </div>
          </div>
        </div>
        {isMenuOpen && (
          <div className="md:hidden mt-2 pb-2 text-white">
            <a href="https://www.iiit.ac.in/" className="block px-4 py-2 hover:bg-blue-700">IIIT</a>
            <a href="https://www.iiit.ac.in/" className="block px-4 py-2 hover:bg-blue-700">SPCRC</a>
            <a href="#" className="block px-4 py-2 hover:bg-blue-700" data-toggle="modal" data-target="#nodeStatusPanel">Status of Node</a>
            <div className="mr-4">
              <Dropdown label={dropdownLabel} items={dropdownItems} selectedOptions={selectedOptions} toggleOption={toggleOption} />
            </div>
          </div>
        )}
      </nav>
    </div>
  );
};

export default Navbar;