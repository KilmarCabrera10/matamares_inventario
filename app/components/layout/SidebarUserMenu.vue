<template>
  <div>
    <!-- Versión expandida -->
    <div v-if="!collapsed" class="w-full relative">
      <UPopover 
        :portal="false"
        :content="{
          align: 'start',
          side: 'top',
          sideOffset: 8,
          collisionPadding: 8
        }"
        :ui="{
          content: 'w-48 p-0 z-50'
        }"
      >
        <template #default="{ open }">
          <div 
            class="flex items-center w-full p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors duration-200"
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
          </div>
        </template>
        
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
            </template>
          </div>
        </template>
      </UPopover>
    </div>
    
    <!-- Versión colapsada -->
    <div v-else class="flex justify-center relative">
      <UPopover 
        :portal="false"
        :content="{
          align: 'start',
          side: 'right',
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
          class="p-2"
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
            </template>
          </div>
        </template>
      </UPopover>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  collapsed: boolean
}

defineProps<Props>()

const { logout, user } = useAuth()
// const { sidebarExpandedDropdownConfig, sidebarCollapsedDropdownConfig } = useDropdown()

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
    label: 'Cerrar sesión',
    icon: 'i-lucide-log-out',
    onSelect: handleLogout
  }]
])
</script>
