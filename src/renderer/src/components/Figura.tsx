function Figura ({ tipo }: { tipo: string }) {

  if (tipo === 'Cuadradas') {
    return <span className='size-12 border border-solid border-white' />
  } else {
    return <span className='size-12 border border-solid rounded-full border-white' />
  }
}

export default Figura