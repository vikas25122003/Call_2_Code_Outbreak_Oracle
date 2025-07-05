import React from 'react';
import './Loader.css';

interface LoaderProps {
  message?: string;
}

const Loader: React.FC<LoaderProps> = ({ message = 'Loading data...' }) => {
  return (
    <div className="loader-container">
      <div className="loader">
        <div className="spinner"></div>
        <p className="loader-message">{message}</p>
      </div>
    </div>
  );
};

export default Loader; 