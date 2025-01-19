import React from 'react';
import PropTypes from 'prop-types';

const LoadingScreen = ({
  message = 'Loading...',
  spinnerSize = '50px',
  backgroundColor = '#f9f9f9',
  textColor = '#333',
}) => {
  const spinnerStyle = {
    width: spinnerSize,
    height: spinnerSize,
    border: '5px solid #e3e3e3',
    borderTop: `5px solid ${textColor}`,
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    marginBottom: '10px',
  };

  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor,
    color: textColor,
    fontFamily: 'Arial, sans-serif',
  };

  return (
    <div style={containerStyle}>
      <div style={spinnerStyle}></div>
      <p>{message}</p>
    </div>
  );
};

LoadingScreen.propTypes = {
  message: PropTypes.string,
  spinnerSize: PropTypes.string,
  backgroundColor: PropTypes.string,
  textColor: PropTypes.string,
};

export default LoadingScreen;
