<template>
  <header class="fixed top-0 z-40 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm pr-4 sm:pr-6 lg:pr-8 transition-all duration-300 ease-in-out" :class="headerClasses">
    <div class="flex h-16 items-center justify-between">
            <!-- Left side -->
      <div class="flex items-center">
        <!-- Breadcrumb -->
        <nav class="hidden sm:block pl-4">
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
        <div class="relative">
          <UPopover 
            :portal="false"
            :content="{
              align: 'end',
              side: 'bottom',
              sideOffset: 8,
              collisionPadding: 8
            }"
            :ui="{
              content: 'w-48 p-0 z-50'
            }"
          >
            <UButton 
              color="neutral" 
              variant="ghost"
              icon="i-lucide-user"
              class="p-1"
            />
            
            <template #content>
              <div class="py-1">
                <template v-for="(group, groupIndex) in dropdownItems" :key="groupIndex">
                  <template v-for="(item, itemIndex) in group" :key="itemIndex">
                    <button
                      class="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2"
                      @click="item.onSelect"
                    >
                      <Icon :name="item.icon" class="h-4 w-4" />
                      {{ item.label }}
                    </button>
                  </template>
                  <div v-if="groupIndex < dropdownItems.length - 1" class="border-t border-gray-200 dark:border-gray-600 my-1" />
                </template>
              </div>
            </template>
          </UPopover>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
interface Props {
  sidebarOpen?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  sidebarOpen: false
})

// Composable para configuración de dropdowns
// const { headerDropdownConfig } = useDropdown()

// Clases dinámicas para el header
const headerClasses = computed(() => {
  return [
    'left-0 right-0',
    // En desktop, ajustar según el estado del sidebar
    {
      'lg:left-64': props.sidebarOpen,
      'lg:left-16': !props.sidebarOpen
    }
  ]
})

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

// Estructura de dropdown para UDropdownMenu
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
