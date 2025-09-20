/**
 * Componente OfertasPage - Página principal
 * Integra todos los componentes y maneja el estado de la aplicación
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, Grid, List, ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui';
import { useOfertaStore } from '@/store/useOfertaStore';
import { useOfertas, useOpcionesFiltros } from '@/hooks/useOfertas';
import OfertaGrid from './OfertaGrid';
import OfertaFilters from './OfertaFilters';
import OfertaSorting from './OfertaSorting';
import OfertaDetailView from './OfertaDetailView';
import ScrollToTop from '@/components/common/ScrollToTop';
import { mockOfertas, mockOpcionesFiltros } from '@/data/mockData';
import { cn } from '@/utils/cn';
import type { Oferta } from '@/types/oferta';
import type { SortField, SortDirection } from './OfertaSorting';

const OfertasPage: React.FC = () => {
  const [ofertaSeleccionada, setOfertaSeleccionada] = useState<Oferta | null>(null);
  
  const {
    sortField,
    sortDirection,
    vistaActual,
    mostrarOrdenamiento,
    setVistaActual,
    setSorting,
    toggleOrdenamiento,
    setOpciones
  } = useOfertaStore();

  // Hooks personalizados para datos
  const {
    data: ofertasData,
    isLoading: isLoadingOfertas,
    error: errorOfertas,
    refetch: refetchOfertas
  } = useOfertas();

  const {
    data: opcionesFiltros,
    isLoading: isLoadingFiltros
  } = useOpcionesFiltros();

  // Usar datos mock si hay error de conexión
  const isConnectionError = errorOfertas && (
    String(errorOfertas).includes('Network Error') || 
    String(errorOfertas).includes('ECONNREFUSED') ||
    String(errorOfertas).includes('fetch')
  );

  const ofertas = isConnectionError ? mockOfertas : (ofertasData?.ofertas || []);
  const pagination = ofertasData?.pagination;
  const isLoading = isLoadingOfertas || cargando;
  const hasError = errorOfertas && !isConnectionError ? error : null;
  const filtrosOptions = isConnectionError ? mockOpcionesFiltros : (opcionesFiltros || { categorias: [], empresasTiendas: [], tiposTips: [] });

  const handleRefresh = () => {
    refetchOfertas();
  };

  const handlePageChange = (nuevaPagina: number) => {
    setOpciones({ pagina: nuevaPagina });
    // Scroll suave al inicio de la grilla
    document.querySelector('#ofertas-grid')?.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    });
  };

  const handleViewDetail = (oferta: Oferta) => {
    setOfertaSeleccionada(oferta);
  };

  const handleBackToList = () => {
    setOfertaSeleccionada(null);
  };

  const handleSortChange = (field: SortField | null, direction: SortDirection) => {
    setSorting(field, direction);
  };

  // Si hay una oferta seleccionada, mostrar la vista detallada
  if (ofertaSeleccionada) {
    return (
      <>
        <OfertaDetailView 
          oferta={ofertaSeleccionada} 
          onBack={handleBackToList}
        />
        <ScrollToTop />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-secondary-50">
      {/* Header */}
      <motion.header
        className="bg-white shadow-sm border-b border-secondary-200"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <motion.h1 
                className="text-2xl font-bold text-secondary-900"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                🔥 Ofertas
              </motion.h1>
              {pagination && (
                <motion.div
                  className="hidden sm:flex items-center text-sm text-secondary-600"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <span>
                    {((pagination.pagina - 1) * pagination.limite) + 1}-{Math.min(pagination.pagina * pagination.limite, pagination.total)} de {pagination.total} ofertas
                  </span>
                </motion.div>
              )}
              
              {/* Indicador móvil */}
              {pagination && (
                <motion.div
                  className="sm:hidden flex items-center text-xs text-secondary-600"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <span>{pagination.total} ofertas</span>
                </motion.div>
              )}
            </div>

            <div className="flex items-center space-x-3">
              {/* Controles de vista */}
              <div className="flex items-center bg-secondary-100 rounded-lg p-1">
                <button
                  className={cn(
                    "p-2 rounded-md transition-all duration-200",
                    vistaActual === 'grid'
                      ? "bg-white shadow-sm text-primary-600"
                      : "text-secondary-600 hover:text-secondary-900"
                  )}
                  onClick={() => setVistaActual('grid')}
                  title="Vista de grilla"
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  className={cn(
                    "p-2 rounded-md transition-all duration-200",
                    vistaActual === 'list'
                      ? "bg-white shadow-sm text-primary-600"
                      : "text-secondary-600 hover:text-secondary-900"
                  )}
                  onClick={() => setVistaActual('list')}
                  title="Vista de lista"
                >
                  <List className="w-4 h-4" />
                </button>
              </div>

              {/* Botón de ordenamiento */}
              <Button
                variant={mostrarOrdenamiento ? "primary" : "outline"}
                size="sm"
                onClick={toggleOrdenamiento}
                leftIcon={<ArrowUpDown className="w-4 h-4" />}
              >
                Ordenar
              </Button>

              {/* Botón de refresh */}
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                leftIcon={
                  <RefreshCw 
                    className={cn("w-4 h-4", isLoading && "animate-spin")} 
                  />
                }
                disabled={isLoading}
              >
                Actualizar
              </Button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Contenido principal */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="space-y-6">
          {/* Filtros */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <OfertaFilters
              opcionesFiltros={filtrosOptions}
              loading={isLoadingFiltros && !isConnectionError}
            />
          </motion.section>

          {/* Ordenamiento */}
          <AnimatePresence>
            {mostrarOrdenamiento && (
              <motion.section
                initial={{ opacity: 0, y: -20, height: 0 }}
                animate={{ opacity: 1, y: 0, height: 'auto' }}
                exit={{ opacity: 0, y: -20, height: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <OfertaSorting
                  sortField={sortField}
                  sortDirection={sortDirection}
                  onSortChange={handleSortChange}
                  totalItems={ofertas.length}
                />
              </motion.section>
            )}
          </AnimatePresence>

          {/* Mensaje de conexión */}
          {isConnectionError && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-warning-50 border border-warning-200 rounded-lg p-6 mb-6"
            >
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <svg className="w-6 h-6 text-warning-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-warning-800">
                    Modo demostración
                  </h3>
                  <p className="text-sm text-warning-700 mt-1">
                    Mostrando datos de ejemplo. Para ver ofertas reales, inicia el servidor backend ejecutando <code className="bg-warning-100 px-1 rounded">npm run dev</code> en la carpeta <code className="bg-warning-100 px-1 rounded">backend</code>.
                  </p>
                </div>
              </div>
            </motion.section>
          )}

          {/* Grilla de ofertas */}
          <motion.section
            id="ofertas-grid"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <OfertaGrid
              ofertas={ofertas}
              loading={isLoading && !isConnectionError}
              error={hasError ? String(hasError) : null}
              onViewDetail={handleViewDetail}
            />
          </motion.section>

          {/* Paginación */}
          {pagination && pagination.totalPaginas > 1 && (
            <motion.section
              className="flex justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(pagination.pagina - 1)}
                  disabled={pagination.pagina <= 1 || isLoading}
                >
                  Anterior
                </Button>

                <div className="flex items-center space-x-1">
                  {Array.from({ length: Math.min(5, pagination.totalPaginas) }, (_, i) => {
                    const startPage = Math.max(1, pagination.pagina - 2);
                    const pageNumber = startPage + i;
                    
                    if (pageNumber > pagination.totalPaginas) return null;

                    return (
                      <Button
                        key={pageNumber}
                        variant={pageNumber === pagination.pagina ? "primary" : "ghost"}
                        size="sm"
                        onClick={() => handlePageChange(pageNumber)}
                        disabled={isLoading}
                        className="w-10"
                      >
                        {pageNumber}
                      </Button>
                    );
                  })}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(pagination.pagina + 1)}
                  disabled={pagination.pagina >= pagination.totalPaginas || isLoading}
                >
                  Siguiente
                </Button>
              </div>
            </motion.section>
          )}
        </div>
      </main>

      {/* Botón de scroll to top */}
      <ScrollToTop />
    </div>
  );
};

export default OfertasPage;
