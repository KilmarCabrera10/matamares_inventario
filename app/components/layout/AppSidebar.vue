<template>
  <div>
    <!-- Overlay para mobile -->
    <div 
      v-if="open && isMobile" 
      class="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
      @click="$emit('update:open', false)"
    />
    
    <!-- Sidebar -->
    <div 
      :class="[
        'fixed inset-y-0 left-0 z-45 flex flex-col transition-all duration-300 ease-in-out',
        'bg-white dark:bg-gray-800',
        open ? 'w-64' : 'w-16',
        isMobile && !open ? '-translate-x-full' : 'translate-x-0'
      ]"
    >
      <!-- Logo/Brand -->
      <div 
        :class="[
          'flex items-center px-4 py-4 cursor-pointer group transition-all duration-200',
          open ? 'justify-between' : 'justify-center'
        ]"
        @mouseenter="handleMouseEnter"
        @mouseleave="isHoveringLogo = false"
        @click="emit('update:open', !open)"
      >
        <div class="flex items-center">
          <!-- Ícono que cambia en hover solo cuando está contraído -->
          <div class="relative">
            <Icon 
              name="i-lucide-package" 
              :class="[
                'text-primary-600 dark:text-primary-400 flex-shrink-0 transition-all duration-200',
                open ? 'h-8 w-8' : 'h-7 w-7',
                !open && isHoveringLogo ? 'opacity-0 scale-90' : 'opacity-100 scale-100'
              ]" 
            />
            <Icon 
              v-if="!open"
              name="i-lucide-menu" 
              :class="[
                'text-primary-600 dark:text-primary-400 flex-shrink-0 transition-all duration-200 absolute top-0 left-0',
                'h-7 w-7',
                isHoveringLogo ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
              ]" 
            />
          </div>
          <span 
            v-if="open" 
            class="ml-3 text-xl font-bold text-gray-900 dark:text-white transition-all duration-200"
          >
            Inventario
          </span>
        </div>
        
        <!-- Ícono de hamburguesa pequeño al final cuando está expandido -->
        <div v-if="open" class="flex items-center">
          <Icon 
            name="i-lucide-menu" 
            class="h-4 w-4 text-primary-600 dark:text-primary-400 group-hover:text-primary-700 dark:group-hover:text-primary-300 transition-colors duration-200" 
          />
        </div>
      </div>
      
      <!-- Navigation -->
      <nav class="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
        <SidebarItem
          v-for="item in navigationItems"
          :key="item.name"
          :item="item"
          :collapsed="!open"
          :force-open-submenu="expandedItemName === item.name"
          @expand-sidebar="handleExpandSidebar"
        />
      </nav>
      
      <!-- User Section -->
      <div 
        :class="[
          open ? 'border-t border-gray-200 dark:border-gray-700 p-4' : 'p-2 flex justify-center'
        ]"
      >
        <SidebarUserMenu :collapsed="!open" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Imports explícitos
import SidebarItem from '~/components/layout/SidebarItem.vue'
import SidebarUserMenu from '~/components/layout/SidebarUserMenu.vue'

interface NavigationItem {
  name: string
  href: string
  icon: string
  badge?: string | number
  children?: NavigationItem[]
}

interface Props {
  open: boolean
}

const _props = defineProps<Props>()
const emit = defineEmits<{
  'update:open': [value: boolean]
}>()

// Función para expandir el sidebar cuando se hace clic en un item con hijos mientras está colapsado
const expandedItemName = ref<string | null>(null)

// Estado para el hover del logo
const isHoveringLogo = ref(false)

const handleMouseEnter = () => {
  // Solo cambiar el ícono si está contraído
  if (!_props.open) {
    isHoveringLogo.value = true
  }
}

const handleExpandSidebar = (itemName: string) => {
  emit('update:open', true)
  // Marcar el item que se debe abrir automáticamente después de la expansión
  expandedItemName.value = itemName
  
  // Limpiar la marca después de un breve delay para permitir que se abra
  nextTick(() => {
    setTimeout(() => {
      expandedItemName.value = null
    }, 100)
  })
}

// Detectar si estamos en mobile
const isMobile = ref(false)

onMounted(() => {
  const checkMobile = () => {
    isMobile.value = window.innerWidth < 1024
  }
  
  checkMobile()
  window.addEventListener('resize', checkMobile)
  
  onUnmounted(() => {
    window.removeEventListener('resize', checkMobile)
  })
})

// Items de navegación
const navigationItems: NavigationItem[] = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: 'i-lucide-layout-dashboard'
  },
  {
    name: 'Productos',
    href: '/products',
    icon: 'i-lucide-package',
    children: [
      { name: 'Lista', href: '/products', icon: 'i-lucide-list' },
      { name: 'Agregar', href: '/products/create', icon: 'i-lucide-plus' },
      { name: 'Categorías', href: '/products/categories', icon: 'i-lucide-folder' }
    ]
  },
  {
    name: 'Inventario',
    href: '/inventory',
    icon: 'i-lucide-warehouse',
    children: [
      { name: 'Stock', href: '/inventory', icon: 'i-lucide-boxes' },
      { name: 'Movimientos', href: '/inventory/movements', icon: 'i-lucide-arrow-right-left' },
      { name: 'Alertas', href: '/inventory/alerts', icon: 'i-lucide-alert-triangle', badge: '3' }
    ]
  },
  {
    name: 'Reportes',
    href: '/reports',
    icon: 'i-lucide-bar-chart-3'
  },
  {
    name: 'Configuración',
    href: '/settings',
    icon: 'i-lucide-settings'
  }
]
</script>
