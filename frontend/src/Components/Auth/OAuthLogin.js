import React from 'react';
import './OAuthLogin.css';

const OAuthLogin = () => {
  // Redirect to the backend OAuth endpoint
  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:8080/oauth2/authorization/google';
  };

  return (
    <div className="oauth-container">
      <button 
        className="google-login-btn" 
        onClick={handleGoogleLogin}
      >
        <img 
          src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" 
          alt="Google Logo" 
          className="google-icon"
        />
        Continue with Google
      </button>
    </div>
  );
};

export default OAuthLogin; 