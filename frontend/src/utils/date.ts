/**
 * Utilidades para manejo de fechas
 * Usando date-fns para formateo y cálculos
 */

import { 
  format, 
  formatDistanceToNow, 
  differenceInDays, 
  isAfter, 
  isBefore, 
  parseISO 
} from 'date-fns';
import es from 'date-fns/locale/es';

/**
 * Formatea una fecha ISO string a formato legible en español
 */
export const formatearFecha = (fechaISO: string): string => {
  try {
    const fecha = parseISO(fechaISO);
    return format(fecha, 'dd/MM/yyyy HH:mm', { locale: es });
  } catch {
    return 'Fecha inválida';
  }
};

/**
 * Formatea una fecha ISO string a formato relativo (hace X tiempo)
 */
export const formatearFechaRelativa = (fechaISO: string): string => {
  try {
    const fecha = parseISO(fechaISO);
    const distancia = formatDistanceToNow(fecha, { 
      addSuffix: true, 
      locale: es 
    });
    
    // Simplificar el texto eliminando "alrededor de"
    return distancia
      .replace('alrededor de ', '')
      .replace('aproximadamente ', '')
      .replace('casi ', '');
  } catch {
    return 'Fecha inválida';
  }
};

/**
 * Calcula los días restantes hasta una fecha
 */
export const calcularDiasRestantes = (fechaFin: string | null): number | null => {
  if (!fechaFin) return null;
  
  try {
    const fecha = parseISO(fechaFin);
    const ahora = new Date();
    return differenceInDays(fecha, ahora);
  } catch {
    return null;
  }
};

/**
 * Verifica si una oferta está vigente
 */
export const esOfertaVigente = (
  fechaInicio: string | null, 
  fechaFin: string | null
): boolean => {
  const ahora = new Date();
  
  try {
    // Si no hay fechas, se considera siempre vigente
    if (!fechaInicio && !fechaFin) return true;
    
    // Si solo hay fecha de inicio
    if (fechaInicio && !fechaFin) {
      const inicio = parseISO(fechaInicio);
      return isAfter(ahora, inicio) || ahora.getTime() === inicio.getTime();
    }
    
    // Si solo hay fecha de fin
    if (!fechaInicio && fechaFin) {
      const fin = parseISO(fechaFin);
      return isBefore(ahora, fin) || ahora.getTime() === fin.getTime();
    }
    
    // Si hay ambas fechas
    if (fechaInicio && fechaFin) {
      const inicio = parseISO(fechaInicio);
      const fin = parseISO(fechaFin);
      return (isAfter(ahora, inicio) || ahora.getTime() === inicio.getTime()) &&
             (isBefore(ahora, fin) || ahora.getTime() === fin.getTime());
    }
    
    return false;
  } catch {
    return false;
  }
};
