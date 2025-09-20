/**
 * Capa de Ruteo - Define endpoints y los asocia con controladores
 * Mantiene las rutas organizadas y con middleware específico
 */

import { Router } from 'express';
import { OfertaController } from '@/controllers/oferta.controller.js';
import { OfertaService } from '@/services/oferta.service.js';

const router = Router();

// Instanciar dependencias siguiendo principios de inyección de dependencias
const ofertaService = new OfertaService();
const ofertaController = new OfertaController(ofertaService);

/**
 * @route   POST /api/ofertas
 * @desc    Crear múltiples ofertas
 * @access  Public
 */
router.post('/', ofertaController.crearOfertas);

/**
 * @route   GET /api/ofertas
 * @desc    Obtener ofertas con filtros y paginación
 * @query   categoria, empresaTienda, conCupon, vigente, busqueda, pagina, limite, ordenarPor, orden
 * @access  Public
 */
router.get('/', ofertaController.obtenerOfertas);

/**
 * @route   GET /api/ofertas/filtros/opciones
 * @desc    Obtener opciones dinámicas para filtros
 * @access  Public
 */
router.get('/filtros/opciones', ofertaController.obtenerOpcionesFiltros);

/**
 * @route   GET /api/ofertas/:id
 * @desc    Obtener oferta específica por ID
 * @access  Public
 */
router.get('/:id', ofertaController.obtenerOfertaPorId);

/**
 * @route   DELETE /api/ofertas/:id
 * @desc    Eliminar oferta específica
 * @access  Public
 */
router.delete('/:id', ofertaController.eliminarOferta);

export default router;

