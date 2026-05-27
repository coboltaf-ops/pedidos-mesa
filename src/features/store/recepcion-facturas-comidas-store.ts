import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { RecepcionFacturaComida } from '../types'

export function nextNumeroRecepcion(records: RecepcionFacturaComida[]): string {
  const numeros = records.map((r) => parseInt(r.numero.replace('RF-', '')) || 0)
  const maximo = numeros.length === 0 ? 0 : Math.max(...numeros)
  return `RF-${String(maximo + 1).padStart(5, '0')}`
}

interface RecepcionStore {
  recepciones: RecepcionFacturaComida[]
  addRecepcionComida: (recepcion: RecepcionFacturaComida) => void
  updateRecepcionComida: (id: string, recepcion: Partial<RecepcionFacturaComida>) => void
  deleteRecepcionComida: (id: string) => void
  setRecepcionesComidas: (recepciones: RecepcionFacturaComida[]) => void
}

export const useRecepcionesComidasStore = create<RecepcionStore>()(
  persist(
    (set) => ({
      recepciones: [],
      addRecepcionComida: (recepcion) =>
        set((state) => ({
          recepciones: [...state.recepciones, recepcion],
        })),
      updateRecepcionComida: (id, recepcion) =>
        set((state) => ({
          recepciones: state.recepciones.map((r) => (r.id === id ? { ...r, ...recepcion } : r)),
        })),
      deleteRecepcionComida: (id) =>
        set((state) => ({
          recepciones: state.recepciones.filter((r) => r.id !== id),
        })),
      setRecepcionesComidas: (recepciones) => set({ recepciones }),
    }),
    {
      name: 'recepcion-facturas-comidas-storage',
    }
  )
)
