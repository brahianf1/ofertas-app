/**
 * Componente Input - Átomo UI
 * Campo de entrada reutilizable con variantes y estados
 */

import React, { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  variant?: 'default' | 'filled' | 'outlined';
  inputSize?: 'sm' | 'md' | 'lg';
  error?: boolean;
  errorMessage?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  label?: string;
  fullWidth?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({
    className,
    variant = 'default',
    inputSize = 'md',
    error = false,
    errorMessage,
    helperText,
    leftIcon,
    rightIcon,
    label,
    fullWidth = false,
    disabled,
    type = 'text',
    ...props
  }, ref) => {
    const baseClasses = 'transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed';
    
    const variants = {
      default: 'border border-secondary-300 bg-white focus:border-primary-500 focus:ring-primary-500/20',
      filled: 'border-none bg-secondary-100 focus:bg-white focus:ring-primary-500/20',
      outlined: 'border-2 border-secondary-300 bg-transparent focus:border-primary-500 focus:ring-primary-500/20'
    };

    const sizes = {
      sm: 'px-3 py-2 text-sm rounded-md',
      md: 'px-4 py-2.5 text-sm rounded-lg',
      lg: 'px-4 py-3 text-base rounded-lg'
    };

    const errorStyles = error 
      ? 'border-error-500 focus:border-error-500 focus:ring-error-500/20' 
      : '';

    return (
      <div className={cn('relative', fullWidth && 'w-full')}>
        {/* Label */}
        {label && (
          <motion.label
            className="block text-sm font-medium text-secondary-700 mb-1"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            {label}
          </motion.label>
        )}

        {/* Input Container */}
        <div className="relative">
          {/* Left Icon */}
          {leftIcon && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400">
              {leftIcon}
            </div>
          )}

          {/* Input */}
          <motion.input
            ref={ref}
            type={type}
            className={cn(
              baseClasses,
              variants[variant],
              sizes[inputSize],
              errorStyles,
              leftIcon && 'pl-10',
              rightIcon && 'pr-10',
              fullWidth && 'w-full',
              className
            )}
            disabled={disabled}
            whileFocus={{ scale: 1.01 }}
            {...props}
          />

          {/* Right Icon */}
          {rightIcon && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-secondary-400">
              {rightIcon}
            </div>
          )}
        </div>

        {/* Helper Text / Error Message */}
        {(helperText || errorMessage) && (
          <motion.p
            className={cn(
              'mt-1 text-xs',
              error ? 'text-error-600' : 'text-secondary-500'
            )}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ duration: 0.2 }}
          >
            {error ? errorMessage : helperText}
          </motion.p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
