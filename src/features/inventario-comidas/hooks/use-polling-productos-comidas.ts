import { useEffect } from 'react'
import { useProductosComidasStore } from '../store/productos-comidas-store'
import type { ProductoComida } from '../types'

export function usePollingProductosComidas(intervalMs: number = 5000) {
  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const response = await fetch('/api/data/productos-comidas')
        if (!response.ok) throw new Error('Failed to fetch productos-comidas')
        const data: ProductoComida[] = await response.json()
        useProductosComidasStore.setState({ productos: data })
      } catch (error) {
        console.error('Error polling productos-comidas:', error)
      }
    }

    // Fetch immediately
    fetchProductos()

    // Set up interval
    const interval = setInterval(fetchProductos, intervalMs)

    return () => clearInterval(interval)
  }, [intervalMs])
}
