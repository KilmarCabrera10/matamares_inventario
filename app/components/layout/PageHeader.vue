<template>
  <div class="mb-8 border-b border-gray-200 dark:border-gray-700 pb-6">
    <!-- Breadcrumb -->
    <nav v-if="breadcrumbs && breadcrumbs.length > 0" class="flex mb-4" aria-label="Breadcrumb">
      <ol class="inline-flex items-center space-x-1 md:space-x-3">
        <li v-for="(crumb, index) in breadcrumbs" :key="index" class="inline-flex items-center">
          <template v-if="index === 0">
            <Icon name="lucide:home" class="w-4 h-4 text-gray-400" />
          </template>
          <template v-else>
            <Icon name="lucide:chevron-right" class="w-4 h-4 text-gray-400 mx-2" />
          </template>
          
          <NuxtLink 
            v-if="crumb.href && index < breadcrumbs.length - 1"
            :to="crumb.href"
            class="ml-1 text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-400 dark:hover:text-white transition-colors"
          >
            {{ crumb.name }}
          </NuxtLink>
          <span 
            v-else
            class="ml-1 text-sm font-medium text-gray-500 dark:text-gray-400"
          >
            {{ crumb.name }}
          </span>
        </li>
      </ol>
    </nav>

    <!-- Header principal -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
      <div class="flex-1 min-w-0">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
          {{ title }}
        </h1>
        <p v-if="subtitle" class="mt-2 text-gray-600 dark:text-gray-400">
          {{ subtitle }}
        </p>
      </div>
      
      <!-- Acciones del header -->
      <div v-if="$slots.actions" class="mt-4 sm:mt-0 sm:ml-4 flex-shrink-0">
        <slot name="actions" />
      </div>
    </div>

    <!-- Información adicional -->
    <div v-if="$slots.info" class="mt-6">
      <slot name="info" />
    </div>
  </div>
</template>

<script setup lang="ts">
interface Breadcrumb {
  name: string
  href?: string
}

interface Props {
  title: string
  subtitle?: string
  breadcrumbs?: Breadcrumb[]
}

defineProps<Props>()
</script>
