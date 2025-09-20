/**
 * Utilidad para combinar clases CSS con Tailwind
 * Basada en clsx y tailwind-merge para evitar conflictos
 */

import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
