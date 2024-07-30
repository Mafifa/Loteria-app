import React from 'react'
import Matriz from './Matriz'
import { useTamanioStore } from '../store/store'

function Tamanio () {
  const { setColumnas, setFilas, sizeCartones } = useTamanioStore()

  const handdleColumnas = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value)

    if (isNaN(value) || value <= 0 || value > 6) {
    }
    else {
      setColumnas(value)
    }

  }

  const handdleFilas = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value)
    if (isNaN(value) || value <= 0 || value > 8) {
    }
    else {
      setFilas(value)
    }
  }

  return (
    <div>
      <p className='text-2xl font-semibold text-center pb-2'>Tamanio de Cartones</p>
      <form className='grid grid-cols-2 w-fit mx-auto gap-8'>

        <div className='grid grid-cols-1 items-center justify-center'>
          <label className='text-xl font-semibold' htmlFor="filas">Filas</label>
          <input onChange={handdleColumnas} value={sizeCartones.columnas} className='text-black rounded-xl p-2 text-xl w-14' type="number" name="filas" id="filas" />
        </div>

        <div className='grid grid-cols-1 items-center justify-center'>
          <label className='text-xl font-semibold' htmlFor="columnas">Columnas</label>
          <input onChange={handdleFilas} value={sizeCartones.filas} className='text-black rounded-xl p-2 text-xl w-14' type="number" name="columnas" id="columnas" />
        </div>

      </form>
      <div className='pt-4'>
        <p className='text-center text-white/70'>La cantidad maxima de Filas es 6</p>
        <p className='text-center text-white/70'>La cantidad maxima de Columnas es 8</p>
      </div>

      <div className='w-44 mx-auto pt-8'>
        <Matriz></Matriz>
      </div>
    </div>
  )
}

export default Tamanio