// ========================================
// TIPOS COMPARTIDOS DE LA APLICACIÓN
// ========================================

// Organización
export interface Organization {
  id: number
  name: string
  description?: string
  created_at: string
  updated_at: string
}

// Usuario base (como viene del backend)
export interface BaseUser {
  id: string
  name: string
  email: string
  organizations?: Organization[] // Opcional, se puede agregar después
}

// Respuesta de autenticación
export interface AuthResponse {
  success: boolean
  data?: {
    user: BaseUser
    token: string
    expires_at: string
    organizations: Organization[] // Las organizaciones vienen separadas del usuario
  }
  message?: string
  error?: string
}

// Credenciales de login
export interface LoginCredentials {
  email: string
  password: string
}

// Datos de registro
export interface RegisterData {
  name: string
  email: string
  password: string
  password_confirmation: string
}

// Estados de respuesta API genérica
export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  message?: string
  error?: string
}

// Headers de autenticación
export interface AuthHeaders {
  'Content-Type': string
  token?: string
  organizationId?: string
}
