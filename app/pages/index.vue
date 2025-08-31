<template>
  <div>
    <TitlePage subtitle="Sistema de gestión de inventario moderno">
      Dashboard - Sistema de Inventario
    </TitlePage>
    
    <!-- Header con información del usuario -->
    <div class="mb-8 p-6 bg-default rounded-lg shadow">
      <div class="flex justify-between items-center">
        <div>
          <h2 class="text-2xl font-bold text-highlighted">
            Bienvenido, {{ user?.name }}
          </h2>
          <p class="text-muted">{{ user?.email }}</p>
        </div>
        <div class="flex items-center space-x-4">
          <!-- Selector de organización -->
          <div v-if="user?.organizations?.length > 1" class="min-w-48">
            <USelect
              v-model="currentOrgId"
              :options="organizationOptions"
              placeholder="Seleccionar organización"
              @change="handleOrgChange"
            />
          </div>
          <div v-else-if="user?.organizations?.length === 1" class="text-sm text-muted">
            Organización: {{ user.organizations[0].name }}
          </div>
          
          <UButton 
            variant="outline" 
            :loading="loggingOut"
            @click="handleLogout"
          >
            Cerrar Sesión
          </UButton>
        </div>
      </div>
    </div>

    <!-- Enlaces rápidos -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      <NuxtLink 
        to="/inventario-example" 
        class="p-6 bg-default rounded-lg shadow hover:shadow-lg transition-shadow"
      >
        <h3 class="text-lg font-semibold mb-2 text-default">📦 Gestión de Inventario</h3>
        <p class="text-muted">Administra productos, ubicaciones y movimientos de inventario</p>
      </NuxtLink>
      
      <NuxtLink 
        to="/api-example" 
        class="p-6 bg-default rounded-lg shadow hover:shadow-lg transition-shadow"
      >
        <h3 class="text-lg font-semibold mb-2 text-default">🔧 Ejemplos de API</h3>
        <p class="text-muted">Prueba diferentes endpoints y funcionalidades</p>
      </NuxtLink>
      
      <NuxtLink 
        to="/users-simple" 
        class="p-6 bg-default rounded-lg shadow hover:shadow-lg transition-shadow"
      >
        <h3 class="text-lg font-semibold mb-2 text-default">👥 Usuarios</h3>
        <p class="text-muted">Gestión básica de usuarios del sistema</p>
      </NuxtLink>
    </div>

    <!-- Estadísticas rápidas (si hay organización seleccionada) -->
    <div v-if="selectedOrgId" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div class="p-6 bg-primary/10 rounded-lg border border-primary/20">
        <h4 class="text-sm font-medium text-primary">Total Productos</h4>
        <p class="text-2xl font-bold text-primary">--</p>
      </div>
      
      <div class="p-6 bg-success/10 rounded-lg border border-success/20">
        <h4 class="text-sm font-medium text-success">Ubicaciones</h4>
        <p class="text-2xl font-bold text-success">--</p>
      </div>
      
      <div class="p-6 bg-warning/10 rounded-lg border border-warning/20">
        <h4 class="text-sm font-medium text-warning">Stock Bajo</h4>
        <p class="text-2xl font-bold text-warning">--</p>
      </div>
      
      <div class="p-6 bg-info/10 rounded-lg border border-info/20">
        <h4 class="text-sm font-medium text-info">Movimientos Hoy</h4>
        <p class="text-2xl font-bold text-info">--</p>
      </div>
    </div>
  </div>
</template>

<script setup>
// Middleware de autenticación
definePageMeta({
  middleware: 'auth'
})

const { user, logout, selectedOrgId, selectOrganization } = useAuth()
const loggingOut = ref(false)

// Organización seleccionada actualmente
const currentOrgId = ref(selectedOrgId.value || '')

// Opciones para el selector de organizaciones
const organizationOptions = computed(() => {
  if (!user.value?.organizations) return []
  
  return user.value.organizations.map(org => ({
    label: org.name,
    value: org.id.toString()
  }))
})

// Manejar cambio de organización
const handleOrgChange = (orgId) => {
  selectOrganization(orgId)
  currentOrgId.value = orgId
}

// Manejar logout
const handleLogout = async () => {
  try {
    loggingOut.value = true
    await logout()
    await navigateTo('/login')
  } catch (error) {
    console.error('Error al cerrar sesión:', error)
  } finally {
    loggingOut.value = false
  }
}

// Establecer organización por defecto si no hay una seleccionada
onMounted(() => {
  if (!selectedOrgId.value && user.value?.organizations?.length > 0) {
    const firstOrg = user.value.organizations[0]
    selectOrganization(firstOrg.id.toString())
    currentOrgId.value = firstOrg.id.toString()
  }
})
</script>
