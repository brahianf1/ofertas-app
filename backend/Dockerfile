# Dockerfile para el Backend (Node.js + TypeScript)
FROM node:18-alpine AS builder

# Instalar dependencias del sistema
RUN apk add --no-cache libc6-compat

# Establecer directorio de trabajo
WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./
COPY tsconfig.json ./

# Instalar todas las dependencias (incluyendo dev para compilar)
RUN npm ci && npm cache clean --force

# Copiar código fuente
COPY src ./src

# Compilar TypeScript
RUN npm run build

# Instalar solo dependencias de producción para la siguiente etapa
RUN npm ci --omit=dev && npm cache clean --force

# Etapa de producción
FROM node:18-alpine AS production

# Crear usuario no-root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nodejs

# Establecer directorio de trabajo
WORKDIR /app

# Copiar dependencias instaladas
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./

# Copiar código compilado
COPY --from=builder /app/dist ./dist

# Cambiar propietario de archivos
RUN chown -R nodejs:nodejs /app
USER nodejs

# Exponer puerto
EXPOSE 3001

# Variables de entorno por defecto
ENV NODE_ENV=production
ENV PORT=3001

# Comando de inicio
CMD ["node", "dist/index.js"]
