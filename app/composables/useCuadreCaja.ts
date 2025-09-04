export interface CuadreData {
  saldoInicial: number
  observaciones: string
}

export interface ConteoEfectivo {
  billetes: {
    cien: number
    cincuenta: number
    veinte: number
    diez: number
    cinco: number
    dos: number
    uno: number
  }
  monedas: {
    dollar: number
    cincuentaCentavos: number
    veinticinco: number
    diez: number
    cinco: number
    uno: number
  }
}

export interface DailyStats {
  ingresos: number
  gastos: number
  diferencia: number
}

export interface HistorialCuadre {
  id: number
  fecha: string
  saldoInicial: number
  efectivoReal: number
  diferencia: number
  observaciones: string
  usuarioId?: number
  usuario?: string
  createdAt?: string
  updatedAt?: string
}

export interface CuadreCompleto {
  cuadre: CuadreData
  conteoEfectivo: ConteoEfectivo
  totalEfectivoContado: number
  diferenciaCuadre: number
  fecha: string
  usuarioId?: number
}

export interface CuadreResponse {
  id: number
  mensaje: string
  cuadre?: CuadreCompleto
}

export const useCuadreCaja = () => {
  const api = useApi()

  // Obtener saldo anterior (último cuadre)
  const obtenerSaldoAnterior = async (): Promise<number> => {
    try {
      const response = await api.get<{ saldo: number }>('/cuadres/saldo-anterior')
      return response.saldo || 0
    } catch (error) {
      console.error('Error al obtener saldo anterior:', error)
      throw error
    }
  }

  // Obtener estadísticas del día
  const obtenerEstadisticasDia = async (fecha?: string): Promise<DailyStats> => {
    try {
      const fechaParam = fecha || new Date().toISOString().split('T')[0]
      const response = await api.get<{ ingresos: number; gastos: number }>(`/movimientos/estadisticas-dia?fecha=${fechaParam}`)
      
      return {
        ingresos: response.ingresos || 0,
        gastos: response.gastos || 0,
        diferencia: (response.ingresos || 0) - (response.gastos || 0)
      }
    } catch (error) {
      console.error('Error al obtener estadísticas del día:', error)
      throw error
    }
  }

  // Obtener historial de cuadres
  const obtenerHistorialCuadres = async (limite: number = 10): Promise<HistorialCuadre[]> => {
    try {
      const response = await api.get<{ cuadres: HistorialCuadre[] }>(`/cuadres/historial?limit=${limite}`)
      return response.cuadres || []
    } catch (error) {
      console.error('Error al obtener historial de cuadres:', error)
      throw error
    }
  }

  // Guardar cuadre de caja
  const guardarCuadre = async (cuadreCompleto: CuadreCompleto): Promise<CuadreResponse> => {
    try {
      const response = await api.post<CuadreResponse>('/cuadres', {
        ...cuadreCompleto,
        fecha: new Date().toISOString(),
        createdAt: new Date().toISOString()
      })
      return response
    } catch (error) {
      console.error('Error al guardar cuadre:', error)
      throw error
    }
  }

  // Validar cuadre existente para la fecha
  const validarCuadreExistente = async (fecha?: string): Promise<boolean> => {
    try {
      const fechaParam = fecha || new Date().toISOString().split('T')[0]
      const response = await api.get<{ existe: boolean }>(`/cuadres/validar-fecha?fecha=${fechaParam}`)
      return response.existe || false
    } catch (error) {
      console.error('Error al validar cuadre existente:', error)
      return false
    }
  }

  // Obtener cuadre por fecha
  const obtenerCuadrePorFecha = async (fecha: string): Promise<CuadreCompleto | null> => {
    try {
      const response = await api.get<{ cuadre: CuadreCompleto }>(`/cuadres/fecha/${fecha}`)
      return response.cuadre || null
    } catch (error) {
      console.error('Error al obtener cuadre por fecha:', error)
      return null
    }
  }

  // Actualizar cuadre existente
  const actualizarCuadre = async (id: number, cuadreCompleto: Partial<CuadreCompleto>): Promise<CuadreResponse> => {
    try {
      const response = await api.put<CuadreResponse>(`/cuadres/${id}`, {
        ...cuadreCompleto,
        updatedAt: new Date().toISOString()
      })
      return response
    } catch (error) {
      console.error('Error al actualizar cuadre:', error)
      throw error
    }
  }

  // Eliminar cuadre
  const eliminarCuadre = async (id: number): Promise<boolean> => {
    try {
      await api.delete(`/cuadres/${id}`)
      return true
    } catch (error) {
      console.error('Error al eliminar cuadre:', error)
      throw error
    }
  }

  return {
    // Métodos principales
    obtenerSaldoAnterior,
    obtenerEstadisticasDia,
    obtenerHistorialCuadres,
    guardarCuadre,
    validarCuadreExistente,
    obtenerCuadrePorFecha,
    actualizarCuadre,
    eliminarCuadre
  }
}
