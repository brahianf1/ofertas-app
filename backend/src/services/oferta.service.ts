/**
 * Capa de Servicios - Contiene toda la lógica de negocio
 * Usando el cliente nativo de Supabase siguiendo principios SOLID
 */

import { supabase } from '@/config/supabase.js';
import type { 
  OfertaResponse, 
  FiltrosOferta, 
  OpcionesConsulta,
  OfertasEncontradasInput 
} from '@/types/oferta.types.js';

export class OfertaService {
  constructor() {
    // No necesitamos constructor con Supabase client
  }

  /**
   * Crea múltiples ofertas de forma transaccional
   * Siguiendo principios de atomicidad y consistencia
   */
  async crearOfertas(input: OfertasEncontradasInput): Promise<OfertaResponse[]> {
    const resultados: OfertaResponse[] = [];

    try {
      for (const ofertaData of input.ofertas_encontradas) {
        // 1. Crear la oferta principal
        const { data: oferta, error: ofertaError } = await supabase
          .from('ofertas')
          .insert({
            titulo_oferta: ofertaData.titulo_oferta,
            contexto_descripcion: ofertaData.contexto_y_descripcion,
            empresa_tienda: ofertaData.empresa_tienda,
            categoria: ofertaData.categoria,
            codigo_cupon: ofertaData.codigo_cupon,
            es_bug: ofertaData.esBug || false,
            fecha_hora_publicacion: ofertaData.fecha_hora_publicacion,
            publicado_por_usuario: ofertaData.publicado_por_usuario,
          })
          .select()
          .single();

        if (ofertaError) {
          throw new Error(`Error al crear oferta: ${ofertaError.message}`);
        }

        const ofertaId = oferta.id;

        // 2. Crear links
        const { error: linksError } = await supabase
          .from('links')
          .insert({
            url_oferta: ofertaData.links.url_oferta,
            url_post_foro: ofertaData.links.url_post_foro,
            oferta_id: ofertaId
          });

        if (linksError) {
          throw new Error(`Error al crear links: ${linksError.message}`);
        }

        // 3. Crear imágenes
        if (ofertaData.imagenes_adjuntas.length > 0) {
          const imagenesData = ofertaData.imagenes_adjuntas.map(url => ({
            url,
            oferta_id: ofertaId
          }));

          const { error: imagenesError } = await supabase
            .from('imagenes')
            .insert(imagenesData);

          if (imagenesError) {
            throw new Error(`Error al crear imágenes: ${imagenesError.message}`);
          }
        }

        // 4. Crear vigencia si existe
        if (ofertaData.vigencia_oferta.fecha_inicio || ofertaData.vigencia_oferta.fecha_fin) {
          const { error: vigenciaError } = await supabase
            .from('vigencias_ofertas')
            .insert({
              fecha_inicio: ofertaData.vigencia_oferta.fecha_inicio,
              fecha_fin: ofertaData.vigencia_oferta.fecha_fin,
              oferta_id: ofertaId
            });

          if (vigenciaError) {
            throw new Error(`Error al crear vigencia: ${vigenciaError.message}`);
          }
        }

        // 5. Crear tips comunitarios
        if (ofertaData.tips_de_la_comunidad.length > 0) {
          const tipsData = ofertaData.tips_de_la_comunidad.map(tip => ({
            tipo: tip.tipo,
            descripcion: tip.descripcion,
            usuario: tip.usuario,
            oferta_id: ofertaId
          }));

          const { error: tipsError } = await supabase
            .from('tips_comunitarios')
            .insert(tipsData);

          if (tipsError) {
            throw new Error(`Error al crear tips: ${tipsError.message}`);
          }
        }

        // 6. Obtener la oferta completa para la respuesta
        const ofertaCompleta = await this.obtenerOfertaPorId(ofertaId);
        if (ofertaCompleta) {
          resultados.push(ofertaCompleta);
        }
      }

      return resultados;
    } catch (error) {
      throw new Error(`Error en transacción de ofertas: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }

  /**
   * Obtiene ofertas con filtros y paginación
   * Implementa búsqueda flexible y ordenamiento
   */
  async obtenerOfertas(
    filtros: FiltrosOferta = {}, 
    opciones: OpcionesConsulta = {}
  ): Promise<{ ofertas: OfertaResponse[], total: number, pagina: number, totalPaginas: number }> {
    const {
      pagina = 1,
      limite = 20,
      ordenarPor = 'fecha_hora_publicacion',
      orden = 'desc'
    } = opciones;

    const desde = (pagina - 1) * limite;
    const hasta = desde + limite - 1;

    // Construir query base
    let query = supabase
      .from('ofertas')
      .select(`
        *,
        links(*),
        imagenes(*),
        vigencias_ofertas(*),
        tips_comunitarios(*)
      `);

    // Aplicar filtros
    query = this.aplicarFiltros(query, filtros);

    // Aplicar ordenamiento y paginación
    query = query
      .order(ordenarPor, { ascending: orden === 'asc' })
      .range(desde, hasta);

    const { data: ofertas, error } = await query;

    if (error) {
      throw new Error(`Error al obtener ofertas: ${error.message}`);
    }

    // Obtener conteo total
    let countQuery = supabase
      .from('ofertas')
      .select('*', { count: 'exact', head: true });
    
    countQuery = this.aplicarFiltros(countQuery, filtros);
    const { count: total } = await countQuery;

    const totalPaginas = Math.ceil((total || 0) / limite);

    return {
      ofertas: (ofertas || []).map(this.transformarOfertaResponse),
      total: total || 0,
      pagina,
      totalPaginas
    };
  }

  /**
   * Obtiene una oferta específica por ID
   */
  async obtenerOfertaPorId(id: string): Promise<OfertaResponse | null> {
    const { data: oferta, error } = await supabase
      .from('ofertas')
      .select(`
        *,
        links(*),
        imagenes(*),
        vigencias_ofertas(*),
        tips_comunitarios(*)
      `)
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null; // No encontrado
      }
      throw new Error(`Error al obtener oferta: ${error.message}`);
    }

    return this.transformarOfertaResponse(oferta);
  }

  /**
   * Elimina una oferta específica
   */
  async eliminarOferta(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('ofertas')
      .delete()
      .eq('id', id);

    return !error;
  }

  /**
   * Obtiene opciones dinámicas para filtros
   * Permite UI dinámica basada en datos reales
   */
  async obtenerOpcionesFiltros(): Promise<{
    categorias: string[],
    empresasTiendas: string[],
    tiposTips: string[]
  }> {
    try {
      const [categoriasRes, empresasRes, tiposRes] = await Promise.all([
        supabase.from('ofertas').select('categoria').order('categoria'),
        supabase.from('ofertas').select('empresa_tienda').order('empresa_tienda'),
        supabase.from('tips_comunitarios').select('tipo').order('tipo')
      ]);

      const categorias = [...new Set(categoriasRes.data?.map(c => c.categoria) || [])];
      const empresasTiendas = [...new Set(empresasRes.data?.map(e => e.empresa_tienda) || [])];
      const tiposTips = [...new Set(tiposRes.data?.map(t => t.tipo) || [])];

      return {
        categorias: categorias.sort(),
        empresasTiendas: empresasTiendas.sort(),
        tiposTips: tiposTips.sort()
      };
    } catch (error) {
      throw new Error(`Error al obtener opciones de filtros: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }

  /**
   * Aplica filtros dinámicos a la query de Supabase
   */
  private aplicarFiltros(query: any, filtros: FiltrosOferta) {
    if (filtros.categoria) {
      query = query.eq('categoria', filtros.categoria);
    }

    if (filtros.empresaTienda) {
      query = query.eq('empresa_tienda', filtros.empresaTienda);
    }

    if (filtros.conCupon !== undefined) {
      if (filtros.conCupon) {
        query = query.not('codigo_cupon', 'is', null);
      } else {
        query = query.is('codigo_cupon', null);
      }
    }

    if (filtros.vigente) {
      const ahora = new Date().toISOString();
      query = query.or(`vigencias_ofertas.fecha_fin.is.null,vigencias_ofertas.fecha_fin.gte.${ahora}`);
    }

    if (filtros.busqueda) {
      const busqueda = filtros.busqueda;
      query = query.or(`titulo_oferta.ilike.%${busqueda}%,contexto_descripcion.ilike.%${busqueda}%,empresa_tienda.ilike.%${busqueda}%,publicado_por_usuario.ilike.%${busqueda}%`);
    }

    return query;
  }

  /**
   * Transforma el resultado de Supabase al formato de respuesta
   * Mantiene separación entre modelo de datos y API
   */
  private transformarOfertaResponse(oferta: any): OfertaResponse {
    return {
      id: oferta.id,
      tituloOferta: oferta.titulo_oferta,
      contextoDescripcion: oferta.contexto_descripcion,
      empresaTienda: oferta.empresa_tienda,
      categoria: oferta.categoria,
      codigoCupon: oferta.codigo_cupon,
      esBug: oferta.es_bug,
      fechaHoraPublicacion: oferta.fecha_hora_publicacion,
      publicadoPorUsuario: oferta.publicado_por_usuario,
      fechaCreacion: oferta.fecha_creacion,
      fechaActualizacion: oferta.fecha_actualizacion,
      links: {
        url_oferta: oferta.links[0]?.url_oferta || null,
        url_post_foro: oferta.links[0]?.url_post_foro || null
      },
      imagenes: oferta.imagenes?.map((img: any) => img.url) || [],
      vigenciaOferta: oferta.vigencias_ofertas?.[0] ? {
        fecha_inicio: oferta.vigencias_ofertas[0].fecha_inicio,
        fecha_fin: oferta.vigencias_ofertas[0].fecha_fin
      } : null,
      tipsComunitarios: oferta.tips_comunitarios?.map((tip: any) => ({
        tipo: tip.tipo,
        descripcion: tip.descripcion,
        usuario: tip.usuario
      })) || []
    };
  }
}