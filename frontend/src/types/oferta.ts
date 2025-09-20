/**
 * Tipos TypeScript para el frontend - Ofertas
 * Mantiene consistencia con el backend y añade tipos específicos del UI
 */

export interface TipComunitario {
  tipo: 'Mejora' | 'Advertencia' | 'Contexto';
  descripcion: string;
  usuario: string;
}

export interface VigenciaOferta {
  fechaInicio: string | null;
  fechaFin: string | null;
}

export interface Links {
  urlOferta: string;
  urlPostForo: string | null;
  url_oferta?: string;
  url_post_foro?: string | null;
}

export interface Oferta {
  id: string;
  tituloOferta: string;
  contextoDescripcion: string;
  empresaTienda: string;
  categoria: string;
  codigoCupon: string | null;
  esBug: boolean;
  fechaHoraPublicacion: string;
  publicadoPorUsuario: string;
  fechaCreacion: string;
  fechaActualizacion: string;
  links: Links;
  imagenes: string[];
  vigenciaOferta: VigenciaOferta | null;
  tipsComunitarios: TipComunitario[];
}

export interface FiltrosOferta {
  categoria?: string;
  empresaTienda?: string;
  conCupon?: boolean;
  vigente?: boolean;
  busqueda?: string;
}

export interface OpcionesConsulta {
  pagina?: number;
  limite?: number;
  ordenarPor?: 'fecha_hora_publicacion' | 'fecha_creacion' | 'titulo_oferta' | 'empresa_tienda';
  orden?: 'asc' | 'desc';
}

export interface PaginacionResponse {
  total: number;
  pagina: number;
  totalPaginas: number;
  limite: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  pagination?: PaginacionResponse;
}

export interface OpcionesFiltros {
  categorias: string[];
  empresasTiendas: string[];
  tiposTips: string[];
}

// Estados del UI
export interface EstadoOferta {
  esVigente: boolean;
  diasRestantes: number | null;
  estadoTexto: string;
  estadoColor: 'success' | 'warning' | 'error' | 'secondary';
}

// Tipos para animaciones
export interface AnimacionConfig {
  duracion: number;
  delay?: number;
  tipo: 'fade' | 'slide' | 'scale' | 'stagger';
}
