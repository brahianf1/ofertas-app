/**
 * Componente ErrorBoundary - Manejo de errores React
 * Captura errores y muestra una interfaz de fallback elegante
 */

import React, { Component, type ReactNode } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary capturó un error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <motion.div
          className="min-h-screen bg-secondary-50 flex items-center justify-center p-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
            <motion.div
              className="w-16 h-16 mx-auto mb-6 bg-error-100 rounded-full flex items-center justify-center"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            >
              <AlertTriangle className="w-8 h-8 text-error-600" />
            </motion.div>

            <motion.h1
              className="text-xl font-semibold text-secondary-900 mb-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Algo salió mal
            </motion.h1>

            <motion.p
              className="text-secondary-600 mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              Ha ocurrido un error inesperado. Por favor, intenta recargar la página.
            </motion.p>

            {import.meta.env.DEV && this.state.error && (
              <motion.div
                className="mb-6 p-3 bg-error-50 border border-error-200 rounded-lg text-left"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <p className="text-xs text-error-700 font-mono">
                  {this.state.error.message}
                </p>
              </motion.div>
            )}

            <motion.div
              className="space-y-3"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Button
                onClick={this.handleReset}
                variant="primary"
                leftIcon={<RefreshCw className="w-4 h-4" />}
                fullWidth
              >
                Intentar de nuevo
              </Button>

              <Button
                onClick={() => window.location.reload()}
                variant="outline"
                fullWidth
              >
                Recargar página
              </Button>
            </motion.div>
          </div>
        </motion.div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
