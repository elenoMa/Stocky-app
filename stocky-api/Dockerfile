FROM node:18-alpine

WORKDIR /app

# Copiar archivos de dependencias primero para aprovechar el cache de Docker
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el código fuente
COPY . .

# Crear directorio para logs
RUN mkdir -p logs

# Exponer puerto
EXPOSE 3000

# Comando por defecto
CMD ["npm", "run", "dev"]
