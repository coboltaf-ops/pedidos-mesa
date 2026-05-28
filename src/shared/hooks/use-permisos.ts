'use client'

export function usePermisos(modulo?: string) {
  return {
    crear: true,
    leer: true,
    actualizar: true,
    eliminar: true,
  }
}
