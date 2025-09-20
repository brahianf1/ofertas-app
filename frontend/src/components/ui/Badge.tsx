/**
 * Componente Badge - Átomo UI
 * Etiqueta pequeña para mostrar estados, categorías, etc.
 */

import React, { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'outline' | 'bug';
  size?: 'sm' | 'md' | 'lg';
  removable?: boolean;
  onRemove?: () => void;
}

const Badge = forwardRef<HTMLDivElement, BadgeProps>(
  ({
    className,
    variant = 'secondary',
    size = 'md',
    removable = false,
    onRemove,
    children,
    ...props
  }, ref) => {
    const baseClasses = 'inline-flex items-center font-medium rounded-full transition-all duration-200';
    
    const variants = {
      primary: 'bg-primary-100 text-primary-800 border border-primary-200',
      secondary: 'bg-secondary-100 text-secondary-800 border border-secondary-200',
      success: 'bg-success-100 text-success-800 border border-success-200',
      warning: 'bg-warning-100 text-warning-800 border border-warning-200',
      error: 'bg-error-100 text-error-800 border border-error-200',
      outline: 'bg-transparent text-secondary-700 border border-secondary-300',
      bug: 'bg-purple-100 text-purple-800 border border-purple-200 shadow-sm'
    };

    const sizes = {
      sm: 'px-2 py-0.5 text-xs',
      md: 'px-2.5 py-1 text-xs',
      lg: 'px-3 py-1.5 text-sm'
    };

    return (
      <motion.div
        ref={ref}
        className={cn(
          baseClasses,
          variants[variant],
          sizes[size],
          removable && 'pr-1',
          className
        )}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{ duration: 0.2 }}
        {...props}
      >
        <span>{children}</span>
        
        {removable && (
          <motion.button
            className="ml-1 inline-flex items-center justify-center w-4 h-4 rounded-full hover:bg-black/10 focus:outline-none focus:bg-black/10"
            onClick={onRemove}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            type="button"
          >
            <svg
              className="w-2.5 h-2.5"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </motion.button>
        )}
      </motion.div>
    );
  }
);

Badge.displayName = 'Badge';

export default Badge;
