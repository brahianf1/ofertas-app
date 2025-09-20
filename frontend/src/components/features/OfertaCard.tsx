/**
 * Componente OfertaCard - Organismo
 * Tarjeta principal para mostrar una oferta con todas sus funcionalidades
 */

import React from 'react';
import { 
  ExternalLink, 
  Copy, 
  Calendar, 
  User, 
  Store, 
  Tag,
  MessageCircle,
  Image as ImageIcon,
  Bug,
  Zap
} from 'lucide-react';
import { Card, Button, Badge } from '@/components/ui';
import { useOfertaStatus } from '@/hooks/useOfertaStatus';
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard';
import { formatearFechaRelativa } from '@/utils/date';
import { cn } from '@/utils/cn';
import type { Oferta } from '@/types/oferta';

interface OfertaCardProps {
  oferta: Oferta;
  index?: number;
  onViewDetail?: (oferta: Oferta) => void;
}

const OfertaCard: React.FC<OfertaCardProps> = ({ oferta, onViewDetail }) => {
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

  const handleViewDetail = () => {
    if (onViewDetail) {
      onViewDetail(oferta);
    }
  };

  const handleCardClick = (e: React.MouseEvent) => {
    // Solo abrir detalle si no se clickeó en un botón
    if ((e.target as HTMLElement).closest('button')) {
      return;
    }
    handleViewDetail();
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
    <Card 
      variant="elevated" 
      className={cn(
        "h-full flex flex-col overflow-hidden transition-shadow duration-200 cursor-pointer",
        "hover:shadow-lg border border-secondary-200",
        oferta.esBug && "bg-purple-50/20"
      )}
      onClick={handleCardClick}
    >
      {/* Header con imagen y badges */}
      <div className="relative">
        {oferta.imagenes.length > 0 ? (
          <div className="relative h-48 overflow-hidden">
            <img
              src={oferta.imagenes[0]}
              alt={oferta.tituloOferta}
              className="w-full h-full object-cover"
              onError={handleImageError}
            />
            <div className="hidden absolute inset-0 bg-secondary-100 flex items-center justify-center">
              <ImageIcon className="w-12 h-12 text-secondary-400" />
            </div>
          </div>
        ) : (
          <div className="h-48 bg-secondary-100 flex items-center justify-center">
            <ImageIcon className="w-12 h-12 text-secondary-400" />
          </div>
        )}
        
        {/* Overlay con badges */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent">
          {/* Badge de estado - esquina superior izquierda */}
          <div className="absolute top-3 left-3">
            <Badge 
              variant={estadoOferta.estadoColor as any}
              className="bg-white/95 backdrop-blur-sm shadow-sm border-0"
              size="sm"
            >
              {estadoOferta.estadoTexto}
            </Badge>
          </div>
          
          {/* Badge de categoría - esquina superior derecha */}
          <div className="absolute top-3 right-3">
            <Badge 
              variant="outline" 
              className="bg-white/95 backdrop-blur-sm shadow-sm border-white/20"
              size="sm"
            >
              {oferta.categoria}
            </Badge>
          </div>
          
          {/* Badge de bug - debajo del estado si existe */}
          {oferta.esBug && (
            <div className="absolute top-12 left-3">
              <Badge 
                variant="bug"
                className="bg-white/95 backdrop-blur-sm shadow-sm border-0 font-medium inline-flex items-center"
                size="sm"
              >
                <Bug className="w-3 h-3 mr-1 flex-shrink-0" />
                <span className="whitespace-nowrap">Bug</span>
              </Badge>
            </div>
          )}
        </div>
      </div>

      {/* Contenido principal */}
      <div className="flex-1 p-4 space-y-4">
        {/* Título */}
        <div className="space-y-2">
          <h3 className={cn(
            "text-lg font-semibold leading-tight line-clamp-2",
            "text-secondary-900",
            oferta.esBug && "text-purple-800"
          )}>
            {oferta.esBug && <Zap className="inline w-4 h-4 mr-1 text-purple-600" />}
            {oferta.tituloOferta}
          </h3>
        </div>

        {/* Descripción */}
        <p className="text-sm text-secondary-600 line-clamp-3 leading-relaxed">
          {oferta.contextoDescripcion}
        </p>

        {/* Información de la tienda */}
        <div className="flex items-center gap-2 pt-1">
          <div className="flex items-center gap-2 text-sm">
            <Store className="w-4 h-4 text-secondary-500 flex-shrink-0" />
            <span className="font-medium text-secondary-800 truncate">{oferta.empresaTienda}</span>
          </div>
        </div>

        {/* Metadatos secundarios */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-1 text-xs text-secondary-500 pt-2 border-t border-secondary-100">
          <div className="flex items-center gap-1 min-w-0">
            <User className="w-3 h-3 flex-shrink-0" />
            <span className="truncate">Por {oferta.publicadoPorUsuario}</span>
          </div>
          <div className="flex items-center gap-1 flex-shrink-0">
            <Calendar className="w-3 h-3" />
            <span className="whitespace-nowrap">{formatearFechaRelativa(oferta.fechaHoraPublicacion)}</span>
          </div>
        </div>

        {/* Tips comunitarios - versión compacta */}
        {oferta.tipsComunitarios.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-1 text-xs font-medium text-secondary-600">
              <MessageCircle className="w-3 h-3" />
              <span>Tips ({oferta.tipsComunitarios.length})</span>
            </div>
            <div className="space-y-1">
              {oferta.tipsComunitarios.slice(0, 1).map((tip, idx) => (
                <div key={idx} className="flex items-start gap-2 p-2 bg-secondary-50 rounded-md">
                  <Badge variant={getTipColor(tip.tipo) as any} size="sm">
                    {tip.tipo}
                  </Badge>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-secondary-700 line-clamp-2">
                      {tip.descripcion}
                    </p>
                  </div>
                </div>
              ))}
              {oferta.tipsComunitarios.length > 1 && (
                <p className="text-xs text-secondary-500 text-center py-1">
                  +{oferta.tipsComunitarios.length - 1} más
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Footer con acciones */}
      <div className="p-4 pt-0 space-y-3 border-t border-secondary-100">
        {/* Código de cupón */}
        {oferta.codigoCupon && (
          <Button
            variant="outline"
            size="sm"
            fullWidth
            leftIcon={<Tag className="w-4 h-4" />}
            rightIcon={<Copy className={cn("w-4 h-4 transition-colors", isCopied && "text-success-600")} />}
            onClick={handleCopyCode}
            className={cn(
              "font-mono border-dashed transition-all duration-200",
              "hover:bg-secondary-50",
              isCopied && "border-success-300 bg-success-50 text-success-700"
            )}
          >
            {isCopied ? '¡Copiado!' : oferta.codigoCupon}
          </Button>
        )}

        {/* Botones de acción */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleViewDetail}
            className="flex-1"
          >
            Ver Detalle
          </Button>
          <Button
            variant="primary"
            size="sm"
            rightIcon={<ExternalLink className="w-4 h-4" />}
            onClick={handleOpenExternalLink}
            className={cn(
              "flex-1 font-medium transition-all duration-200",
              oferta.esBug && "bg-purple-600 hover:bg-purple-700"
            )}
          >
            {oferta.esBug ? 'Ir al Bug' : 'Ir a Oferta'}
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default OfertaCard;
