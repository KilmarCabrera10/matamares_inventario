<template>
  <div class="flex items-center justify-center min-h-[calc(100vh-200px)]">
    <div class="max-w-2xl w-full text-center p-8">
      <!-- Logo -->
      <div class="inline-flex items-center justify-center w-24 h-24 bg-primary-600 rounded-full mb-8">
        <Icon name="i-lucide-package" class="h-12 w-12 text-white" />
      </div>
      
      <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-6">
        ¡Bienvenido al Dashboard!
      </h1>
      
      <p class="text-lg text-gray-600 dark:text-gray-400 mb-8">
        Sistema de gestión de inventario moderno y eficiente
      </p>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-lg mx-auto">
        <UButton 
          to="/dashboard" 
          color="primary" 
          size="lg" 
          block
          icon="i-lucide-layout-dashboard"
        >
          Ver Dashboard
        </UButton>
        
        <UButton 
          to="/products" 
          color="neutral" 
          variant="outline" 
          size="lg" 
          block
          icon="i-lucide-package"
        >
          Ver Productos
        </UButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Usar el layout default que incluye el navbar
definePageMeta({
  middleware: 'auth'  // Proteger esta página también
})

// Redirigir directamente al dashboard si está autenticado
const { isAuthenticated } = useAuth()

if (isAuthenticated.value) {
  await navigateTo('/dashboard')
}
</script>