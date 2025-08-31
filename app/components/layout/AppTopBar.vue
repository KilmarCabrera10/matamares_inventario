<template>
  <header class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 sm:px-6 lg:px-8">
    <div class="flex h-16 items-center justify-between">
      <!-- Left side -->
      <div class="flex items-center">
        <!-- Sidebar toggle -->
        <UButton
          icon="i-lucide-menu"
          color="neutral"
          variant="ghost"
          size="sm"
          @click="$emit('toggleSidebar')"
        />
        
        <!-- Breadcrumb -->
        <nav class="ml-4 hidden sm:block">
          <ol class="flex items-center space-x-2 text-sm">
            <li v-for="(item, index) in breadcrumbs" :key="item.href">
              <div class="flex items-center">
                <Icon 
                  v-if="index > 0" 
                  name="i-lucide-chevron-right" 
                  class="h-4 w-4 text-gray-400 mx-2" 
                />
                <NuxtLink
                  :to="item.href"
                  :class="[
                    'font-medium transition-colors duration-200',
                    index === breadcrumbs.length - 1
                      ? 'text-gray-900 dark:text-white'
                      : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                  ]"
                >
                  {{ item.name }}
                </NuxtLink>
              </div>
            </li>
          </ol>
        </nav>
      </div>
      
      <!-- Right side -->
      <div class="flex items-center space-x-4">
        <!-- Search (opcional para futuro) -->
        <UButton
          icon="i-lucide-search"
          color="neutral"
          variant="ghost"
          size="sm"
          class="hidden md:flex"
        />
        
        <!-- Notifications -->
        <UButton
          icon="i-lucide-bell"
          color="neutral"
          variant="ghost"
          size="sm"
        />
        
        <!-- Color mode toggle -->
        <ColorModeToggle />
        
        <!-- User dropdown -->
        <UDropdownMenu :items="dropdownItems">
          <template #default>
            <button 
              type="button"
              class="p-1 rounded-full hover:ring-2 hover:ring-gray-300 dark:hover:ring-gray-600 transition-all focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <UAvatar
                src="/api/placeholder/32/32"
                alt="Usuario"
                size="sm"
              />
            </button>
          </template>
        </UDropdownMenu>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
defineEmits<{
  toggleSidebar: []
}>()

// Obtener la función de logout
const { logout } = useAuth()

const isLoggingOut = ref(false)

const handleLogout = async () => {
  try {
    isLoggingOut.value = true
    await logout()
  } catch (error) {
    console.error('Error al cerrar sesión:', error)
  } finally {
    isLoggingOut.value = false
  }
}

// Estructura de dropdown mejorada
const dropdownItems = computed(() => [
  [{
    label: 'Perfil',
    icon: 'i-lucide-user',
    onSelect: () => {
      console.log('📝 Navegando a perfil')
      navigateTo('/profile')
    }
  }],
  [{
    label: 'Cerrar sesión',
    icon: 'i-lucide-log-out',
    onSelect: handleLogout
  }]
])

// Breadcrumbs dinámicos basados en la ruta
const route = useRoute()

const breadcrumbs = computed(() => {
  const pathSegments = route.path.split('/').filter(Boolean)
  const breadcrumbs = [{ name: 'Inicio', href: '/' }]
  
  let currentPath = ''
  pathSegments.forEach((segment) => {
    currentPath += `/${segment}`
    
    // Mapear segmentos a nombres legibles
    const nameMap: Record<string, string> = {
      'dashboard': 'Dashboard',
      'products': 'Productos',
      'inventory': 'Inventario',
      'reports': 'Reportes',
      'settings': 'Configuración',
      'auth': 'Autenticación',
      'create': 'Crear',
      'edit': 'Editar'
    }
    
    const name = nameMap[segment] || segment.charAt(0).toUpperCase() + segment.slice(1)
    breadcrumbs.push({ name, href: currentPath })
  })
  
  return breadcrumbs
})
</script>
