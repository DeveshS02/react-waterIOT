import React, { useState, useEffect } from "react";
import IndexButton from "./IndexButton";
import IndexPanel from "./IndexPanel";

const Index = ({ indexButtonRef, options, selectedOptions, toggleOption }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const handleButtonClick = () => {
    setIsOpen(true);
    setIsClosing(false);
  };
  const handleClose = () => {
    setIsClosing(true);
  };

  const handleAnimationEnd = () => {
    if (isClosing) {
      setIsOpen(false);
      setIsClosing(false);
    }
  };
  return (
    <div className="fixed bottom-4 left-4 p-2 z-50">
      {!isOpen && !isClosing && (
        <IndexButton
          handleButtonClick={handleButtonClick}
          indexButtonRef={indexButtonRef}
        />
      )}
      <div
        className={`${isOpen ? (isClosing ? "closing" : "blockk") : "hiddenn"}`}
        onAnimationEnd={handleAnimationEnd}
      >
        {isOpen && (
          <IndexPanel
            isOpen={isOpen}
            handleClose={handleClose}
            options={options}
            selectedOptions={selectedOptions}
            toggleOption={toggleOption}
          />
        )}
      </div>
    </div>
  );
};

export default Index;