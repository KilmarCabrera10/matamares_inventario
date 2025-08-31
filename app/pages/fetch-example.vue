<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-6">Ejemplo con useFetch (Recomendado)</h1>
    
    <!-- Botón para refrescar -->
    <div class="mb-4">
      <UButton :loading="pending" @click="refresh()">
        Refrescar Usuarios
      </UButton>
    </div>

    <!-- Loading state -->
    <div v-if="pending" class="flex justify-center items-center h-32">
      <UIcon name="i-lucide-loader-2" class="w-8 h-8 animate-spin" />
    </div>

    <!-- Error state -->
    <UAlert
      v-else-if="error"
      variant="soft"
      title="Error al cargar usuarios"
      :description="error.message"
      class="mb-4"
    />

    <!-- Mostrar usuarios -->
    <div v-else-if="data && users.length > 0" class="grid gap-4">
      <div v-for="user in users" :key="user.id" class="p-4 border rounded-lg">
        <h3 class="font-bold">{{ user.name }}</h3>
        <p class="text-gray-600">{{ user.email }}</p>
        <p class="text-sm text-gray-500">ID: {{ user.id }}</p>
        <p class="text-xs text-gray-400">
          Creado: {{ new Date(user.created_at).toLocaleDateString() }}
        </p>
      </div>
    </div>

    <!-- Mensaje si no hay usuarios -->
    <div v-else class="text-gray-500">
      No hay usuarios disponibles.
    </div>

    <!-- Ejemplo de crear usuario -->
    <div class="mt-8 p-4 border-t">
      <h2 class="text-lg font-semibold mb-4">Crear Nuevo Usuario</h2>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <UInput v-model="newUser.name" placeholder="Nombre completo" />
        <UInput v-model="newUser.email" type="email" placeholder="Email" />
        <UInput v-model="newUser.password" type="password" placeholder="Contraseña" />
        <UInput 
          v-model="newUser.password_confirmation" 
          type="password" 
          placeholder="Confirmar contraseña" 
        />
      </div>
      
      <UButton 
        :loading="creating" 
        :disabled="!canCreate"
        @click="createUser"
      >
        Crear Usuario
      </UButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { User } from '~/composables/useUsersApi'

// Usar useFetch para cargar usuarios automáticamente
const config = useRuntimeConfig()

const { data, pending, error, refresh } = await useFetch<{ data?: User[] } | User[]>('/users', {
  baseURL: config.public.apiBase,
  server: false // Solo en el cliente para evitar problemas de CORS en SSR
})

// Computed para extraer usuarios del formato de respuesta
const users = computed(() => {
  if (!data.value) return []
  return Array.isArray(data.value) ? data.value : data.value.data || []
})

// Estado para crear usuario
const newUser = ref({
  name: '',
  email: '',
  password: '',
  password_confirmation: ''
})

const creating = ref(false)

// Computed para validar si se puede crear
const canCreate = computed(() => {
  return newUser.value.name && 
         newUser.value.email && 
         newUser.value.password && 
         newUser.value.password === newUser.value.password_confirmation
})

// Función para crear usuario
const createUser = async () => {
  if (!canCreate.value) return
  
  try {
    creating.value = true
    
    await $fetch('/users', {
      method: 'POST',
      baseURL: config.public.apiBase,
      body: newUser.value
    })
    
    // Limpiar formulario
    newUser.value = {
      name: '',
      email: '',
      password: '',
      password_confirmation: ''
    }
    
    // Refrescar la lista
    await refresh()
    
    // Notificación de éxito (si usas toast)
    console.log('Usuario creado exitosamente')
    
  } catch (err) {
    console.error('Error al crear usuario:', err)
  } finally {
    creating.value = false
  }
}
</script>
