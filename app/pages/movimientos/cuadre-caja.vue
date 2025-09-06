<template>
  <PageContainer
    title="Cuadre de Caja"
    subtitle="Control y cuadre diario de efectivo"
    :breadcrumbs="[
      { name: 'Inicio', href: '/' },
      { name: 'Movimientos', href: '/movimientos' },
      { name: 'Cuadre de Caja' }
    ]"
    :stats="dailyStatsCards"
  >
    <template #actions>
      <div class="flex space-x-3">
        <button class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2">
          <Icon name="lucide:save" class="w-4 h-4" />
          <span>Guardar Cuadre</span>
        </button>
        <button class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2">
          <Icon name="lucide:printer" class="w-4 h-4" />
          <span>Imprimir</span>
        </button>
      </div>
    </template>

    <!-- Grid container para colocar las dos secciones lado a lado -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      <!-- Sección izquierda: Saldo Inicial e Historial -->
      <div class="flex flex-col space-y-6 h-full">
            <!-- Resumen Final del Cuadre -->
        <div class="mb-8">
          <UCard class="neutral-card">
            <template #header>
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                <Icon name="lucide:calculator" class="h-5 w-5 mr-2" />
                Resumen del Cuadre
              </h3>
            </template>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div class="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <p class="text-sm text-blue-600 dark:text-blue-400 font-medium">Total Efectivo Contado</p>
                <p class="text-2xl font-bold text-blue-900 dark:text-blue-100">
                  ${{ formatMoney(totalEfectivoContado) }}
                </p>
              </div>
              <div class="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <p class="text-sm text-purple-600 dark:text-purple-400 font-medium">Efectivo Esperado</p>
                <p class="text-2xl font-bold text-purple-900 dark:text-purple-100">
                  ${{ formatMoney(calcularEfectivoEsperado) }}
                </p>
              </div>
              <div 
                class="text-center p-4 rounded-lg" 
                :class="[
                  diferenciaCuadre >= 0 
                    ? 'bg-green-50 dark:bg-green-900/20' 
                    : 'bg-red-50 dark:bg-red-900/20'
                ]"
              >
                <p 
                  class="text-sm font-medium" 
                  :class="[
                    diferenciaCuadre >= 0 
                      ? 'text-green-600 dark:text-green-400' 
                      : 'text-red-600 dark:text-red-400'
                  ]"
                >
                  Diferencia
                </p>
                <p 
                  class="text-2xl font-bold" 
                  :class="[
                    diferenciaCuadre >= 0 
                      ? 'text-green-900 dark:text-green-100' 
                      : 'text-red-900 dark:text-red-100'
                  ]"
                >
                  ${{ formatMoney(Math.abs(diferenciaCuadre)) }}
                </p>
                <p 
                  class="text-sm font-medium" 
                  :class="[
                    diferenciaCuadre >= 0 
                      ? 'text-green-600 dark:text-green-400' 
                      : 'text-red-600 dark:text-red-400'
                  ]"
                >
                  {{ diferenciaCuadre >= 0 ? '(Sobrante)' : '(Faltante)' }}
                </p>
              </div>
            </div>
          </UCard>
        </div>


        <!-- Saldo Inicial -->
        <UCard class="neutral-card">
          <template #header>
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                <Icon name="lucide:wallet" class="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" />
                Saldo Inicial
              </h3>
              <UBadge 
                :color="cuadre.saldoInicial > 0 ? 'success' : 'neutral'" 
                variant="soft"
                size="sm"
              >
                {{ cuadre.saldoInicial > 0 ? 'Configurado' : 'Pendiente' }}
              </UBadge>
            </div>
          </template>

          <div class="space-y-6">
            <!-- Input Principal con información adicional en la misma fila -->
            <div class="grid grid-cols-3 gap-4 items-start">
              <!-- Input del saldo inicial -->
              <div class="col-span-1">
                <UFormField label="Saldo Inicial en Caja" required>
                  <UInputNumber
                    v-model="cuadre.saldoInicial"
                    :format-options="{
                      style: 'currency',
                      currency: 'USD',
                      currencyDisplay: 'symbol'
                    }"
                    :step="0.01"
                    :min="0"
                    placeholder="$0.00"
                    size="lg"
                    icon="i-lucide-dollar-sign"
                  />
                </UFormField>
              </div>

              <!-- Saldo de ayer -->
              <div class="col-span-1">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Saldo de Ayer</label>
                <div class="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800 h-[52px] flex items-center">
                  <div class="flex items-center justify-between w-full">
                    <div class="flex items-center">
                      <Icon name="lucide:calendar" class="h-4 w-4 mr-2 text-blue-600 dark:text-blue-400" />
                      <span class="text-sm font-medium text-blue-800 dark:text-blue-200">
                        Ayer
                      </span>
                    </div>
                    <span class="text-sm font-bold text-blue-900 dark:text-blue-100">
                      ${{ formatMoney(saldoAnterior) }}
                    </span>
                  </div>
                </div>
              </div>

              <!-- Diferencia con ayer -->
              <div class="col-span-1">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Diferencia</label>
                <div 
                  v-if="cuadre.saldoInicial > 0" 
                  class="p-4 rounded-lg border h-[52px] flex items-center" 
                  :class="[
                    diferenciaSaldoAnterior >= 0 
                      ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' 
                      : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
                  ]"
                >
                  <div class="flex items-center justify-between w-full">
                    <div class="flex items-center">
                      <Icon 
                        :name="diferenciaSaldoAnterior >= 0 ? 'lucide:trending-up' : 'lucide:trending-down'" 
                        class="h-4 w-4 mr-2" 
                        :class="[
                          diferenciaSaldoAnterior >= 0 
                            ? 'text-green-600 dark:text-green-400' 
                            : 'text-red-600 dark:text-red-400'
                        ]"
                      />
                      <span 
                        class="text-sm font-medium" 
                        :class="[
                          diferenciaSaldoAnterior >= 0 
                            ? 'text-green-800 dark:text-green-200' 
                            : 'text-red-800 dark:text-red-200'
                        ]"
                      >
                        Dif.
                      </span>
                    </div>
                    <span 
                      class="text-sm font-bold" 
                      :class="[
                        diferenciaSaldoAnterior >= 0 
                          ? 'text-green-900 dark:text-green-100' 
                          : 'text-red-900 dark:text-red-100'
                      ]"
                    >
                      {{ diferenciaSaldoAnterior >= 0 ? '+' : '' }}${{ formatMoney(Math.abs(diferenciaSaldoAnterior)) }}
                    </span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </UCard>
        
        <!-- Historial de Cuadres -->
        <UCard class="neutral-card flex-1">
          <template #header>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
              <Icon name="lucide:history" class="h-5 w-5 mr-2" />
              Historial de Cuadres
            </h3>
          </template>
          <div class="space-y-3 max-h-96 overflow-y-auto">
            <div v-for="historial in historialCuadres"  :key="historial.id" class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div>
                <p class="font-medium text-gray-900 dark:text-white">
                  {{ historial.fecha }}
                </p>
                <p class="text-sm text-gray-500 dark:text-gray-400">
                  Efectivo: ${{ formatMoney(historial.efectivoReal) }}
                </p>
              </div>
              <div class="text-right">
                <UBadge  :color="historial.diferencia === 0 ? 'success' : 'error'"  variant="soft" size="sm">
                  {{ historial.diferencia === 0 ? 'Cuadrado' : 'Descuadrado' }}
                </UBadge>
                <p class="text-xs text-gray-500 mt-1">
                  Dif: ${{ formatMoney(Math.abs(historial.diferencia)) }}
                </p>
              </div>
            </div>
          </div>
        </UCard>
      </div>

      <!-- Sección derecha: Conteo Detallado de Efectivo -->
      <div class="h-full">
      <UCard class="neutral-card h-full flex flex-col">
        <template #header>
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
          <Icon name="lucide:banknote" class="h-5 w-5 mr-2" />
          Conteo Detallado de Efectivo
          </h3>
          <UBadge :color="cuadreValido ? 'success' : 'error'" variant="soft">
          {{ cuadreValido ? 'Cuadrado' : 'Descuadrado' }}
          </UBadge>
        </div>
        </template>

        <div class="flex-1 flex flex-col">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Billetes -->
          <div class="space-y-4">
            <h4 class="text-md font-semibold text-gray-800 dark:text-gray-200 flex items-center border-b pb-2">
            <Icon name="lucide:receipt" class="h-4 w-4 mr-2" />
            Billetes
            </h4>
            
            <div class="grid grid-cols-2 gap-3">
            <UFormField 
              v-for="billete in billetes" 
              :key="billete.valor"
              :label="`$${billete.valor}`"
              class="space-y-1"
            >
              <UInputNumber
              v-model="conteoEfectivo.billetes[billete.key]"
              :min="0"
              :step="1"
              placeholder="0"
              size="sm"
              />
              <p class="text-xs text-gray-500">
              {{ formatMoney(conteoEfectivo.billetes[billete.key] * billete.valor) }}
              </p>
            </UFormField>
            </div>
          </div>

          <!-- Monedas -->
          <div class="space-y-4">
            <h4 class="text-md font-semibold text-gray-800 dark:text-gray-200 flex items-center border-b pb-2">
            <Icon name="lucide:coins" class="h-4 w-4 mr-2" />
            Monedas
            </h4>
            
            <div class="grid grid-cols-2 gap-3">
            <UFormField 
              v-for="moneda in monedas" 
              :key="moneda.valor"
              :label="moneda.label"
              class="space-y-1"
            >
              <UInputNumber
              v-model="conteoEfectivo.monedas[moneda.key]"
              :min="0"
              :step="1"
              placeholder="0"
              size="sm"
              />
              <p class="text-xs text-gray-500">
              {{ formatMoney(conteoEfectivo.monedas[moneda.key] * moneda.valor) }}
              </p>
            </UFormField>
            </div>
          </div>
          </div>

          <!-- Totales Generales -->
          <div class="mt-6 grid grid-cols-2 gap-4">
          <div class="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
            <div class="flex justify-between items-center">
            <span class="font-medium text-green-800 dark:text-green-200">Total Billetes:</span>
            <span class="font-bold text-green-900 dark:text-green-100">
              ${{ formatMoney(totalBilletes) }}
            </span>
            </div>
          </div>
          
          <div class="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <div class="flex justify-between items-center">
            <span class="font-medium text-blue-800 dark:text-blue-200">Total Monedas:</span>
            <span class="font-bold text-blue-900 dark:text-blue-100">
              ${{ formatMoney(totalMonedas) }}
            </span>
            </div>
          </div>
          </div>

          <!-- Observaciones -->
          <div class="mt-6 flex-1">
          <UFormField label="Observaciones" help="Describe cualquier observación sobre el cuadre...">
            <UTextarea
            v-model="cuadre.observaciones"
            placeholder="Observaciones del cuadre de caja..."
            :rows="3"
            :maxlength="500"
            resize
            class="w-full"
            />
          </UFormField>
          </div>

          <!-- Botones dentro del card - abajo a la derecha -->
          <div class="mt-6 pt-4 border-t border-gray-200 dark:border-gray-600">
            <div class="flex justify-end space-x-3">
              <UButton
                color="secondary"
                variant="solid"
                class="shadow-sm"
                @click="limpiarFormulario"
              >
                <Icon name="lucide:refresh-cw" class="h-4 w-4 mr-2" />
                Limpiar
              </UButton>
              <UButton
                color="neutral"
                variant="solid"
                class="shadow-sm bg-blue-700 hover:bg-blue-600 text-white"
                :loading="guardando"
                @click="guardarCuadre"
              >
                <Icon name="lucide:save" class="h-4 w-4 mr-2" />
                Guardar Cuadre
              </UButton>
            </div>
          </div>
        </div>
      </UCard>
      </div>
    </div>
  </PageContainer>
</template>

<script setup lang="ts">
import type { CuadreData, ConteoEfectivo, HistorialCuadre, DailyStats } from '~/composables/useCuadreCaja'

// Definición de billetes y monedas de EE.UU.
const billetes = [
  { valor: 100, key: 'cien' as keyof ConteoEfectivo['billetes'] },
  { valor: 50, key: 'cincuenta' as keyof ConteoEfectivo['billetes'] },
  { valor: 20, key: 'veinte' as keyof ConteoEfectivo['billetes'] },
  { valor: 10, key: 'diez' as keyof ConteoEfectivo['billetes'] },
  { valor: 5, key: 'cinco' as keyof ConteoEfectivo['billetes'] },
  { valor: 2, key: 'dos' as keyof ConteoEfectivo['billetes'] },
  { valor: 1, key: 'uno' as keyof ConteoEfectivo['billetes'] }
]

const monedas = [
  { valor: 1.00, key: 'dollar' as keyof ConteoEfectivo['monedas'], label: '$1.00' },
  { valor: 0.50, key: 'cincuentaCentavos' as keyof ConteoEfectivo['monedas'], label: '50¢' },
  { valor: 0.25, key: 'veinticinco' as keyof ConteoEfectivo['monedas'], label: '25¢' },
  { valor: 0.10, key: 'diez' as keyof ConteoEfectivo['monedas'], label: '10¢' },
  { valor: 0.05, key: 'cinco' as keyof ConteoEfectivo['monedas'], label: '5¢' },
  { valor: 0.01, key: 'uno' as keyof ConteoEfectivo['monedas'], label: '1¢' }
]

// Estados reactivos
const cuadre = ref<CuadreData>({
  saldoInicial: 0,
  observaciones: ''
})

const conteoEfectivo = ref<ConteoEfectivo>({
  billetes: {
    cien: 0,
    cincuenta: 0,
    veinte: 0,
    diez: 0,
    cinco: 0,
    dos: 0,
    uno: 0
  },
  monedas: {
    dollar: 0,
    cincuentaCentavos: 0,
    veinticinco: 0,
    diez: 0,
    cinco: 0,
    uno: 0
  }
})

const guardando = ref(false)
const cargando = ref(true)

// Composable para API del cuadre de caja
const cuadreCaja = useCuadreCaja()

// Estados reactivos para datos de la API
const saldoAnterior = ref(0)
const dailyStats = ref<DailyStats>({
  ingresos: 0,
  gastos: 0,
  diferencia: 0
})
const historialCuadres = ref<HistorialCuadre[]>([])

// Stats cards para mostrar en el PageContainer
const dailyStatsCards = computed(() => [
  {
    title: "Ingresos del Día",
    value: `$${formatMoney(dailyStats.value.ingresos)}`,
    icon: "lucide:trending-up",
    color: "green" as const
  },
  {
    title: "Gastos del Día",
    value: `$${formatMoney(dailyStats.value.gastos)}`,
    icon: "lucide:trending-down",
    color: "red" as const
  },
  {
    title: "Diferencia",
    value: `$${formatMoney(dailyStats.value.diferencia)}`,
    changeType: dailyStats.value.diferencia >= 0 ? 'positive' as const : 'negative' as const,
    icon: "lucide:calculator",
    color: "blue" as const
  },
  {
    title: "Efectivo Esperado",
    value: `$${formatMoney(calcularEfectivoEsperado.value)}`,
    icon: "lucide:wallet",
    color: "purple" as const
  }
])

const diferenciaSaldoAnterior = computed(() => {
  return cuadre.value.saldoInicial - saldoAnterior.value
})

// Computed properties para cálculos
const totalBilletes = computed(() => {
  return billetes.reduce((total, billete) => {
    return total + (conteoEfectivo.value.billetes[billete.key] * billete.valor)
  }, 0)
})

const totalMonedas = computed(() => {
  return monedas.reduce((total, moneda) => {
    return total + (conteoEfectivo.value.monedas[moneda.key] * moneda.valor)
  }, 0)
})

const totalEfectivoContado = computed(() => {
  return totalBilletes.value + totalMonedas.value
})

const calcularEfectivoEsperado = computed(() => {
  return cuadre.value.saldoInicial + dailyStats.value.diferencia
})

const diferenciaCuadre = computed(() => {
  return totalEfectivoContado.value - calcularEfectivoEsperado.value
})

const cuadreValido = computed(() => {
  return Math.abs(diferenciaCuadre.value) <= 1 // Tolerancia de $1
})

// Métodos
const formatMoney = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount)
}

const limpiarFormulario = () => {
  cuadre.value = {
    saldoInicial: 0,
    observaciones: ''
  }
  
  conteoEfectivo.value = {
    billetes: {
      cien: 0,
      cincuenta: 0,
      veinte: 0,
      diez: 0,
      cinco: 0,
      dos: 0,
      uno: 0
    },
    monedas: {
      dollar: 0,
      cincuentaCentavos: 0,
      veinticinco: 0,
      diez: 0,
      cinco: 0,
      uno: 0
    }
  }
}

// Función para cargar datos iniciales
const cargarDatosIniciales = async () => {
  try {
    cargando.value = true
    
    // Cargar datos en paralelo
    const [saldoAnteriorData, statsData, historialData] = await Promise.all([
      cuadreCaja.obtenerSaldoAnterior(),
      cuadreCaja.obtenerEstadisticasDia(),
      cuadreCaja.obtenerHistorialCuadres(5)
    ])
    
    saldoAnterior.value = saldoAnteriorData
    dailyStats.value = statsData
    historialCuadres.value = historialData
    
  } catch (error) {
    console.error('Error al cargar datos iniciales:', error)
    // En caso de error, mostrar valores por defecto o mensaje de error
  } finally {
    cargando.value = false
  }
}

const guardarCuadre = async () => {
  try {
    guardando.value = true
    
    // Validaciones
    if (cuadre.value.saldoInicial < 0) {
      throw new Error('El saldo inicial no puede ser negativo')
    }

    if (totalEfectivoContado.value < 0) {
      throw new Error('El efectivo contado no puede ser negativo')
    }

    // Verificar si ya existe un cuadre para hoy
    const fechaHoy = new Date().toISOString().split('T')[0]
    const existeCuadre = await cuadreCaja.validarCuadreExistente(fechaHoy)
    
    if (existeCuadre) {
      const confirmar = confirm('Ya existe un cuadre para hoy. ¿Desea actualizarlo?')
      if (!confirmar) {
        return
      }
    }

    // Preparar datos del cuadre completo
    const cuadreCompleto: {
      cuadre: CuadreData
      conteoEfectivo: ConteoEfectivo
      totalEfectivoContado: number
      diferenciaCuadre: number
      fecha: string
    } = {
      cuadre: cuadre.value,
      conteoEfectivo: conteoEfectivo.value,
      totalEfectivoContado: totalEfectivoContado.value,
      diferenciaCuadre: diferenciaCuadre.value,
      fecha: new Date().toISOString()
    }

    // Guardar cuadre
    const respuesta = await cuadreCaja.guardarCuadre(cuadreCompleto)
    
    // Mostrar mensaje de éxito
    alert(`Cuadre guardado exitosamente. ID: ${respuesta.id}`)
    
    // Limpiar formulario y recargar datos
    limpiarFormulario()
    await cargarDatosIniciales()
    
  } catch (error) {
    console.error('Error al guardar cuadre:', error)
    alert(`Error al guardar cuadre: ${error instanceof Error ? error.message : 'Error desconocido'}`)
  } finally {
    guardando.value = false
  }
}

// Cargar datos iniciales al montar el componente
onMounted(async () => {
  await cargarDatosIniciales()
})
</script>

<style scoped>
.neutral-card {
  background-color: white;
  box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
  border: 1px solid rgb(229 231 235);
}

.dark .neutral-card {
  background-color: rgb(17 24 39);
  border-color: rgb(31 41 55);
}
</style>
