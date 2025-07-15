# Stocky API - Backend

API REST para el sistema de gestión de inventario Stocky.

## 🚀 Características

- **Gestión de Productos**: CRUD completo con validaciones
- **Gestión de Movimientos**: Entradas y salidas de stock
- **Gestión de Categorías**: Organización de productos
- **Estadísticas**: Dashboard con métricas en tiempo real
- **Base de Datos MongoDB**: Escalable y flexible
- **API RESTful**: Endpoints bien documentados

## 📋 Prerrequisitos

- Node.js 18+
- Docker y Docker Compose
- MongoDB (incluido en Docker Compose)

## 🛠️ Instalación

### Opción 1: Con Docker (Recomendado)

1. **Clonar el repositorio y navegar al directorio:**
   ```bash
   cd stocky-app
   ```

2. **Levantar los servicios:**
   ```bash
   docker-compose up -d
   ```

3. **Poblar la base de datos con datos de ejemplo:**
   ```bash
   docker-compose exec stocky-api npm run seed
   ```

### Opción 2: Instalación local

1. **Instalar dependencias:**
   ```bash
   cd stocky-api
   npm install
   ```

2. **Configurar variables de entorno:**
   ```bash
   cp env.example .env
   # Editar .env con tus configuraciones
   ```

3. **Iniciar MongoDB localmente o usar Docker:**
   ```bash
   docker run -d -p 27017:27017 --name stocky-mongo mongo:latest
   ```

4. **Ejecutar el servidor:**
   ```bash
   npm run dev
   ```

5. **Poblar datos de ejemplo:**
   ```bash
   npm run seed
   ```

## 📡 Endpoints de la API

### Productos
- `GET /api/products` - Listar productos (con paginación y filtros)
- `GET /api/products/:id` - Obtener producto por ID
- `POST /api/products` - Crear nuevo producto
- `PUT /api/products/:id` - Actualizar producto
- `DELETE /api/products/:id` - Eliminar producto
- `GET /api/products/stats` - Estadísticas de productos
- `GET /api/products/low-stock` - Productos con bajo stock
- `PATCH /api/products/:id/stock` - Actualizar stock

### Movimientos
- `GET /api/movements` - Listar movimientos (con paginación y filtros)
- `GET /api/movements/:id` - Obtener movimiento por ID
- `POST /api/movements` - Crear nuevo movimiento
- `GET /api/movements/stats` - Estadísticas de movimientos
- `GET /api/movements/recent` - Movimientos recientes
- `GET /api/movements/product/:productId` - Movimientos por producto

### Categorías
- `GET /api/categories` - Listar categorías
- `GET /api/categories/:id` - Obtener categoría por ID
- `POST /api/categories` - Crear nueva categoría
- `PUT /api/categories/:id` - Actualizar categoría
- `DELETE /api/categories/:id` - Eliminar categoría

## 🔧 Variables de Entorno

```env
# Configuración del servidor
PORT=3000

# Configuración de MongoDB
MONGO_URI=mongodb://mongo:27017/stockydb

# Configuración de desarrollo
NODE_ENV=development
```

## 📊 Estructura de la Base de Datos

### Producto
```javascript
{
  name: String,           // Nombre del producto
  category: String,       // Categoría
  stock: Number,          // Stock actual
  price: Number,          // Precio
  minStock: Number,       // Stock mínimo
  maxStock: Number,       // Stock máximo
  supplier: String,       // Proveedor
  sku: String,           // SKU único
  description: String,    // Descripción
  status: String,        // active/inactive/low-stock
  createdAt: Date,       // Fecha de creación
  updatedAt: Date        // Fecha de actualización
}
```

### Movimiento
```javascript
{
  productId: ObjectId,    // Referencia al producto
  productName: String,    // Nombre del producto
  category: String,       // Categoría
  type: String,          // entrada/salida
  quantity: Number,       // Cantidad
  previousStock: Number,  // Stock anterior
  newStock: Number,       // Stock nuevo
  reason: String,         // Motivo
  user: String,          // Usuario
  cost: Number,          // Costo (opcional)
  notes: String,         // Notas (opcional)
  createdAt: Date        // Fecha de creación
}
```

### Categoría
```javascript
{
  name: String,          // Nombre de la categoría
  description: String,   // Descripción
  color: String,         // Color para UI
  isActive: Boolean,     // Estado activo
  createdAt: Date,       // Fecha de creación
  updatedAt: Date        // Fecha de actualización
}
```

## 🚀 Scripts Disponibles

- `npm run dev` - Ejecutar en modo desarrollo con nodemon
- `npm start` - Ejecutar en modo producción
- `npm run seed` - Poblar base de datos con datos de ejemplo

## 🔍 Ejemplos de Uso

### Crear un producto
```bash
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Nuevo Producto",
    "category": "Electrónicos",
    "stock": 10,
    "price": 99.99,
    "minStock": 5,
    "maxStock": 50,
    "supplier": "Proveedor ABC",
    "sku": "PROD-001",
    "description": "Descripción del producto"
  }'
```

### Crear un movimiento
```bash
curl -X POST http://localhost:3000/api/movements \
  -H "Content-Type: application/json" \
  -d '{
    "productId": "PRODUCT_ID",
    "type": "entrada",
    "quantity": 5,
    "reason": "Compra",
    "user": "Admin",
    "cost": 50.00
  }'
```

## 🐛 Troubleshooting

### Error de conexión a MongoDB
- Verificar que MongoDB esté corriendo
- Verificar la variable `MONGO_URI` en el archivo `.env`
- Verificar que el puerto 27017 esté disponible

### Error de dependencias
```bash
rm -rf node_modules package-lock.json
npm install
```

### Limpiar datos y repoblar
```bash
npm run seed
```

## 📝 Logs

Los logs se muestran en la consola con emojis para facilitar la identificación:
- 🔗 Conexión a MongoDB
- 🚀 Servidor iniciado
- ✅ Operaciones exitosas
- ❌ Errores
- ⚠️ Advertencias

## 🤝 Contribución

1. Fork el proyecto
2. Crear una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. 