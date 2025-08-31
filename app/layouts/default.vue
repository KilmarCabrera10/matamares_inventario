<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Sidebar -->
    <AppSidebar v-model:open="sidebarOpen" />
    
    <!-- Main Content -->
    <div 
      :class="[
        'transition-all duration-300 ease-in-out',
        sidebarOpen ? 'lg:ml-64' : 'lg:ml-16'
      ]"
    >
      <!-- Top Bar -->
      <AppTopBar @toggle-sidebar="sidebarOpen = !sidebarOpen" />
      
      <!-- Page Content -->
      <main class="p-4 sm:p-6 lg:p-8">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
// Imports explícitos de los componentes
import AppSidebar from '~/components/layout/AppSidebar.vue'
import AppTopBar from '~/components/layout/AppTopBar.vue'

// State para controlar el sidebar - siempre colapsado al cargar la página
const sidebarOpen = ref(false)

// Colapsar automáticamente cuando se navega a una nueva página
const route = useRoute()
watch(() => route.path, () => {
  // Colapsar el sidebar cuando cambie la ruta
  sidebarOpen.value = false
})

// Responsive: cerrar sidebar en mobile por defecto
onMounted(() => {
  const handleResize = () => {
    if (window.innerWidth < 1024) {
      sidebarOpen.value = false
    }
  }
  
  handleResize()
  window.addEventListener('resize', handleResize)
  
  onUnmounted(() => {
    window.removeEventListener('resize', handleResize)
  })
})
</script>
