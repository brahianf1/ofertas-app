/**
 * Componente App principal
 * Configuración de providers y layout de la aplicación
 */

import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import OfertasPage from '@/components/features/OfertasPage';
import ErrorBoundary from '@/components/common/ErrorBoundary';
import '@/styles/globals.css';

// Configuración del cliente de TanStack Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: (failureCount, error: any) => {
        // No reintentar para errores 4xx
        if (error?.response?.status >= 400 && error?.response?.status < 500) {
          return false;
        }
        return failureCount < 2;
      },
      staleTime: 5 * 60 * 1000, // 5 minutos
    },
    mutations: {
      retry: 1,
    },
  },
});

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <motion.div
          className="app"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <OfertasPage />
        </motion.div>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;