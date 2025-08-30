<script lang="ts" setup>
import { NuxtLink, UButton, UIcon } from '#components';

interface Props {
  product: Product
  variant?: 'summary' | 'detailed'
  showActions?: boolean
}

withDefaults(defineProps<Props>(), {
  variant: 'summary',
  showActions: true
})
</script>
<template>
  <!-- Vista resumen para la lista general -->
  <article v-if="variant === 'summary'" class="border rounded-lg p-4 shadow hover:shadow-lg transition-shadow bg-white">
    <h2 class="text-lg font-semibold mb-2 text-gray-900 min-h-[3.5rem] overflow-hidden">{{ product.title }}</h2>
    <p class="text-gray-600 mb-3 text-sm min-h-[4.5rem] overflow-hidden">{{ product.description }}</p>
    <div class="flex justify-between items-center mb-3">
      <p class="text-blue-600 font-bold text-xl flex items-center">
        <UIcon name="i-heroicons-currency-dollar" class="w-5 h-5 mr-1" />
        {{ product.price }}
      </p>
      <span class="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full flex items-center">
        <UIcon name="i-heroicons-tag" class="w-3 h-3 mr-1" />
        {{ product.category }}
      </span>
    </div>
    <NuxtLink v-if="showActions" :to="`/products/${product.id}`" class="block">
      <UButton class="w-full" variant="outline" icon="i-heroicons-eye">View Details</UButton>
    </NuxtLink>
  </article>

  <!-- Vista detallada para la página específica -->
  <article v-else-if="variant === 'detailed'" class="max-w-6xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
    <div class="lg:flex">
      <!-- Imagen del producto -->
      <div class="lg:w-1/2 p-8 bg-gray-50 flex items-center justify-center min-h-[400px]">
        <img 
          :src="product.image" 
          :alt="product.title" 
          class="max-w-full max-h-96 object-contain"
        >
      </div>
      
      <!-- Información del producto -->
      <div class="lg:w-1/2 p-8">
        <div class="mb-6">
          <span class="inline-flex items-center bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full mb-4">
            <UIcon name="i-heroicons-tag" class="w-4 h-4 mr-1" />
            {{ product.category }}
          </span>
          <h1 class="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">{{ product.title }}</h1>
        </div>
        
        <p class="text-gray-700 text-base lg:text-lg leading-relaxed mb-6">{{ product.description }}</p>
        
        <!-- Precio -->
        <div class="mb-6">
          <span class="text-3xl lg:text-4xl font-bold text-green-600 flex items-center">
            <UIcon name="i-heroicons-currency-dollar" class="w-8 h-8 mr-1" />
            {{ product.price }}
          </span>
        </div>
        
        <!-- Rating -->
        <div class="flex items-center mb-8 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
          <div class="flex items-center">
            <div class="flex mr-2">
              <template v-for="star in 5" :key="star">
                <UIcon 
                  :name="star <= Math.round(product.rating.rate) ? 'i-heroicons-star-solid' : 'i-heroicons-star'" 
                  :class="star <= Math.round(product.rating.rate) ? 'text-yellow-400' : 'text-gray-300'"
                  class="w-5 h-5"
                />
              </template>
            </div>
            <span class="text-gray-700 font-medium">{{ product.rating.rate }}/5</span>
            <span class="ml-2 text-gray-500">({{ product.rating.count }} reviews)</span>
          </div>
        </div>
        
        <!-- Acciones -->
        <div v-if="showActions" class="space-y-3">
          <UButton size="lg" class="w-full" color="primary" icon="i-heroicons-shopping-cart">
            Add to Cart
          </UButton>
          <UButton size="lg" variant="outline" class="w-full" icon="i-heroicons-heart">
            Add to Wishlist
          </UButton>
        </div>
      </div>
    </div>
  </article>
</template>
