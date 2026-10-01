import React from 'react';

const Input = React.forwardRef(({ label, error, className = '', ...props }, ref) => (
  <label className="block">
    {label && <span className="mb-1.5 block text-sm text-secondary">{label}</span>}
    <input
      ref={ref}
      className={`w-full rounded-md border bg-white/60 px-3.5 py-2.5 text-sm text-primary placeholder:text-secondary/70 dark:bg-ink-900/60
        field-glow transition-shadow focus:border-accent-teal focus:outline-none
        ${error ? 'border-red-400' : 'border-subtle'} ${className}`}
      {...props}
    />
    {error && <span className="mt-1 block text-xs text-red-500">{error}</span>}
  </label>
));
Input.displayName = 'Input';
export default Input;
