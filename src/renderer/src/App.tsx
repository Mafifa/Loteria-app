import Opciones from "./components/Opciones"
import Tamanio from "./components/Tamanio"
import { useLoteriaStore, useTamanioStore } from "./store/store"
import { type Datos } from '../../types'

function App (): JSX.Element {
  const { loteria } = useLoteriaStore();
  const { sizeCartones } = useTamanioStore();

  const { cantidadCartones, cantidadFichas, tipoFichas } = loteria
  const { columnas, filas } = sizeCartones

  const Datos: Datos = {
    cantidadCartones,
    cantidadFichas,
    columnas,
    filas,
    tipoFichas
  }

  // ASI SE ENVIA UN PING A PRE-RENDER
  const ipcHandle = (): void => window.electron.ipcRenderer.send(
    'ping',
    Datos
  )

  return (

    <main>
      <h1 className="text-center text-4xl font-bold p-4">
        Generador de Cartones
      </h1>
      <section className="grid grid-cols-2">
        <Opciones />
        <Tamanio />
      </section>

      <div className="text-center">
        <p>{`Cantidad de Cartones ${loteria.cantidadCartones} `}</p>
        <p>{`Cantidad de Fichas ${loteria.cantidadFichas} `}</p>
        <p>{`Tipo de Fichas: ${loteria.tipoFichas} `}</p>
        <p>{`Cantidad de Columnas: ${sizeCartones.columnas} `}</p>
        <p>{`Cantidad de Filas: ${sizeCartones.filas} `}</p>
        <button type="button" onClick={ipcHandle}>Enviar Respuesta</button>
      </div>
    </main>
  )
}

export default App
