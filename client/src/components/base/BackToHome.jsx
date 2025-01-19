import React from 'react';
import { useNavigate } from 'react-router-dom';

const BackToHome = () => {
  const navigate = useNavigate();

  const goHome = () => {
    navigate('/');
  };

  return (
    <div>
      <button onClick={goHome}>Back to Home</button>
    </div>
  );
};

export default BackToHome;
