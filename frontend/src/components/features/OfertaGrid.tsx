/**
 * Componente OfertaGrid - Organismo
 * Grilla responsiva de ofertas con animaciones staggered
 */

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SkeletonCard } from '@/components/ui';
import OfertaCard from './OfertaCard';
import type { Oferta } from '@/types/oferta';

interface OfertaGridProps {
  ofertas: Oferta[];
  loading?: boolean;
  error?: string | null;
  onViewDetail?: (oferta: Oferta) => void;
}

const OfertaGrid: React.FC<OfertaGridProps> = ({ 
  ofertas, 
  loading = false, 
  error = null,
  onViewDetail 
}) => {
  // Animaciones mejoradas para mejor UX
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { 
      opacity: 0, 
      y: 30, 
      scale: 0.9,
      rotateX: 15
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      rotateX: 0,
      transition: {
        duration: 0.5,
        ease: [0.25, 0.46, 0.45, 0.94] // easeOutQuart
      }
    },
    exit: {
      opacity: 0,
      y: -20,
      scale: 0.9,
      transition: {
        duration: 0.2
      }
    },
    hover: {
      transition: {
        duration: 0.2,
        ease: "easeOut"
      }
    }
  };

  if (error) {
    return (
      <motion.div
        className="text-center py-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="max-w-md mx-auto">
          <div className="w-16 h-16 mx-auto mb-4 bg-error-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-error-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-secondary-900 mb-2">
            Error al cargar ofertas
          </h3>
          <p className="text-secondary-600">
            {error}
          </p>
        </div>
      </motion.div>
    );
  }

  if (loading) {
    return (
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {Array.from({ length: 8 }).map((_, index) => (
          <motion.div key={index} variants={itemVariants}>
            <SkeletonCard />
          </motion.div>
        ))}
      </motion.div>
    );
  }

  if (ofertas.length === 0) {
    return (
      <motion.div
        className="text-center py-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="max-w-md mx-auto">
          <div className="w-16 h-16 mx-auto mb-4 bg-secondary-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-secondary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-secondary-900 mb-2">
            No se encontraron ofertas
          </h3>
          <p className="text-secondary-600">
            Intenta ajustar los filtros o buscar con otros términos.
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 sm:gap-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <AnimatePresence mode="popLayout">
        {ofertas.map((oferta, index) => (
          <motion.div
            key={oferta.id}
            variants={itemVariants}
            whileHover="hover"
            layout
            className="h-full"
          >
            <OfertaCard oferta={oferta} index={index} onViewDetail={onViewDetail} />
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
};

export default OfertaGrid;
