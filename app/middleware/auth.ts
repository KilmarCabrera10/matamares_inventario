export default defineNuxtRouteMiddleware(async () => {
  // En el servidor, no verificar autenticación (se manejará en el cliente)
  if (import.meta.server) {
    return
  }
  
  const { isAuthenticated } = useAuth()
  
  // En el cliente, esperar hasta que la autenticación se haya estabilizado
  let attempts = 0
  const maxAttempts = 20 // 1 segundo máximo de espera
  
  while (attempts < maxAttempts) {
    // Verificar si hay datos en localStorage
    const hasLocalData = localStorage.getItem('auth_token') && localStorage.getItem('auth_user')
    
    // Si hay datos locales pero no están cargados en el estado, esperar
    if (hasLocalData && !isAuthenticated.value) {
      await new Promise(resolve => setTimeout(resolve, 50))
      attempts++
      continue
    }
    
    // Si ya está autenticado o no hay datos locales, salir del loop
    break
  }
  
  // Si no está autenticado, redirigir a welcome
  if (!isAuthenticated.value) {
    return navigateTo('/welcome', { replace: true })
  }
})
