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
    const response = await api.get<{ success: boolean; data: { saldo: number } }>('/cuadres/saldo-anterior')
    return response.data?.saldo || 0
  }

  // Obtener estadísticas del día
  const obtenerEstadisticasDia = async (fecha?: string): Promise<DailyStats> => {
    const fechaParam = fecha || new Date().toISOString().split('T')[0]
    const response = await api.get<{ 
      success: boolean; 
      data: { ingresos: number; gastos: number } 
    }>(`/movimientos/estadisticas-dia?fecha=${fechaParam}`)
    
    const data = response.data || { ingresos: 0, gastos: 0 }
    return {
      ingresos: data.ingresos || 0,
      gastos: data.gastos || 0,
      diferencia: (data.ingresos || 0) - (data.gastos || 0)
    }
  }

  // Obtener historial de cuadres
  const obtenerHistorialCuadres = async (limite: number = 10): Promise<HistorialCuadre[]> => {
    const response = await api.get<{ 
      success: boolean; 
      message: string; 
      data: HistorialCuadre[] 
    }>(`/cuadres/historial?limit=${limite}`)
    
    // Extraer el array de data de la respuesta
    return response.data || []
  }

  // Guardar cuadre de caja
  const guardarCuadre = async (cuadreCompleto: CuadreCompleto): Promise<CuadreResponse> => {
    const response = await api.post<{
      success: boolean;
      message: string;
      data: CuadreCompleto & { id: number }
    }>('/cuadres', {
      ...cuadreCompleto,
      fecha: new Date().toISOString(),
      createdAt: new Date().toISOString()
    })
    
    return {
      id: response.data.id,
      mensaje: response.message,
      cuadre: response.data
    }
  }

  // Validar cuadre existente para la fecha
  const validarCuadreExistente = async (fecha?: string): Promise<boolean> => {
    const fechaParam = fecha || new Date().toISOString().split('T')[0]
    const response = await api.get<{ 
      success: boolean; 
      data: { existe: boolean } 
    }>(`/cuadres/validar-fecha?fecha=${fechaParam}`)
    
    return response.data?.existe || false
  }

  // Obtener cuadre por fecha
  const obtenerCuadrePorFecha = async (fecha: string): Promise<CuadreCompleto | null> => {
    try {
      const response = await api.get<{ 
        success: boolean; 
        data: CuadreCompleto 
      }>(`/cuadres/fecha/${fecha}`)
      
      return response.data || null
    } catch (error ) {
      return null
    }
  }

  // Actualizar cuadre existente
  const actualizarCuadre = async (id: number, cuadreCompleto: Partial<CuadreCompleto>): Promise<CuadreResponse> => {
    const response = await api.put<{
      success: boolean;
      message: string;
      data: CuadreCompleto & { id: number }
    }>(`/cuadres/${id}`, cuadreCompleto)
    
    return {
      id: response.data.id,
      mensaje: response.message,
      cuadre: response.data
    }
  }

  // Eliminar cuadre
  const eliminarCuadre = async (id: number): Promise<boolean> => {
    await api.delete(`/cuadres/${id}`)
    return true
  }

  return {
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
