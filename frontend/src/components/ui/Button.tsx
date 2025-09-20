/**
 * Componente Button - Átomo UI
 * Botón reutilizable con variantes, tamaños y efectos
 */

import React, { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({
    className,
    variant = 'primary',
    size = 'md',
    loading = false,
    leftIcon,
    rightIcon,
    fullWidth = false,
    disabled,
    children,
    ...props
  }, ref) => {
    const baseClasses = 'relative inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden';
    
    const variants = {
      primary: 'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500 shadow-lg hover:shadow-xl',
      secondary: 'bg-secondary-100 text-secondary-900 hover:bg-secondary-200 focus:ring-secondary-500',
      outline: 'border-2 border-primary-600 text-primary-600 hover:bg-primary-50 focus:ring-primary-500',
      ghost: 'text-secondary-700 hover:bg-secondary-100 focus:ring-secondary-500',
      destructive: 'bg-error-600 text-white hover:bg-error-700 focus:ring-error-500 shadow-lg hover:shadow-xl'
    };

    const sizes = {
      sm: 'px-3 py-1.5 text-sm rounded-md',
      md: 'px-4 py-2 text-sm rounded-lg',
      lg: 'px-6 py-3 text-base rounded-lg',
      xl: 'px-8 py-4 text-lg rounded-xl'
    };

    const iconSizes = {
      sm: 'w-4 h-4',
      md: 'w-4 h-4',
      lg: 'w-5 h-5',
      xl: 'w-6 h-6'
    };

    return (
      <motion.button
        ref={ref}
        className={cn(
          baseClasses,
          variants[variant],
          sizes[size],
          fullWidth && 'w-full',
          className
        )}
        disabled={disabled || loading}
        whileTap={{ scale: disabled || loading ? 1 : 0.98 }}
        {...props}
      >
        {/* Efecto ripple */}
        <motion.div
          className="absolute inset-0 bg-white rounded-inherit"
          initial={{ scale: 0, opacity: 0.3 }}
          whileTap={{ scale: 1, opacity: 0 }}
          transition={{ duration: 0.6 }}
        />
        
        {/* Contenido del botón */}
        <div className="relative flex items-center justify-center gap-2">
          {loading ? (
            <motion.div
              className={cn('border-2 border-current border-t-transparent rounded-full', iconSizes[size])}
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            />
          ) : leftIcon ? (
            <span className={iconSizes[size]}>{leftIcon}</span>
          ) : null}
          
          {children && (
            <span className={loading ? 'opacity-70' : ''}>
              {children}
            </span>
          )}
          
          {!loading && rightIcon && (
            <span className={iconSizes[size]}>{rightIcon}</span>
          )}
        </div>
      </motion.button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
