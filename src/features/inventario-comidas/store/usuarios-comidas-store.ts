import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { UsuarioComida } from '../types'

interface UsuariosStore {
  usuarios: UsuarioComida[]
  addUsuario: (usuario: UsuarioComida) => void
  updateUsuario: (id: string, usuario: Partial<UsuarioComida>) => void
  deleteUsuario: (id: string) => void
  setUsuarios: (usuarios: UsuarioComida[]) => void
}

export const useUsuariosComidasStore = create<UsuariosStore>()(
  persist(
    (set) => ({
      usuarios: [],
      addUsuario: (usuario) =>
        set((state) => ({
          usuarios: [...state.usuarios, usuario],
        })),
      updateUsuario: (id, usuario) =>
        set((state) => ({
          usuarios: state.usuarios.map((u) => (u.id === id ? { ...u, ...usuario } : u)),
        })),
      deleteUsuario: (id) =>
        set((state) => ({
          usuarios: state.usuarios.filter((u) => u.id !== id),
        })),
      setUsuarios: (usuarios) => set({ usuarios }),
    }),
    {
      name: 'usuarios-comidas-storage',
    }
  )
)
