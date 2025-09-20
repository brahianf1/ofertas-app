/**
 * Hook para copiar texto al portapapeles
 * Incluye feedback visual y manejo de errores
 */

import { useState, useCallback } from 'react';

interface UseCopyToClipboardReturn {
  copiedText: string | null;
  copy: (text: string) => Promise<boolean>;
  isCopied: boolean;
}

export const useCopyToClipboard = (): UseCopyToClipboardReturn => {
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  const copy = useCallback(async (text: string): Promise<boolean> => {
    if (!navigator?.clipboard) {
      console.warn('Clipboard no disponible');
      return false;
    }

    try {
      await navigator.clipboard.writeText(text);
      setCopiedText(text);
      setIsCopied(true);
      
      // Reset después de 2 segundos
      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
      
      return true;
    } catch (error) {
      console.error('Error al copiar al portapapeles:', error);
      setCopiedText(null);
      setIsCopied(false);
      return false;
    }
  }, []);

  return { copiedText, copy, isCopied };
};
