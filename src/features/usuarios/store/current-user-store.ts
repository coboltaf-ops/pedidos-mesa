import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type Usuario = {
  id?: string
  nombre?: string
  apellido?: string
  rol?: string
  correo?: string
  [key: string]: any
}

interface CurrentUserState {
  user: Usuario
  setUser: (u: Usuario) => void
  logout: () => void
}

export const useCurrentUserStore = create<CurrentUserState>()(
  persist(
    (set) => ({
      user: {
        id: '1',
        nombre: 'Usuario',
        apellido: 'Sistema',
        rol: 'admin',
        correo: 'admin@sistema.com',
      },
      setUser: (u) => set({ user: u }),
      logout: () =>
        set({
          user: {
            id: '1',
            nombre: 'Usuario',
            apellido: 'Sistema',
            rol: 'admin',
            correo: 'admin@sistema.com',
          },
        }),
    }),
    { name: 'current-user-storage' }
  )
)
