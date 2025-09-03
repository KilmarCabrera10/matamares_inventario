<template>
  <div>
    <div class="mb-8 text-center">
      <h2 class="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
        Crear Cuenta
      </h2>
      <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
        Regístrate en el sistema de inventario
      </p>
    </div>
    
    <form class="space-y-6" @submit.prevent="handleRegister">
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Nombre completo
          </label>
          <UInput
            v-model="formData.name"
            type="text"
            placeholder="Tu nombre completo"
            required
            :disabled="loading"
            size="lg"
            icon="i-lucide-user"
            class="w-full"
            :ui="{
              base: 'transition-all duration-200',
              wrapper: 'focus-within:ring-2 focus-within:ring-cyan-500/20 focus-within:border-cyan-500'
            }"
          />
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Correo electrónico
          </label>
          <UInput
            v-model="formData.email"
            type="email"
            placeholder="tu@ejemplo.com"
            required
            :disabled="loading"
            size="lg"
            icon="i-lucide-mail"
            class="w-full"
            :ui="{
              base: 'transition-all duration-200',
              wrapper: 'focus-within:ring-2 focus-within:ring-cyan-500/20 focus-within:border-cyan-500'
            }"
          />
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Contraseña
          </label>
          <UInput
            v-model="formData.password"
            type="password"
            placeholder="••••••••"
            required
            :disabled="loading"
            size="lg"
            icon="i-lucide-lock"
            class="w-full"
            :ui="{
              base: 'transition-all duration-200',
              wrapper: 'focus-within:ring-2 focus-within:ring-cyan-500/20 focus-within:border-cyan-500'
            }"
          />
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Confirmar contraseña
          </label>
          <UInput
            v-model="formData.password_confirmation"
            type="password"
            placeholder="••••••••"
            required
            :disabled="loading"
            size="lg"
            icon="i-lucide-lock"
            class="w-full"
            :ui="{
              base: 'transition-all duration-200',
              wrapper: 'focus-within:ring-2 focus-within:ring-cyan-500/20 focus-within:border-cyan-500'
            }"
          />
        </div>
      </div>

      <div>
        <UButton
          type="submit"
          :loading="loading"
          :disabled="!isFormValid"
          block
          size="lg"
          class="bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-200 shadow-lg shadow-cyan-500/20"
        >
          <span v-if="!loading">Crear Cuenta</span>
          <span v-else class="flex items-center">
            <Icon name="i-lucide-loader-2" class="w-4 h-4 mr-2 animate-spin" />
            Creando cuenta...
          </span>
        </UButton>
      </div>

      <div class="text-center">
        <p class="text-sm text-gray-600 dark:text-gray-400">
          ¿Ya tienes cuenta?
          <NuxtLink 
            to="/auth/login" 
            class="font-medium text-cyan-600 hover:text-cyan-500 dark:text-cyan-400 dark:hover:text-cyan-300 transition-colors duration-200"
          >
            Inicia sesión aquí
          </NuxtLink>
        </p>
      </div>
    </form>

    <!-- Mostrar errores -->
    <UAlert
      v-if="error"
      icon="i-lucide-alert-triangle"
      color="error"
      variant="soft"
      :title="error"
      class="mt-6 border border-red-200 dark:border-red-800"
      :ui="{
        wrapper: 'bg-red-50 dark:bg-red-900/20',
        icon: { base: 'text-red-500' },
        title: 'text-red-800 dark:text-red-200'
      }"
    />

    <!-- Mostrar éxito -->
    <UAlert
      v-if="success"
      icon="i-lucide-check-circle"
      color="success"
      variant="soft"
      :title="success"
      class="mt-6 border border-green-200 dark:border-green-800"
      :ui="{
        wrapper: 'bg-green-50 dark:bg-green-900/20',
        icon: { base: 'text-green-500' },
        title: 'text-green-800 dark:text-green-200'
      }"
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
const success = ref('')

// Si ya está autenticado, redirigir
if (isAuthenticated.value) {
  await navigateTo('/')
}

// Validación del formulario
const isFormValid = computed(() => {
  return formData.value.name.trim() &&
         formData.value.email.trim() &&
         formData.value.password.length >= 6 &&
         formData.value.password === formData.value.password_confirmation
})

const handleRegister = async () => {
  try {
    loading.value = true
    error.value = ''
    success.value = ''
    
    // Validar que las contraseñas coincidan
    if (formData.value.password !== formData.value.password_confirmation) {
      error.value = 'Las contraseñas no coinciden'
      return
    }
    
    await register(formData.value)
    
    success.value = 'Cuenta creada exitosamente. Redirigiendo...'
    
    // Redirigir al dashboard después de un momento
    setTimeout(() => {
      navigateTo('/')
    }, 2000)
    
  } catch (err) {
    console.error('Error en registro:', err)
    if (err && typeof err === 'object' && 'data' in err && err.data) {
      const errorData = err.data
      error.value = errorData.message || 'Error al crear la cuenta'
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
