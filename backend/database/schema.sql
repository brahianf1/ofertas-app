-- Esquema de base de datos para aplicación de ofertas en Supabase
-- Ejecutar este script en el SQL Editor de tu proyecto de Supabase

-- Habilitar extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabla principal de ofertas
CREATE TABLE IF NOT EXISTS ofertas (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    titulo_oferta TEXT NOT NULL,
    contexto_descripcion TEXT NOT NULL,
    empresa_tienda TEXT NOT NULL,
    categoria TEXT NOT NULL,
    codigo_cupon TEXT,
    es_bug BOOLEAN DEFAULT FALSE,
    fecha_hora_publicacion TIMESTAMP WITH TIME ZONE NOT NULL,
    publicado_por_usuario TEXT NOT NULL,
    fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    fecha_actualizacion TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de links
CREATE TABLE IF NOT EXISTS links (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    url_oferta TEXT,
    url_post_foro TEXT,
    oferta_id UUID NOT NULL REFERENCES ofertas(id) ON DELETE CASCADE
);

-- Tabla de imágenes
CREATE TABLE IF NOT EXISTS imagenes (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    url TEXT NOT NULL,
    oferta_id UUID NOT NULL REFERENCES ofertas(id) ON DELETE CASCADE
);

-- Tabla de vigencias de ofertas
CREATE TABLE IF NOT EXISTS vigencias_ofertas (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    fecha_inicio TIMESTAMP WITH TIME ZONE,
    fecha_fin TIMESTAMP WITH TIME ZONE,
    oferta_id UUID NOT NULL REFERENCES ofertas(id) ON DELETE CASCADE,
    UNIQUE(oferta_id)
);

-- Tabla de tips comunitarios
CREATE TABLE IF NOT EXISTS tips_comunitarios (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    tipo TEXT NOT NULL CHECK (tipo IN ('Mejora', 'Advertencia', 'Contexto')),
    descripcion TEXT NOT NULL,
    usuario TEXT NOT NULL,
    oferta_id UUID NOT NULL REFERENCES ofertas(id) ON DELETE CASCADE
);

-- Función para actualizar fecha_actualizacion automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.fecha_actualizacion = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para actualizar fecha_actualizacion en ofertas
CREATE TRIGGER update_ofertas_updated_at 
    BEFORE UPDATE ON ofertas 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Índices para mejorar performance
CREATE INDEX IF NOT EXISTS idx_ofertas_categoria ON ofertas(categoria);
CREATE INDEX IF NOT EXISTS idx_ofertas_empresa_tienda ON ofertas(empresa_tienda);
CREATE INDEX IF NOT EXISTS idx_ofertas_fecha_publicacion ON ofertas(fecha_hora_publicacion);
CREATE INDEX IF NOT EXISTS idx_ofertas_es_bug ON ofertas(es_bug);
CREATE INDEX IF NOT EXISTS idx_links_oferta_id ON links(oferta_id);
CREATE INDEX IF NOT EXISTS idx_imagenes_oferta_id ON imagenes(oferta_id);
CREATE INDEX IF NOT EXISTS idx_vigencias_oferta_id ON vigencias_ofertas(oferta_id);
CREATE INDEX IF NOT EXISTS idx_tips_oferta_id ON tips_comunitarios(oferta_id);

-- Habilitar Row Level Security (RLS) para todas las tablas
ALTER TABLE ofertas ENABLE ROW LEVEL SECURITY;
ALTER TABLE links ENABLE ROW LEVEL SECURITY;
ALTER TABLE imagenes ENABLE ROW LEVEL SECURITY;
ALTER TABLE vigencias_ofertas ENABLE ROW LEVEL SECURITY;
ALTER TABLE tips_comunitarios ENABLE ROW LEVEL SECURITY;

-- Políticas de RLS para permitir lectura pública
CREATE POLICY "Permitir lectura pública de ofertas" ON ofertas FOR SELECT USING (true);
CREATE POLICY "Permitir lectura pública de links" ON links FOR SELECT USING (true);
CREATE POLICY "Permitir lectura pública de imagenes" ON imagenes FOR SELECT USING (true);
CREATE POLICY "Permitir lectura pública de vigencias" ON vigencias_ofertas FOR SELECT USING (true);
CREATE POLICY "Permitir lectura pública de tips" ON tips_comunitarios FOR SELECT USING (true);

-- Políticas para permitir escritura con service key (autenticado)
CREATE POLICY "Permitir inserción con service key" ON ofertas FOR INSERT WITH CHECK (true);
CREATE POLICY "Permitir inserción de links con service key" ON links FOR INSERT WITH CHECK (true);
CREATE POLICY "Permitir inserción de imagenes con service key" ON imagenes FOR INSERT WITH CHECK (true);
CREATE POLICY "Permitir inserción de vigencias con service key" ON vigencias_ofertas FOR INSERT WITH CHECK (true);
CREATE POLICY "Permitir inserción de tips con service key" ON tips_comunitarios FOR INSERT WITH CHECK (true);

-- Comentarios para documentar las tablas
COMMENT ON TABLE ofertas IS 'Tabla principal que almacena las ofertas encontradas';
COMMENT ON TABLE links IS 'Enlaces asociados a cada oferta (URL de la oferta y del foro)';
COMMENT ON TABLE imagenes IS 'Imágenes adjuntas a cada oferta';
COMMENT ON TABLE vigencias_ofertas IS 'Fechas de inicio y fin de vigencia de las ofertas';
COMMENT ON TABLE tips_comunitarios IS 'Tips y comentarios de la comunidad sobre las ofertas';

-- Función para obtener estadísticas de ofertas
CREATE OR REPLACE FUNCTION get_ofertas_stats()
RETURNS TABLE(
    total_ofertas BIGINT,
    ofertas_con_cupon BIGINT,
    ofertas_bug BIGINT,
    categorias_count BIGINT,
    empresas_count BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(*) as total_ofertas,
        COUNT(*) FILTER (WHERE codigo_cupon IS NOT NULL) as ofertas_con_cupon,
        COUNT(*) FILTER (WHERE es_bug = true) as ofertas_bug,
        COUNT(DISTINCT categoria) as categorias_count,
        COUNT(DISTINCT empresa_tienda) as empresas_count
    FROM ofertas;
END;
$$ LANGUAGE plpgsql;
