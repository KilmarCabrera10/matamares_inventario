import type { 
  BaseUser as User, 
  AuthResponse, 
  LoginCredentials, 
  RegisterData 
} from '../../types'

export const useAuth = () => {
  // Estados reactivos - usar ref normal para mejor control
  const user = ref<User | null>(null)
  const token = ref<string | null>(null)
  const selectedOrgId = ref<string | null>(null)
  
  // Configuración de expiración de sesión (en horas)
  const SESSION_DURATION_HOURS = 24 // Duración por defecto: 24 horas
  
  // Función auxiliar para limpiar localStorage
  const clearLocalStorage = () => {
    if (import.meta.client) {
      localStorage.removeItem('auth_token')
      localStorage.removeItem('auth_user')
      localStorage.removeItem('selected_org_id')
      localStorage.removeItem('auth_expires_at')
    }
  }

  // Función para validar si la sesión almacenada sigue siendo válida
  const validateStoredSession = (): boolean => {
    if (!import.meta.client) return false
    
    try {
      const expiresAt = localStorage.getItem('auth_expires_at')
      if (!expiresAt) {
        // No hay timestamp de expiración, considerar sesión inválida
        return false
      }
      
      const expirationTime = parseInt(expiresAt, 10)
      const currentTime = Date.now()
      
      // Verificar si la sesión ha expirado
      if (currentTime >= expirationTime) {
        console.log('Sesión expirada, limpiando datos...')
        return false
      }
      
      return true
    } catch (error) {
      console.error('Error al validar sesión:', error)
      return false
    }
  }

  // Función para establecer el tiempo de expiración de la sesión
  const setSessionExpiration = (hours: number = SESSION_DURATION_HOURS) => {
    if (import.meta.client) {
      const expirationTime = Date.now() + (hours * 60 * 60 * 1000) // hours en milisegundos
      localStorage.setItem('auth_expires_at', expirationTime.toString())
    }
  }
  
  // Si estamos en el cliente, intentar restaurar inmediatamente
  if (import.meta.client && !token.value) {
    const isSessionValid = validateStoredSession()
    if (isSessionValid) {
      const savedToken = localStorage.getItem('auth_token')
      const savedUser = localStorage.getItem('auth_user')
      const savedOrgId = localStorage.getItem('selected_org_id')
      
      if (savedToken && savedUser) {
        try {
          const parsedUser = JSON.parse(savedUser)
          if (parsedUser && (parsedUser.id || parsedUser._id) && parsedUser.email) {
            token.value = savedToken
            user.value = parsedUser
            selectedOrgId.value = savedOrgId
          }
        } catch {
          // Ignorar errores de parsing
          clearLocalStorage()
        }
      }
    } else {
      // Sesión expirada, limpiar datos
      clearLocalStorage()
    }
  }
  
  const isAuthenticated = computed(() => !!token.value && !!user.value)

  const config = useRuntimeConfig()
  const baseURL = config.public.apiBase

  // Headers con autenticación
  const getAuthHeaders = () => {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
    
    if (token.value) {
      headers['Authorization'] = `Bearer ${token.value}`
    }
    
    if (selectedOrgId.value) {
      headers['Organization-Id'] = selectedOrgId.value
    }
    
    return headers
  }

  // Funciones de autenticación
  const login = async (credentials: LoginCredentials) => {
    const response = await $fetch<AuthResponse>('/auth/login', {
      method: 'POST',
      baseURL,
      body: credentials
    })

    if (response.success && response.data) {
      // Guardar datos de autenticación
      token.value = response.data.token
      user.value = response.data.user
      
      // Seleccionar primera organización por defecto
      if (response.data.organizations?.length > 0) {
        const firstOrgId = response.data.organizations[0]?.id.toString()
        selectedOrgId.value = firstOrgId || null
        
        // Agregar las organizaciones al objeto user para mantener consistencia
        user.value.organizations = response.data.organizations
      } else {
        selectedOrgId.value = null
      }

      // Persistir en localStorage
      if (import.meta.client) {
        localStorage.setItem('auth_token', response.data.token)
        localStorage.setItem('auth_user', JSON.stringify(user.value))
        if (selectedOrgId.value) {
          localStorage.setItem('selected_org_id', selectedOrgId.value)
        }
        // Establecer tiempo de expiración de la sesión
        setSessionExpiration()
      }

      return response
    }
    
    throw new Error(response.message || 'Error en el login')
  }

  const register = async (data: RegisterData) => {
    const response = await $fetch<AuthResponse>('/auth/register', {
      method: 'POST',
      baseURL,
      body: data
    })

    if (response.success && response.data) {
      // Auto-login después del registro
      token.value = response.data.token
      user.value = response.data.user
      
      // Persistir en localStorage
      if (import.meta.client) {
        localStorage.setItem('auth_token', response.data.token)
        localStorage.setItem('auth_user', JSON.stringify(response.data.user))
        // Establecer tiempo de expiración de la sesión
        setSessionExpiration()
      }

      return response
    }
    
    throw new Error(response.message || 'Error en el registro')
  }

  const logout = async () => {
    try {
      // Llamar al endpoint de logout si hay token
      if (token.value) {
        await $fetch('/auth/logout', {
          method: 'POST',
          baseURL,
          headers: getAuthHeaders()
        })
      }
    } catch (error) {
      console.error('Error en logout:', error)
    } finally {
      // Limpiar estado y localStorage
      token.value = null
      user.value = null
      selectedOrgId.value = null
      
      clearLocalStorage()
      
      // Redirigir a la página de bienvenida
      await navigateTo('/welcome')
    }
  }

  const refreshToken = async () => {
    try {
      if (!token.value) return false

      const response = await $fetch<AuthResponse>('/auth/refresh', {
        method: 'POST',
        baseURL,
        headers: getAuthHeaders()
      })

      if (response.success && response.data) {
        token.value = response.data.token
        user.value = response.data.user
        
        // Actualizar localStorage
        if (import.meta.client) {
          localStorage.setItem('auth_token', response.data.token)
          localStorage.setItem('auth_user', JSON.stringify(response.data.user))
          // Renovar tiempo de expiración de la sesión
          setSessionExpiration()
        }
        
        return true
      }
      
      return false
    } catch (error) {
      console.error('Error al refrescar token:', error)
      await logout()
      return false
    }
  }

  const checkAuth = async () => {
    try {
      if (!token.value) return false

      const response = await $fetch<{ success: boolean; data: User }>('/auth/me', {
        baseURL,
        headers: getAuthHeaders()
      })

      if (response.success && response.data) {
        user.value = response.data
        return true
      }
      
      return false
    } catch (error) {
      console.error('Error al verificar autenticación:', error)
      // No hacer logout automático, solo retornar false
      // Esto permite mantener la sesión local cuando no hay conectividad
      return false
    }
  }

  // Restaurar sesión desde localStorage
  const restoreSession = () => {
    if (import.meta.client) {
      try {
        // Primero validar si la sesión no ha expirado
        if (!validateStoredSession()) {
          console.log('Sesión expirada al intentar restaurar')
          clearLocalStorage()
          return false
        }

        const savedToken = localStorage.getItem('auth_token')
        const savedUser = localStorage.getItem('auth_user')
        const savedOrgId = localStorage.getItem('selected_org_id')
        
        // Validar que el token existe y no está vacío
        if (savedToken && savedToken.trim() !== '') {
          // Validar que el usuario existe y es un JSON válido
          if (savedUser && savedUser.trim() !== '') {
            try {
              const parsedUser = JSON.parse(savedUser)
              
              // Validar que el usuario tiene las propiedades mínimas requeridas
              // Acepta tanto 'id' como '_id' para mayor compatibilidad
              if (parsedUser && (parsedUser.id || parsedUser._id) && parsedUser.email) {
                token.value = savedToken
                user.value = parsedUser
                selectedOrgId.value = savedOrgId
                return true
              } else {
                console.warn('Datos de usuario inválidos, limpiando sesión')
                clearLocalStorage()
                return false
              }
            } catch {
              console.warn('Error al parsear datos de usuario, limpiando sesión')
              clearLocalStorage()
              return false
            }
          } else {
            clearLocalStorage()
            return false
          }
        } else {
          return false
        }
      } catch (error) {
        console.error('Error al restaurar sesión:', error)
        clearLocalStorage()
        return false
      }
    }
    return false
  }

  // Seleccionar organización
  const selectOrganization = (orgId: string) => {
    selectedOrgId.value = orgId
    if (import.meta.client) {
      localStorage.setItem('selected_org_id', orgId)
    }
  }

  // Función para obtener el tiempo restante de sesión en milisegundos
  const getSessionTimeRemaining = (): number => {
    if (!import.meta.client) return 0
    
    try {
      const expiresAt = localStorage.getItem('auth_expires_at')
      if (!expiresAt) return 0
      
      const expirationTime = parseInt(expiresAt, 10)
      const currentTime = Date.now()
      const timeRemaining = expirationTime - currentTime
      
      return Math.max(0, timeRemaining)
    } catch {
      return 0
    }
  }

  // Función para verificar si la sesión expirará pronto (en los próximos 30 minutos)
  const isSessionExpiringSoon = (): boolean => {
    const timeRemaining = getSessionTimeRemaining()
    const thirtyMinutes = 30 * 60 * 1000 // 30 minutos en milisegundos
    return timeRemaining > 0 && timeRemaining <= thirtyMinutes
  }

  // Función para extender la sesión
  const extendSession = (hours: number = SESSION_DURATION_HOURS) => {
    if (import.meta.client && token.value) {
      setSessionExpiration(hours)
      console.log(`Sesión extendida por ${hours} horas`)
    }
  }

  // Verificar expiración de sesión periódicamente (solo en cliente)
  if (import.meta.client) {
    // Verificar cada 5 minutos
    setInterval(() => {
      if (token.value && !validateStoredSession()) {
        console.log('Sesión expirada detectada en verificación periódica')
        // Limpiar sesión expirada automáticamente
        token.value = null
        user.value = null
        selectedOrgId.value = null
        clearLocalStorage()
        
        // Redirigir a la página de bienvenida
        navigateTo('/welcome', { replace: true })
      }
    }, 5 * 60 * 1000) // 5 minutos
  }

  return {
    // Estados
    user: readonly(user),
    token: readonly(token),
    isAuthenticated,
    selectedOrgId: readonly(selectedOrgId),
    
    // Funciones de autenticación
    login,
    register,
    logout,
    refreshToken,
    checkAuth,
    restoreSession,
    selectOrganization,
    getAuthHeaders,
    clearLocalStorage,
    
    // Funciones de manejo de sesión
    getSessionTimeRemaining,
    isSessionExpiringSoon,
    extendSession,
    validateStoredSession
  }
}
