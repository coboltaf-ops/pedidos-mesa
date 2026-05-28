import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type Orden = {
  id?: string
  numero?: string
  [key: string]: any
}

interface OrdenesState {
  ordenes: Orden[]
  addOrden: (o: Orden) => void
  updateOrden: (id: string, o: Partial<Orden>) => void
  deleteOrden: (id: string) => void
}

export const useOrdenesStore = create<OrdenesState>()(
  persist(
    (set) => ({
      ordenes: [],
      addOrden: (o) => set((s) => ({ ordenes: [...s.ordenes, o] })),
      updateOrden: (id, o) =>
        set((s) => ({
          ordenes: s.ordenes.map((x) => (x.id === id ? { ...x, ...o } : x)),
        })),
      deleteOrden: (id) =>
        set((s) => ({ ordenes: s.ordenes.filter((x) => x.id !== id) })),
    }),
    { name: 'ordenes-storage' }
  )
)
