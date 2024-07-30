const fs = require('fs')
const path = require('path')
const { PDFDocument, rgb } = require('pdf-lib')

async function generarLoteriaPDF (cantidadCartones, cantidadFichas, columnas, filas) {
  // Función para generar un array de números únicos
  function generarFichas () {
    const fichas = []
    for (let i = 1; i <= cantidadFichas; i++) {
      fichas.push(i)
    }
    return fichas
  }

  // Función para mezclar un array utilizando el algoritmo de Fisher-Yates
  function mezclar (array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]]
    }
    return array
  }

  // Función para generar un cartón único
  function generarCarton (fichas) {
    return mezclar([...fichas]).slice(0, columnas * filas)
  }

  // Función principal para generar cartones únicos
  function generarCartones () {
    const fichas = generarFichas()
    const cartones = new Set()

    while (cartones.size < cantidadCartones) {
      const nuevoCarton = generarCarton(fichas)
      cartones.add(JSON.stringify(nuevoCarton))
    }

    return Array.from(cartones).map(carton => JSON.parse(carton))
  }

  // Función para crear una tabla de imágenes en el PDF
  async function crearTablaImagenes (pdfDoc, carton, startX, startY, columnWidth, rowHeight) {
    const page = pdfDoc.getPages()[pdfDoc.getPageCount() - 1]

    for (let i = 0; i < filas; i++) {
      for (let j = 0; j < columnas; j++) {
        const numero = carton[i * columnas + j]
        const imagePath = path.join(__dirname, 'images', `${numero}.png`)
        const imageBytes = fs.readFileSync(imagePath)
        const image = await pdfDoc.embedPng(imageBytes)

        const x = startX + j * columnWidth
        const y = startY - i * rowHeight

        // Dibujar el marco
        page.drawRectangle({
          x,
          y,
          width: columnWidth,
          height: rowHeight,
          borderColor: rgb(0, 0, 0),
          borderWidth: 1
        })

        // Dibujar la imagen
        page.drawImage(image, {
          x: x + 2, // margen de 2 puntos
          y: y + 2, // margen de 2 puntos
          width: columnWidth - 4, // margen de 2 puntos a cada lado
          height: rowHeight - 4 // margen de 2 puntos a cada lado
        })
      }
    }
  }

  // Función para generar el documento PDF
  async function generarDocumento (cartones, fileIndex, startCartonNumber) {
    const pdfDoc = await PDFDocument.create()

    for (let i = 0; i < cartones.length; i += 2) {
      const page = pdfDoc.addPage([595, 842]) // Tamaño A4 en puntos (8.27 x 11.69 pulgadas)
      const { width, height } = page.getSize()
      const margin = 20 // Margen superior e inferior
      const interCartonMargin = 40 // Espacio entre los cartones
      const usableHeight = height - 2 * margin - interCartonMargin // Altura usable para los cartones
      const columnWidth = (width - 2 * margin) / columnas
      const rowHeight = usableHeight / (filas * 2)

      const carton1 = cartones[i]
      const carton2 = cartones[i + 1]

      // Posiciones Y para los dos cartones
      const startY1 = height - margin - 40
      const startY2 = height / 2 - interCartonMargin / 2 - 40

      // Dibujar el título para el primer cartón
      page.drawText(`Cartón ${startCartonNumber + i}`, {
        x: margin,
        y: startY1 + 20,
        size: 20,
        color: rgb(0, 0, 0)
      })
      await crearTablaImagenes(pdfDoc, carton1, margin, startY1, columnWidth, rowHeight)

      if (i + 1 < cartones.length) {
        // Dibujar el título para el segundo cartón
        page.drawText(`Cartón ${startCartonNumber + i + 1}`, {
          x: margin,
          y: startY2 + 20,
          size: 20,
          color: rgb(0, 0, 0)
        })
        await crearTablaImagenes(pdfDoc, carton2, margin, startY2, columnWidth, rowHeight)
      }
    }

    const pdfBytes = await pdfDoc.save()
    fs.writeFileSync(`cartones_${fileIndex}.pdf`, pdfBytes)
  }

  // Generar los cartones únicos y los archivos PDF
  const cartonesUnicos = generarCartones()
  const maxCartonesPorArchivo = 100 // Ajusta según sea necesario
  const totalArchivos = Math.ceil(cartonesUnicos.length / maxCartonesPorArchivo)

  for (let i = 0; i < totalArchivos; i++) {
    const start = i * maxCartonesPorArchivo
    const end = start + maxCartonesPorArchivo
    const cartonesSubset = cartonesUnicos.slice(start, end)
    await generarDocumento(cartonesSubset, i + 1, start + 1)
  }

  console.log('Archivos PDF generados con éxito.')
}

export default generarLoteriaPDF
