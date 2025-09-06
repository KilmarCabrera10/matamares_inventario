<template>
  <div class="space-y-6">
    <!-- Header de la página usando el componente PageHeader -->
    <PageHeader 
      :title="title"
      :subtitle="subtitle"
      :breadcrumbs="breadcrumbs"
    >
      <template v-if="$slots.actions" #actions>
        <slot name="actions" />
      </template>
      
      <template v-if="$slots.info" #info>
        <slot name="info" />
      </template>
    </PageHeader>

    <!-- Stats Cards (si se proporcionan) -->
    <div v-if="stats && stats.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <DashboardStatCard
        v-for="(stat, index) in stats"
        :key="index"
        v-bind="stat"
      />
    </div>

    <!-- Contenido principal de la página -->
    <div class="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
      <slot />
    </div>

    <!-- Contenido adicional (opcional) -->
    <div v-if="$slots.additional" class="space-y-6">
      <slot name="additional" />
    </div>
  </div>
</template>

<script setup lang="ts">
interface Breadcrumb {
  name: string
  href?: string
}

interface StatCard {
  title: string
  value: string | number
  change?: string
  changeType?: 'positive' | 'negative' | 'neutral'
  icon?: string
  color?: 'blue' | 'green' | 'red' | 'orange' | 'purple' | 'gray'
}

interface Props {
  title: string
  subtitle?: string
  breadcrumbs?: Breadcrumb[]
  stats?: StatCard[]
}

defineProps<Props>()
</script>
