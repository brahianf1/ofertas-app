/**
 * Middleware de manejo de errores centralizado
 * Proporciona respuestas consistentes y logging de errores
 */

import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';

interface ErrorResponse {
  success: false;
  message: string;
  errors?: any;
  stack?: string;
}

/**
 * Middleware principal de manejo de errores
 * Captura todas las excepciones y las formatea consistentemente
 */
export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  console.error(`[ERROR] ${new Date().toISOString()}:`, {
    message: error.message,
    stack: error.stack,
    url: req.url,
    method: req.method,
    body: req.body
  });

  // Error de validación con Zod
  if (error instanceof ZodError) {
    const response: ErrorResponse = {
      success: false,
      message: 'Error de validación en los datos enviados',
      errors: error.errors.map(err => ({
        field: err.path.join('.'),
        message: err.message,
        code: err.code
      }))
    };
    res.status(400).json(response);
    return;
  }

  // Errores de Supabase (base de datos)
  if (error.message && error.message.includes('supabase')) {
    const response: ErrorResponse = {
      success: false,
      message: 'Error en la base de datos'
    };
    res.status(500).json(response);
    return;
  }

  // Error genérico del servidor
  const response: ErrorResponse = {
    success: false,
    message: process.env.NODE_ENV === 'production' 
      ? 'Error interno del servidor' 
      : error.message
  };

  // En desarrollo, incluir stack trace
  if (process.env.NODE_ENV !== 'production') {
    (response as any).stack = error.stack;
  }

  res.status(500).json(response);
};

/**
 * Middleware para manejar rutas no encontradas
 */
export const notFoundHandler = (req: Request, res: Response): void => {
  res.status(404).json({
    success: false,
    message: `Ruta ${req.method} ${req.path} no encontrada`
  });
};

/**
 * Wrapper para funciones asíncronas que permite captura automática de errores
 */
export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

