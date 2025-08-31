<template>
  <div>
    <div class="mb-6 text-center">
      <h2 class="text-2xl font-bold text-gray-900 dark:text-white">
        Iniciar Sesión
      </h2>
      <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
        Accede a tu sistema de inventario
      </p>
    </div>
    
    <form class="space-y-6" @submit.prevent="handleLogin">
      <div class="space-y-4">
        <div>
          <UInput
            v-model="credentials.email"
            type="email"
            placeholder="Email"
            required
            :disabled="loading"
            size="lg"
            icon="i-lucide-mail"
            class="w-full"
          />
        </div>
        <div>
          <UInput
            v-model="credentials.password"
            type="password"
            placeholder="Contraseña"
            required
            :disabled="loading"
            size="lg"
            icon="i-lucide-lock"
            class="w-full"
          />
        </div>
      </div>

      <div>
        <UButton
          type="submit"
          :loading="loading"
          :disabled="!credentials.email || !credentials.password"
          block
          size="lg"
          color="primary"
        >
          Iniciar Sesión
        </UButton>
      </div>

      <div class="text-center">
        <p class="text-sm text-gray-600 dark:text-gray-400">
          ¿No tienes cuenta?
          <NuxtLink to="/auth/register" class="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400">
            Regístrate aquí
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

const { login, isAuthenticated } = useAuth()

// Estados reactivos
const credentials = ref({
  email: '',
  password: ''
})
const loading = ref(false)
const error = ref('')

// Si ya está autenticado, redirigir
if (isAuthenticated.value) {
  await navigateTo('/')
}

const handleLogin = async () => {
  try {
    loading.value = true
    error.value = ''
    
    await login(credentials.value)
    
    // Redirigir al dashboard
    await navigateTo('/')
  } catch (err) {
    console.error('Error en login:', err)
    if (err && typeof err === 'object' && 'data' in err && err.data) {
      const errorData = err.data
      error.value = errorData.message || 'Error de autenticación'
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
