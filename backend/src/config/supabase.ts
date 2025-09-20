/**
 * Configuración del cliente de Supabase
 * Siguiendo las mejores prácticas de la documentación oficial
 */

// Cargar variables de entorno ANTES de cualquier otra importación
import dotenv from 'dotenv';
dotenv.config({ path: '.env' });

import { createClient } from '@supabase/supabase-js';

// Validar que las variables de entorno estén configuradas
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error(
    'Las variables de entorno SUPABASE_URL y SUPABASE_SERVICE_KEY son requeridas'
  );
}


// Crear cliente de Supabase básico sin configuraciones extras
export const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Tipos para las tablas de la base de datos
export interface Database {
  public: {
    Tables: {
      ofertas: {
        Row: {
          id: string;
          titulo_oferta: string;
          contexto_descripcion: string;
          empresa_tienda: string;
          categoria: string;
          codigo_cupon: string | null;
          es_bug: boolean;
          fecha_hora_publicacion: string;
          publicado_por_usuario: string;
          fecha_creacion: string;
          fecha_actualizacion: string;
        };
        Insert: {
          id?: string;
          titulo_oferta: string;
          contexto_descripcion: string;
          empresa_tienda: string;
          categoria: string;
          codigo_cupon?: string | null;
          es_bug?: boolean;
          fecha_hora_publicacion: string;
          publicado_por_usuario: string;
          fecha_creacion?: string;
          fecha_actualizacion?: string;
        };
        Update: {
          id?: string;
          titulo_oferta?: string;
          contexto_descripcion?: string;
          empresa_tienda?: string;
          categoria?: string;
          codigo_cupon?: string | null;
          es_bug?: boolean;
          fecha_hora_publicacion?: string;
          publicado_por_usuario?: string;
          fecha_creacion?: string;
          fecha_actualizacion?: string;
        };
      };
      links: {
        Row: {
          id: string;
          url_oferta: string | null;
          url_post_foro: string | null;
          oferta_id: string;
        };
        Insert: {
          id?: string;
          url_oferta?: string | null;
          url_post_foro?: string | null;
          oferta_id: string;
        };
        Update: {
          id?: string;
          url_oferta?: string | null;
          url_post_foro?: string | null;
          oferta_id?: string;
        };
      };
      imagenes: {
        Row: {
          id: string;
          url: string;
          oferta_id: string;
        };
        Insert: {
          id?: string;
          url: string;
          oferta_id: string;
        };
        Update: {
          id?: string;
          url?: string;
          oferta_id?: string;
        };
      };
      vigencias_ofertas: {
        Row: {
          id: string;
          fecha_inicio: string | null;
          fecha_fin: string | null;
          oferta_id: string;
        };
        Insert: {
          id?: string;
          fecha_inicio?: string | null;
          fecha_fin?: string | null;
          oferta_id: string;
        };
        Update: {
          id?: string;
          fecha_inicio?: string | null;
          fecha_fin?: string | null;
          oferta_id?: string;
        };
      };
      tips_comunitarios: {
        Row: {
          id: string;
          tipo: string;
          descripcion: string;
          usuario: string;
          oferta_id: string;
        };
        Insert: {
          id?: string;
          tipo: string;
          descripcion: string;
          usuario: string;
          oferta_id: string;
        };
        Update: {
          id?: string;
          tipo?: string;
          descripcion?: string;
          usuario?: string;
          oferta_id?: string;
        };
      };
    };
  };
}
