/**
 * Tipos TypeScript para el dominio de ofertas
 * Mantiene consistencia entre la base de datos y la lógica de negocio
 */

export interface TipComunitario {
  tipo: 'Mejora' | 'Advertencia' | 'Contexto';
  descripcion: string;
  usuario: string;
}

export interface VigenciaOferta {
  fecha_inicio: string | null;
  fecha_fin: string | null;
}

export interface Links {
  url_oferta: string | null;
  url_post_foro: string | null;
}

export interface OfertaInput {
  titulo_oferta: string;
  contexto_y_descripcion: string;
  empresa_tienda: string;
  categoria: string;
  codigo_cupon: string | null;
  esBug: boolean;
  links: Links;
  imagenes_adjuntas: string[];
  fecha_hora_publicacion: string;
  publicado_por_usuario: string;
  vigencia_oferta: VigenciaOferta;
  tips_de_la_comunidad: TipComunitario[];
}

export interface OfertaResponse {
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

export interface OfertasEncontradasInput {
  ofertas_encontradas: OfertaInput[];
}

export interface FiltrosOferta {
  categoria?: string | undefined;
  empresaTienda?: string | undefined;
  conCupon?: boolean | undefined;
  vigente?: boolean | undefined;
  busqueda?: string | undefined;
}

export interface OpcionesConsulta {
  pagina?: number | undefined;
  limite?: number | undefined;
  ordenarPor?: 'fecha_hora_publicacion' | 'fecha_creacion' | undefined;
  orden?: 'asc' | 'desc' | undefined;
}

