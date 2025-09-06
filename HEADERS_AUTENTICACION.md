# Configuración de Headers de Autenticación

## Cambios Realizados

Se ha actualizado el sistema de autenticación para incluir automáticamente los headers requeridos (`token` y `organizationId`) en todas las peticiones API después del login.

### Headers Enviados

Después del login exitoso, **TODAS** las peticiones incluirán automáticamente estos headers:

```
Authorization: Bearer <token_del_usuario>
Organization-Id: <id_organizacion_seleccionada>
Content-Type: application/json
Accept: application/json
```

### Archivos Modificados

1. **`types/index.ts`** ⭐ **NUEVO**
   - ✅ Archivo central de tipos compartidos
   - ✅ Definiciones de `Organization`, `BaseUser`, `AuthResponse`, etc.
   - ✅ Mejora la organización y reutilización de tipos

2. **`app/composables/useAuth.ts`**
   - ✅ Actualizado para usar tipos centralizados desde `types/index.ts`
   - ✅ Modificada función `getAuthHeaders()` para usar los nombres correctos de headers
   - ✅ Eliminado el parámetro `organizationId` - ahora usa automáticamente `selectedOrgId`

3. **`app/composables/useApi.ts`**
   - ✅ Actualizado para incluir `getAuthHeaders()` en todas las peticiones (GET, POST, PUT, DELETE)
   - ✅ Todas las peticiones ahora incluyen automáticamente los headers de autenticación

4. **`app/composables/useInventarioApi.ts`**
   - ✅ Actualizado para usar el tipo `Organization` centralizado
   - ✅ Eliminados parámetros `organizationId` de las llamadas a `getAuthHeaders()`
   - ✅ Prefijados parámetros no utilizados con `_` para evitar warnings de ESLint

5. **`app/composables/useUsersApi.ts`**
   - ✅ Agregado uso de `getAuthHeaders()` en todas las peticiones

6. **`app/composables/useCuadreCaja.ts`**
   - ✅ Ya estaba usando `useApi`, por lo que automáticamente incluye los headers

### Funcionamiento

1. **Al hacer login exitoso:**
   - Se guarda el `token` recibido
   - Se selecciona automáticamente la primera organización del usuario
   - Se guarda el `selectedOrgId` en el estado y localStorage

2. **En cada petición API:**
   - `useApi` llama automáticamente a `getAuthHeaders()`
   - Se incluyen los headers `token` y `organizationId`
   - Las peticiones a `/cuadres` ahora funcionarán sin errores 401

### Beneficios

- ✅ **Automático**: No necesitas recordar agregar headers manualmente
- ✅ **Consistente**: Todas las peticiones usan el mismo sistema
- ✅ **Centralizado**: Un solo lugar para manejar headers de autenticación
- ✅ **Sin Duplicación**: Evita código repetitivo en cada API call

### Endpoints Afectados

Todos los endpoints ahora incluyen automáticamente los headers de autenticación:

- `/cuadres/*` - ✅ Ahora funcionarán sin errores 401
- `/products/*` - ✅ Headers incluidos
- `/inventory/*` - ✅ Headers incluidos
- `/locations/*` - ✅ Headers incluidos
- `/users/*` - ✅ Headers incluidos
- `/movimientos/*` - ✅ Headers incluidos

### Nota Importante

El sistema de headers se activa automáticamente después del login exitoso. Si necesitas cambiar de organización, puedes usar:

```typescript
const { selectOrganization } = useAuth()
selectOrganization('nuevo_organization_id')
```

Esto actualizará automáticamente el header `organizationId` en todas las futuras peticiones.
