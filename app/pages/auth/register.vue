<template>
  <div>
    <div class="mb-6 text-center">
      <h2 class="text-2xl font-bold text-gray-900 dark:text-white">
        Crear Cuenta
      </h2>
      <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
        Regístrate en el sistema de inventario
      </p>
    </div>
    
    <form class="space-y-6" @submit.prevent="handleRegister">
      <div class="space-y-4">
        <UInput
          v-model="formData.name"
          type="text"
          placeholder="Nombre completo"
          required
          :disabled="loading"
          size="lg"
          icon="i-lucide-user"
          class="w-full"
        />
        
        <UInput
          v-model="formData.email"
          type="email"
          placeholder="Email"
          required
          :disabled="loading"
          size="lg"
          icon="i-lucide-mail"
          class="w-full"
        />
        
        <UInput
          v-model="formData.password"
          type="password"
          placeholder="Contraseña"
          required
          :disabled="loading"
          size="lg"
          icon="i-lucide-lock"
          class="w-full"
        />
        
        <UInput
          v-model="formData.password_confirmation"
          type="password"
          placeholder="Confirmar contraseña"
          required
          :disabled="loading"
          size="lg"
          icon="i-lucide-lock"
          class="w-full"
        />
      </div>

      <div>
        <UButton
          type="submit"
          :loading="loading"
          :disabled="!isFormValid"
          block
          size="lg"
          color="primary"
        >
          Crear Cuenta
        </UButton>
      </div>

      <div class="text-center">
        <p class="text-sm text-gray-600 dark:text-gray-400">
          ¿Ya tienes cuenta?
          <NuxtLink to="/auth/login" class="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400">
            Inicia sesión aquí
          </NuxtLink>
        </p>
      </div>
    </form>

    <!-- Mostrar errores -->
    <UAlert
      v-if="error"
      icon="i-lucide-alert-circle"
      color="red"
      variant="soft"
      :title="error"
      class="mt-4"
    />
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'auth'
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
