import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { BodegaComida } from '../types'

export function nextCodigoBodega(records: BodegaComida[]): string {
  const numeros = records.map((r) => parseInt(r.codigo.replace('BD-', '')) || 0)
  const maximo = numeros.length === 0 ? 0 : Math.max(...numeros)
  return `BD-${String(maximo + 1).padStart(5, '0')}`
}

interface BodegasStore {
  bodegas: BodegaComida[]
  addBodegaComida: (bodega: BodegaComida) => void
  updateBodegaComida: (id: string, bodega: Partial<BodegaComida>) => void
  deleteBodegaComida: (id: string) => void
  setBodyegasComidas: (bodegas: BodegaComida[]) => void
}

export const useBodegasComidasStore = create<BodegasStore>()(
  persist(
    (set) => ({
      bodegas: [],
      addBodegaComida: (bodega) =>
        set((state) => ({
          bodegas: [...state.bodegas, bodega],
        })),
      updateBodegaComida: (id, bodega) =>
        set((state) => ({
          bodegas: state.bodegas.map((b) => (b.id === id ? { ...b, ...bodega } : b)),
        })),
      deleteBodegaComida: (id) =>
        set((state) => ({
          bodegas: state.bodegas.filter((b) => b.id !== id),
        })),
      setBodyegasComidas: (bodegas) => set({ bodegas }),
    }),
    {
      name: 'bodegas-comidas-storage',
    }
  )
)
