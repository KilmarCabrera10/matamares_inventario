<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Crear Cuenta
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          Regístrate en el sistema de inventario
        </p>
      </div>
      
      <form class="mt-8 space-y-6" @submit.prevent="handleRegister">
        <div class="space-y-4">
          <UInput
            v-model="formData.name"
            type="text"
            placeholder="Nombre completo"
            required
            :disabled="loading"
          />
          
          <UInput
            v-model="formData.email"
            type="email"
            placeholder="Email"
            required
            :disabled="loading"
          />
          
          <UInput
            v-model="formData.password"
            type="password"
            placeholder="Contraseña"
            required
            :disabled="loading"
          />
          
          <UInput
            v-model="formData.password_confirmation"
            type="password"
            placeholder="Confirmar contraseña"
            required
            :disabled="loading"
          />
        </div>

        <div>
          <UButton
            type="submit"
            :loading="loading"
            :disabled="!isFormValid"
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Crear Cuenta
          </UButton>
        </div>

        <div class="text-center">
          <p class="text-sm text-gray-600">
            ¿Ya tienes cuenta?
            <NuxtLink to="/login" class="font-medium text-indigo-600 hover:text-indigo-500">
              Inicia sesión aquí
            </NuxtLink>
          </p>
        </div>
      </form>

      <!-- Mostrar errores -->
      <div v-if="error" class="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
        <strong>❌ Error:</strong> {{ error }}
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: false
})

const { register, isAuthenticated } = useAuth()

// Estados reactivos
const formData = ref({
  name: '',
  email: '',
  password: '',
  password_confirmation: ''
})
const loading = ref(false)
const error = ref('')

// Si ya está autenticado, redirigir
if (isAuthenticated.value) {
  await navigateTo('/')
}

// Validación del formulario
const isFormValid = computed(() => {
  return formData.value.name && 
         formData.value.email && 
         formData.value.password && 
         formData.value.password_confirmation &&
         formData.value.password === formData.value.password_confirmation
})

const handleRegister = async () => {
  try {
    loading.value = true
    error.value = ''
    
    if (formData.value.password !== formData.value.password_confirmation) {
      error.value = 'Las contraseñas no coinciden'
      return
    }
    
    await register(formData.value)
    
    // Redirigir al dashboard
    await navigateTo('/')
  } catch (err) {
    console.error('Error en registro:', err)
    if (err && typeof err === 'object' && 'data' in err && err.data) {
      const errorData = err.data
      error.value = errorData.message || 'Error en el registro'
    } else if (err instanceof Error) {
      error.value = err.message
    } else {
      error.value = 'Error de conexión'
    }
  } finally {
    loading.value = false
  }
}
</script>
