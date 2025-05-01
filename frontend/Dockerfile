FROM node:20-alpine as build

WORKDIR /app

# Variables de entorno para la construcción
ARG VITE_API_URL=/graphql
ENV VITE_API_URL=${VITE_API_URL}

# Copiar archivos de dependencias
COPY package.json package-lock.json ./

# Instalar dependencias con --legacy-peer-deps para evitar problemas de compatibilidad
RUN npm ci --legacy-peer-deps

# Copiar el resto de archivos
COPY . .

# Construir la aplicación para producción
RUN npm run build

# Etapa de producción
FROM nginx:alpine

# Copiar los archivos de configuración de nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copiar los archivos estáticos de la etapa de construcción
COPY --from=build /app/dist /usr/share/nginx/html

# Exponer el puerto 80
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"] 