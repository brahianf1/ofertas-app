-- Datos de ejemplo para la aplicación de ofertas
-- Ejecutar después de crear el schema

-- Insertar ofertas de ejemplo
INSERT INTO ofertas (titulo_oferta, contexto_descripcion, empresa_tienda, categoria, codigo_cupon, es_bug, fecha_hora_publicacion, publicado_por_usuario) VALUES 
(
    '15% de Reintegro con MODO Contactless (NFC) y VISA',
    'Promoción de bonificación del 15% de reintegro sobre el monto total bruto del pago realizado en Comercios Adheridos mediante MODO Contactless (NFC), con un tope de reintegro de hasta $6.500 por usuario por promoción.',
    'MODO',
    'Promoción',
    NULL,
    FALSE,
    '2025-09-19T18:12:00+00:00',
    'mhmr'
),
(
    '25% de Reintegro con MODO en Supermercados (Vea)',
    'Consulta sobre una promoción de MODO que ofrece un 25% de reintegro en supermercados (especialmente Vea), y si esta bonificación es aplicable también a tarjetas adicionales, a diferencia de otras promociones como las del Banco Galicia.',
    'MODO',
    'Promoción',
    NULL,
    FALSE,
    '2025-09-19T18:28:00+00:00',
    'Raulo.'
),
(
    'Smart TV Samsung 50'' Crystal UHD 4K (474k con cupón MLEXCLUSIVO en Mercado Libre)',
    'Compra de un Smart TV Samsung 50'' Crystal UHD 4K UN50DU7000 en Mercado Libre. El precio final fue de 474.000 aplicando el cupón MLEXCLUSIVO, que descontó 5.000. Se pagó en 1 cuota, con la expectativa de que el valor en dólares al momento del pago (10 de octubre) sea favorable, situándolo por debajo de los 300 USD. Considerado un buen deal por el usuario.',
    'Mercado Libre',
    'Oferta',
    'MLEXCLUSIVO',
    FALSE,
    '2025-09-19T21:20:00+00:00',
    'Adanapme'
),
(
    '18 Cuotas Sin Interés en Diggit (Posible Bug)',
    'Se reporta una situación inusual en Diggit donde, al simular compras con cualquier tarjeta, se ofrecía la opción de pagar en 18 cuotas sin interés. El usuario plantea la duda de si se trata de un bug o una promoción.',
    'Diggit',
    'Promoción',
    NULL,
    TRUE,
    '2025-09-20T00:36:00+00:00',
    'Armando-Barreda'
);

-- Obtener los IDs de las ofertas insertadas para crear las relaciones
DO $$
DECLARE
    oferta_modo_1 UUID;
    oferta_modo_2 UUID;
    oferta_samsung UUID;
    oferta_diggit UUID;
BEGIN
    -- Obtener IDs de las ofertas
    SELECT id INTO oferta_modo_1 FROM ofertas WHERE titulo_oferta = '15% de Reintegro con MODO Contactless (NFC) y VISA';
    SELECT id INTO oferta_modo_2 FROM ofertas WHERE titulo_oferta = '25% de Reintegro con MODO en Supermercados (Vea)';
    SELECT id INTO oferta_samsung FROM ofertas WHERE titulo_oferta LIKE 'Smart TV Samsung 50%';
    SELECT id INTO oferta_diggit FROM ofertas WHERE titulo_oferta = '18 Cuotas Sin Interés en Diggit (Posible Bug)';

    -- Insertar links
    INSERT INTO links (url_oferta, url_post_foro, oferta_id) VALUES 
    (NULL, 'https://foros.3dgames.com.ar/threads/942062-ofertas-online-argentina?p=25758759&viewfull=1#post25758759', oferta_modo_1),
    ('https://www.modo.com.ar/promosisupersmodo-julio25', 'https://foros.3dgames.com.ar/threads/942062-ofertas-online-argentina?p=25758762&viewfull=1#post25758762', oferta_modo_2),
    ('https://www.mercadolibre.com.ar/smart-tv-samsung-50-crystal-uhd-4k-un50du7000/p/MLA46526613', 'https://foros.3dgames.com.ar/threads/942062-ofertas-online-argentina?p=25758855&viewfull=1#post25758855', oferta_samsung),
    (NULL, 'https://foros.3dgames.com.ar/threads/942062-ofertas-online-argentina?p=25758943&viewfull=1#post25758943', oferta_diggit);

    -- Insertar imágenes
    INSERT INTO imagenes (url, oferta_id) VALUES 
    ('https://i.ibb.co/qLJ2Z2y2/MODO.jpg', oferta_modo_1),
    ('https://i.imgur.com/Kix5UQD.png', oferta_modo_1),
    ('https://i.imgur.com/mb5bHGQ.png', oferta_modo_2),
    ('https://i.ibb.co/chmxkp2P/smarting.jpg', oferta_samsung);

    -- Insertar tips comunitarios
    INSERT INTO tips_comunitarios (tipo, descripcion, usuario, oferta_id) VALUES 
    ('Contexto', 'Para hacer uso de la promoción, es necesario habilitar la funcionalidad contactless de MODO. La oferta es válida para pagos realizados con tarjetas VISA.', 'elpibevdp', oferta_modo_1),
    ('Contexto', 'La promoción del 25% de MODO en supermercados (Vea) sí aplica para tarjetas adicionales, confirmado por experiencia personal de haberla utilizado con dos tarjetas adicionales.', 'Quesitu', oferta_modo_2);

    -- Insertar vigencias (solo para ofertas que las tengan)
    -- En este caso, las ofertas de ejemplo no tienen fechas específicas, pero podríamos agregar algunas de ejemplo
    
END $$;

-- Verificar que los datos se insertaron correctamente
SELECT 
    o.titulo_oferta,
    o.empresa_tienda,
    o.categoria,
    o.es_bug,
    COUNT(l.id) as links_count,
    COUNT(i.id) as imagenes_count,
    COUNT(t.id) as tips_count
FROM ofertas o
LEFT JOIN links l ON o.id = l.oferta_id
LEFT JOIN imagenes i ON o.id = i.oferta_id
LEFT JOIN tips_comunitarios t ON o.id = t.oferta_id
GROUP BY o.id, o.titulo_oferta, o.empresa_tienda, o.categoria, o.es_bug
ORDER BY o.fecha_hora_publicacion;
