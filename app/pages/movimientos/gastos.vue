<template>
  <PageContainer
    title="Gastos"
    subtitle="Registro y control de gastos operativos"
    :breadcrumbs="[
      { name: 'Inicio', href: '/' },
      { name: 'Movimientos', href: '/movimientos' },
      { name: 'Gastos' }
    ]"
    :stats="gastosStats"
  >
    <template #actions>
      <div class="flex space-x-3">
        <button class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2">
          <Icon name="lucide:plus" class="w-4 h-4" />
          <span>Nuevo Gasto</span>
        </button>
        <button class="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2">
          <Icon name="lucide:download" class="w-4 h-4" />
          <span>Exportar</span>
        </button>
      </div>
    </template>

    <ContentSection title="Lista de Gastos" description="Gastos registrados en el período actual">
      <template #filters>
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Desde</label>
            <input 
              type="date" 
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            >
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Hasta</label>
            <input 
              type="date" 
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            >
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Categoría</label>
            <select class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white">
              <option>Todas las categorías</option>
              <option>Operativos</option>
              <option>Mantenimiento</option>
              <option>Servicios</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Buscar</label>
            <input 
              type="text" 
              placeholder="Buscar por descripción..." 
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            >
          </div>
        </div>
      </template>

      <!-- Tabla de gastos -->
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Fecha
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Descripción
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Categoría
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Monto
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Usuario
              </th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            <tr v-for="gasto in gastos" :key="gasto.id" class="hover:bg-gray-50 dark:hover:bg-gray-700">
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                {{ formatDate(gasto.fecha) }}
              </td>
              <td class="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">
                {{ gasto.descripcion }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm">
                <span 
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                  :class="getCategoryColor(gasto.categoria)"
                >
                  {{ gasto.categoria }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-red-600 dark:text-red-400">
                -${{ formatMoney(gasto.monto) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                {{ gasto.usuario }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div class="flex items-center justify-end space-x-2">
                  <button class="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300">
                    <Icon name="lucide:edit" class="w-4 h-4" />
                  </button>
                  <button class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300">
                    <Icon name="lucide:trash-2" class="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <template #footer>
        <div class="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
          <span>Total de gastos: ${{ formatMoney(totalGastos) }}</span>
          <div class="flex items-center space-x-2">
            <button class="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              Anterior
            </button>
            <span class="px-3 py-1">1 de 3</span>
            <button class="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              Siguiente
            </button>
          </div>
        </div>
      </template>
    </ContentSection>
  </PageContainer>
</template>

<script setup lang="ts">
interface Gasto {
  id: number
  fecha: string
  descripcion: string
  categoria: string
  monto: number
  usuario: string
}

// Datos de ejemplo - después conectarás con tu API
const gastos = ref<Gasto[]>([
  {
    id: 1,
    fecha: '2024-01-15',
    descripcion: 'Compra de suministros de oficina',
    categoria: 'Operativos',
    monto: 150.00,
    usuario: 'Juan Pérez'
  },
  {
    id: 2,
    fecha: '2024-01-14',
    descripcion: 'Mantenimiento de equipo',
    categoria: 'Mantenimiento',
    monto: 300.00,
    usuario: 'María García'
  },
  {
    id: 3,
    fecha: '2024-01-13',
    descripcion: 'Pago de servicios públicos',
    categoria: 'Servicios',
    monto: 245.50,
    usuario: 'Carlos López'
  }
])

const totalGastos = computed(() => {
  return gastos.value.reduce((total, gasto) => total + gasto.monto, 0)
})

const gastosStats = computed(() => [
  {
    title: "Gastos Hoy",
    value: `$${formatMoney(150)}`,
    change: "+5%",
    changeType: "negative" as const,
    icon: "lucide:trending-down",
    color: "red" as const
  },
  {
    title: "Gastos Mes",
    value: `$${formatMoney(2340)}`,
    change: "-8%",
    changeType: "positive" as const,
    icon: "lucide:calendar",
    color: "orange" as const
  },
  {
    title: "Promedio Diario",
    value: `$${formatMoney(78)}`,
    icon: "lucide:calculator",
    color: "blue" as const
  },
  {
    title: "Presupuesto Restante",
    value: `$${formatMoney(1660)}`,
    change: "33%",
    changeType: "positive" as const,
    icon: "lucide:piggy-bank",
    color: "green" as const
  }
])

const formatMoney = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount)
}

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const getCategoryColor = (categoria: string): string => {
  const colors = {
    'Operativos': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    'Mantenimiento': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
    'Servicios': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
  }
  return colors[categoria as keyof typeof colors] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
}
</script>