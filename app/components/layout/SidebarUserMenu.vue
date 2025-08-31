<template>
  <div>
    <!-- Versión expandida -->
    <div v-if="!collapsed" class="w-full">
      <UDropdownMenu :items="dropdownItems">
        <template #default="{ open }">
          <button 
            type="button"
            class="flex items-center w-full p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <UAvatar
              src="/api/placeholder/32/32"
              alt="Usuario"
              size="sm"
            />
            <div class="ml-3 flex-1 min-w-0 text-left">
              <p class="text-sm font-medium text-gray-900 dark:text-white truncate">
                {{ user?.name || 'Admin User' }}
              </p>
              <p class="text-xs text-gray-500 dark:text-gray-400 truncate">
                {{ user?.email || 'admin@inventario.com' }}
              </p>
            </div>
            <Icon 
              name="i-lucide-chevron-up" 
              :class="[
                'h-4 w-4 text-gray-400 transition-transform duration-200',
                open ? 'rotate-180' : ''
              ]"
            />
          </button>
        </template>
      </UDropdownMenu>
    </div>
    
    <!-- Versión colapsada -->
    <div v-else class="flex justify-center">
      <UDropdownMenu :items="dropdownItems">
        <template #default>
          <button 
            type="button"
            class="p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
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
</template>

<script setup lang="ts">
interface Props {
  collapsed: boolean
}

defineProps<Props>()

const { logout, user } = useAuth()

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
    label: 'Cerrar sesión',
    icon: 'i-lucide-log-out',
    onSelect: handleLogout
  }]
])
</script>
