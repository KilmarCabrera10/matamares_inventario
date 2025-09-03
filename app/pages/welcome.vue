<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4 w-full">
    <div class="max-w-lg w-full text-center">
      <!-- Card principal -->
      <div class="neutral-card p-8 sm:p-12">
        <!-- Logo con gradiente cyan -->
        <div class="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-xl mb-8 shadow-xl shadow-cyan-500/25">
          <Icon name="i-lucide-package" class="h-10 w-10 text-white" />
        </div>
        
        <h1 class="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Inventario Matamares
        </h1>
        
        <p class="text-gray-600 dark:text-gray-400 mb-8 text-lg leading-relaxed">
          Sistema de gestión de inventario moderno y eficiente para tu negocio
        </p>
        <!-- Botones de acción -->
        <div class="space-y-4">
          <UButton 
            to="/auth/login" 
            size="lg" 
            class="w-full bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-200 shadow-lg shadow-cyan-500/20"
            icon="i-lucide-log-in"
          >
            Iniciar Sesión
          </UButton>
          
          <UButton 
            to="/auth/register" 
            color="neutral" 
            variant="outline" 
            size="lg" 
            class="w-full border-gray-300 dark:border-gray-600 hover:border-cyan-500 dark:hover:border-cyan-500 hover:text-cyan-600 dark:hover:text-cyan-400 transition-all duration-200"
            icon="i-lucide-user-plus"
          >
            Crear Cuenta Nueva
          </UButton>
        </div>
        
        <!-- Información adicional -->
        <div class="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
          <p class="text-xs text-gray-500 dark:text-gray-400">
            © 2025 Matamares Inventario. Sistema seguro y confiable.
          </p>
        </div>
      </div>
      
      <!-- Elemento decorativo -->
      <div class="mt-8 flex justify-center space-x-2">
        <div class="w-2 h-2 bg-cyan-300 rounded-full animate-pulse"></div>
        <div class="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" style="animation-delay: 0.2s"></div>
        <div class="w-2 h-2 bg-cyan-500 rounded-full animate-pulse" style="animation-delay: 0.4s"></div>
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
