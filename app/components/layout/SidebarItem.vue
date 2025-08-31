<template>
  <div>
    <!-- Item principal -->
    <NuxtLink
      v-if="!item.children"
      :to="item.href"
      :class="[
        'group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors duration-200',
        isActive 
          ? 'bg-primary-100 text-primary-900 dark:bg-primary-900 dark:text-primary-100' 
          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white',
        collapsed ? 'justify-center' : ''
      ]"
    >
      <Icon 
        :name="item.icon" 
        :class="[
          'flex-shrink-0',
          collapsed ? 'h-5 w-5' : 'h-5 w-5',
          isActive 
            ? 'text-primary-600 dark:text-primary-400' 
            : 'text-gray-400 group-hover:text-gray-500 dark:group-hover:text-gray-300'
        ]" 
      />
      <span 
        v-if="!collapsed" 
        class="ml-3 transition-opacity duration-200"
      >
        {{ item.name }}
      </span>
      <UBadge
        v-if="!collapsed && item.badge"
        :label="item.badge.toString()"
        color="error"
        variant="solid"
        size="xs"
        class="ml-auto"
      />
    </NuxtLink>
    
    <!-- Item con submenú -->
    <div v-else>
      <button
        type="button"
        :class="[
          'group flex w-full items-center px-2 py-2 text-sm font-medium rounded-md transition-colors duration-200',
          hasActiveChild
            ? 'bg-primary-50 text-primary-900 dark:bg-primary-900/50 dark:text-primary-100'
            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white',
          collapsed ? 'justify-center' : ''
        ]"
        @click="toggleSubmenu"
      >
        <Icon 
          :name="item.icon" 
          :class="[
            'flex-shrink-0 h-5 w-5',
            hasActiveChild
              ? 'text-primary-600 dark:text-primary-400'
              : 'text-gray-400 group-hover:text-gray-500 dark:group-hover:text-gray-300'
          ]" 
        />
        <span 
          v-if="!collapsed" 
          class="ml-3 flex-1 text-left transition-opacity duration-200"
        >
          {{ item.name }}
        </span>
        <Icon
          v-if="!collapsed"
          name="i-lucide-chevron-down"
          :class="[
            'ml-auto h-4 w-4 transition-transform duration-200',
            submenuOpen ? 'rotate-180' : '',
            hasActiveChild
              ? 'text-primary-600 dark:text-primary-400'
              : 'text-gray-400'
          ]"
        />
      </button>
      
      <!-- Submenú -->
      <Transition
        enter-active-class="transition-all duration-200 ease-out"
        enter-from-class="opacity-0 max-h-0"
        enter-to-class="opacity-100 max-h-96"
        leave-active-class="transition-all duration-200 ease-in"
        leave-from-class="opacity-100 max-h-96"
        leave-to-class="opacity-0 max-h-0"
      >
        <div 
          v-if="submenuOpen && !collapsed" 
          class="ml-6 mt-1 space-y-1 overflow-hidden"
        >
          <NuxtLink
            v-for="child in item.children"
            :key="child.name"
            :to="child.href"
            :class="[
              'group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors duration-200',
              $route.path === child.href
                ? 'bg-primary-100 text-primary-900 dark:bg-primary-900 dark:text-primary-100'
                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'
            ]"
          >
            <Icon 
              :name="child.icon" 
              :class="[
                'flex-shrink-0 h-4 w-4',
                $route.path === child.href
                  ? 'text-primary-600 dark:text-primary-400'
                  : 'text-gray-400 group-hover:text-gray-500 dark:group-hover:text-gray-300'
              ]" 
            />
            <span class="ml-3">{{ child.name }}</span>
            <UBadge
              v-if="child.badge"
              :label="child.badge.toString()"
              color="error"
              variant="solid"
              size="xs"
              class="ml-auto"
            />
          </NuxtLink>
        </div>
      </Transition>
    </div>
  </div>
</template>

<script setup lang="ts">
interface NavigationItem {
  name: string
  href: string
  icon: string
  badge?: string | number
  children?: NavigationItem[]
}

interface Props {
  item: NavigationItem
  collapsed: boolean
  forceOpenSubmenu?: boolean
}

const props = defineProps<Props>()
const route = useRoute()

// Estado del submenú
const submenuOpen = ref(false)

// Verificar si el item actual está activo
const isActive = computed(() => {
  if (props.item.children) {
    return false
  }
  return route.path === props.item.href
})

// Verificar si algún hijo está activo
const hasActiveChild = computed(() => {
  if (!props.item.children) return false
  return props.item.children.some(child => route.path === child.href)
})

// Abrir submenú automáticamente si tiene un hijo activo o si se fuerza la apertura
watch([hasActiveChild, () => props.forceOpenSubmenu], ([hasActive, forceOpen]) => {
  if (hasActive || forceOpen) {
    submenuOpen.value = true
  }
}, { immediate: true })

// Cerrar submenú cuando el sidebar se colapsa
watch(() => props.collapsed, (collapsed) => {
  if (collapsed) {
    submenuOpen.value = false
  }
})

// Toggle submenú
const emit = defineEmits<{
  expandSidebar: [itemName: string]
}>()

const toggleSubmenu = () => {
  if (props.collapsed) {
    // Si está colapsado y tiene hijos, expandir el sidebar y pasar el nombre del item
    if (props.item.children) {
      emit('expandSidebar', props.item.name)
      return
    }
  } else {
    submenuOpen.value = !submenuOpen.value
  }
}
</script>
