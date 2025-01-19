import React from 'react';
import { useNavigate } from 'react-router-dom';

const BackToHome = () => {
  const navigate = useNavigate(); // Get the navigate function

  const goHome = () => {
    navigate('/'); // Navigate to the home page (assuming home is at '/')
  };

  return (
    <div>
      <button onClick={goHome}>Back to Home</button>
    </div>
  );
};

export default BackToHome;
