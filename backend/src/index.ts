/**
 * Servidor principal - Configuración de Express con mejores prácticas
 * Implementa middleware de seguridad, CORS, compresión y manejo de errores
 */

// Cargar variables de entorno ANTES que cualquier otra importación
import dotenv from 'dotenv';
dotenv.config({ path: '.env' });

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import routes from '@/routes/index.js';
import { errorHandler, notFoundHandler } from '@/middleware/error.middleware.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware de seguridad
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// Configuración de CORS
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware de compresión para mejorar performance
app.use(compression());

// Middleware para parsing de JSON con límite de tamaño
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging básico de requests (en desarrollo)
if (process.env.NODE_ENV === 'development') {
  app.use((req, _res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    next();
  });
}

// Rutas principales
app.use('/api', routes);

// Ruta raíz con información de la API
app.get('/', (_req, res) => {
  res.json({
    success: true,
    message: 'API de Ofertas - Backend',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      ofertas: '/api/ofertas',
      filtros: '/api/ofertas/filtros/opciones'
    },
    documentation: 'Consulta el README.md para más información'
  });
});

// Middleware de manejo de errores (debe ir al final)
app.use(notFoundHandler);
app.use(errorHandler);

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  console.log(`📦 Ofertas API: http://localhost:${PORT}/api/ofertas`);
  
  if (process.env.NODE_ENV === 'development') {
    console.log(`🔧 Modo: Desarrollo`);
    console.log(`🌐 CORS habilitado para: ${process.env.CORS_ORIGIN || 'http://localhost:5173'}`);
  }
});

// Manejo graceful de cierre del servidor
process.on('SIGTERM', () => {
  console.log('🛑 Recibida señal SIGTERM, cerrando servidor...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('🛑 Recibida señal SIGINT, cerrando servidor...');
  process.exit(0);
});

