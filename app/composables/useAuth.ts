export interface User {
  id: string
  name: string
  email: string
  organizations: Organization[]
}

export interface AuthResponse {
  success: boolean
  data?: {
    user: User
    token: string
    expires_at: string
  }
  message?: string
  error?: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  name: string
  email: string
  password: string
  password_confirmation: string
}

export const useAuth = () => {
  // Estados reactivos
  const user = useState<User | null>('auth.user', () => null)
  const token = useState<string | null>('auth.token', () => null)
  const isAuthenticated = computed(() => !!token.value && !!user.value)
  const selectedOrgId = useState<string | null>('auth.selectedOrgId', () => null)

  const config = useRuntimeConfig()
  const baseURL = config.public.apiBase

  // Headers con autenticación
  const getAuthHeaders = (organizationId?: string | number) => {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    }
    
    if (token.value) {
      headers['Authorization'] = `Bearer ${token.value}`
    }
    
    if (organizationId) {
      headers['Organization-Id'] = organizationId.toString()
    }
    
    return headers
  }

  // Funciones de autenticación
  const login = async (credentials: LoginCredentials) => {
    try {
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
        if (response.data.user.organizations?.length > 0) {
          selectedOrgId.value = response.data.user.organizations[0]?.id.toString() || null
        }

        // Persistir en localStorage
        if (import.meta.client) {
          localStorage.setItem('auth_token', response.data.token)
          localStorage.setItem('auth_user', JSON.stringify(response.data.user))
          if (selectedOrgId.value) {
            localStorage.setItem('selected_org_id', selectedOrgId.value)
          }
        }

        return response
      }
      
      throw new Error(response.message || 'Error en el login')
    } catch (error: unknown) {
      console.error('Error en login:', error)
      throw error
    }
  }

  const register = async (data: RegisterData) => {
    try {
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
        }

        return response
      }
      
      throw new Error(response.message || 'Error en el registro')
    } catch (error: unknown) {
      console.error('Error en registro:', error)
      throw error
    }
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
      
      if (import.meta.client) {
        localStorage.removeItem('auth_token')
        localStorage.removeItem('auth_user')
        localStorage.removeItem('selected_org_id')
      }
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
      await logout()
      return false
    }
  }

  // Restaurar sesión desde localStorage
  const restoreSession = () => {
    if (import.meta.client) {
      const savedToken = localStorage.getItem('auth_token')
      const savedUser = localStorage.getItem('auth_user')
      const savedOrgId = localStorage.getItem('selected_org_id')
      
      if (savedToken && savedUser) {
        try {
          token.value = savedToken
          user.value = JSON.parse(savedUser)
          selectedOrgId.value = savedOrgId
        } catch (error) {
          console.error('Error al restaurar sesión:', error)
          // Limpiar datos corruptos
          localStorage.removeItem('auth_token')
          localStorage.removeItem('auth_user')
          localStorage.removeItem('selected_org_id')
        }
      }
    }
  }

  // Seleccionar organización
  const selectOrganization = (orgId: string) => {
    selectedOrgId.value = orgId
    if (import.meta.client) {
      localStorage.setItem('selected_org_id', orgId)
    }
  }

  return {
    // Estados
    user: readonly(user),
    token: readonly(token),
    isAuthenticated,
    selectedOrgId: readonly(selectedOrgId),
    
    // Funciones
    login,
    register,
    logout,
    refreshToken,
    checkAuth,
    restoreSession,
    selectOrganization,
    getAuthHeaders
  }
}
