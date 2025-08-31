# Configuración de Rutas de API - Sistema de Inventario

## Problema Resuelto

### ❌ Error Original
```
Error: The route api/auth/login could not be found.
```

### ✅ Solución Implementada
La aplicación frontend ahora está configurada para usar el prefijo correcto del proyecto: `/api/inventario`

## Configuración Actualizada

### 1. **Variables de Entorno** (`.env`)
```bash
# URL base de tu API Laravel
NUXT_PUBLIC_API_BASE=http://localhost:8000/api/inventario
```

### 2. **Configuración Nuxt** (`nuxt.config.ts`)
```typescript
runtimeConfig: {
  public: {
    apiBase: process.env.NUXT_PUBLIC_API_BASE || 'http://localhost:8000/api/inventario',
    // ...
  }
}
```

## Rutas Actuales

Con esta configuración, las rutas de autenticación quedan:

- **Login**: `http://localhost:8000/api/inventario/auth/login`
- **Register**: `http://localhost:8000/api/inventario/auth/register`
- **Logout**: `http://localhost:8000/api/inventario/auth/logout`
- **User Info**: `http://localhost:8000/api/inventario/auth/user`

## Estructura de URLs

```
Backend Laravel: http://localhost:8000
├── api/
    └── inventario/          ← Prefijo del proyecto
        ├── auth/
        │   ├── login
        │   ├── register
        │   ├── logout
        │   └── user
        ├── products/
        ├── inventory/
        └── users/
```

## Configuración para Diferentes Entornos

### Desarrollo Local
```bash
NUXT_PUBLIC_API_BASE=http://localhost:8000/api/inventario
```

### Producción
```bash
NUXT_PUBLIC_API_BASE=https://tu-dominio.com/api/inventario
```

### Testing
```bash
NUXT_PUBLIC_API_BASE=http://testing-server:8000/api/inventario
```

## Verificación

Para verificar que la configuración es correcta:

1. **Revisar la consola del navegador** en las herramientas de desarrollador
2. **Network tab** para ver las peticiones HTTP
3. **Confirmar que las URLs** incluyen `/api/inventario`

## Archivos Modificados

1. ✅ `nuxt.config.ts` - Configuración base actualizada
2. ✅ `.env` - Variable de entorno actualizada  
3. ✅ `.env.example` - Ejemplo actualizado

## Notas Importantes

- **No modificar** los composables `useAuth.ts`, `useApi.ts`, etc. - estos usan rutas relativas
- **La configuración en `nuxt.config.ts`** maneja el `baseURL` automáticamente
- **Reiniciar el servidor** después de cambios en `.env` o `nuxt.config.ts`
- **Los composables** automáticamente heredan el `baseURL` configurado

## Troubleshooting

### Si sigues viendo errores 404:

1. **Verificar que Laravel** esté corriendo en `http://localhost:8000`
2. **Confirmar las rutas** en tu backend Laravel
3. **Revisar la consola** del navegador para ver las URLs exactas
4. **Reiniciar ambos servidores** (frontend y backend)

### Comandos útiles:

```bash
# Reiniciar servidor frontend
pnpm dev

# Ver rutas Laravel (en el proyecto backend)
php artisan route:list | grep inventario
```
