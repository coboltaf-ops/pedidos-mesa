import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { OrdenComida } from '../types'

export function nextNumeroOC(records: OrdenComida[]): string {
  const numeros = records.map((r) => parseInt(r.numero.replace('OC-', '')) || 0)
  const maximo = numeros.length === 0 ? 0 : Math.max(...numeros)
  return `OC-${String(maximo + 1).padStart(5, '0')}`
}

interface OrdenesStore {
  ordenes: OrdenComida[]
  addOrdenComida: (orden: OrdenComida) => void
  updateOrdenComida: (id: string, orden: Partial<OrdenComida>) => void
  deleteOrdenComida: (id: string) => void
  setOrdenesComidas: (ordenes: OrdenComida[]) => void
}

export const useOrdenesComidasStore = create<OrdenesStore>()(
  persist(
    (set) => ({
      ordenes: [],
      addOrdenComida: (orden) =>
        set((state) => ({
          ordenes: [...state.ordenes, orden],
        })),
      updateOrdenComida: (id, orden) =>
        set((state) => ({
          ordenes: state.ordenes.map((o) => (o.id === id ? { ...o, ...orden } : o)),
        })),
      deleteOrdenComida: (id) =>
        set((state) => ({
          ordenes: state.ordenes.filter((o) => o.id !== id),
        })),
      setOrdenesComidas: (ordenes) => set({ ordenes }),
    }),
    {
      name: 'ordenes-compra-comidas-storage',
    }
  )
)
