import React from "react";
import "./WhatsApp.css";

function WhatsApp() {
  return (
    <a
      href="https://wa.me/7906396629" 
      target="_blank"
      rel="noopener noreferrer"
      className="whatsapp-button"
    >
      <img
        src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
        alt="WhatsApp"
      />
    </a>
  );
}

export default WhatsApp;
