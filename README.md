# Stocky App

Sistema de gestión de inventario moderno con frontend React + Vite y backend Node.js + Express + MongoDB.

---

## 🚀 Características
- Gestión de productos, movimientos, categorías, proveedores, usuarios y tareas.
- Dashboard con métricas y alertas en tiempo real.
- Autenticación JWT y refresh token.
- UI moderna, responsiva y animada.
- API RESTful documentada.
- Seeds para poblar la base de datos con datos de ejemplo.

---

## 📋 Prerrequisitos
- Node.js 18+
- Docker y Docker Compose (recomendado)
- npm

---

## 🛠️ Instalación y configuración

### Opción 1: Todo con Docker (recomendado)

1. Clona el repositorio y entra al directorio:
   ```bash
   git clone <repo-url>
   cd stoky-app
   ```
2. Levanta todos los servicios (API, frontend, MongoDB, Nginx):
   ```bash
   docker-compose up -d
   ```
3. Pueba la base de datos con datos de ejemplo:
   ```bash
   docker-compose exec stocky-api npm run seed
   ```
4. Accede a la app:
   - Frontend: [http://localhost](http://localhost)
   - API: [http://localhost:3000/api](http://localhost:3000/api)

### Opción 2: Manual (local)

#### Backend (API)
1. Instala dependencias:
   ```bash
   cd stocky-api
   npm install
   ```
2. Configura variables de entorno:
   - Copia `env.example` a `.env` y edítalo según tu entorno.
3. Inicia MongoDB (puedes usar Docker):
   ```bash
   docker run -d --name mongo -p 27017:27017 mongo
   ```
4. Ejecuta la API:
   ```bash
   npm run dev
   ```
5. Pueba la base de datos:
   ```bash
   npm run seed
   ```

#### Frontend (App)
1. Instala dependencias:
   ```bash
   cd stocky
   npm install
   ```
2. Ejecuta la app:
   ```bash
   npm run dev
   ```
3. Accede a [http://localhost:5173](http://localhost:5173) (o el puerto que indique Vite).

---

## 🧑‍💻 Uso de archivos .env

### Backend (stocky-api)
- El backend requiere un archivo `.env` para definir variables sensibles y de entorno.
- Ejemplo de variables típicas:
  ```env
  PORT=3000
  MONGODB_URI=mongodb://mongo:27017/stocky
  JWT_SECRET=tu_clave_secreta
  JWT_REFRESH_SECRET=tu_refresh_secret
  FRONTEND_URL=http://localhost:5173
  NODE_ENV=development
  ```
- Puedes copiar el archivo `env.example` y renombrarlo a `.env`:
  ```bash
  cp env.example .env
  ```
- Modifica los valores según tu entorno y necesidades.

### Frontend (stocky)
- El frontend puede usar variables de entorno para configurar la URL de la API y otros parámetros.
- Crea un archivo `.env` en la carpeta `stocky/` si necesitas personalizar la API:
  ```env
  VITE_API_URL=http://localhost:3000/api
  ```
- Por defecto, la mayoría de los entornos de desarrollo funcionarán sin necesidad de modificar el `.env` del frontend, pero puedes crearlo si necesitas apuntar a otra API.

---

## 🧑‍💻 Scripts útiles
- `docker-compose up -d` — Levanta todo el stack (API, frontend, MongoDB, Nginx)
- `docker-compose exec stocky-api npm run seed` — Ejecuta los seeds en la base de datos
- `cd stocky-api && npm run dev` — Inicia la API en modo desarrollo
- `cd stocky && npm run dev` — Inicia el frontend en modo desarrollo

---

## 🗃️ Seeds y datos de ejemplo
- Los seeds poblan la base con productos, categorías, movimientos, usuarios y proveedores de ejemplo.
- Puedes modificar los scripts en `stocky-api/src/scripts/` para personalizar los datos iniciales.

---

## 📝 Notas
- El frontend y backend están desacoplados, pero se comunican por HTTP.
- El login de administrador por defecto se crea con los seeds.
- Puedes cambiar la configuración de puertos y variables en los archivos `.env` y `docker-compose.yml`.

