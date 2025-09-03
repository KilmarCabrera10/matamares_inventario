<template>
  <div class="min-h-screen main-background">
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
      <AppTopBar :sidebar-open="sidebarOpen" />
      
      <!-- Page Content -->
      <main class="ml-2 mt-2 me-3 pt-16" data-main-content>
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-6">
          <slot />
        </div>
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
