/**
 * Router principal que centraliza todas las rutas de la API
 * Facilita el mantenimiento y organización de endpoints
 */

import { Router } from 'express';
import ofertaRoutes from './oferta.routes.js';

const router = Router();

// Rutas de ofertas
router.use('/ofertas', ofertaRoutes);

// Ruta de health check
router.get('/health', (_req, res) => {
  res.json({
    success: true,
    message: 'API de ofertas funcionando correctamente',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

export default router;

