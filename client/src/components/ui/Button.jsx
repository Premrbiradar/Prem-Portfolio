import React from 'react';

const variants = {
  primary: 'btn-shine bg-accent-teal text-ink-950 hover:opacity-95',
  ghost:
    'bg-transparent text-primary border border-subtle hover:border-accent-teal hover:text-accent-teal',
  brass: 'btn-shine bg-brass text-ink-950 hover:bg-brass-light',
  danger: 'bg-red-500/90 text-white hover:bg-red-500',
  subtle: 'bg-ink-500/10 text-primary hover:bg-ink-500/20 dark:bg-ink-800 dark:hover:bg-ink-700',
};

const Button = React.forwardRef(
  ({ as: Comp = 'button', variant = 'primary', className = '', children, ...props }, ref) => (
    <Comp
      ref={ref}
      className={`inline-flex items-center justify-center gap-2 rounded-md px-5 py-2.5 text-sm font-medium
        transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.97] disabled:hover:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed
        ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </Comp>
  )
);

Button.displayName = 'Button';
export default Button;
