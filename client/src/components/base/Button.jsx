import React from 'react';

export const Button = ({
  children,
  onClick,
  classNames = 'bg-blue-500 hover:bg-blue-600',
  ...props
}) => {
  return (
    <button
      onClick={onClick}
      className={`text-white p-2 rounded ${classNames}`}
      {...props}
    >
      {children}
    </button>
  );
};
