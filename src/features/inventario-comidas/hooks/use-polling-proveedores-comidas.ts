import { useEffect } from 'react'
import { useProveedoresComidasStore } from '../store/proveedores-comidas-store'

export function usePollingProveedoresComidas(intervalMs: number = 5000) {
  const setProveedoresComidas = useProveedoresComidasStore((s) => s.setProveedoresComidas)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/data/proveedores-comidas')
        if (res.ok) {
          const data = await res.json()
          setProveedoresComidas(data)
        }
      } catch (err) {
        console.error('Error polling proveedores-comidas:', err)
      }
    }

    fetchData()
    const interval = setInterval(fetchData, intervalMs)
    return () => clearInterval(interval)
  }, [setProveedoresComidas, intervalMs])
}
