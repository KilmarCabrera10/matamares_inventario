<template>
  <UCard 
    :class="[
      'hover-lift stat-card dashboard-card neutral-card transition-all duration-300',
      loading && 'animate-pulse',
      clickable && 'cursor-pointer hover:scale-[1.02]'
    ]"
    :role="clickable ? 'button' : undefined"
    :tabindex="clickable ? 0 : undefined"
    :aria-label="clickable ? `Ver detalles de ${title}` : undefined"
    @click="clickable && $emit('click')"
    @keydown.enter="clickable && $emit('click')"
    @keydown.space.prevent="clickable && $emit('click')"
  >
    <!-- Loading State -->
    <div v-if="loading" class="flex items-center">
      <div class="flex-shrink-0">
        <div class="w-8 h-8 sm:w-10 sm:h-10 rounded-md bg-gray-200 dark:bg-gray-700 animate-pulse" />
      </div>
      <div class="ml-4 sm:ml-5 w-0 flex-1 space-y-2">
        <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-3/4" />
        <div class="h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-1/2" />
      </div>
    </div>

    <!-- Content State -->
    <div v-else class="flex items-center">
      <div class="flex-shrink-0">
        <div 
          :class="[
            'w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center transition-all duration-200',
            colorClasses,
            clickable && 'group-hover:scale-110'
          ]"
        >
          <Icon :name="icon" class="h-4 w-4 sm:h-5 sm:w-5" />
        </div>
      </div>
      
      <div class="ml-4 sm:ml-5 w-0 flex-1 min-w-0">
        <dl>
          <dt class="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
            {{ title }}
          </dt>
          <dd class="flex items-baseline flex-wrap gap-1 sm:gap-2">
            <div 
              :class="[
                'font-semibold text-gray-900 dark:text-white transition-colors duration-200',
                size === 'sm' ? 'text-lg sm:text-xl' : 'text-xl sm:text-2xl lg:text-3xl'
              ]"
            >
              <span v-if="prefix" class="text-sm opacity-70">{{ prefix }}</span>
              {{ formattedValue }}
              <span v-if="suffix" class="text-sm opacity-70 ml-1">{{ suffix }}</span>
            </div>
            
            <div 
              v-if="change"
              :class="[
                'flex items-center text-xs sm:text-sm font-semibold transition-colors duration-200',
                changeType === 'positive' 
                  ? 'text-green-600 dark:text-green-400' 
                  : changeType === 'negative'
                  ? 'text-red-600 dark:text-red-400'
                  : 'text-gray-500 dark:text-gray-400'
              ]"
            >
              <Icon 
                v-if="changeType !== 'neutral'"
                :name="changeType === 'positive' ? 'i-lucide-trending-up' : 'i-lucide-trending-down'" 
                class="flex-shrink-0 h-3 w-3 sm:h-4 sm:w-4 mr-1"
              />
              <span>{{ change }}</span>
            </div>
          </dd>
          
          <!-- Descripción adicional opcional -->
          <dd v-if="description" class="mt-1">
            <p class="text-xs text-gray-400 dark:text-gray-500 truncate">
              {{ description }}
            </p>
          </dd>
        </dl>
      </div>
      
      <!-- Icono de acción si es clickeable -->
      <div v-if="clickable" class="flex-shrink-0 ml-2">
        <Icon 
          name="i-lucide-chevron-right" 
          class="h-4 w-4 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors duration-200" 
        />
      </div>
    </div>
  </UCard>
</template>

<script setup lang="ts">
interface Props {
  title: string
  value: string | number
  change?: string
  changeType?: 'positive' | 'negative' | 'neutral'
  icon: string
  color?: 'blue' | 'green' | 'orange' | 'purple' | 'red' | 'cyan' | 'gray'
  loading?: boolean
  clickable?: boolean
  size?: 'sm' | 'md'
  prefix?: string
  suffix?: string
  description?: string
}

const props = withDefaults(defineProps<Props>(), {
  color: 'cyan',
  changeType: 'positive',
  change: undefined,
  loading: false,
  clickable: false,
  size: 'md',
  prefix: undefined,
  suffix: undefined,
  description: undefined
})

defineEmits<{
  click: []
}>()

const colorClasses = computed(() => {
  const colorMap = {
    blue: 'bg-blue-500 text-white shadow-blue-500/20',
    green: 'bg-green-500 text-white shadow-green-500/20',
    orange: 'bg-orange-500 text-white shadow-orange-500/20',
    purple: 'bg-purple-500 text-white shadow-purple-500/20',
    red: 'bg-red-500 text-white shadow-red-500/20',
    cyan: 'bg-cyan-500 text-white shadow-cyan-500/20',
    gray: 'bg-gray-500 text-white shadow-gray-500/20'
  }
  return `${colorMap[props.color]} shadow-lg`
})

const formattedValue = computed(() => {
  if (typeof props.value === 'number') {
    // Formatear números grandes con comas
    return new Intl.NumberFormat('es-ES').format(props.value)
  }
  return props.value
})
</script>
