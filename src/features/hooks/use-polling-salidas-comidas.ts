import { useEffect } from 'react'
import { useSalidasAlmacenComidasStore } from '../store/salidas-almacen-comidas-store'

export function usePollingsSalidasComidas(intervalMs: number = 5000) {
  const setSalidasAlmacen = useSalidasAlmacenComidasStore((s) => s.setSalidasAlmacen)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/data/salidas-almacen-comidas')
        if (res.ok) {
          const data = await res.json()
          setSalidasAlmacen(data)
        }
      } catch (err) {
        console.error('Error polling salidas-almacen-comidas:', err)
      }
    }

    fetchData()
    const interval = setInterval(fetchData, intervalMs)
    return () => clearInterval(interval)
  }, [setSalidasAlmacen, intervalMs])
}
