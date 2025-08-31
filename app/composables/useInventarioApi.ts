export interface Organization {
  id: number
  name: string
  description?: string
  created_at: string
  updated_at: string
}

export interface Product {
  id: number
  name: string
  description?: string
  sku: string
  price: number
  organization_id: number
  created_at: string
  updated_at: string
}

export interface Location {
  id: number
  name: string
  description?: string
  organization_id: number
  created_at: string
  updated_at: string
}

export interface InventoryMovement {
  id: number
  product_id: number
  location_id: number
  transaction_type: string
  quantity: number
  reference?: string
  created_at: string
  updated_at: string
}

export const useInventarioApi = () => {
  const config = useRuntimeConfig()
  const baseURL = config.public.apiBase + '/inventario'
  const { getAuthHeaders } = useAuth()

  return {
    // Health check (ruta pública)
    async healthCheck() {
      return await $fetch<{ status: string; service: string }>('/health', {
        baseURL: config.public.apiBase
      })
    },

    // === ORGANIZACIONES ===
    async getOrganizations() {
      return await $fetch<{ data: Organization[] }>('/organizations', {
        baseURL,
        headers: getAuthHeaders()
      })
    },

    async createOrganization(organization: Partial<Organization>) {
      return await $fetch<Organization>('/organizations', {
        method: 'POST',
        baseURL,
        headers: getAuthHeaders(),
        body: organization
      })
    },

    async updateOrganization(id: number, organization: Partial<Organization>) {
      return await $fetch<Organization>(`/organizations/${id}`, {
        method: 'PUT',
        baseURL,
        headers: getAuthHeaders(),
        body: organization
      })
    },

    async deleteOrganization(id: number) {
      return await $fetch(`/organizations/${id}`, {
        method: 'DELETE',
        baseURL,
        headers: getAuthHeaders()
      })
    },

    // === PRODUCTOS (requieren Organization-Id) ===
    async getProducts(organizationId: number | string) {
      return await $fetch<{ data: Product[] }>('/products', {
        baseURL,
        headers: getAuthHeaders(organizationId)
      })
    },

    async createProduct(organizationId: number | string, product: Partial<Product>) {
      return await $fetch<Product>('/products', {
        method: 'POST',
        baseURL,
        headers: getAuthHeaders(organizationId),
        body: product
      })
    },

    async searchProducts(organizationId: number | string, term: string) {
      return await $fetch<{ data: Product[] }>(`/products/search/${term}`, {
        baseURL,
        headers: getAuthHeaders(organizationId)
      })
    },

    async getLowStockProducts(organizationId: number | string) {
      return await $fetch<{ data: Product[] }>('/products/low-stock/alert', {
        baseURL,
        headers: getAuthHeaders(organizationId)
      })
    },

    // === UBICACIONES (requieren Organization-Id) ===
    async getLocations(organizationId: number | string) {
      return await $fetch<{ data: Location[] }>('/locations', {
        baseURL,
        headers: getAuthHeaders(organizationId)
      })
    },

    async createLocation(organizationId: number | string, location: Partial<Location>) {
      return await $fetch<Location>('/locations', {
        method: 'POST',
        baseURL,
        headers: getAuthHeaders(organizationId),
        body: location
      })
    },

    async getLocationStock(organizationId: number | string, locationId: number) {
      return await $fetch(`/locations/${locationId}/stock`, {
        baseURL,
        headers: getAuthHeaders(organizationId)
      })
    },

    // === INVENTARIO (requieren Organization-Id) ===
    async getDashboard(organizationId: number | string) {
      return await $fetch('/inventory/dashboard', {
        baseURL,
        headers: getAuthHeaders(organizationId)
      })
    },

    async getStock(organizationId: number | string) {
      return await $fetch('/inventory/stock', {
        baseURL,
        headers: getAuthHeaders(organizationId)
      })
    },

    async getMovements(organizationId: number | string) {
      return await $fetch<{ data: InventoryMovement[] }>('/inventory/movements', {
        baseURL,
        headers: getAuthHeaders(organizationId)
      })
    },

    async createMovement(organizationId: number | string, movement: Partial<InventoryMovement>) {
      return await $fetch<InventoryMovement>('/inventory/movements', {
        method: 'POST',
        baseURL,
        headers: getAuthHeaders(organizationId),
        body: movement
      })
    },

    async getTransactionTypes(organizationId: number | string) {
      return await $fetch('/inventory/transaction-types', {
        baseURL,
        headers: getAuthHeaders(organizationId)
      })
    },

    async getReports(organizationId: number | string) {
      return await $fetch('/inventory/reports', {
        baseURL,
        headers: getAuthHeaders(organizationId)
      })
    }
  }
}