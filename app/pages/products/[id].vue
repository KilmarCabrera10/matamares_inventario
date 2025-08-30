<script lang="ts" setup>
const route = useRoute()
const { data: product, error } = await useFetch<Product>(`https://fakestoreapi.com/products/${route.params.id}`)
</script>
<template>
  <div class="py-8">
    <div class="container mx-auto px-4">
      <TitlePage title="Product Details" subtitle="Detailed view of the product" />
      
      <div v-if="error" class="text-center py-8">
        <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          Error loading product
        </div>
      </div>
      
      <div v-if="product" class="mt-8">
        <!-- Breadcrumb navigation -->
        <nav class="mb-8">
          <NuxtLink to="/products" class="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors">
            <UIcon name="i-heroicons-arrow-left" class="w-4 h-4 mr-2" />
            Back to Products
          </NuxtLink>
        </nav>
        
        <!-- Product detailed view -->
        <CardProduct 
          :product="product" 
          variant="detailed"
        />
      </div>
    </div>
  </div>
</template>