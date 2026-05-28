'use client'

import { useEffect } from 'react'
import { useDatosEmpresaComidasStore } from '@/features/inventario-comidas/store/datos-empresa-comidas-store'

export function InventarioComidasDataInitializer() {
  useEffect(() => {
    // Hydrate datos empresa comidas from localStorage BEFORE other hooks
    const hydrate = useDatosEmpresaComidasStore.getState().hydrate
    hydrate()
    console.log('🔧 InventarioComidasDataInitializer: Hydrating datos empresa comidas')
  }, [])

  return null
}
