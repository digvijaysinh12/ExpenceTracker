// Spinner.js
import React from 'react';

/**
 * Spinner component that shows a Bootstrap loading spinner.
 * 
 * Props:
 * - size: string (e.g., "spinner-border-sm")
 * - color: string (e.g., "text-primary", "text-success")
 * - className: string - Additional custom classes
 * - message: string - Optional loading message
 */
const Spinner = ({
  size = '',
  color = 'text-primary',
  className = '',
  message = 'Loading...',
}) => {
  return (
    <div className={`d-flex flex-column align-items-center ${className}`}>
      <div className={`spinner-border ${size} ${color}`} role="status">
        <span className="visually-hidden">{message}</span>
      </div>
      {message && <div className="mt-2 text-muted">{message}</div>}
    </div>
  );
};

export default Spinner;
