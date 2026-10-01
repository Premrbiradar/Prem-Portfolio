import React from 'react';

const Card = ({ className = '', children, ...props }) => (
  <div className={`rounded-lg bg-surface-card ${className}`} {...props}>
    {children}
  </div>
);

export default Card;
