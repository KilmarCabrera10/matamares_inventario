export const useApi = () => {
  const config = useRuntimeConfig()
  const { getAuthHeaders } = useAuth()

  // Método genérico para hacer peticiones GET
  const get = async <T>(url: string): Promise<T> => {
    const headers = getAuthHeaders()
    
    const data = await $fetch<T>(url, {
      baseURL: config.public.apiBase,
      headers
    })
    
    return data as T
  }

  // Método genérico para hacer peticiones POST
  const post = async <T>(url: string, body: Record<string, unknown>): Promise<T> => {
    const headers = getAuthHeaders()
    
    const data = await $fetch<T>(url, {
      method: 'POST',
      baseURL: config.public.apiBase,
      headers,
      body
    })
    
    return data as T
  }

  // Método genérico para hacer peticiones PUT
  const put = async <T>(url: string, body: Record<string, unknown>): Promise<T> => {
    const headers = getAuthHeaders()
    
    const data = await $fetch<T>(url, {
      method: 'PUT',
      baseURL: config.public.apiBase,
      headers,
      body
    })
    
    return data as T
  }

  // Método genérico para hacer peticiones DELETE
  const del = async (url: string): Promise<void> => {
    const headers = getAuthHeaders()
    
    await $fetch(url, {
      method: 'DELETE',
      baseURL: config.public.apiBase,
      headers
    })
  }

  return {
    get,
    post,
    put,
    delete: del
  }
}
