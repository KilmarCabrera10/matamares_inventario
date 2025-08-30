# Plugin de API para Laravel

## Configuración realizada

Se ha creado un plugin de API que sigue tu estructura preferida. Ahora puedes usarlo así:

### En las páginas `.vue`:

```vue
<script setup>
const { $api_laravel } = useNuxtApp()

// Obtener productos
const { data: products } = await useLazyAsyncData(
  'products',
  () => $api_laravel.get('/products')
)

// Crear un producto
const createProduct = async (productData) => {
  try {
    await $api_laravel.post('/products', productData)
    console.log('Producto creado')
  } catch (error) {
    console.error('Error:', error)
  }
}

// Actualizar un producto
const updateProduct = async (id, productData) => {
  try {
    await $api_laravel.put(`/products/${id}`, productData)
    console.log('Producto actualizado')
  } catch (error) {
    console.error('Error:', error)
  }
}

// Eliminar un producto
const deleteProduct = async (id) => {
  try {
    await $api_laravel.delete(`/products/${id}`)
    console.log('Producto eliminado')
  } catch (error) {
    console.error('Error:', error)
  }
}
</script>
```

### Características del plugin:

1. **Contador de requests**: Maneja automáticamente el estado de carga global
2. **Autenticación automática**: Incluye tokens del localStorage si existen
3. **Manejo de errores**: Intercepta y maneja errores globalmente
4. **TypeScript**: Completamente tipado

### Variables de entorno necesarias:

```env
NUXT_PUBLIC_API_BASE=http://localhost:8000/api
```

### En tu Laravel API:

El plugin espera respuestas en este formato:

```php
// Para listas
return response()->json([
    'data' => $products
]);

// Para items individuales
return response()->json([
    'data' => $product
]);

// Para respuestas simples
return response()->json([
    'message' => 'Operación exitosa'
]);
```

### Configuración de CORS en Laravel:

En `config/cors.php`:

```php
'allowed_origins' => ['http://localhost:3000'], // Tu dominio de Nuxt
'supports_credentials' => true,
```

### Rutas de ejemplo en Laravel:

```php
// routes/api.php
Route::prefix('v1')->group(function () {
    Route::apiResource('products', ProductController::class);
    
    Route::middleware('auth:sanctum')->prefix('admin')->group(function () {
        Route::apiResource('users', UserController::class);
    });
});
```
