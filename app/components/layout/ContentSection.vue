<template>
  <div class="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
    <!-- Header de la sección -->
    <div v-if="title || $slots.actions" class="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
      <div class="flex items-center justify-between">
        <div v-if="title">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
            {{ title }}
          </h3>
          <p v-if="description" class="mt-1 text-sm text-gray-600 dark:text-gray-400">
            {{ description }}
          </p>
        </div>
        
        <div v-if="$slots.actions" class="flex items-center space-x-3">
          <slot name="actions" />
        </div>
      </div>
    </div>

    <!-- Filtros -->
    <div v-if="$slots.filters" class="px-6 py-4 bg-gray-50 dark:bg-gray-800/30 border-b border-gray-200 dark:border-gray-700">
      <slot name="filters" />
    </div>

    <!-- Contenido principal -->
    <div class="p-6">
      <slot />
    </div>

    <!-- Footer de la sección -->
    <div v-if="$slots.footer" class="px-6 py-4 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700">
      <slot name="footer" />
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title?: string
  description?: string
}

defineProps<Props>()
</script>
