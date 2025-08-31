<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-6">Ejemplo simple de API con Laravel - Inventario</h1>
    
    <!-- Botón para probar health check -->
    <div class="mb-4 space-x-2">
      <UButton :loading="loading" @click="testHealth">
        Probar Health Check
      </UButton>
      <UButton :loading="loadingOrgs" @click="loadOrganizations" variant="outline">
        Cargar Organizaciones
      </UButton>
    </div>

    <!-- Mostrar resultado del health check -->
    <div v-if="healthData" class="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
      <strong>✅ Health Check:</strong> {{ healthData.status }} - {{ healthData.service }}
    </div>

    <!-- Mostrar organizaciones -->
    <div v-if="organizations.length > 0" class="mb-6">
      <h2 class="text-lg font-semibold mb-3">Organizaciones:</h2>
      <div class="grid gap-4">
        <div v-for="org in organizations" :key="org.id" class="p-4 border rounded-lg">
          <h3 class="font-bold">{{ org.name }}</h3>
          <p class="text-gray-600">{{ org.description }}</p>
          <p class="text-sm text-gray-500">ID: {{ org.id }}</p>
        </div>
      </div>
    </div>

    <!-- Mensaje si no hay datos -->
    <div v-else-if="!loading && !loadingOrgs && !healthData" class="text-gray-500">
      Haz clic en los botones para probar la conexión con la API.
    </div>

    <!-- Mostrar errores -->
    <div v-if="error" class="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
      <strong>❌ Error:</strong> {{ error }}
    </div>
  </div>
</template>

<script setup>
// Variables reactivas
const healthData = ref(null)
const organizations = ref([])
const loading = ref(false)
const loadingOrgs = ref(false)
const error = ref(null)

// Obtener configuración de runtime
const config = useRuntimeConfig()

// Función para probar health check
const testHealth = async () => {
  try {
    loading.value = true
    error.value = null
    
    // Hacer petición a la ruta health del inventario
    const data = await $fetch('/health', {
      baseURL: config.public.apiBase
    })
    
    healthData.value = data
    console.log('Health check exitoso:', data)
  } catch (err) {
    console.error('Error en health check:', err)
    error.value = err.data?.message || err.message || 'Error desconocido'
  } finally {
    loading.value = false
  }
}

// Función para cargar organizaciones (requiere autenticación)
const loadOrganizations = async () => {
  try {
    loadingOrgs.value = true
    error.value = null
    
    // Esta ruta requiere autenticación con Sanctum
    const data = await $fetch('/organizations', {
      baseURL: config.public.apiBase,
      headers: {
        // Aquí necesitarás agregar el token de autenticación cuando lo tengas
        // 'Authorization': 'Bearer ' + token
      }
    })
    
    organizations.value = data.data || data
    console.log('Organizaciones cargadas:', organizations.value)
  } catch (err) {
    console.error('Error al cargar organizaciones:', err)
    error.value = err.data?.message || err.message || 'Error de autenticación o conexión'
  } finally {
    loadingOrgs.value = false
  }
}
</script>
