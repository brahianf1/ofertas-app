/**
 * Componente SortButton - Botón de ordenamiento
 * Implementa Material Design para controles de ordenamiento
 */

import React from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, ChevronUp, ArrowUpDown } from 'lucide-react';
import { cn } from '@/utils/cn';

export type SortDirection = 'asc' | 'desc' | null;

interface SortButtonProps {
  label: string;
  active: boolean;
  direction: SortDirection;
  onClick: () => void;
  className?: string;
}

const SortButton: React.FC<SortButtonProps> = ({
  label,
  active,
  direction,
  onClick,
  className
}) => {
  const getIcon = () => {
    if (!active) return <ArrowUpDown className="w-4 h-4 opacity-50" />;
    if (direction === 'asc') return <ChevronUp className="w-4 h-4" />;
    if (direction === 'desc') return <ChevronDown className="w-4 h-4" />;
    return <ArrowUpDown className="w-4 h-4" />;
  };

  return (
    <motion.button
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200",
        "border border-secondary-200 bg-white hover:bg-secondary-50",
        "focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2",
        active && "bg-primary-50 border-primary-200 text-primary-700",
        className
      )}
      whileTap={{ scale: 0.98 }}
    >
      <span>{label}</span>
      <motion.div
        animate={{ 
          rotate: direction === 'desc' ? 180 : 0,
          scale: active ? 1 : 0.8
        }}
        transition={{ duration: 0.2 }}
      >
        {getIcon()}
      </motion.div>
    </motion.button>
  );
};

export default SortButton;
