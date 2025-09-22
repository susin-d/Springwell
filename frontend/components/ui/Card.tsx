
import React from 'react';

type CardProps = React.HTMLAttributes<HTMLDivElement>;

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, ...props }, ref) => {
    const baseClasses = 'rounded-lg border border-white/10 backdrop-blur-xl bg-white/5';
    const combinedClasses = [baseClasses, className].filter(Boolean).join(' ');
    
    return (
      <div
        ref={ref}
        className={combinedClasses}
        {...props}
      />
    );
  }
);
Card.displayName = 'Card';
