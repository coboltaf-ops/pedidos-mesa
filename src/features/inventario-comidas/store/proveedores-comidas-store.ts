import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { ProveedorComida } from '../types'

export function nextCodigoProveedor(records: ProveedorComida[]): string {
  const numeros = records.map((r) => parseInt(r.codigo.replace('PC-', '')) || 0)
  const maximo = numeros.length === 0 ? 0 : Math.max(...numeros)
  return `PC-${String(maximo + 1).padStart(5, '0')}`
}

interface ProveedoresStore {
  proveedores: ProveedorComida[]
  addProveedorComida: (proveedor: ProveedorComida) => void
  updateProveedorComida: (id: string, proveedor: Partial<ProveedorComida>) => void
  deleteProveedorComida: (id: string) => void
  setProveedoresComidas: (proveedores: ProveedorComida[]) => void
}

export const useProveedoresComidasStore = create<ProveedoresStore>()(
  persist(
    (set) => ({
      proveedores: [],
      addProveedorComida: (proveedor) =>
        set((state) => ({
          proveedores: [...state.proveedores, proveedor],
        })),
      updateProveedorComida: (id, proveedor) =>
        set((state) => ({
          proveedores: state.proveedores.map((p) => (p.id === id ? { ...p, ...proveedor } : p)),
        })),
      deleteProveedorComida: (id) =>
        set((state) => ({
          proveedores: state.proveedores.filter((p) => p.id !== id),
        })),
      setProveedoresComidas: (proveedores) => set({ proveedores }),
    }),
    {
      name: 'proveedores-comidas-storage',
    }
  )
)
