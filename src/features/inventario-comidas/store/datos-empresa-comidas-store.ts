import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export type DatosEmpresa = {
  id?: string
  nombre?: string
  nit?: string
  razon_social?: string
  correo?: string
  telefono_oficina?: string
  direccion?: string
  ciudad?: string
  pais?: string
  representante_legal?: string
  servidor_correo?: string
  logo?: string
}

interface DatosEmpresaComidasState {
  datosEmpresa: DatosEmpresa
  setDatosEmpresa: (datos: DatosEmpresa) => void
  hydrate: () => void
}

export const useDatosEmpresaComidasStore = create<DatosEmpresaComidasState>()(
  persist(
    (set, get) => ({
      datosEmpresa: {
        nombre: '',
        logo: '',
      },
      setDatosEmpresa: (datos) => {
        set({ datosEmpresa: datos })
        // Explicit localStorage save
        if (typeof window !== 'undefined') {
          localStorage.setItem(
            'datos-empresa-comidas-storage',
            JSON.stringify({ state: { datosEmpresa: datos } })
          )
        }
      },
      hydrate: () => {
        if (typeof window !== 'undefined') {
          const stored = localStorage.getItem('datos-empresa-comidas-storage')
          if (stored) {
            try {
              const parsed = JSON.parse(stored)
              if (parsed.state?.datosEmpresa) {
                set({ datosEmpresa: parsed.state.datosEmpresa })
                console.log('✅ Datos empresa comidas hidratados:', parsed.state.datosEmpresa)
              }
            } catch (e) {
              console.error('❌ Error hidratando datos empresa comidas:', e)
            }
          }
        }
      },
    }),
    {
      name: 'datos-empresa-comidas-storage',
      version: 1,
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        if (state) {
          console.log('Store rehydrated:', state.datosEmpresa)
        }
      },
    }
  )
)
