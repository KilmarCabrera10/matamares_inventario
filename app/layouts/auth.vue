<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
    <div class="w-full max-w-md">
      <!-- Logo/Brand -->
      <div class="text-center mb-8">
        <div class="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-xl mb-4 shadow-lg shadow-cyan-500/20">
          <Icon 
            name="i-lucide-package" 
            class="h-8 w-8 text-white" 
          />
        </div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
          Inventario Matamares
        </h1>
        <p class="text-gray-600 dark:text-gray-400 mt-2">
          Sistema de gestión de inventario
        </p>
      </div>
      
      <!-- Content -->
      <div class="neutral-card p-6 sm:p-8">
        <slot />
      </div>
      
      <!-- Footer -->
      <div class="text-center mt-6 text-sm text-gray-500 dark:text-gray-400">
        © 2025 Matamares Inventario. Todos los derechos reservados.
      </div>
    </div>
  </div>
</template>

<script setup>
// Layout específico para páginas de autenticación
</script>
