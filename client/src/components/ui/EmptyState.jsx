import React from 'react';

const EmptyState = ({ title, description, action }) => (
  <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-subtle px-6 py-14 text-center">
    <p className="font-display text-base text-primary">{title}</p>
    {description && <p className="mt-2 max-w-sm text-sm text-secondary">{description}</p>}
    {action && <div className="mt-5">{action}</div>}
  </div>
);

export default EmptyState;
