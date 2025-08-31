<template>
  <div class="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
    <div class="max-w-md w-full text-center p-8">
      <!-- Logo -->
      <div class="inline-flex items-center justify-center w-20 h-20 bg-primary-600 rounded-full mb-6">
        <Icon name="i-lucide-package" class="h-10 w-10 text-white" />
      </div>
      
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-4">
        Inventario Matamares
      </h1>
      
      <p class="text-gray-600 dark:text-gray-400 mb-8">
        Sistema de gestión de inventario moderno y eficiente
      </p>
      
      <div class="space-y-4">
        <UButton 
          to="/auth/login" 
          color="primary" 
          size="lg" 
          class="w-full"
          icon="lucide:log-in"
        >
          Iniciar Sesión
        </UButton>
        
        <UButton 
          to="/auth/register" 
          color="neutral" 
          variant="outline" 
          size="lg" 
          class="w-full"
          icon="lucide:user-plus"
        >
          Crear Cuenta
        </UButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: false  // Sin navbar para la página de bienvenida
})

// Si ya está autenticado, redirigir al dashboard
const { isAuthenticated } = useAuth()

if (isAuthenticated.value) {
  await navigateTo('/dashboard')
}
</script>
