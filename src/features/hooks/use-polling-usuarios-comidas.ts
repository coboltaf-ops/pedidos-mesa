import { useEffect } from 'react'
import { useUsuariosComidasStore } from '../store/usuarios-comidas-store'

export function usePollingUsuariosComidas(intervalMs: number = 5000) {
  const setUsuarios = useUsuariosComidasStore((s) => s.setUsuarios)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/data/usuarios-comidas')
        if (res.ok) {
          const data = await res.json()
          setUsuarios(data)
        }
      } catch (err) {
        console.error('Error polling usuarios-comidas:', err)
      }
    }

    fetchData()
    const interval = setInterval(fetchData, intervalMs)
    return () => clearInterval(interval)
  }, [setUsuarios, intervalMs])
}
