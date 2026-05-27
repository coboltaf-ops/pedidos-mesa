import { useEffect } from 'react'
import { useRecepcionesComidasStore } from '../store/recepcion-facturas-comidas-store'

export function usePollingRecepcionComidas(intervalMs: number = 5000) {
  const setRecepcionesComidas = useRecepcionesComidasStore((s) => s.setRecepcionesComidas)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/data/recepcion-facturas-comidas')
        if (res.ok) {
          const data = await res.json()
          setRecepcionesComidas(data)
        }
      } catch (err) {
        console.error('Error polling recepcion-facturas-comidas:', err)
      }
    }

    fetchData()
    const interval = setInterval(fetchData, intervalMs)
    return () => clearInterval(interval)
  }, [setRecepcionesComidas, intervalMs])
}
