/**
 * Componente OfertaFilters - Organismo
 * Panel de filtros dinámico para ofertas con animaciones
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Filter, 
  ChevronDown,
  RotateCcw
} from 'lucide-react';
import { Input, Button, Badge } from '@/components/ui';
import { useOfertaStore } from '@/store/useOfertaStore';
import { cn } from '@/utils/cn';
import type { OpcionesFiltros } from '@/types/oferta';

interface OfertaFiltersProps {
  opcionesFiltros: OpcionesFiltros;
  loading?: boolean;
}

const OfertaFilters: React.FC<OfertaFiltersProps> = ({ 
  opcionesFiltros, 
  loading = false 
}) => {
  const {
    filtros,
    mostrarFiltros,
    setFiltros,
    resetFiltros,
    toggleFiltros,
    getFiltrosActivos
  } = useOfertaStore();

  const [busquedaLocal, setBusquedaLocal] = useState(filtros.busqueda || '');
  const [mostrarCategorias, setMostrarCategorias] = useState(false);
  const [mostrarTiendas, setMostrarTiendas] = useState(false);

  // Sincronizar búsqueda local con store (debounced)
  useEffect(() => {
    const timer = setTimeout(() => {
      setFiltros({ busqueda: busquedaLocal || undefined });
    }, 300);

    return () => clearTimeout(timer);
  }, [busquedaLocal, setFiltros]);

  const filtrosActivos = getFiltrosActivos();

  const handleResetFiltros = () => {
    resetFiltros();
    setBusquedaLocal('');
  };

  return (
    <div className="space-y-4">
      {/* Barra de búsqueda principal */}
      <div className="flex gap-3">
        <div className="flex-1">
          <Input
            placeholder="Buscar ofertas..."
            value={busquedaLocal}
            onChange={(e) => setBusquedaLocal(e.target.value)}
            leftIcon={<Search className="w-4 h-4" />}
            fullWidth
            disabled={loading}
          />
        </div>
        
        <Button
          variant="outline"
          onClick={toggleFiltros}
          leftIcon={<Filter className="w-4 h-4" />}
          className={cn(
            "relative",
            mostrarFiltros && "bg-primary-50 border-primary-300"
          )}
        >
          Filtros
          {filtrosActivos > 0 && (
            <motion.div
              className="absolute -top-2 -right-2 w-5 h-5 bg-primary-600 text-white text-xs rounded-full flex items-center justify-center"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            >
              {filtrosActivos}
            </motion.div>
          )}
        </Button>

        {filtrosActivos > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
          >
            <Button
              variant="ghost"
              onClick={handleResetFiltros}
              leftIcon={<RotateCcw className="w-4 h-4" />}
              disabled={loading}
            >
              Limpiar
            </Button>
          </motion.div>
        )}
      </div>

      {/* Panel de filtros expandible */}
      <AnimatePresence>
        {mostrarFiltros && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="bg-white border border-secondary-200 rounded-lg p-4 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                
                {/* Filtro de Categoría */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-secondary-700">
                    Categoría
                  </label>
                  <div className="relative">
                    <button
                      className={cn(
                        "w-full px-3 py-2 text-left bg-white border border-secondary-300 rounded-lg",
                        "hover:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20",
                        "flex items-center justify-between transition-colors",
                        filtros.categoria && "border-primary-500 bg-primary-50"
                      )}
                      onClick={() => setMostrarCategorias(!mostrarCategorias)}
                      disabled={loading}
                    >
                      <span className="text-sm">
                        {filtros.categoria || 'Todas las categorías'}
                      </span>
                      <ChevronDown 
                        className={cn(
                          "w-4 h-4 transition-transform",
                          mostrarCategorias && "rotate-180"
                        )} 
                      />
                    </button>
                    
                    <AnimatePresence>
                      {mostrarCategorias && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="absolute z-10 w-full mt-1 bg-white border border-secondary-200 rounded-lg shadow-lg max-h-48 overflow-y-auto"
                        >
                          <button
                            className="w-full px-3 py-2 text-left text-sm hover:bg-secondary-50 transition-colors"
                            onClick={() => {
                              setFiltros({ categoria: undefined });
                              setMostrarCategorias(false);
                            }}
                          >
                            Todas las categorías
                          </button>
                          {opcionesFiltros.categorias.map((categoria) => (
                            <button
                              key={categoria}
                              className={cn(
                                "w-full px-3 py-2 text-left text-sm hover:bg-secondary-50 transition-colors",
                                filtros.categoria === categoria && "bg-primary-50 text-primary-700"
                              )}
                              onClick={() => {
                                setFiltros({ categoria });
                                setMostrarCategorias(false);
                              }}
                            >
                              {categoria}
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Filtro de Tienda */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-secondary-700">
                    Tienda
                  </label>
                  <div className="relative">
                    <button
                      className={cn(
                        "w-full px-3 py-2 text-left bg-white border border-secondary-300 rounded-lg",
                        "hover:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20",
                        "flex items-center justify-between transition-colors",
                        filtros.empresaTienda && "border-primary-500 bg-primary-50"
                      )}
                      onClick={() => setMostrarTiendas(!mostrarTiendas)}
                      disabled={loading}
                    >
                      <span className="text-sm">
                        {filtros.empresaTienda || 'Todas las tiendas'}
                      </span>
                      <ChevronDown 
                        className={cn(
                          "w-4 h-4 transition-transform",
                          mostrarTiendas && "rotate-180"
                        )} 
                      />
                    </button>
                    
                    <AnimatePresence>
                      {mostrarTiendas && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="absolute z-10 w-full mt-1 bg-white border border-secondary-200 rounded-lg shadow-lg max-h-48 overflow-y-auto"
                        >
                          <button
                            className="w-full px-3 py-2 text-left text-sm hover:bg-secondary-50 transition-colors"
                            onClick={() => {
                              setFiltros({ empresaTienda: undefined });
                              setMostrarTiendas(false);
                            }}
                          >
                            Todas las tiendas
                          </button>
                          {opcionesFiltros.empresasTiendas.map((tienda) => (
                            <button
                              key={tienda}
                              className={cn(
                                "w-full px-3 py-2 text-left text-sm hover:bg-secondary-50 transition-colors",
                                filtros.empresaTienda === tienda && "bg-primary-50 text-primary-700"
                              )}
                              onClick={() => {
                                setFiltros({ empresaTienda: tienda });
                                setMostrarTiendas(false);
                              }}
                            >
                              {tienda}
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Filtros de toggle */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-secondary-700">
                    Opciones
                  </label>
                  <div className="space-y-2">
                    <motion.button
                      className={cn(
                        "w-full px-3 py-2 text-left text-sm border rounded-lg transition-all",
                        filtros.conCupon
                          ? "border-primary-500 bg-primary-50 text-primary-700"
                          : "border-secondary-300 hover:border-secondary-400"
                      )}
                      onClick={() => setFiltros({ conCupon: filtros.conCupon ? undefined : true })}
                      whileTap={{ scale: 0.98 }}
                      disabled={loading}
                    >
                      Con cupón de descuento
                    </motion.button>
                    
                    <motion.button
                      className={cn(
                        "w-full px-3 py-2 text-left text-sm border rounded-lg transition-all",
                        filtros.vigente
                          ? "border-primary-500 bg-primary-50 text-primary-700"
                          : "border-secondary-300 hover:border-secondary-400"
                      )}
                      onClick={() => setFiltros({ vigente: filtros.vigente ? undefined : true })}
                      whileTap={{ scale: 0.98 }}
                      disabled={loading}
                    >
                      Solo ofertas vigentes
                    </motion.button>
                  </div>
                </div>

                {/* Resumen de filtros activos */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-secondary-700">
                    Filtros activos
                  </label>
                  <div className="space-y-1">
                    <motion.div 
                      className="flex flex-wrap gap-2"
                      layout
                    >
                      <AnimatePresence>
                        {filtros.categoria && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.8, x: -20 }}
                            animate={{ opacity: 1, scale: 1, x: 0 }}
                            exit={{ opacity: 0, scale: 0.8, x: -20 }}
                            transition={{ duration: 0.2 }}
                            layout
                          >
                            <Badge
                              variant="primary"
                              removable
                              onRemove={() => setFiltros({ categoria: undefined })}
                            >
                              {filtros.categoria}
                            </Badge>
                          </motion.div>
                        )}
                        
                        {filtros.empresaTienda && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.8, x: -20 }}
                            animate={{ opacity: 1, scale: 1, x: 0 }}
                            exit={{ opacity: 0, scale: 0.8, x: -20 }}
                            transition={{ duration: 0.2 }}
                            layout
                          >
                            <Badge
                              variant="primary"
                              removable
                              onRemove={() => setFiltros({ empresaTienda: undefined })}
                            >
                              {filtros.empresaTienda}
                            </Badge>
                          </motion.div>
                        )}
                        
                        {filtros.conCupon && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.8, x: -20 }}
                            animate={{ opacity: 1, scale: 1, x: 0 }}
                            exit={{ opacity: 0, scale: 0.8, x: -20 }}
                            transition={{ duration: 0.2 }}
                            layout
                          >
                            <Badge
                              variant="success"
                              removable
                              onRemove={() => setFiltros({ conCupon: undefined })}
                            >
                              Con cupón
                            </Badge>
                          </motion.div>
                        )}
                        
                        {filtros.vigente && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.8, x: -20 }}
                            animate={{ opacity: 1, scale: 1, x: 0 }}
                            exit={{ opacity: 0, scale: 0.8, x: -20 }}
                            transition={{ duration: 0.2 }}
                            layout
                          >
                            <Badge
                              variant="success"
                              removable
                              onRemove={() => setFiltros({ vigente: undefined })}
                            >
                              Vigentes
                            </Badge>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                    
                    {filtrosActivos === 0 && (
                      <p className="text-xs text-secondary-500">
                        No hay filtros activos
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default OfertaFilters;
