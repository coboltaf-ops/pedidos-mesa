import { useEffect } from 'react'
import { useAjustesInventarioComidasStore } from '../store/ajustes-inventario-comidas-store'

export function usePollingAjustesComidas(intervalMs: number = 5000) {
  const setAjustes = useAjustesInventarioComidasStore((s) => s.setAjustes)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/data/ajustes-inventario-comidas')
        if (res.ok) {
          const data = await res.json()
          setAjustes(data)
        }
      } catch (err) {
        console.error('Error polling ajustes-inventario-comidas:', err)
      }
    }

    fetchData()
    const interval = setInterval(fetchData, intervalMs)
    return () => clearInterval(interval)
  }, [setAjustes, intervalMs])
}
