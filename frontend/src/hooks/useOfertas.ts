/**
 * Hook personalizado para manejo de ofertas
 * Encapsula la lógica de TanStack Query para ofertas
 */

import { useQuery } from '@tanstack/react-query';
import { apiService } from '@/services/api';
import { useOfertaStore } from '@/store/useOfertaStore';
import type { Oferta, OpcionesFiltros } from '@/types/oferta';

export const useOfertas = () => {
  const { filtros, opciones } = useOfertaStore();

  return useQuery({
    queryKey: ['ofertas', filtros, opciones],
    queryFn: () => apiService.obtenerOfertas(filtros, opciones),
    staleTime: 5 * 60 * 1000, // 5 minutos
    retry: 2,
    refetchOnWindowFocus: false,
  });
};

export const useOferta = (id: string) => {
  return useQuery({
    queryKey: ['oferta', id],
    queryFn: () => apiService.obtenerOfertaPorId(id),
    staleTime: 10 * 60 * 1000, // 10 minutos
    retry: 2,
    enabled: !!id,
  });
};

export const useOpcionesFiltros = () => {
  return useQuery({
    queryKey: ['opciones-filtros'],
    queryFn: () => apiService.obtenerOpcionesFiltros(),
    staleTime: 15 * 60 * 1000, // 15 minutos
    retry: 2,
  });
};
