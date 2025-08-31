<template>
  <div class="min-h-screen flex items-center justify-center bg-muted py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-highlighted">
          Iniciar Sesión
        </h2>
        <p class="mt-2 text-center text-sm text-muted">
          Accede a tu sistema de inventario
        </p>
      </div>
      
      <form class="mt-8 space-y-6" @submit.prevent="handleLogin">
        <div class="rounded-md shadow-sm -space-y-px">
          <div>
            <UInput
              v-model="credentials.email"
              type="email"
              placeholder="Email"
              required
              :disabled="loading"
              class="mb-4"
            />
          </div>
          <div>
            <UInput
              v-model="credentials.password"
              type="password"
              placeholder="Contraseña"
              required
              :disabled="loading"
            />
          </div>
        </div>

        <div>
          <UButton
            type="submit"
            :loading="loading"
            :disabled="!credentials.email || !credentials.password"
            class="w-full"
            size="lg"
            color="primary"
          >
            Iniciar Sesión
          </UButton>
        </div>

        <div class="text-center">
          <p class="text-sm text-muted">
            ¿No tienes cuenta?
            <NuxtLink to="/register" class="font-medium text-primary hover:text-primary/75">
              Regístrate aquí
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
