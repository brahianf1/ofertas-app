/**
 * Hook para calcular el estado de una oferta
 * Determina si está vigente, días restantes, etc.
 */

import { useMemo } from 'react';
import { esOfertaVigente, calcularDiasRestantes } from '@/utils/date';
import type { VigenciaOferta, EstadoOferta } from '@/types/oferta';

export const useOfertaStatus = (vigenciaOferta: VigenciaOferta | null): EstadoOferta => {
  return useMemo(() => {
    if (!vigenciaOferta) {
      return {
        esVigente: true,
        diasRestantes: null,
        estadoTexto: 'Sin fecha límite',
        estadoColor: 'secondary'
      };
    }

    const { fechaInicio, fechaFin } = vigenciaOferta;
    const esVigente = esOfertaVigente(fechaInicio, fechaFin);
    const diasRestantes = calcularDiasRestantes(fechaFin);

    if (!esVigente) {
      return {
        esVigente: false,
        diasRestantes,
        estadoTexto: 'Expirada',
        estadoColor: 'error'
      };
    }

    if (diasRestantes === null) {
      return {
        esVigente: true,
        diasRestantes: null,
        estadoTexto: 'Sin fecha límite',
        estadoColor: 'secondary'
      };
    }

    if (diasRestantes <= 0) {
      return {
        esVigente: false,
        diasRestantes,
        estadoTexto: 'Expirada',
        estadoColor: 'error'
      };
    }

    if (diasRestantes <= 1) {
      return {
        esVigente: true,
        diasRestantes,
        estadoTexto: 'Expira hoy',
        estadoColor: 'error'
      };
    }

    if (diasRestantes <= 3) {
      return {
        esVigente: true,
        diasRestantes,
        estadoTexto: `${diasRestantes} días restantes`,
        estadoColor: 'warning'
      };
    }

    if (diasRestantes <= 7) {
      return {
        esVigente: true,
        diasRestantes,
        estadoTexto: `${diasRestantes} días restantes`,
        estadoColor: 'warning'
      };
    }

    return {
      esVigente: true,
      diasRestantes,
      estadoTexto: `${diasRestantes} días restantes`,
      estadoColor: 'success'
    };
  }, [vigenciaOferta]);
};