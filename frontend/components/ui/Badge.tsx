import React from 'react';

// FIX: Changed BadgeProps from an interface to a type with an intersection. This correctly includes all properties from React.HTMLAttributes<HTMLDivElement>, including 'className', which resolves the TypeScript error.
export type BadgeProps = React.HTMLAttributes<HTMLDivElement> & {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline';
};

export function Badge({ className, variant, ...props }: BadgeProps) {
    const baseClasses = 'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2';
    
    const variantClasses = {
        default: 'border-transparent bg-primary text-primary-foreground hover:bg-primary/80',
        secondary: 'border-transparent bg-white/20 text-white',
        destructive: 'border-transparent bg-red-500 text-white',
        outline: 'text-foreground',
    };

    const combinedClasses = [baseClasses, variant ? variantClasses[variant] : variantClasses.secondary, className].filter(Boolean).join(' ');

    return (
        <div className={combinedClasses} {...props} />
    );
}
