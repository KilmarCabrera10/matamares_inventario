export default defineNuxtPlugin(async () => {
  const { restoreSession, checkAuth } = useAuth()
  
  // Solo en el cliente
  if (import.meta.client) {
    // Restaurar sesión desde localStorage
    restoreSession()
    
    // Verificar si el token sigue siendo válido
    await checkAuth()
  }
})
