<script lang="ts" setup>
interface Props {
  product: Product
  variant?: 'summary' | 'detailed'
  showActions?: boolean
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'summary',
  showActions: true,
  loading: false
})

const emit = defineEmits<{
  'view-details': [product: Product]
  'add-to-cart': [product: Product]
}>()

// Formatear precio
const formattedPrice = computed(() => {
  if (typeof props.product?.price === 'number') {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(props.product.price)
  }
  return props.product?.price || '0'
})

const handleViewDetails = () => {
  if (props.product) {
    emit('view-details', props.product)
  }
}
</script>

<template>
  <!-- Loading State -->
  <article v-if="loading" class="neutral-card animate-pulse p-4 sm:p-6">
    <div class="space-y-4">
      <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
      <div class="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full" />
      <div class="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3" />
      <div class="flex justify-between items-center">
        <div class="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />
        <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/6" />
      </div>
      <div class="h-8 bg-gray-200 dark:bg-gray-700 rounded w-full" />
    </div>
  </article>

  <!-- Vista resumen para la lista general -->
  <article 
    v-else-if="variant === 'summary'" 
    class="neutral-card hover-lift group cursor-pointer transition-all duration-300"
    role="button"
    tabindex="0"
    :aria-label="`Ver detalles de ${product.name}`"
    @click="handleViewDetails"
    @keydown.enter="handleViewDetails"
    @keydown.space.prevent="handleViewDetails"
  >
    <div class="p-4 sm:p-6">
      <!-- Header con SKU -->
      <div class="flex justify-between items-start mb-3">
        <span class="text-xs font-mono text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
          {{ product.sku }}
        </span>
        <Icon 
          name="i-lucide-chevron-right" 
          class="h-4 w-4 text-gray-400 group-hover:text-cyan-500 group-hover:translate-x-1 transition-all duration-200" 
        />
      </div>

      <!-- Título del producto -->
      <h2 class="text-lg sm:text-xl font-semibold mb-3 text-gray-900 dark:text-white line-clamp-2 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors duration-200">
        {{ product.name }}
      </h2>

      <!-- Descripción -->
      <p v-if="product.description" class="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3">
        {{ product.description }}
      </p>

      <!-- Precio -->
      <div class="flex justify-between items-center">
        <div class="flex items-center space-x-2">
          <span class="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
            {{ formattedPrice }}
          </span>
        </div>
        
        <!-- Botón de acción (si está habilitado) -->
        <UButton
          v-if="showActions"
          size="sm"
          color="primary"
          variant="soft"
          icon="i-lucide-eye"
          @click.stop="handleViewDetails"
        >
          Ver
        </UButton>
      </div>
    </div>
  </article>

  <!-- Vista detallada para la página específica -->
  <article v-else-if="variant === 'detailed'" class="max-w-6xl mx-auto neutral-card overflow-hidden">
    <div class="lg:flex">
      <!-- Placeholder para imagen del producto -->
      <div class="lg:w-1/2 p-6 sm:p-8 bg-gray-50 dark:bg-gray-800/50 flex items-center justify-center min-h-[300px] sm:min-h-[400px]">
        <div class="text-center">
          <Icon name="i-lucide-package" class="h-16 w-16 sm:h-24 sm:w-24 text-gray-400 mx-auto mb-4" />
          <p class="text-gray-500 dark:text-gray-400 text-sm">
            Imagen del producto
          </p>
        </div>
      </div>
      
      <!-- Información del producto -->
      <div class="lg:w-1/2 p-6 sm:p-8">
        <div class="mb-6">
          <!-- SKU -->
          <span class="inline-flex items-center bg-cyan-50 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300 text-sm px-3 py-1 rounded-full mb-4">
            <Icon name="i-lucide-hash" class="w-4 h-4 mr-1" />
            {{ product.sku }}
          </span>
          
          <!-- Título -->
          <h1 class="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {{ product.name }}
          </h1>
        </div>
        
        <!-- Descripción -->
        <div v-if="product.description" class="mb-6">
          <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
            Descripción
          </h3>
          <p class="text-gray-700 dark:text-gray-300 text-base lg:text-lg leading-relaxed">
            {{ product.description }}
          </p>
        </div>
        
        <!-- Precio -->
        <div class="mb-8">
          <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
            Precio
          </h3>
          <span class="text-3xl sm:text-4xl lg:text-5xl font-bold text-cyan-600 dark:text-cyan-400">
            {{ formattedPrice }}
          </span>
        </div>
        
        <!-- Información adicional -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
          <div>
            <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">ID</dt>
            <dd class="text-gray-900 dark:text-white font-mono">{{ product.id }}</dd>
          </div>
          <div>
            <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Organización</dt>
            <dd class="text-gray-900 dark:text-white">#{{ product.organization_id }}</dd>
          </div>
          <div>
            <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Creado</dt>
            <dd class="text-gray-900 dark:text-white">{{ new Date(product.created_at).toLocaleDateString('es-ES') }}</dd>
          </div>
          <div>
            <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Actualizado</dt>
            <dd class="text-gray-900 dark:text-white">{{ new Date(product.updated_at).toLocaleDateString('es-ES') }}</dd>
          </div>
        </div>
        
        <!-- Acciones -->
        <div class="flex flex-col sm:flex-row gap-3">
          <UButton
            color="primary"
            size="lg"
            icon="i-lucide-shopping-cart"
            class="flex-1"
            @click="$emit('add-to-cart', product)"
          >
            Agregar al Inventario
          </UButton>
          <UButton
            color="neutral"
            variant="outline"
            size="lg"
            icon="i-lucide-edit"
            class="flex-1"
          >
            Editar Producto
          </UButton>
        </div>
      </div>
    </div>
  </article>
</template>