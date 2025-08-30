<template>
  <div class="text-center">
    <h1 class="text-2xl font-bold">{{ title }}</h1>
    <h2 class="text-gray-600">{{ subtitle }}</h2>
  </div>
</template>

<script lang="ts" setup>

interface Props {
  title: string;
  subtitle: string;
}

defineProps<Props>()
</script>

<style>

</style>