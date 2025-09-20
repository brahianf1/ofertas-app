/**
 * Validaciones con Zod para asegurar integridad de datos
 * Siguiendo principios de validación estricta y mensajes de error claros
 */

import { z } from 'zod';

// Esquemas de validación para tipos anidados
export const TipComunitarioSchema = z.object({
  tipo: z.enum(['Mejora', 'Advertencia', 'Contexto'], {
    errorMap: () => ({ message: 'El tipo debe ser: Mejora, Advertencia o Contexto' })
  }),
  descripcion: z.string().min(1, 'La descripción no puede estar vacía').max(500, 'La descripción no puede exceder 500 caracteres'),
  usuario: z.string().min(1, 'El usuario no puede estar vacío').max(100, 'El usuario no puede exceder 100 caracteres')
});

// Función helper para validar fechas ISO 8601 estrictas
const validarFechaISO = (fecha: string): boolean => {
  // Formato estricto: YYYY-MM-DDTHH:mm:ss.sssZ o YYYY-MM-DDTHH:mm:ss±HH:mm
  const formatoISO = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?(Z|[+-]\d{2}:\d{2})$/;
  
  if (!formatoISO.test(fecha)) return false;
  
  // Verificar que la fecha sea válida
  const fechaParseada = new Date(fecha);
  return !isNaN(fechaParseada.getTime());
};

export const VigenciaOfertaSchema = z.object({
  fecha_inicio: z.string()
    .refine((fecha) => fecha === null || validarFechaISO(fecha), {
      message: 'La fecha de inicio debe estar en formato ISO 8601 con timezone (ej: 2025-09-19T15:26:00-03:00)'
    })
    .nullable(),
  fecha_fin: z.string()
    .refine((fecha) => fecha === null || validarFechaISO(fecha), {
      message: 'La fecha de fin debe estar en formato ISO 8601 con timezone (ej: 2025-09-19T15:26:00-03:00)'
    })
    .nullable()
});

export const LinksSchema = z.object({
  url_oferta: z.string().url('La URL de la oferta debe ser válida').nullable(),
  url_post_foro: z.string().url('La URL del post del foro debe ser válida').nullable()
});

// Esquema principal para validar ofertas de entrada
export const OfertaInputSchema = z.object({
  titulo_oferta: z.string()
    .min(1, 'El título no puede estar vacío')
    .max(200, 'El título no puede exceder 200 caracteres'),
  
  contexto_y_descripcion: z.string()
    .min(1, 'El contexto y descripción no puede estar vacío')
    .max(1000, 'El contexto y descripción no puede exceder 1000 caracteres'),
  
  empresa_tienda: z.string()
    .min(1, 'La empresa/tienda no puede estar vacía')
    .max(100, 'La empresa/tienda no puede exceder 100 caracteres'),
  
  categoria: z.string()
    .min(1, 'La categoría no puede estar vacía')
    .max(50, 'La categoría no puede exceder 50 caracteres'),
  
  codigo_cupon: z.string()
    .max(50, 'El código de cupón no puede exceder 50 caracteres')
    .nullable(),
  
  esBug: z.boolean().default(false),
  
  links: LinksSchema,
  
  imagenes_adjuntas: z.array(z.string().url('Cada imagen debe tener una URL válida'))
    .max(10, 'No se pueden adjuntar más de 10 imágenes'),
  
  fecha_hora_publicacion: z.string()
    .refine(validarFechaISO, {
      message: 'La fecha de publicación debe estar en formato ISO 8601 con timezone (ej: 2025-09-19T15:26:00-03:00)'
    }),
  
  publicado_por_usuario: z.string()
    .min(1, 'El usuario que publica no puede estar vacío')
    .max(100, 'El usuario que publica no puede exceder 100 caracteres'),
  
  vigencia_oferta: VigenciaOfertaSchema,
  
  tips_de_la_comunidad: z.array(TipComunitarioSchema)
    .max(20, 'No se pueden agregar más de 20 tips comunitarios')
});

// Esquema para el payload completo de ofertas encontradas
export const OfertasEncontradasInputSchema = z.object({
  ofertas_encontradas: z.array(OfertaInputSchema)
    .min(1, 'Debe haber al menos una oferta')
    .max(100, 'No se pueden procesar más de 100 ofertas a la vez')
});

// Esquemas para filtros y consultas
export const FiltrosOfertaSchema = z.object({
  categoria: z.string().optional(),
  empresaTienda: z.string().optional(),
  conCupon: z.boolean().optional(),
  vigente: z.boolean().optional(),
  busqueda: z.string().max(200, 'La búsqueda no puede exceder 200 caracteres').optional()
});

export const OpcionesConsultaSchema = z.object({
  pagina: z.number().int().min(1, 'La página debe ser mayor a 0').optional(),
  limite: z.number().int().min(1, 'El límite debe ser mayor a 0').max(100, 'El límite no puede exceder 100').optional(),
  ordenarPor: z.enum(['fecha_hora_publicacion', 'fecha_creacion']).optional(),
  orden: z.enum(['asc', 'desc']).optional()
});

// Esquema para parámetros de ID (UUID de Supabase)
export const IdParamSchema = z.object({
  id: z.string().uuid('El ID debe ser un UUID válido')
});

