# Sistema de Inventario - Frontend

Frontend desarrollado con Nuxt 3 y Nuxt UI para el sistema de inventario con autenticación JWT.

## 🚀 Características

- ✅ **Autenticación JWT** - Login/registro con tokens Bearer
- ✅ **Multi-tenancy** - Soporte para múltiples organizaciones
- ✅ **Gestión de Inventario** - CRUD completo de productos, ubicaciones y movimientos
- ✅ **UI Moderna** - Interfaz construida con Nuxt UI y Tailwind CSS
- ✅ **Gestión de Estado** - Composables para manejo de autenticación y API
- ✅ **Middleware de Seguridad** - Protección de rutas autenticadas

## 🛠️ Tecnologías

- **Nuxt 3** - Framework Vue.js full-stack
- **Nuxt UI** - Componentes UI modernos
- **Tailwind CSS** - Framework de utilidades CSS
- **TypeScript** - Tipado estático
- **Pinia** - Gestión de estado (via composables)

## 📋 Prerrequisitos

- Node.js 18+ 
- pnpm (recomendado) o npm
- API Backend funcionando (Laravel con autenticación JWT)

## 🚀 Instalación

1. **Clonar e instalar dependencias:**
   ```bash
   git clone <tu-repo>
   cd matamares_inventario
   pnpm install
   ```

2. **Configurar variables de entorno:**
   ```bash
   cp .env.example .env
   ```
   
   Editar `.env` con tus configuraciones:
   ```env
   NUXT_PUBLIC_API_BASE=http://localhost:8000/api
   NODE_ENV=development
   ```

3. **Ejecutar en desarrollo:**
   ```bash
   pnpm dev
   ```

## 🔐 Autenticación

### Configuración Requerida

El sistema requiere que tu API backend tenga configurada autenticación JWT con los siguientes endpoints:

```
POST /api/auth/login
POST /api/auth/register  
POST /api/auth/logout
POST /api/auth/refresh
GET  /api/auth/me
```

### Headers Requeridos

Para endpoints protegidos, el sistema envía automáticamente:

```http
Authorization: Bearer {token}
Organization-Id: {uuid-de-organizacion}
Content-Type: application/json
```

### Flujo de Autenticación

1. **Login/Registro** → Obtener token JWT
2. **Selección de Organización** → Si el usuario tiene múltiples organizaciones
3. **Persistencia** → Token y organización se guardan en localStorage
4. **Auto-renovación** → Verificación automática del token al cargar la app

## 📁 Estructura del Proyecto

```
app/
├── components/           # Componentes reutilizables
├── composables/         # Lógica de negocio
│   ├── useAuth.ts      # Autenticación JWT
│   ├── useInventarioApi.ts # API de inventario
│   └── useUsersApi.ts  # API de usuarios
├── layouts/            # Layouts base
├── middleware/         # Middleware de rutas
│   └── auth.ts        # Protección de rutas
├── pages/              # Páginas de la aplicación
│   ├── login.vue      # Página de login
│   ├── register.vue   # Página de registro
│   └── inventario-example.vue # Demo de inventario
├── plugins/            # Plugins de Nuxt
│   └── auth.client.ts # Inicialización de autenticación
└── utils/              # Utilidades
```

## 🔧 Uso

### 1. Autenticación

```vue
<script setup>
const { login, logout, user, isAuthenticated } = useAuth()

// Login
await login({ email: 'user@example.com', password: 'password' })

// Verificar si está autenticado
if (isAuthenticated.value) {
  console.log('Usuario:', user.value.name)
}

// Logout
await logout()
</script>
```

### 2. API de Inventario

```vue
<script setup>
const api = useInventarioApi()
const { selectedOrgId } = useAuth()

// Obtener productos de la organización seleccionada
const productos = await api.getProducts(selectedOrgId.value)

// Crear producto
await api.createProduct(selectedOrgId.value, {
  name: 'Producto Test',
  sku: 'TEST-001',
  price: 15.99
})
</script>
```

### 3. Protección de Rutas

```vue
<script setup>
// Proteger página con middleware
definePageMeta({
  middleware: 'auth'
})
</script>
```

## 🌐 Endpoints de la API

El frontend está configurado para trabajar con la API de inventario documentada. Principales endpoints:

### Autenticación
- `POST /auth/login` - Iniciar sesión
- `POST /auth/register` - Registrarse
- `GET /auth/me` - Información del usuario

### Inventario
- `GET /inventario/organizations` - Organizaciones del usuario
- `GET /inventario/products` - Productos (requiere Organization-Id)
- `GET /inventario/inventory/dashboard` - Dashboard de inventario
- `POST /inventario/inventory/movements` - Crear movimiento

> Ver `README_API.md` para documentación completa de la API.

## 🔧 Configuración Avanzada

### Variables de Entorno

```env
# URL base de la API (requerido)
NUXT_PUBLIC_API_BASE=http://localhost:8000/api

# Entorno de desarrollo
NODE_ENV=development

# Secreto de API (opcional, solo servidor)
API_SECRET=your-secret-key
```

### Configuración de CORS

Asegúrate de que tu API backend tenga configurado CORS para permitir solicitudes desde tu dominio frontend:

```php
// En Laravel, config/cors.php
'paths' => ['api/*'],
'allowed_origins' => ['http://localhost:3000'],
'allowed_headers' => ['*'],
'allowed_methods' => ['*'],
```

## 🐛 Resolución de Problemas

### Error de CORS
```
Access to fetch has been blocked by CORS policy
```
**Solución:** Configurar CORS en el backend para permitir tu dominio frontend.

### Token Expirado
```
401 Unauthorized
```
**Solución:** El sistema automáticamente intenta renovar el token. Si falla, redirige al login.

### Organización No Seleccionada
```
Error: Selecciona una organización primero
```
**Solución:** Verificar que el usuario tenga organizaciones y que esté seleccionada una.

## 📝 Scripts Disponibles

```bash
# Desarrollo
pnpm dev

# Build para producción
pnpm build

# Preview de producción
pnpm preview

# Linting
pnpm lint

# Generar sitio estático
pnpm generate
```

## 🤝 Contribución

1. Fork del proyecto
2. Crear rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit de cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver `LICENSE` para más detalles.
