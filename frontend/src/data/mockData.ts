/**
 * Datos de demostración para mostrar cuando el backend no esté disponible
 * Permite probar la UI sin necesidad de servidor
 */

import type { Oferta, OpcionesFiltros } from '@/types/oferta';

export const mockOfertas: Oferta[] = [
  {
    id: "mock-1",
    tituloOferta: "Placa de Video RTX 4070 Super 12GB con 15% OFF",
    contextoDescripcion: "El usuario 'MasterRace' compartió el link de la tienda 'HardGamerz', mencionando que es el mejor precio que ha visto para este modelo.",
    empresaTienda: "HardGamerz",
    categoria: "Oferta",
    codigoCupon: "VERANO2025",
    esBug: false,
    fechaHoraPublicacion: "2025-09-18T21:30:00.000Z",
    publicadoPorUsuario: "MasterRace",
    fechaCreacion: "2025-09-18T21:30:00.000Z",
    fechaActualizacion: "2025-09-18T21:30:00.000Z",
    links: {
      urlOferta: "https://hardgamerz.com/producto/rtx-4070-super",
      urlPostForo: "https://www.3dgames.com.ar/foro/threads/12345/page1#post-54321"
    },
    imagenes: ["https://images.unsplash.com/photo-1591488320449-011701bb6704?w=400&h=300&fit=crop"],
    vigenciaOferta: {
      fechaInicio: "2025-09-18T00:00:00.000Z",
      fechaFin: "2025-09-25T23:59:59.000Z"
    },
    tipsComunitarios: [
      { 
        tipo: "Mejora", 
        descripcion: "Si pagan con transferencia bancaria directa, les hacen un 5% de descuento adicional sobre el precio de oferta.", 
        usuario: "AhorradorPRO" 
      },
      { 
        tipo: "Advertencia", 
        descripcion: "Ojo que el envío de esta tienda puede tardar más de 10 días, no es para ansiosos.", 
        usuario: "Comprador_Ansioso" 
      },
      { 
        tipo: "Contexto", 
        descripcion: "Es el modelo con 2 ventiladores, no el de 3. Tenganlo en cuenta para el flujo de aire de su gabinete.", 
        usuario: "TecnoReviewer" 
      }
    ]
  },
  {
    id: "mock-2",
    tituloOferta: "Monitor Gaming 27\" 144Hz - Error de precio ¡APROVECHA!",
    contextoDescripcion: "¡ERROR DE PRECIO! Monitor gaming premium listado por error a precio de monitor básico. Los usuarios reportan que es un bug del sistema de CompuMundo.",
    empresaTienda: "CompuMundo",
    categoria: "Bug Deal",
    codigoCupon: "GAMING25",
    esBug: true,
    fechaHoraPublicacion: "2025-09-19T14:20:00.000Z",
    publicadoPorUsuario: "BugHunter",
    fechaCreacion: "2025-09-19T14:20:00.000Z",
    fechaActualizacion: "2025-09-19T14:20:00.000Z",
    links: {
      urlOferta: "https://compumundo.com/monitor-gaming-27",
      urlPostForo: "https://www.3dgames.com.ar/foro/threads/67890/page1#post-12345"
    },
    imagenes: ["https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&h=300&fit=crop"],
    vigenciaOferta: {
      fechaInicio: "2025-09-19T00:00:00.000Z",
      fechaFin: "2025-09-22T23:59:59.000Z"
    },
    tipsComunitarios: [
      { 
        tipo: "Advertencia", 
        descripcion: "¡RÁPIDO! Ya varios usuarios confirmaron que les cancelaron el pedido. Parece que están corrigiendo el error.", 
        usuario: "SpeedBuyer" 
      },
      { 
        tipo: "Mejora", 
        descripcion: "Usen la app móvil, parece que el bug solo funciona ahí. En la web ya lo corrigieron.", 
        usuario: "MobileBugHunter" 
      },
      { 
        tipo: "Contexto", 
        descripcion: "Confirmado por 15+ usuarios. Es el modelo 2024 con todas las características premium.", 
        usuario: "BugVerifier" 
      }
    ]
  },
  {
    id: "mock-3",
    tituloOferta: "Auriculares Inalámbricos Premium - Stock Limitado",
    contextoDescripcion: "Auriculares de alta gama con cancelación de ruido, encontrados en una liquidación especial.",
    empresaTienda: "TechStore",
    categoria: "Liquidación",
    codigoCupon: null,
    esBug: false,
    fechaHoraPublicacion: "2025-09-17T16:45:00.000Z",
    publicadoPorUsuario: "AudioFan",
    fechaCreacion: "2025-09-17T16:45:00.000Z",
    fechaActualizacion: "2025-09-17T16:45:00.000Z",
    links: {
      urlOferta: "https://techstore.com/auriculares-premium",
      urlPostForo: null
    },
    imagenes: ["https://images.unsplash.com/photo-1484704849700-f032a568e944?w=400&h=300&fit=crop"],
    vigenciaOferta: {
      fechaInicio: "2025-09-17T00:00:00.000Z",
      fechaFin: "2025-09-20T23:59:59.000Z"
    },
    tipsComunitarios: [
      { 
        tipo: "Advertencia", 
        descripcion: "Solo quedan pocas unidades, hay que apurarse.", 
        usuario: "FastBuyer" 
      }
    ]
  },
  {
    id: "mock-4",
    tituloOferta: "PlayStation 5 a precio de PS4 - BUG CONFIRMADO",
    contextoDescripcion: "¡CONFIRMADO! Error masivo en el sistema de MercadoLibre. PS5 listadas al precio de PS4. Múltiples usuarios confirmaron compras exitosas.",
    empresaTienda: "Mercado Libre",
    categoria: "Bug Deal",
    codigoCupon: null,
    esBug: true,
    fechaHoraPublicacion: "2025-09-19T09:15:10.000Z",
    publicadoPorUsuario: "DealMaster",
    fechaCreacion: "2025-09-19T09:15:10.000Z",
    fechaActualizacion: "2025-09-19T09:15:10.000Z",
    links: {
      urlOferta: "https://mercadolibre.com/cyberpunk-ps5-123",
      urlPostForo: "https://www.3dgames.com.ar/foro/threads/12345/page2#post-54388"
    },
    imagenes: ["https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400&h=300&fit=crop"],
    vigenciaOferta: null,
    tipsComunitarios: [
      { 
        tipo: "Advertencia", 
        descripcion: "¡URGENTE! MercadoLibre se dio cuenta del error. Solo quedan algunas publicaciones activas. ¡CORRAN!", 
        usuario: "LastMinuteBuyer" 
      },
      { 
        tipo: "Mejora", 
        descripcion: "Busquen vendedores con más de 1000 ventas y buena reputación. Esos suelen respetar más las compras.", 
        usuario: "SmartShopper" 
      },
      { 
        tipo: "Contexto", 
        descripcion: "Ya confirmé la compra de 2 consolas. Pagué con tarjeta de crédito para tener más protección.", 
        usuario: "ConfirmedBuyer" 
      }
    ]
  }
];

export const mockOpcionesFiltros: OpcionesFiltros = {
  categorias: ["Oferta", "Oportunidad", "Liquidación", "Bug Deal"],
  empresasTiendas: ["HardGamerz", "CompuMundo", "TechStore", "Mercado Libre"],
  tiposTips: ["Mejora", "Advertencia", "Contexto"]
};
