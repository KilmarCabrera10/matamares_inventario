export default defineNuxtRouteMiddleware(() => {
  const { isAuthenticated } = useAuth()
  
  // Si no está autenticado, redirigir a login
  if (!isAuthenticated.value) {
    return navigateTo('/login', { replace: true })
  }
})
