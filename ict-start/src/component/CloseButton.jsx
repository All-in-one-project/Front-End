
import React from 'react';
import '../App.css'; // CSS import

function CloseButton({ onClose }) {
    return (
        <span className="close-btn" onClick={onClose}></span>
    );
}

export default CloseButton;
