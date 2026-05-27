import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { DatosEmpresaComida } from '../types'

interface DatosEmpresaStore {
  datosEmpresa: DatosEmpresaComida | null
  setDatosEmpresa: (datos: DatosEmpresaComida) => void
  updateDatosEmpresa: (datos: Partial<DatosEmpresaComida>) => void
}

export const useDatosEmpresaComidasStore = create<DatosEmpresaStore>()(
  persist(
    (set) => ({
      datosEmpresa: null,
      setDatosEmpresa: (datos) => set({ datosEmpresa: datos }),
      updateDatosEmpresa: (datos) =>
        set((state) => ({
          datosEmpresa: state.datosEmpresa ? { ...state.datosEmpresa, ...datos } : null,
        })),
    }),
    {
      name: 'datos-empresa-comidas-storage',
    }
  )
)
