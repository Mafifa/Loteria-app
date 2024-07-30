import { create } from 'zustand'
import { type Loteria, type SizeCartones } from '../types'

interface LoteriaState {
  loteria: Loteria
  setCantidadCartones: (cantidad: number) => void
  setCantidadFichas: (cantidad: number) => void
  setTipoFichas: (tipo: string) => void
}

interface SizeState {
  sizeCartones: SizeCartones
  setColumnas: (cantidad: number) => void
  setFilas: (cantidad: number) => void
}

export const useLoteriaStore = create<LoteriaState>((set) => ({
  loteria: {
    cantidadCartones: 1,
    cantidadFichas: 1,
    tipoFichas: 'Cuadradas'
  },
  setCantidadCartones: (cantidad) =>
    set((state) => ({
      loteria: {
        ...state.loteria,
        cantidadCartones: cantidad
      }
    })),
  setCantidadFichas: (cantidad) =>
    set((state) => ({
      loteria: {
        ...state.loteria,
        cantidadFichas: cantidad
      }
    })),
  setTipoFichas: (tipo) =>
    set((state) => ({
      loteria: {
        ...state.loteria,
        tipoFichas: tipo
      }
    }))
}))

export const useTamanioStore = create<SizeState>((set) => ({
  sizeCartones: {
    columnas: 4,
    filas: 4
  },
  setColumnas: (cantidad) =>
    set((state) => ({
      sizeCartones: {
        ...state.sizeCartones,
        columnas: cantidad
      }
    })),
  setFilas: (cantidad) =>
    set((state) => ({
      sizeCartones: {
        ...state.sizeCartones,
        filas: cantidad
      }
    }))
}))
