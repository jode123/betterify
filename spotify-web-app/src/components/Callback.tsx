import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Callback: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');

    if (code) {
      // TODO: Exchange code for access token
      console.log('Authorization code:', code);
      // For now, just redirect to home
      navigate('/');
    }
  }, [navigate]);

  return <div>Authenticating...</div>;
};

export default Callback;