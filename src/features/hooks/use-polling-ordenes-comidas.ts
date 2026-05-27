import { useEffect } from 'react'
import { useOrdenesComidasStore } from '../store/ordenes-compra-comidas-store'

export function usePollingOrdenesComidas(intervalMs: number = 5000) {
  const setOrdenesComidas = useOrdenesComidasStore((s) => s.setOrdenesComidas)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/data/ordenes-compra-comidas')
        if (res.ok) {
          const data = await res.json()
          setOrdenesComidas(data)
        }
      } catch (err) {
        console.error('Error polling ordenes-compra-comidas:', err)
      }
    }

    fetchData()
    const interval = setInterval(fetchData, intervalMs)
    return () => clearInterval(interval)
  }, [setOrdenesComidas, intervalMs])
}
