import React, { useState, useEffect } from "react";

const Modal = ({ children, onClose }) => {
  const [closing, setClosing] = useState(false);
  const [contentVisible, setContentVisible] = useState(false);

  const handleClose = () => {
    setClosing(true);
    setTimeout(() => {
      onClose();
    }, 500); // Match the duration of the close animation
  };

  useEffect(() => {
    const overlay = document.querySelector(".modal-overlay");
    overlay.classList.remove("hidden");
    setTimeout(() => {
      setContentVisible(true);
    }, 500); // Match the duration of the open animation

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        handleClose();
      }
    };
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      overlay.classList.add("hidden");
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <>
      <div className="modal-overlay hidden" onClick={handleClose}></div>
      <div className={`modal nodeGraph ${closing ? "close" : ""}`}>
        <button className="modal-close" onClick={handleClose}>
          x
        </button>
        {contentVisible && children}
      </div>
    </>
  );
};

export default Modal;