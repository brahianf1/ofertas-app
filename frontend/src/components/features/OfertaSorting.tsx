/**
 * Componente OfertaSorting - Control de ordenamiento de ofertas
 * Implementa Material Design para ordenamiento intuitivo
 */

import React from 'react';
import { motion } from 'framer-motion';
import { SortAsc, Calendar, Clock, TrendingUp, Filter } from 'lucide-react';
import SortButton, { type SortDirection as SortButtonDirection } from '@/components/ui/SortButton';
import { cn } from '@/utils/cn';

export type SortField = 'fecha_hora_publicacion' | 'fecha_creacion' | 'titulo_oferta' | 'empresa_tienda';
export type SortDirection = SortButtonDirection;

interface SortOption {
  field: SortField;
  label: string;
  icon: React.ReactNode;
  description: string;
}

interface OfertaSortingProps {
  sortField: SortField | null;
  sortDirection: SortDirection;
  onSortChange: (field: SortField, direction: SortDirection) => void;
  totalItems: number;
  className?: string;
}

const sortOptions: SortOption[] = [
  {
    field: 'fecha_hora_publicacion',
    label: 'Fecha de publicación',
    icon: <Calendar className="w-4 h-4" />,
    description: 'Ordenar por cuándo se publicó la oferta'
  },
  {
    field: 'fecha_creacion',
    label: 'Fecha de creación',
    icon: <Clock className="w-4 h-4" />,
    description: 'Ordenar por cuándo se creó en el sistema'
  },
  {
    field: 'titulo_oferta',
    label: 'Título',
    icon: <SortAsc className="w-4 h-4" />,
    description: 'Ordenar alfabéticamente por título'
  },
  {
    field: 'empresa_tienda',
    label: 'Tienda',
    icon: <TrendingUp className="w-4 h-4" />,
    description: 'Ordenar por nombre de tienda'
  }
];

const OfertaSorting: React.FC<OfertaSortingProps> = ({
  sortField,
  sortDirection,
  onSortChange,
  totalItems,
  className
}) => {
  const handleSortClick = (field: SortField) => {
    if (sortField === field) {
      // Si ya está ordenado por este campo, cambiar dirección
      const newDirection: SortDirection = 
        sortDirection === 'asc' ? 'desc' : 
        sortDirection === 'desc' ? null : 'asc';
      onSortChange(field, newDirection);
    } else {
      // Si es un campo nuevo, empezar con ascendente
      onSortChange(field, 'asc');
    }
  };

  const getSortDescription = () => {
    if (!sortField || !sortDirection) {
      return 'Sin ordenamiento específico';
    }
    
    const option = sortOptions.find(opt => opt.field === sortField);
    const directionText = sortDirection === 'asc' ? 'ascendente' : 'descendente';
    return `Ordenado por ${option?.label.toLowerCase()} (${directionText})`;
  };

  return (
    <motion.div
      className={cn("space-y-4", className)}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-secondary-700">
            <Filter className="w-5 h-5" />
            <h3 className="font-medium">Ordenar ofertas</h3>
          </div>
          <div className="text-sm text-secondary-500">
            ({totalItems} {totalItems === 1 ? 'oferta' : 'ofertas'})
          </div>
        </div>
        
        {/* Reset button */}
        {sortField && (
          <motion.button
            onClick={() => onSortChange('fecha_hora_publicacion', null)}
            className="text-sm text-secondary-500 hover:text-secondary-700 underline"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Restablecer
          </motion.button>
        )}
      </div>

      {/* Sort buttons */}
      <div className="flex flex-wrap gap-2">
        {sortOptions.map((option) => (
          <SortButton
            key={option.field}
            label={option.label}
            active={sortField === option.field}
            direction={sortField === option.field ? sortDirection : null}
            onClick={() => handleSortClick(option.field)}
          />
        ))}
      </div>

      {/* Current sort description */}
      <div className="text-xs text-secondary-500 bg-secondary-50 rounded-lg p-3 border border-secondary-100">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-secondary-400" />
          <span>{getSortDescription()}</span>
        </div>
      </div>
    </motion.div>
  );
};

export default OfertaSorting;
