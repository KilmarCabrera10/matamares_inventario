<script lang="ts" setup>
const {data: products, pending, error} = await useFetch<Product[]>('https://fakestoreapi.com/products')
</script>

<template>
  <PageContainer
    title="Productos"
    subtitle="Explora nuestra colección de productos"
    :breadcrumbs="[
      { name: 'Inicio', href: '/' },
      { name: 'Productos' }
    ]"
  >
    <template #actions>
      <button class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2">
        <Icon name="lucide:plus" class="w-4 h-4" />
        <span>Nuevo Producto</span>
      </button>
    </template>

    <ContentSection title="Lista de Productos" description="Gestiona tu inventario de productos">
      <template #filters>
        <div class="flex flex-wrap items-center gap-4">
          <div class="flex-1 min-w-64">
            <input 
              type="text" 
              placeholder="Buscar productos..." 
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            >
          </div>
          <select class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white">
            <option>Todas las categorías</option>
            <option>Electrónicos</option>
            <option>Ropa</option>
          </select>
        </div>
      </template>

      <div v-if="pending" class="text-center py-12">
        <div class="animate-pulse flex items-center justify-center">
          <Icon name="lucide:loader-2" class="w-6 h-6 animate-spin text-blue-600 mr-2" />
          <span>Cargando productos...</span>
        </div>
      </div>
      
      <div v-if="error" class="text-center py-8">
        <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
          <Icon name="lucide:alert-circle" class="w-5 h-5 inline mr-2" />
          Error al cargar productos
        </div>
      </div>
      
      <div v-if="products" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <CardProduct 
          v-for="product in products" 
          :key="product.id" 
          :product="product" 
          variant="summary"
        />
      </div>

      <template #footer>
        <div class="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
          <span>Mostrando {{ products?.length || 0 }} productos</span>
          <div class="flex items-center space-x-2">
            <button class="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              Anterior
            </button>
            <span class="px-3 py-1">1 de 5</span>
            <button class="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              Siguiente
            </button>
          </div>
        </div>
      </template>
    </ContentSection>
  </PageContainer>
</template>