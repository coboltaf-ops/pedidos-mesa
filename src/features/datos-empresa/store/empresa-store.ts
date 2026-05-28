import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export type DatosEmpresa = {
  id: string
  nombre: string
  nit: string
  razon_social: string
  correo: string
  telefono_oficina: string
  direccion: string
  ciudad: string
  pais: string
  representante_legal: string
  servidor_correo: string
  logo: string
}

interface EmpresaState {
  empresas: DatosEmpresa[]
  addEmpresa: (empresa: DatosEmpresa) => void
  updateEmpresa: (id: string, empresa: Partial<DatosEmpresa>) => void
  deleteEmpresa: (id: string) => void
  hydrate: () => void
  isHydrated: boolean
}

const defaultEmpresa: DatosEmpresa = {
  id: '1',
  nombre: 'Mi Empresa',
  nit: '',
  razon_social: '',
  correo: '',
  telefono_oficina: '',
  direccion: '',
  ciudad: '',
  pais: 'Colombia',
  representante_legal: '',
  servidor_correo: '',
  logo: '',
}

// Helper para guardar logo en IndexedDB (para Vercel)
const saveLogoToIndexedDB = async (empresaId: string, logoData: string): Promise<void> => {
  if (typeof window === 'undefined' || !logoData) return

  try {
    const db = await new Promise<IDBDatabase>((resolve, reject) => {
      const request = indexedDB.open('empresa-db', 1)
      request.onupgradeneeded = () => {
        const db = request.result
        if (!db.objectStoreNames.contains('logos')) {
          db.createObjectStore('logos', { keyPath: 'id' })
        }
      }
      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })

    const tx = db.transaction('logos', 'readwrite')
    const store = tx.objectStore('logos')
    store.put({ id: empresaId, logo: logoData, timestamp: Date.now() })

    await new Promise<void>((resolve, reject) => {
      tx.oncomplete = () => resolve()
      tx.onerror = () => reject(tx.error)
    })

    console.log('✅ Logo guardado en IndexedDB para empresa:', empresaId)
  } catch (e) {
    console.warn('⚠️ IndexedDB no disponible, usando localStorage como fallback:', e)
  }
}

// Helper para cargar logo desde IndexedDB
const loadLogoFromIndexedDB = async (empresaId: string): Promise<string | null> => {
  if (typeof window === 'undefined') return null

  try {
    const db = await new Promise<IDBDatabase>((resolve, reject) => {
      const request = indexedDB.open('empresa-db', 1)
      request.onupgradeneeded = () => {
        const db = request.result
        if (!db.objectStoreNames.contains('logos')) {
          db.createObjectStore('logos', { keyPath: 'id' })
        }
      }
      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })

    const tx = db.transaction('logos', 'readonly')
    const store = tx.objectStore('logos')

    return new Promise((resolve) => {
      const request = store.get(empresaId)
      request.onsuccess = () => {
        const result = request.result
        resolve(result?.logo || null)
      }
      request.onerror = () => resolve(null)
    })
  } catch (e) {
    console.warn('⚠️ Error leyendo logo desde IndexedDB:', e)
    return null
  }
}

export const useEmpresaStore = create<EmpresaState>()(
  persist(
    (set, get) => ({
      empresas: [defaultEmpresa],
      isHydrated: false,
      addEmpresa: (empresa) => {
        const newState = [empresa]
        set({ empresas: newState })

        // Save logo separately to IndexedDB if present
        if (empresa.logo) {
          saveLogoToIndexedDB(empresa.id, empresa.logo)
        }
      },
      updateEmpresa: (id, empresaUpdate) => {
        const currentEmpresas = get().empresas
        const updated = currentEmpresas.map((e) =>
          e.id === id ? { ...e, ...empresaUpdate } : e
        )

        set({ empresas: updated })

        // Save logo separately to IndexedDB if present
        const updatedEmpresa = updated.find(e => e.id === id)
        if (updatedEmpresa?.logo) {
          saveLogoToIndexedDB(id, updatedEmpresa.logo)
          console.log('✅ Logo actualizado:', { id, nombre: updatedEmpresa.nombre, logoSize: updatedEmpresa.logo.length })
        }
      },
      deleteEmpresa: (id) =>
        set((state) => ({
          empresas: state.empresas.filter((e) => e.id !== id),
        })),
      hydrate: async () => {
        if (typeof window === 'undefined') return

        try {
          const state = get()

          // Load logos from IndexedDB and restore to state
          const empresasWithLogos = await Promise.all(
            state.empresas.map(async (empresa) => {
              const logo = await loadLogoFromIndexedDB(empresa.id)
              return { ...empresa, logo: logo || empresa.logo }
            })
          )

          set({ empresas: empresasWithLogos, isHydrated: true })
          console.log('✅ Store hidratado completamente (con logos desde IndexedDB)')
        } catch (e) {
          console.error('❌ Error en hidratación completa:', e)
          set({ isHydrated: true })
        }
      },
    }),
    {
      name: 'empresa-storage',
      version: 1,
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        if (state?.empresas) {
          console.log('🔧 Store Zustand rehydrated (localStorage):', state.empresas[0]?.nombre)
        }
      },
      // IMPORTANTE: No persistir logos en localStorage (muy grandes), solo en IndexedDB
      partialize: (state) => ({
        empresas: state.empresas.map(({ logo, ...rest }) => ({
          ...rest,
          logo: '' // Siempre vacío en localStorage, cargado desde IndexedDB en hydrate()
        })),
      }),
    }
  )
)
