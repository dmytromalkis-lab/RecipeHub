import React from "react";
import { useNavigate } from "react-router-dom";
import "./ForbiddenPage.css";

const ForbiddenPage = () => {
  const navigate = useNavigate();

  return (
    <div className="forbidden-container">
      <h1 className="forbidden-title">403</h1>
      <h2 className="forbidden-subtitle">Access Denied</h2>
      <p className="forbidden-text">
        You don’t have permission to view this page.  
        Please contact the administrator or go back to the previous page.
      </p>

      <button className="forbidden-btn" onClick={() => navigate(-1)}>
        Go Back
      </button>
    </div>
  );
};

export default ForbiddenPage;
