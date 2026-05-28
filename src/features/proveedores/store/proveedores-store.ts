import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type Proveedor = {
  id?: string
  nombre?: string
  [key: string]: any
}

interface ProveedoresState {
  proveedores: Proveedor[]
  addProveedor: (p: Proveedor) => void
  updateProveedor: (id: string, p: Partial<Proveedor>) => void
  deleteProveedor: (id: string) => void
}

export const useProveedoresStore = create<ProveedoresState>()(
  persist(
    (set) => ({
      proveedores: [],
      addProveedor: (p) => set((s) => ({ proveedores: [...s.proveedores, p] })),
      updateProveedor: (id, p) =>
        set((s) => ({
          proveedores: s.proveedores.map((x) => (x.id === id ? { ...x, ...p } : x)),
        })),
      deleteProveedor: (id) =>
        set((s) => ({ proveedores: s.proveedores.filter((x) => x.id !== id) })),
    }),
    { name: 'proveedores-storage' }
  )
)
