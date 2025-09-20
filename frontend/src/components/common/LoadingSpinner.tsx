/**
 * Componente LoadingSpinner - Indicador de carga global
 * Spinner animado con Framer Motion para estados de carga
 */

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: 'primary' | 'secondary' | 'white';
  text?: string;
  fullScreen?: boolean;
  className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  color = 'primary',
  text,
  fullScreen = false,
  className
}) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12'
  };

  const colors = {
    primary: 'text-primary-600',
    secondary: 'text-secondary-600',
    white: 'text-white'
  };

  const textSizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
    xl: 'text-lg'
  };

  const spinner = (
    <motion.div
      className={cn(
        'inline-flex items-center justify-center',
        fullScreen && 'flex-col space-y-3'
      )}
    >
      <motion.div
        className={cn(
          'border-2 border-current border-t-transparent rounded-full',
          sizes[size],
          colors[color]
        )}
        animate={{ rotate: 360 }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: 'linear'
        }}
      />
      
      {text && (
        <motion.p
          className={cn(
            'font-medium',
            colors[color],
            textSizes[size],
            fullScreen ? 'mt-3' : 'ml-3'
          )}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {text}
        </motion.p>
      )}
    </motion.div>
  );

  if (fullScreen) {
    return (
      <motion.div
        className={cn(
          'fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center',
          className
        )}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        {spinner}
      </motion.div>
    );
  }

  return (
    <div className={cn('inline-flex items-center', className)}>
      {spinner}
    </div>
  );
};

export default LoadingSpinner;
