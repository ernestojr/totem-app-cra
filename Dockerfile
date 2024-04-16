# Especificar la imagen base de Node
FROM node:20 as build

# Establecer el directorio de trabajo en el contenedor
WORKDIR /app

# Definir argumentos
ARG REACT_APP_API_HOST
ARG REACT_APP_API_HOST_POS
ARG REACT_APP_COUNTRY
ARG REACT_APP_API_CITY_ID

# Asignar argumentos a variables de entorno
ENV REACT_APP_API_HOST=$REACT_APP_API_HOST
ENV REACT_APP_API_HOST_POS=$REACT_APP_API_HOST_POS
ENV REACT_APP_COUNTRY=$REACT_APP_COUNTRY
ENV REACT_APP_API_CITY_ID=$REACT_APP_API_CITY_ID

# Copiar los archivos del proyecto al contenedor
COPY package*.json ./

# Instalar las dependencias del proyecto
RUN npm install

# Copiar el resto de los archivos del proyecto al contenedor
COPY . .

# Construir la aplicación
RUN npm run build

# Especificar la imagen base de Nginx
FROM nginx:stable-alpine

# Copiar los archivos estáticos al directorio de Nginx
COPY --from=build /app/build /usr/share/nginx/html

# Exponer el puerto en el que Nginx escuchará las conexiones
EXPOSE 80

# Iniciar Nginx
CMD ["nginx", "-g", "daemon off;"]