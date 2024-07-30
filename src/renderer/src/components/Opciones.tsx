import React from 'react'
import Figura from './Figura'
import { useLoteriaStore } from '@renderer/store/store'

function Opciones () {
  const { loteria, setCantidadCartones, setCantidadFichas, setTipoFichas } = useLoteriaStore()

  const handdleCantidadCartones = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value)

    if (isNaN(value) || value <= 0 || value > 1000) {
    }
    else {
      setCantidadCartones(value)
    }
  }
  const handleCantidadFichas = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value)

    if (isNaN(value) || value <= 0 || value > 212) {
    }
    else {
      setCantidadFichas(value)
    }
  }

  return (
    <div>
      <form className='grid grid-cols-1 w-fit mx-auto gap-4'>
        <label className='text-xl font-semibold' >Cantidad de Cartones:</label>
        <input
          className='text-black rounded-xl p-2 text-xl w-32'
          type="number"
          value={loteria.cantidadCartones}
          onChange={handdleCantidadCartones}
        />
        <p className='text-white/70'>La cantidad maxima de cartones es 1000</p>

        <label className='text-xl font-semibold' >Cantidad de Fichas:</label>
        <input
          className='text-black rounded-xl p-2 text-xl w-32'
          type="number"
          max={212}
          min={1}
          value={loteria.cantidadFichas}
          onChange={handleCantidadFichas}
        />
        <p className='text-white/70'>La cantidad maxima de fichas es 212</p>

        <fieldset className='grid grid-cols-2 items-center gap-6 border-white border border-solid rounded-xl p-4'>
          <div className='grid grid-cols-1'>
            <legend className='text-xl font-semibold pb-2' >Tipos de Fichas</legend>

            <div>
              <label className='p-2 text-xl font-semibold' >Redondas</label>
              <input
                className='text-black rounded-xl p-2 text-xl'
                type="radio"
                name='tipo'
                value='Redondas'
                onChange={(e) => setTipoFichas(e.target.value.toString())}
              />
            </div>

            <div>
              <label className='p-2 text-xl font-semibold' >Cuadradas</label>
              <input
                className='text-black rounded-xl p-2 text-xl'
                type="radio"
                name='tipo'
                value='Cuadradas'
                onChange={(e) => setTipoFichas(e.target.value.toString())}
              />
            </div>

          </div>

          <Figura tipo={loteria.tipoFichas} ></Figura>

        </fieldset>
      </form>
    </div>
  )
}

export default Opciones