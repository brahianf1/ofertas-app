/**
 * Store de Zustand para manejo de estado de ofertas
 * Maneja filtros, UI state y preferencias del usuario
 */

import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import type { FiltrosOferta, OpcionesConsulta } from '@/types/oferta';
import type { SortField, SortDirection } from '@/components/features/OfertaSorting';

interface OfertaStore {
  // Estado de filtros
  filtros: FiltrosOferta;
  opciones: OpcionesConsulta;
  
  // Estado de ordenamiento
  sortField: SortField | null;
  sortDirection: SortDirection;
  
  // Estado del UI
  vistaActual: 'grid' | 'list';
  mostrarFiltros: boolean;
  mostrarOrdenamiento: boolean;
  cargando: boolean;
  error: string | null;
  
  // Acciones para filtros
  setFiltros: (filtros: Partial<FiltrosOferta>) => void;
  resetFiltros: () => void;
  setOpciones: (opciones: Partial<OpcionesConsulta>) => void;
  
  // Acciones para ordenamiento
  setSorting: (field: SortField | null, direction: SortDirection) => void;
  resetSorting: () => void;
  
  // Acciones para UI
  setVistaActual: (vista: 'grid' | 'list') => void;
  toggleFiltros: () => void;
  toggleOrdenamiento: () => void;
  setCargando: (cargando: boolean) => void;
  setError: (error: string | null) => void;
  
  // Utilidades
  getFiltrosActivos: () => number;
}

const filtrosIniciales: FiltrosOferta = {
  categoria: undefined,
  empresaTienda: undefined,
  conCupon: undefined,
  vigente: undefined,
  busqueda: undefined,
};

const opcionesIniciales: OpcionesConsulta = {
  pagina: 1,
  limite: 20,
  ordenarPor: 'fecha_hora_publicacion',
  orden: 'desc',
};

export const useOfertaStore = create<OfertaStore>()(
  subscribeWithSelector((set, get) => ({
    // Estado inicial
    filtros: filtrosIniciales,
    opciones: opcionesIniciales,
    sortField: 'fecha_hora_publicacion',
    sortDirection: 'desc',
    vistaActual: 'grid',
    mostrarFiltros: false,
    mostrarOrdenamiento: false,
    cargando: false,
    error: null,

    // Acciones para filtros
    setFiltros: (nuevosFiltros) =>
      set((state) => ({
        filtros: { ...state.filtros, ...nuevosFiltros },
        opciones: { ...state.opciones, pagina: 1 }, // Reset página al cambiar filtros
      })),

    resetFiltros: () =>
      set((state) => ({
        filtros: filtrosIniciales,
        opciones: { ...state.opciones, pagina: 1 },
      })),

    setOpciones: (nuevasOpciones) =>
      set((state) => ({
        opciones: { ...state.opciones, ...nuevasOpciones },
      })),

    // Acciones para ordenamiento
    setSorting: (field, direction) =>
      set((state) => {
        const newState = {
          sortField: field,
          sortDirection: direction,
          opciones: {
            ...state.opciones,
            ordenarPor: field || 'fecha_hora_publicacion',
            orden: direction || 'desc',
            pagina: 1 // Reset página al cambiar ordenamiento
          }
        };
        return newState;
      }),

    resetSorting: () =>
      set((state) => ({
        sortField: 'fecha_hora_publicacion',
        sortDirection: 'desc',
        opciones: {
          ...state.opciones,
          ordenarPor: 'fecha_hora_publicacion',
          orden: 'desc',
          pagina: 1
        }
      })),

    // Acciones para UI
    setVistaActual: (vista) => {
      set({ vistaActual: vista });
      // Guardar preferencia en localStorage de forma segura
      try {
        localStorage.setItem('oferta-vista', vista);
      } catch (error) {
        console.warn('Error al guardar en localStorage:', error);
      }
    },
    
    toggleFiltros: () =>
      set((state) => ({ mostrarFiltros: !state.mostrarFiltros })),
    
    toggleOrdenamiento: () =>
      set((state) => ({ mostrarOrdenamiento: !state.mostrarOrdenamiento })),

    setCargando: (cargando) => set({ cargando }),
    
    setError: (error) => set({ error }),

    // Utilidades
    getFiltrosActivos: () => {
      const { filtros } = get();
      return Object.values(filtros).filter(
        (valor) => valor !== undefined && valor !== '' && valor !== null
      ).length;
    },
  }))
);

// Inicializar vista desde localStorage de forma segura
try {
  const vistaGuardada = localStorage.getItem('oferta-vista') as 'grid' | 'list';
  if (vistaGuardada && (vistaGuardada === 'grid' || vistaGuardada === 'list')) {
    useOfertaStore.setState({ vistaActual: vistaGuardada });
  }
} catch (error) {
  console.warn('Error al acceder al localStorage:', error);
}
