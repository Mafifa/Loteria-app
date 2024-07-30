import { useTamanioStore } from '../store/store';

function Square () {
  return (
    <span className="w-6 -my-0.5 mx-0 h-6 border border-solid border-white"></span>
  );
}

function Matriz () {
  const { sizeCartones } = useTamanioStore();
  const { columnas, filas } = sizeCartones;

  // Crear la cuadrícula (matriz)
  const Cuadrilla: JSX.Element[] = [];
  for (let i = 0; i < columnas; i++) {
    const row: JSX.Element[] = [];
    for (let j = 0; j < filas; j++) {
      row.push(<Square key={`${i}-${j}`} />);
    }
    Cuadrilla.push(
      <div key={i} className="flex">
        {row}
      </div>
    );
  }

  return (
    <div className="grid gap-1">
      {Cuadrilla}
    </div>
  );
}

export default Matriz;
