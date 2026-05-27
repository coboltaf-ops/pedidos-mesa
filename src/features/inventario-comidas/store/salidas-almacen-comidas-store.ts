import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { SalidaAlmacenComida } from '../types'

export function nextNumeroSalida(records: SalidaAlmacenComida[]): string {
  const numeros = records.map((r) => parseInt(r.numero.replace('SA-', '')) || 0)
  const maximo = numeros.length === 0 ? 0 : Math.max(...numeros)
  return `SA-${String(maximo + 1).padStart(5, '0')}`
}

interface SalidasStore {
  salidas: SalidaAlmacenComida[]
  addSalidaAlmacen: (salida: SalidaAlmacenComida) => void
  updateSalidaAlmacen: (id: string, salida: Partial<SalidaAlmacenComida>) => void
  deleteSalidaAlmacen: (id: string) => void
  setSalidasAlmacen: (salidas: SalidaAlmacenComida[]) => void
}

export const useSalidasAlmacenComidasStore = create<SalidasStore>()(
  persist(
    (set) => ({
      salidas: [],
      addSalidaAlmacen: (salida) =>
        set((state) => ({
          salidas: [...state.salidas, salida],
        })),
      updateSalidaAlmacen: (id, salida) =>
        set((state) => ({
          salidas: state.salidas.map((s) => (s.id === id ? { ...s, ...salida } : s)),
        })),
      deleteSalidaAlmacen: (id) =>
        set((state) => ({
          salidas: state.salidas.filter((s) => s.id !== id),
        })),
      setSalidasAlmacen: (salidas) => set({ salidas }),
    }),
    {
      name: 'salidas-almacen-comidas-storage',
    }
  )
)
