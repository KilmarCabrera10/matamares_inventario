<script lang="ts" setup>
const {data: products, pending, error} = await useFetch<Product[]>('https://fakestoreapi.com/products')
</script>
<template>
  <div class="py-8">
    <div class="container mx-auto px-4">
      <TitlePage title="Products" subtitle="Browse our collection of products" />
      
      <div v-if="pending" class="text-center py-12">
        <div class="animate-pulse">Loading...</div>
      </div>
      
      <div v-if="error" class="text-center py-8">
        <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          Error loading products
        </div>
      </div>
      
      <div v-if="products" class="mt-8">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <CardProduct 
            v-for="product in products" 
            :key="product.id" 
            :product="product" 
            variant="summary"
          />
        </div>
      </div>
    </div>
  </div>
</template>