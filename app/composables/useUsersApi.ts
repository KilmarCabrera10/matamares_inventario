export interface User {
  id: number
  name: string
  email: string
  email_verified_at?: string
  created_at: string
  updated_at: string
}

export interface CreateUserRequest {
  name: string
  email: string
  password: string
  password_confirmation: string
}

export interface UpdateUserRequest {
  name?: string
  email?: string
  password?: string
  password_confirmation?: string
}

export const useUsersApi = () => {
  const config = useRuntimeConfig()
  
  // Obtener todos los usuarios
  const getUsers = async (): Promise<User[]> => {
    try {
      const data = await $fetch<{ data?: User[] } | User[]>('/users', {
        baseURL: config.public.apiBase
      })
      return Array.isArray(data) ? data : data.data || []
    } catch (error) {
      console.error('Error al obtener usuarios:', error)
      throw error
    }
  }

  // Obtener un usuario por ID
  const getUser = async (id: number): Promise<User> => {
    try {
      const data = await $fetch<{ data?: User } | User>(`/users/${id}`, {
        baseURL: config.public.apiBase
      })
      return typeof data === 'object' && 'data' in data ? data.data! : data as User
    } catch (error) {
      console.error('Error al obtener usuario:', error)
      throw error
    }
  }

  // Crear un nuevo usuario
  const createUser = async (userData: CreateUserRequest): Promise<User> => {
    try {
      const data = await $fetch<{ data?: User } | User>('/users', {
        method: 'POST',
        baseURL: config.public.apiBase,
        body: userData
      })
      return typeof data === 'object' && 'data' in data ? data.data! : data as User
    } catch (error) {
      console.error('Error al crear usuario:', error)
      throw error
    }
  }

  // Actualizar un usuario
  const updateUser = async (id: number, userData: UpdateUserRequest): Promise<User> => {
    try {
      const data = await $fetch<{ data?: User } | User>(`/users/${id}`, {
        method: 'PUT',
        baseURL: config.public.apiBase,
        body: userData
      })
      return typeof data === 'object' && 'data' in data ? data.data! : data as User
    } catch (error) {
      console.error('Error al actualizar usuario:', error)
      throw error
    }
  }

  // Eliminar un usuario
  const deleteUser = async (id: number): Promise<void> => {
    try {
      await $fetch(`/users/${id}`, {
        method: 'DELETE',
        baseURL: config.public.apiBase
      })
    } catch (error) {
      console.error('Error al eliminar usuario:', error)
      throw error
    }
  }

  return {
    getUsers,
    getUser,
    createUser,
    updateUser,
    deleteUser
  }
}
