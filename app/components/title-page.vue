<template>
  <div class="text-center">
    <div class="flex justify-between items-center mb-4">
      <h1 class="text-2xl font-bold text-highlighted"><slot /></h1>
      <ColorModeToggle />
    </div>
    <p v-if="subtitle" class="text-muted">{{ subtitle }}</p>
  </div>
</template>

<script lang="ts" setup>

interface Props {
  subtitle?: string;
}

defineProps<Props>()
</script>