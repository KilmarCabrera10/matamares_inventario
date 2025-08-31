<template>
  <div class="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
    <div class="w-full max-w-md">
      <!-- Logo/Brand -->
      <div class="text-center mb-8">
        <div class="inline-flex items-center justify-center w-16 h-16 bg-primary-600 rounded-full mb-4">
          <Icon 
            name="lucide:package" 
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
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6">
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
