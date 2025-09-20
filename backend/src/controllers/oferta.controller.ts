/**
 * Capa de Controladores - Orquesta las solicitudes HTTP
 * Debe ser "delgada", delegando toda la lógica a los servicios
 */

import { Request, Response, NextFunction } from 'express';
import { OfertaService } from '@/services/oferta.service.js';
import { 
  OfertasEncontradasInputSchema, 
  FiltrosOfertaSchema, 
  OpcionesConsultaSchema,
  IdParamSchema 
} from '@/utils/validations.js';

export class OfertaController {
  private ofertaService: OfertaService;

  constructor(ofertaService: OfertaService) {
    this.ofertaService = ofertaService;
  }

  /**
   * POST /api/ofertas - Crear múltiples ofertas
   */
  crearOfertas = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Validar entrada
      const datosValidados = OfertasEncontradasInputSchema.parse(req.body);
      
      // Delegar a la capa de servicios
      const ofertas = await this.ofertaService.crearOfertas(datosValidados);
      
      res.status(201).json({
        success: true,
        message: `Se crearon ${ofertas.length} ofertas exitosamente`,
        data: ofertas
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * GET /api/ofertas - Obtener ofertas con filtros y paginación
   */
  obtenerOfertas = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Validar query parameters
      const filtros = FiltrosOfertaSchema.parse({
        categoria: req.query.categoria || undefined,
        empresaTienda: req.query.empresaTienda || undefined,
        conCupon: req.query.conCupon ? req.query.conCupon === 'true' : undefined,
        vigente: req.query.vigente ? req.query.vigente === 'true' : undefined,
        busqueda: req.query.busqueda || undefined
      });

      const opciones = OpcionesConsultaSchema.parse({
        pagina: req.query.pagina ? parseInt(req.query.pagina as string) : undefined,
        limite: req.query.limite ? parseInt(req.query.limite as string) : undefined,
        ordenarPor: req.query.ordenarPor,
        orden: req.query.orden
      });

      // Delegar a la capa de servicios
      const resultado = await this.ofertaService.obtenerOfertas(filtros, opciones);

      res.json({
        success: true,
        message: 'Ofertas obtenidas exitosamente',
        data: resultado.ofertas,
        pagination: {
          total: resultado.total,
          pagina: resultado.pagina,
          totalPaginas: resultado.totalPaginas,
          limite: opciones.limite || 20
        }
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * GET /api/ofertas/:id - Obtener oferta específica
   */
  obtenerOfertaPorId = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Validar parámetro ID
      const { id } = IdParamSchema.parse(req.params);
      
      // Delegar a la capa de servicios
      const oferta = await this.ofertaService.obtenerOfertaPorId(id);
      
      if (!oferta) {
        res.status(404).json({
          success: false,
          message: 'Oferta no encontrada'
        });
        return;
      }

      res.json({
        success: true,
        message: 'Oferta obtenida exitosamente',
        data: oferta
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * DELETE /api/ofertas/:id - Eliminar oferta específica
   */
  eliminarOferta = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Validar parámetro ID
      const { id } = IdParamSchema.parse(req.params);
      
      // Delegar a la capa de servicios
      const eliminada = await this.ofertaService.eliminarOferta(id);
      
      if (!eliminada) {
        res.status(404).json({
          success: false,
          message: 'Oferta no encontrada'
        });
        return;
      }

      res.json({
        success: true,
        message: 'Oferta eliminada exitosamente'
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * GET /api/ofertas/filtros/opciones - Obtener opciones dinámicas para filtros
   */
  obtenerOpcionesFiltros = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Delegar a la capa de servicios
      const opciones = await this.ofertaService.obtenerOpcionesFiltros();
      
      res.json({
        success: true,
        message: 'Opciones de filtros obtenidas exitosamente',
        data: opciones
      });
    } catch (error) {
      next(error);
    }
  };
}

