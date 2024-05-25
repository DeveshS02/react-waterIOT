import React from 'react';

const Modal = ({ children, onClose }) => {
  return (
    <>
      <div className="modal-overlay" onClick={onClose}></div>
      <div className="modal nodeGraph">
        <button className="modal-close" onClick={onClose}>×</button>
        {children}
      </div>
    </>
  );
};

export default Modal;
