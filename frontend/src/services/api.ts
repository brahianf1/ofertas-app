/**
 * Servicio de API centralizado
 * Maneja todas las comunicaciones con el backend
 */

import axios from 'axios';
import type { AxiosInstance, AxiosResponse } from 'axios';
import type { 
  Oferta, 
  FiltrosOferta, 
  OpcionesConsulta, 
  ApiResponse, 
  OpcionesFiltros,
  PaginacionResponse 
} from '@/types/oferta';

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: 'http://localhost:3001/api',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Interceptor para requests
    this.api.interceptors.request.use(
      (config) => {
        console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`);
        return config;
      },
      (error) => {
        console.error('❌ API Request Error:', error);
        return Promise.reject(error);
      }
    );

    // Interceptor para responses
    this.api.interceptors.response.use(
      (response: AxiosResponse) => {
        console.log(`✅ API Response: ${response.status} ${response.config.url}`);
        return response;
      },
      (error) => {
        console.error('❌ API Response Error:', error.response?.data || error.message);
        return Promise.reject(error);
      }
    );
  }

  /**
   * Obtiene ofertas con filtros y paginación
   */
  async obtenerOfertas(
    filtros: FiltrosOferta = {}, 
    opciones: OpcionesConsulta = {}
  ): Promise<{ ofertas: Oferta[]; pagination: PaginacionResponse }> {
    const params = new URLSearchParams();

    // Agregar filtros
    if (filtros.categoria) params.append('categoria', filtros.categoria);
    if (filtros.empresaTienda) params.append('empresaTienda', filtros.empresaTienda);
    if (filtros.conCupon !== undefined) params.append('conCupon', String(filtros.conCupon));
    if (filtros.vigente !== undefined) params.append('vigente', String(filtros.vigente));
    if (filtros.busqueda) params.append('busqueda', filtros.busqueda);

    // Agregar opciones de consulta
    if (opciones.pagina) params.append('pagina', String(opciones.pagina));
    if (opciones.limite) params.append('limite', String(opciones.limite));
    if (opciones.ordenarPor) params.append('ordenarPor', opciones.ordenarPor);
    if (opciones.orden) params.append('orden', opciones.orden);

    const response = await this.api.get<ApiResponse<Oferta[]>>(`/ofertas?${params.toString()}`);
    
    return {
      ofertas: response.data.data,
      pagination: response.data.pagination!
    };
  }

  /**
   * Obtiene una oferta específica por ID
   */
  async obtenerOfertaPorId(id: string): Promise<Oferta> {
    const response = await this.api.get<ApiResponse<Oferta>>(`/ofertas/${id}`);
    return response.data.data;
  }

  /**
   * Crea múltiples ofertas
   */
  async crearOfertas(ofertas: any[]): Promise<Oferta[]> {
    const response = await this.api.post<ApiResponse<Oferta[]>>('/ofertas', {
      ofertasEncontradas: ofertas
    });
    return response.data.data;
  }

  /**
   * Elimina una oferta
   */
  async eliminarOferta(id: string): Promise<void> {
    await this.api.delete(`/ofertas/${id}`);
  }

  /**
   * Obtiene opciones dinámicas para filtros
   */
  async obtenerOpcionesFiltros(): Promise<OpcionesFiltros> {
    const response = await this.api.get<ApiResponse<OpcionesFiltros>>('/ofertas/filtros/opciones');
    return response.data.data;
  }

  /**
   * Health check del API
   */
  async healthCheck(): Promise<{ status: string; message: string }> {
    const response = await this.api.get('/health');
    return response.data;
  }
}

// Exportar instancia singleton
export const apiService = new ApiService();
export default apiService;
