<template>
  <UCard>
    <div class="flex items-center">
      <div class="flex-shrink-0">
        <div 
          :class="[
            'w-8 h-8 rounded-md flex items-center justify-center',
            colorClasses
          ]"
        >
          <Icon :name="icon" class="h-5 w-5" />
        </div>
      </div>
      <div class="ml-5 w-0 flex-1">
        <dl>
          <dt class="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
            {{ title }}
          </dt>
          <dd class="flex items-baseline">
            <div class="text-2xl font-semibold text-gray-900 dark:text-white">
              {{ value }}
            </div>
            <div 
              v-if="change"
              :class="[
                'ml-2 flex items-baseline text-sm font-semibold',
                changeType === 'positive' 
                  ? 'text-green-600 dark:text-green-400' 
                  : 'text-red-600 dark:text-red-400'
              ]"
            >
              <Icon 
                :name="changeType === 'positive' ? 'lucide:trending-up' : 'lucide:trending-down'" 
                class="self-center flex-shrink-0 h-4 w-4 mr-1"
              />
              <span>{{ change }}</span>
            </div>
          </dd>
        </dl>
      </div>
    </div>
  </UCard>
</template>

<script setup lang="ts">
interface Props {
  title: string
  value: string | number
  change?: string
  changeType?: 'positive' | 'negative'
  icon: string
  color?: 'blue' | 'green' | 'orange' | 'purple' | 'red'
}

const props = withDefaults(defineProps<Props>(), {
  color: 'blue',
  changeType: 'positive',
  change: undefined
})

const colorClasses = computed(() => {
  const colorMap = {
    blue: 'bg-blue-500 text-white',
    green: 'bg-green-500 text-white',
    orange: 'bg-orange-500 text-white',
    purple: 'bg-purple-500 text-white',
    red: 'bg-red-500 text-white'
  }
  return colorMap[props.color]
})
</script>
