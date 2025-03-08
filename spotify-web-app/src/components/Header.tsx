import React from 'react';
import { useNavigate } from 'react-router-dom';

const Header: React.FC = () => {
  const navigate = useNavigate();

  return (
    <header className="header">
      <div className="navigation-buttons">
        <button className="nav-button" onClick={() => navigate(-1)}>←</button>
        <button className="nav-button" onClick={() => navigate(1)}>→</button>
      </div>
      <div className="user-controls">
        <button className="profile-button">Profile</button>
      </div>
    </header>
  );
};

export default Header;