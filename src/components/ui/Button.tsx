'use client';

import React, { forwardRef } from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'neon' | 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = 'neon',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      className = '',
      disabled,
      ...props
    },
    ref
  ) => {
    const sizeClasses = {
      sm: 'px-3 py-1.5 text-xs',
      md: 'px-5 py-2.5 text-sm',
      lg: 'px-7 py-3 text-base',
    }[size];

    const variantStyles = {
      neon: 'border border-[var(--neon-cyan)] text-[var(--neon-cyan)] hover:bg-[rgba(0,240,255,0.12)] hover:shadow-[0_0_20px_rgba(0,240,255,0.4)] active:scale-98',
      primary: 'bg-gradient-to-r from-[var(--neon-cyan)] to-[#0099ff] text-black font-semibold hover:opacity-90 hover:shadow-[0_0_20px_rgba(0,240,255,0.5)] active:scale-98',
      secondary: 'bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] text-[var(--text-primary)] hover:border-[var(--neon-cyan)] hover:text-white active:scale-98',
      danger: 'border border-[#ff3366] text-[#ff3366] hover:bg-[rgba(255,51,102,0.15)] hover:shadow-[0_0_20px_rgba(255,51,102,0.4)] active:scale-98',
      ghost: 'text-[var(--text-secondary)] hover:text-[var(--neon-cyan)] hover:bg-[rgba(0,240,255,0.06)]',
    }[variant];

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        style={{ fontFamily: 'var(--font-display)', letterSpacing: '0.05em' }}
        className={`inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none uppercase ${sizeClasses} ${variantStyles} ${className}`}
        {...props}
      >
        {isLoading ? (
          <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
        ) : (
          leftIcon
        )}
        <span>{children}</span>
        {!isLoading && rightIcon}
      </button>
    );
  }
);

Button.displayName = 'Button';
