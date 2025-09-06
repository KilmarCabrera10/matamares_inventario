<template>
  <PageContainer
    title="Dashboard"
    subtitle="Resumen general del inventario"
    :breadcrumbs="[
      { name: 'Inicio', href: '/' },
      { name: 'Dashboard' }
    ]"
    :stats="dashboardStats"
  >
    <!-- Charts y Tables -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      <!-- Chart de Inventario -->
      <UCard class="dashboard-section-chart neutral-card">
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              Movimientos del Inventario
            </h3>
            <UDropdown :items="chartPeriodItems">
              <UButton color="neutral" variant="ghost" trailing-icon="lucide:chevron-down">
                {{ selectedPeriod }}
              </UButton>
            </UDropdown>
          </div>
        </template>
        
        <div class="h-64 flex items-center justify-center bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div class="text-center">
            <Icon name="lucide:bar-chart-3" class="h-12 w-12 text-gray-400 mx-auto mb-2" />
            <p class="text-gray-500 dark:text-gray-400">
              Gráfico próximamente
            </p>
          </div>
        </div>
      </UCard>

      <!-- Productos con stock bajo -->
      <UCard class="dashboard-section-products neutral-card">
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              Productos con Stock Bajo
            </h3>
            <UButton to="/inventory/alerts" color="primary" variant="ghost" size="sm">
              Ver todos
            </UButton>
          </div>
        </template>
        
        <div class="space-y-3">
          <div 
            v-for="product in lowStockProducts" 
            :key="product.id"
            class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
          >
            <div class="flex items-center space-x-3">
              <div class="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                <Icon name="lucide:package" class="h-5 w-5 text-gray-500" />
              </div>
              <div>
                <p class="font-medium text-gray-900 dark:text-white">
                  {{ product.name }}
                </p>
                <p class="text-sm text-gray-500 dark:text-gray-400">
                  SKU: {{ product.sku }}
                </p>
              </div>
            </div>
            <div class="text-right">
              <p class="text-sm font-medium text-red-600 dark:text-red-400">
                {{ product.stock }} unidades
              </p>
              <p class="text-xs text-gray-500">
                Mín: {{ product.min_stock }}
              </p>
            </div>
          </div>
        </div>
      </UCard>
    </div>

    <!-- Actividad Reciente -->
    <UCard class="dashboard-section-activity neutral-card">
      <template #header>
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
          Actividad Reciente
        </h3>
      </template>
      
      <div class="space-y-4">
        <div 
          v-for="activity in recentActivity" 
          :key="activity.id"
          class="activity-item flex items-center space-x-4"
        >
          <div 
            :class="[
              'w-8 h-8 rounded-full flex items-center justify-center',
              activity.type === 'entrada' ? 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400' : 
              activity.type === 'salida' ? 'bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-400' :
              'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400'
            ]"
          >
            <Icon 
              :name="activity.type === 'entrada' ? 'lucide:arrow-down' : 
                     activity.type === 'salida' ? 'lucide:arrow-up' : 
                     'lucide:edit'" 
              class="h-4 w-4" 
            />
          </div>
          <div class="flex-1">
            <p class="text-sm font-medium text-gray-900 dark:text-white">
              {{ activity.description }}
            </p>
            <p class="text-xs text-gray-500 dark:text-gray-400">
              {{ activity.time }}
            </p>
          </div>
          <div class="text-sm text-gray-500 dark:text-gray-400">
            {{ activity.user }}
          </div>
        </div>
      </div>
    </UCard>
  </PageContainer>
</template>

<script setup lang="ts">
// Datos de ejemplo (después conectarás con tu API)
const selectedPeriod = ref('Última semana')

// Stats para el dashboard
const dashboardStats = ref([
  {
    title: "Total Productos",
    value: "1,234",
    change: "+12%",
    changeType: "positive" as const,
    icon: "lucide:package",
    color: "blue" as const
  },
  {
    title: "Stock Bajo",
    value: "23",
    change: "-5%",
    changeType: "negative" as const,
    icon: "lucide:alert-triangle",
    color: "orange" as const
  },
  {
    title: "Valor Inventario",
    value: "$45,678",
    change: "+8%",
    changeType: "positive" as const,
    icon: "lucide:dollar-sign",
    color: "green" as const
  },
  {
    title: "Movimientos Hoy",
    value: "89",
    change: "+15%",
    changeType: "positive" as const,
    icon: "lucide:arrow-right-left",
    color: "purple" as const
  }
])

const chartPeriodItems = [
  [{ label: 'Última semana', click: () => selectedPeriod.value = 'Última semana' }],
  [{ label: 'Último mes', click: () => selectedPeriod.value = 'Último mes' }],
  [{ label: 'Últimos 3 meses', click: () => selectedPeriod.value = 'Últimos 3 meses' }]
]

const lowStockProducts = ref([
  { id: 1, name: 'Producto A', sku: 'SKU001', stock: 5, min_stock: 10 },
  { id: 2, name: 'Producto B', sku: 'SKU002', stock: 2, min_stock: 15 },
  { id: 3, name: 'Producto C', sku: 'SKU003', stock: 8, min_stock: 20 }
])

const recentActivity = ref([
  {
    id: 1,
    type: 'entrada',
    description: 'Entrada de 50 unidades - Producto XYZ',
    time: 'Hace 2 horas',
    user: 'Juan Pérez'
  },
  {
    id: 2,
    type: 'salida',
    description: 'Salida de 25 unidades - Producto ABC',
    time: 'Hace 4 horas',
    user: 'María García'
  },
  {
    id: 3,
    type: 'edicion',
    description: 'Actualización de precio - Producto DEF',
    time: 'Hace 6 horas',
    user: 'Carlos López'
  }
])

// Meta de la página
definePageMeta({
  middleware: 'auth'
})
</script>
