/**
 * Composable para manejar configuraciones de dropdown mejoradas
 */
export const useDropdown = () => {
  // Configuración para dropdowns en el header (parte superior)
  const headerDropdownConfig = {
    content: {
      side: 'bottom' as const,
      align: 'end' as const,
      sideOffset: 8,
      collisionPadding: 8
    },
    portal: false, // Deshabilitar portal para mejor posicionamiento
    ui: {
      content: 'z-[9999]'
    }
  }

  // Configuración para dropdowns en el sidebar expandido
  const sidebarExpandedDropdownConfig = {
    content: {
      side: 'top' as const,
      align: 'start' as const,
      sideOffset: 8,
      collisionPadding: 8
    },
    portal: false, // Deshabilitar portal para mejor posicionamiento
    ui: {
      content: 'z-[9999]'
    }
  }

  // Configuración para dropdowns en el sidebar colapsado
  const sidebarCollapsedDropdownConfig = {
    content: {
      side: 'right' as const,
      align: 'start' as const,
      sideOffset: 8,
      collisionPadding: 8
    },
    portal: false, // Deshabilitar portal para mejor posicionamiento
    ui: {
      content: 'z-[9999]'
    }
  }

  return {
    headerDropdownConfig,
    sidebarExpandedDropdownConfig,
    sidebarCollapsedDropdownConfig
  }
}
