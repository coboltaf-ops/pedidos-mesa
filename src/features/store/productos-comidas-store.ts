import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { ProductoComida, TipoProductoComida } from '../types'

export function nextCodigoComida(
  records: ProductoComida[],
  tipo: TipoProductoComida
): string {
  const prefix = tipo === 'Plato' ? 'PC' : 'MC'
  const max = records.reduce((m, r) => {
    if (!r.codigo.startsWith(`${prefix}-`)) return m
    const n = parseInt(r.codigo.replace(`${prefix}-`, ''), 10)
    return isNaN(n) ? m : Math.max(m, n)
  }, 0)
  return `${prefix}-${String(max + 1).padStart(5, '0')}`
}

interface ProductosComidasState {
  productos: ProductoComida[]
  addProductoComida: (p: ProductoComida) => void
  updateProductoComida: (id: string, p: Partial<ProductoComida>) => void
  deleteProductoComida: (id: string) => void
  setProductosComidas: (ps: ProductoComida[]) => void
}

export const useProductosComidasStore = create<ProductosComidasState>()(
  persist(
    (set) => ({
      productos: [],

      addProductoComida: (p: ProductoComida) =>
        set((s) => ({ productos: [...s.productos, p] })),

      updateProductoComida: (id: string, p: Partial<ProductoComida>) =>
        set((s) => ({
          productos: s.productos.map((r) =>
            r.id === id ? { ...r, ...p } : r
          ),
        })),

      deleteProductoComida: (id: string) =>
        set((s) => ({
          productos: s.productos.filter((r) => r.id !== id),
        })),

      setProductosComidas: (ps: ProductoComida[]) =>
        set(() => ({
          productos: ps,
        })),
    }),
    {
      name: 'productos-comidas-storage',
    }
  )
)
