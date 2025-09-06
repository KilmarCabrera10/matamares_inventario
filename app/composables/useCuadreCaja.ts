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
    const response = await api.get<{ saldo: number }>('/cuadres/saldo-anterior')
    return response.saldo || 0
  }

  // Obtener estadísticas del día
  const obtenerEstadisticasDia = async (fecha?: string): Promise<DailyStats> => {
    const fechaParam = fecha || new Date().toISOString().split('T')[0]
    const response = await api.get<{ ingresos: number; gastos: number }>(`/movimientos/estadisticas-dia?fecha=${fechaParam}`)
    
    return {
      ingresos: response.ingresos || 0,
      gastos: response.gastos || 0,
      diferencia: (response.ingresos || 0) - (response.gastos || 0)
    }
  }

  // Obtener historial de cuadres
  const obtenerHistorialCuadres = async (limite: number = 10): Promise<HistorialCuadre[]> => {
    const response = await api.get<{ cuadres: HistorialCuadre[] }>(`/cuadres/historial?limit=${limite}`)
    return response.cuadres || []
  }

  // Guardar cuadre de caja
  const guardarCuadre = async (cuadreCompleto: CuadreCompleto): Promise<CuadreResponse> => {
    const response = await api.post<CuadreResponse>('/cuadres', {
      ...cuadreCompleto,
      fecha: new Date().toISOString(),
      createdAt: new Date().toISOString()
    })
    return response
  }

  // Validar cuadre existente para la fecha
  const validarCuadreExistente = async (fecha?: string): Promise<boolean> => {
    try {
      const fechaParam = fecha || new Date().toISOString().split('T')[0]
      const response = await api.get<{ existe: boolean }>(`/cuadres/validar-fecha?fecha=${fechaParam}`)
      return response.existe || false
    } catch {
      return false
    }
  }

  // Obtener cuadre por fecha
  const obtenerCuadrePorFecha = async (fecha: string): Promise<CuadreCompleto | null> => {
    try {
      const response = await api.get<{ cuadre: CuadreCompleto }>(`/cuadres/fecha/${fecha}`)
      return response.cuadre || null
    } catch {
      return null
    }
  }

  // Actualizar cuadre existente
  const actualizarCuadre = async (id: number, cuadreCompleto: Partial<CuadreCompleto>): Promise<CuadreResponse> => {
    const response = await api.put<CuadreResponse>(`/cuadres/${id}`, {
      ...cuadreCompleto,
      updatedAt: new Date().toISOString()
    })
    return response
  }

  // Eliminar cuadre
  const eliminarCuadre = async (id: number): Promise<boolean> => {
    await api.delete(`/cuadres/${id}`)
    return true
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
