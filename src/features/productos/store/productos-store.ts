import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type Producto = {
  id?: string
  nombre?: string
  [key: string]: any
}

interface ProductosState {
  productos: Producto[]
  addProducto: (p: Producto) => void
  updateProducto: (id: string, p: Partial<Producto>) => void
  deleteProducto: (id: string) => void
}

export const useProductosStore = create<ProductosState>()(
  persist(
    (set) => ({
      productos: [],
      addProducto: (p) => set((s) => ({ productos: [...s.productos, p] })),
      updateProducto: (id, p) =>
        set((s) => ({
          productos: s.productos.map((x) => (x.id === id ? { ...x, ...p } : x)),
        })),
      deleteProducto: (id) =>
        set((s) => ({ productos: s.productos.filter((x) => x.id !== id) })),
    }),
    { name: 'productos-storage' }
  )
)
