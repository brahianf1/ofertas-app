/**
 * Componente OfertaDetailView - Vista detallada de una oferta
 * Diseño siguiendo Material Design y mejores prácticas de UI/UX
 */

import React from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  ExternalLink, 
  Copy, 
  Calendar, 
  User, 
  Store, 
  Tag,
  MessageCircle,
  Image as ImageIcon,
  Bug,
  Zap,
  Clock,
  Share2,
  Bookmark
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, Button, Badge } from '@/components/ui';
import { useOfertaStatus } from '@/hooks/useOfertaStatus';
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard';
import { formatearFechaRelativa, formatearFecha } from '@/utils/date';
import { cn } from '@/utils/cn';
import type { Oferta } from '@/types/oferta';

interface OfertaDetailViewProps {
  oferta: Oferta;
  onBack: () => void;
}

const OfertaDetailView: React.FC<OfertaDetailViewProps> = ({ oferta, onBack }) => {
  const estadoOferta = useOfertaStatus(oferta.vigenciaOferta);
  const { copy, isCopied } = useCopyToClipboard();

  const handleCopyCode = async () => {
    if (oferta.codigoCupon) {
      await copy(oferta.codigoCupon);
    }
  };

  const handleOpenExternalLink = () => {
    const url = oferta.links.urlOferta || oferta.links.url_oferta;
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  const handleOpenForumPost = () => {
    const url = oferta.links.urlPostForo || oferta.links.url_post_foro;
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  const getTipColor = (tipo: string) => {
    switch (tipo) {
      case 'Mejora': return 'success';
      case 'Advertencia': return 'warning';
      case 'Contexto': return 'primary';
      default: return 'secondary';
    }
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const target = e.target as HTMLImageElement;
    const placeholder = target.nextElementSibling as HTMLElement;
    target.style.display = 'none';
    if (placeholder) {
      placeholder.classList.remove('hidden');
    }
  };

  return (
    <motion.div
      className="min-h-screen bg-secondary-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header con navegación */}
      <div className="sticky top-0 z-10 bg-white border-b border-secondary-200 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              leftIcon={<ArrowLeft className="w-4 h-4" />}
              className="flex-shrink-0"
            >
              Volver
            </Button>
            <div className="flex-1 min-w-0">
              <h1 className="text-lg font-semibold text-secondary-900 truncate">
                Detalle de la oferta
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm">
                <Share2 className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Bookmark className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Columna principal - Contenido */}
          <div className="lg:col-span-2 space-y-6">
            {/* Hero Section */}
            <Card className="overflow-hidden">
              {/* Imagen principal */}
              <div className="relative">
                {oferta.imagenes.length > 0 ? (
                  <div className="relative h-64 md:h-80">
                    <img
                      src={oferta.imagenes[0]}
                      alt={oferta.tituloOferta}
                      className="w-full h-full object-cover"
                      onError={handleImageError}
                    />
                    <div className="hidden absolute inset-0 bg-secondary-100 flex items-center justify-center">
                      <ImageIcon className="w-16 h-16 text-secondary-400" />
                    </div>
                  </div>
                ) : (
                  <div className="h-64 md:h-80 bg-secondary-100 flex items-center justify-center">
                    <ImageIcon className="w-16 h-16 text-secondary-400" />
                  </div>
                )}
                
                {/* Overlay con badges */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent">
                  <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                    <Badge 
                      variant={estadoOferta.estadoColor as any}
                      className="bg-white/95 backdrop-blur-sm shadow-sm border-0"
                    >
                      {estadoOferta.estadoTexto}
                    </Badge>
                    {oferta.esBug && (
                      <Badge 
                        variant="bug"
                        className="bg-white/95 backdrop-blur-sm shadow-sm border-0 font-medium inline-flex items-center"
                      >
                        <Bug className="w-3 h-3 mr-1 flex-shrink-0" />
                        <span className="whitespace-nowrap">Oferta Bug</span>
                      </Badge>
                    )}
                  </div>
                  <div className="absolute top-4 right-4">
                    <Badge 
                      variant="outline" 
                      className="bg-white/95 backdrop-blur-sm shadow-sm border-white/20"
                    >
                      {oferta.categoria}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Contenido del hero */}
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div>
                    <h1 className={cn(
                      "text-2xl md:text-3xl font-bold leading-tight",
                      "text-secondary-900",
                      oferta.esBug && "text-purple-800"
                    )}>
                      {oferta.esBug && <Zap className="inline w-6 h-6 mr-2 text-purple-600" />}
                      {oferta.tituloOferta}
                    </h1>
                  </div>

                  <div className="prose prose-sm max-w-none">
                    <p className="text-secondary-700 leading-relaxed text-base">
                      {oferta.contextoDescripcion}
                    </p>
                  </div>

                  {/* Metadatos principales */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-secondary-200">
                    <div className="flex items-center gap-3">
                      <Store className="w-5 h-5 text-secondary-500 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-secondary-500">Tienda</p>
                        <p className="font-medium text-secondary-900">{oferta.empresaTienda}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <User className="w-5 h-5 text-secondary-500 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-secondary-500">Publicado por</p>
                        <p className="font-medium text-secondary-900">{oferta.publicadoPorUsuario}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-secondary-500 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-secondary-500">Fecha de publicación</p>
                        <p className="font-medium text-secondary-900">{formatearFecha(oferta.fechaHoraPublicacion)}</p>
                        <p className="text-xs text-secondary-500">{formatearFechaRelativa(oferta.fechaHoraPublicacion)}</p>
                      </div>
                    </div>
                    {oferta.vigenciaOferta?.fechaFin && (
                      <div className="flex items-center gap-3">
                        <Clock className="w-5 h-5 text-secondary-500 flex-shrink-0" />
                        <div>
                          <p className="text-sm text-secondary-500">Vigencia hasta</p>
                          <p className="font-medium text-secondary-900">{formatearFecha(oferta.vigenciaOferta.fechaFin)}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tips de la comunidad */}
            {oferta.tipsComunitarios.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageCircle className="w-5 h-5" />
                    Tips de la Comunidad ({oferta.tipsComunitarios.length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {oferta.tipsComunitarios.map((tip, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="flex items-start gap-3 p-4 bg-secondary-50 rounded-lg"
                    >
                      <Badge variant={getTipColor(tip.tipo) as any} size="sm">
                        {tip.tipo}
                      </Badge>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-secondary-700 leading-relaxed">
                          {tip.descripcion}
                        </p>
                        <p className="text-xs text-secondary-500 mt-2">
                          — {tip.usuario}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Imágenes adicionales */}
            {oferta.imagenes.length > 1 && (
              <Card>
                <CardHeader>
                  <CardTitle>Imágenes Adicionales</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {oferta.imagenes.slice(1).map((imagen, idx) => (
                      <div key={idx} className="aspect-square rounded-lg overflow-hidden bg-secondary-100">
                        <img
                          src={imagen}
                          alt={`${oferta.tituloOferta} - Imagen ${idx + 2}`}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar - Acciones */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-4">
              {/* Cupón */}
              {oferta.codigoCupon && (
                <Card>
                  <CardContent className="p-4">
                    <div className="text-center space-y-3">
                      <div className="flex items-center justify-center gap-2 text-sm font-medium text-secondary-700">
                        <Tag className="w-4 h-4" />
                        Código de Cupón
                      </div>
                      <Button
                        variant="outline"
                        fullWidth
                        rightIcon={<Copy className={cn("w-4 h-4 transition-colors", isCopied && "text-success-600")} />}
                        onClick={handleCopyCode}
                        className={cn(
                          "font-mono text-lg py-3 border-dashed",
                          isCopied && "border-success-300 bg-success-50 text-success-700"
                        )}
                      >
                        {isCopied ? '¡Copiado!' : oferta.codigoCupon}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Acciones principales */}
              <Card>
                <CardContent className="p-4 space-y-3">
                  <Button
                    variant="primary"
                    fullWidth
                    size="lg"
                    rightIcon={<ExternalLink className="w-5 h-5" />}
                    onClick={handleOpenExternalLink}
                    className={cn(
                      "font-medium",
                      oferta.esBug && "bg-purple-600 hover:bg-purple-700"
                    )}
                  >
                    {oferta.esBug ? 'Ir a la Oferta Bug' : 'Ir a la Oferta'}
                  </Button>

                  {oferta.links.urlPostForo && (
                    <Button
                      variant="outline"
                      fullWidth
                      rightIcon={<ExternalLink className="w-4 h-4" />}
                      onClick={handleOpenForumPost}
                    >
                      Ver en el Foro
                    </Button>
                  )}
                </CardContent>
              </Card>

              {/* Información adicional */}
              <Card>
                <CardContent className="p-4">
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-secondary-500">ID de la oferta</span>
                      <span className="font-mono text-xs">{oferta.id.slice(0, 8)}...</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-secondary-500">Última actualización</span>
                      <span>{formatearFechaRelativa(oferta.fechaActualizacion)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-secondary-500">Tips disponibles</span>
                      <span>{oferta.tipsComunitarios.length}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default OfertaDetailView;
