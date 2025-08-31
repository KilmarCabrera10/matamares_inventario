<template>
  <div class="p-6 max-w-6xl mx-auto">
    <h1 class="text-3xl font-bold mb-8">Sistema de Inventario - Ejemplo</h1>
    
    <!-- Health Check -->
    <div class="mb-8 p-6 border rounded-lg">
      <h2 class="text-xl font-semibold mb-4">1. Health Check</h2>
      <UButton :loading="loadingHealth" @click="testHealth" class="mb-4">
        Probar Conexión
      </UButton>
      <div v-if="healthStatus" class="p-3 bg-green-100 text-green-800 rounded">
        ✅ {{ healthStatus.status }} - {{ healthStatus.service }}
      </div>
    </div>

    <!-- Organizaciones -->
    <div class="mb-8 p-6 border rounded-lg">
      <h2 class="text-xl font-semibold mb-4">2. Organizaciones</h2>
      <div class="mb-4">
        <UButton 
          :loading="loadingOrgs" 
          @click="loadOrganizations"
          class="mr-4"
        >
          Cargar Organizaciones
        </UButton>
        <UButton 
          variant="outline" 
          @click="showCreateForm = !showCreateForm"
        >
          {{ showCreateForm ? 'Cancelar' : 'Nueva Organización' }}
        </UButton>
      </div>

      <!-- Formulario para crear organización -->
      <div v-if="showCreateForm" class="mb-6 p-4 bg-gray-50 rounded">
        <h3 class="font-semibold mb-3">Crear Nueva Organización</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <UInput v-model="newOrg.name" placeholder="Nombre de la organización" />
          <UInput v-model="newOrg.description" placeholder="Descripción (opcional)" />
        </div>
        <UButton 
          :loading="creating" 
          :disabled="!newOrg.name"
          @click="createOrganization"
        >
          Crear Organización
        </UButton>
      </div>

      <!-- Lista de organizaciones -->
      <div v-if="organizations.length > 0" class="grid gap-4">
        <div 
          v-for="org in organizations" 
          :key="org.id" 
          class="p-4 border rounded-lg"
        >
          <div class="flex justify-between items-start">
            <div>
              <h3 class="font-bold text-lg">{{ org.name }}</h3>
              <p class="text-gray-600">{{ org.description || 'Sin descripción' }}</p>
              <p class="text-sm text-gray-500">ID: {{ org.id }}</p>
            </div>
            <div class="text-right">
              <div v-if="selectedOrgId === org.id.toString()" class="text-blue-600 font-semibold">
                ✓ Seleccionada (desde login)
              </div>
              <div class="text-xs text-gray-400">
                {{ new Date(org.created_at).toLocaleDateString() }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Productos (solo si hay organización seleccionada) -->
    <div v-if="selectedOrgId" class="mb-8 p-6 border rounded-lg">
      <h2 class="text-xl font-semibold mb-4">
        3. Productos (Organización seleccionada)
      </h2>
      <div class="mb-4 space-x-2">
        <UButton 
          :loading="loadingProducts" 
          @click="loadProducts"
        >
          Cargar Productos
        </UButton>
        <UButton 
          variant="outline" 
          @click="loadLowStock"
        >
          Productos con Stock Bajo
        </UButton>
      </div>

      <div v-if="products.length > 0" class="grid gap-4">
        <div v-for="product in products" :key="product.id" class="p-4 border rounded">
          <h4 class="font-semibold">{{ product.name }}</h4>
          <p class="text-gray-600">{{ product.description }}</p>
          <div class="flex justify-between text-sm text-gray-500">
            <span>SKU: {{ product.sku }}</span>
            <span>Precio: ${{ product.price }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Mostrar errores -->
    <div v-if="error" class="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
      <strong>❌ Error:</strong> {{ error }}
    </div>
  </div>
</template>

<script setup>
import { useInventarioApi } from '~/composables/useInventarioApi'

// Middleware de autenticación
definePageMeta({
  middleware: 'auth'
})

const api = useInventarioApi()
const { selectedOrgId } = useAuth()

// Estados reactivos
const healthStatus = ref(null)
const organizations = ref([])
const products = ref([])
const showCreateForm = ref(false)
const newOrg = ref({ name: '', description: '' })

// Estados de carga
const loadingHealth = ref(false)
const loadingOrgs = ref(false)
const loadingProducts = ref(false)
const creating = ref(false)
const error = ref(null)

// Función para probar health check
const testHealth = async () => {
  try {
    loadingHealth.value = true
    error.value = null
    healthStatus.value = await api.healthCheck()
  } catch (err) {
    console.error('Error en health check:', err)
    error.value = err.data?.message || err.message || 'Error de conexión'
  } finally {
    loadingHealth.value = false
  }
}

// Función para cargar organizaciones
const loadOrganizations = async () => {
  try {
    loadingOrgs.value = true
    error.value = null
    const response = await api.getOrganizations()
    organizations.value = response.data || response
  } catch (err) {
    console.error('Error al cargar organizaciones:', err)
    error.value = err.data?.message || err.message || 'Error al cargar organizaciones'
  } finally {
    loadingOrgs.value = false
  }
}

// Función para crear organización
const createOrganization = async () => {
  if (!newOrg.value.name) return
  
  try {
    creating.value = true
    error.value = null
    await api.createOrganization(newOrg.value)
    
    // Limpiar formulario y recargar lista
    newOrg.value = { name: '', description: '' }
    showCreateForm.value = false
    await loadOrganizations()
  } catch (err) {
    console.error('Error al crear organización:', err)
    error.value = err.data?.message || err.message || 'Error al crear organización'
  } finally {
    creating.value = false
  }
}

// Función para cargar productos
const loadProducts = async () => {
  if (!selectedOrgId.value) {
    error.value = 'Selecciona una organización primero'
    return
  }
  
  try {
    loadingProducts.value = true
    error.value = null
    const response = await api.getProducts(selectedOrgId.value)
    products.value = response.data || response
  } catch (err) {
    console.error('Error al cargar productos:', err)
    error.value = err.data?.message || err.message || 'Error al cargar productos'
  } finally {
    loadingProducts.value = false
  }
}

// Función para cargar productos con stock bajo
const loadLowStock = async () => {
  if (!selectedOrgId.value) {
    error.value = 'Selecciona una organización primero'
    return
  }
  
  try {
    loadingProducts.value = true
    error.value = null
    const response = await api.getLowStockProducts(selectedOrgId.value)
    products.value = response.data || response
  } catch (err) {
    console.error('Error al cargar productos con stock bajo:', err)
    error.value = err.data?.message || err.message || 'Error al cargar productos'
  } finally {
    loadingProducts.value = false
  }
}

// Auto-cargar health check al montar el componente
onMounted(() => {
  testHealth()
  // Cargar organizaciones automáticamente
  loadOrganizations()
})
</script>