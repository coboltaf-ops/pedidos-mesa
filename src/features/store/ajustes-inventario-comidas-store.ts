import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { AjusteInventarioComida } from '../types'

export function nextNumeroAjuste(records: AjusteInventarioComida[]): string {
  const numeros = records.map((r) => parseInt(r.numero.replace('AJ-', '')) || 0)
  const maximo = numeros.length === 0 ? 0 : Math.max(...numeros)
  return `AJ-${String(maximo + 1).padStart(5, '0')}`
}

interface AjustesStore {
  ajustes: AjusteInventarioComida[]
  addAjuste: (ajuste: AjusteInventarioComida) => void
  updateAjuste: (id: string, ajuste: Partial<AjusteInventarioComida>) => void
  deleteAjuste: (id: string) => void
  setAjustes: (ajustes: AjusteInventarioComida[]) => void
}

export const useAjustesInventarioComidasStore = create<AjustesStore>()(
  persist(
    (set) => ({
      ajustes: [],
      addAjuste: (ajuste) =>
        set((state) => ({
          ajustes: [...state.ajustes, ajuste],
        })),
      updateAjuste: (id, ajuste) =>
        set((state) => ({
          ajustes: state.ajustes.map((a) => (a.id === id ? { ...a, ...ajuste } : a)),
        })),
      deleteAjuste: (id) =>
        set((state) => ({
          ajustes: state.ajustes.filter((a) => a.id !== id),
        })),
      setAjustes: (ajustes) => set({ ajustes }),
    }),
    {
      name: 'ajustes-inventario-comidas-storage',
    }
  )
)
