/**
 * Componente Skeleton - Átomo UI
 * Placeholder animado para contenido que está cargando
 */

import React, { forwardRef } from 'react';
import { cn } from '@/utils/cn';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'rectangular' | 'circular';
  width?: string | number;
  height?: string | number;
  lines?: number;
}

const Skeleton = forwardRef<HTMLDivElement, SkeletonProps>(
  ({
    className,
    variant = 'rectangular',
    width,
    height,
    lines = 1,
    ...props
  }, ref) => {
    const baseClasses = 'animate-skeleton bg-secondary-200 rounded';
    
    const variants = {
      text: 'h-4 rounded-md',
      rectangular: 'rounded-lg',
      circular: 'rounded-full'
    };

    const style = {
      width: width || '100%',
      height: height || (variant === 'text' ? '1rem' : '2rem')
    };

    if (variant === 'text' && lines > 1) {
      return (
        <div ref={ref} className={cn('space-y-2', className)} {...props}>
          {Array.from({ length: lines }).map((_, index) => (
            <div
              key={index}
              className={cn(baseClasses, variants.text)}
              style={{
                width: index === lines - 1 ? '75%' : '100%',
                height: '1rem'
              }}
            />
          ))}
        </div>
      );
    }

    return (
      <div
        ref={ref}
        className={cn(baseClasses, variants[variant], className)}
        style={style}
        {...props}
      />
    );
  }
);

Skeleton.displayName = 'Skeleton';

// Componentes de skeleton específicos para casos comunes
const SkeletonCard = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('p-4 border border-secondary-200 rounded-xl bg-white', className)}
      {...props}
    >
      <div className="space-y-3">
        <Skeleton variant="rectangular" height="12rem" />
        <div className="space-y-2">
          <Skeleton variant="text" />
          <Skeleton variant="text" width="75%" />
        </div>
        <div className="flex items-center space-x-2">
          <Skeleton variant="rectangular" width="4rem" height="1.5rem" />
          <Skeleton variant="rectangular" width="3rem" height="1.5rem" />
        </div>
      </div>
    </div>
  )
);
SkeletonCard.displayName = 'SkeletonCard';

const SkeletonList = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & { count?: number }>(
  ({ className, count = 3, ...props }, ref) => (
    <div ref={ref} className={cn('space-y-3', className)} {...props}>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="flex items-center space-x-3 p-3 border border-secondary-200 rounded-lg bg-white">
          <Skeleton variant="circular" width="3rem" height="3rem" />
          <div className="flex-1 space-y-2">
            <Skeleton variant="text" />
            <Skeleton variant="text" width="60%" />
          </div>
        </div>
      ))}
    </div>
  )
);
SkeletonList.displayName = 'SkeletonList';

export default Skeleton;
export { Skeleton, SkeletonCard, SkeletonList };
