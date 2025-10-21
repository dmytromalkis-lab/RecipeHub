import React from 'react';
import { useNavigate } from "react-router-dom";
import "./NotFoundPage.css";

function NotFoundPage() {
    const navigate = useNavigate();

    return (
        <div className="notfound-container">
          <h1 className="notfound-title">404</h1>
          <h2 className="notfound-subtitle">Page Not Found</h2>
          <p className="notfound-text">
            Sorry, the page you’re looking for doesn’t exist or may have been removed.
          </p>
    
          <button className="notfound-btn" onClick={() => navigate("/")}>
            Back to Home
          </button>
        </div>
    );
}
export default NotFoundPage;