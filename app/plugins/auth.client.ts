export default defineNuxtPlugin(() => {
  // Solo en el cliente, inicializar la autenticación
  if (import.meta.client) {
    useAuth() // Esto automáticamente restaura la sesión
  }
})
