import React from 'react';

type ButtonAsButtonProps = {
  asChild?: false;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg' | 'icon';
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

type ButtonAsChildProps = {
  asChild: true;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg' | 'icon';
} & React.HTMLAttributes<HTMLDivElement>;

type ButtonProps = ButtonAsButtonProps | ButtonAsChildProps;

export const Button = React.forwardRef<HTMLButtonElement | HTMLDivElement, ButtonProps>(
  (props, ref) => {
    const baseClasses = 'inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50';

    const variantClasses = {
      primary: 'bg-blue-500 text-white hover:bg-blue-500/90',
      secondary: 'bg-white/20 text-white hover:bg-white/30',
      ghost: 'text-white/70 hover:text-white hover:bg-white/10',
    };

    const sizeClasses = {
      sm: 'h-9 rounded-md px-3',
      md: 'h-10 px-4 py-2',
      lg: 'h-12 rounded-md px-8 text-lg',
      icon: 'h-10 w-10',
    };

    if (props.asChild) {
      const { asChild, variant = 'primary', size = 'md', className, ...divProps } = props;
      const combinedClasses = [ baseClasses, variantClasses[variant], sizeClasses[size], className ].filter(Boolean).join(' ');
      return (
        <div
          className={combinedClasses}
          ref={ref as React.Ref<HTMLDivElement>}
          {...divProps}
        />
      );
    } else {
      // FIX: Corrected a TypeScript error when spreading props for the <button> element.
      // TypeScript's type inference for rest parameters (`...`) with discriminated unions can be unreliable.
      // We cast `props` to `ButtonAsButtonProps`, which is safe in this `else` block, to ensure
      // `buttonProps` is correctly typed and avoids conflicts when spread.
      const { asChild, variant = 'primary', size = 'md', className, ...buttonProps } = props as ButtonAsButtonProps;
      const combinedClasses = [ baseClasses, variantClasses[variant], sizeClasses[size], className ].filter(Boolean).join(' ');
      return (
        <button
          className={combinedClasses}
          ref={ref as React.Ref<HTMLButtonElement>}
          {...buttonProps}
        />
      );
    }
  }
);
Button.displayName = 'Button';
