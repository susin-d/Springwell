
import React from 'react';

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    const baseClasses = 'flex h-10 w-full rounded-md border border-white/20 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 disabled:cursor-not-allowed disabled:opacity-50';
    const combinedClasses = [baseClasses, className].filter(Boolean).join(' ');

    return (
      <input
        type={type}
        className={combinedClasses}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = 'Input';
