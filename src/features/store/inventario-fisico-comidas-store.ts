import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { InventarioFisicoComida } from '../types'

export function nextNumeroInventarioFisico(records: InventarioFisicoComida[]): string {
  const numeros = records.map((r) => parseInt(r.numero.replace('IF-', '')) || 0)
  const maximo = numeros.length === 0 ? 0 : Math.max(...numeros)
  return `IF-${String(maximo + 1).padStart(5, '0')}`
}

interface InventarioFisicoStore {
  inventarios: InventarioFisicoComida[]
  addInventarioFisico: (inventario: InventarioFisicoComida) => void
  updateInventarioFisico: (id: string, inventario: Partial<InventarioFisicoComida>) => void
  deleteInventarioFisico: (id: string) => void
  setInventariosFisicos: (inventarios: InventarioFisicoComida[]) => void
}

export const useInventarioFisicoComidasStore = create<InventarioFisicoStore>()(
  persist(
    (set) => ({
      inventarios: [],
      addInventarioFisico: (inventario) =>
        set((state) => ({
          inventarios: [...state.inventarios, inventario],
        })),
      updateInventarioFisico: (id, inventario) =>
        set((state) => ({
          inventarios: state.inventarios.map((i) => (i.id === id ? { ...i, ...inventario } : i)),
        })),
      deleteInventarioFisico: (id) =>
        set((state) => ({
          inventarios: state.inventarios.filter((i) => i.id !== id),
        })),
      setInventariosFisicos: (inventarios) => set({ inventarios }),
    }),
    {
      name: 'inventario-fisico-comidas-storage',
    }
  )
)
