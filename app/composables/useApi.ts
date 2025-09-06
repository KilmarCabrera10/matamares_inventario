export const useApi = () => {
  const config = useRuntimeConfig()
  const { getAuthHeaders } = useAuth()

  // Método genérico para hacer peticiones GET
  const get = async <T>(url: string): Promise<T> => {
    try {
      const data = await $fetch<T>(url, {
        baseURL: config.public.apiBase,
        headers: getAuthHeaders()
      })
      return data as T
    } catch (error) {
      console.error(`Error en GET ${url}:`, error)
      throw error
    }
  }

  // Método genérico para hacer peticiones POST
  const post = async <T>(url: string, body: Record<string, unknown>): Promise<T> => {
    try {
      const data = await $fetch<T>(url, {
        method: 'POST',
        baseURL: config.public.apiBase,
        headers: getAuthHeaders(),
        body
      })
      return data as T
    } catch (error) {
      console.error(`Error en POST ${url}:`, error)
      throw error
    }
  }

  // Método genérico para hacer peticiones PUT
  const put = async <T>(url: string, body: Record<string, unknown>): Promise<T> => {
    try {
      const data = await $fetch<T>(url, {
        method: 'PUT',
        baseURL: config.public.apiBase,
        headers: getAuthHeaders(),
        body
      })
      return data as T
    } catch (error) {
      console.error(`Error en PUT ${url}:`, error)
      throw error
    }
  }

  // Método genérico para hacer peticiones DELETE
  const del = async (url: string): Promise<void> => {
    try {
      await $fetch(url, {
        method: 'DELETE',
        baseURL: config.public.apiBase,
        headers: getAuthHeaders()
      })
    } catch (error) {
      console.error(`Error en DELETE ${url}:`, error)
      throw error
    }
  }

  return {
    get,
    post,
    put,
    delete: del
  }
}
