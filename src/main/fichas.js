const fs = require('fs')
const path = require('path')
const { PDFDocument, rgb } = require('pdf-lib')

const DIAMETER_REDONDO_CM = 1.8
const DIAMETER_CUADRADO_CM = 2.5 // Definimos un diámetro para las fichas cuadradas
const DIAMETER_REDONDO_POINTS = DIAMETER_REDONDO_CM * 28.3465 // 1 cm = 28.3465 points
const DIAMETER_CUADRADO_POINTS = DIAMETER_CUADRADO_CM * 28.3465
const PADDING_REDONDO = 20 // Espacio entre fichas redondas
const PADDING_CUADRADO = 10 // Espacio entre fichas cuadradas
const MARGIN = 20 // Margen en puntos
const MARGIN_INTERNO_REDONDO = 10 // Margen interno en puntos para fichas redondas
const PAGE_WIDTH = 612 // Tamaño carta en puntos (8.5 x 11 pulgadas)
const PAGE_HEIGHT = 792 // Tamaño carta en puntos (8.5 x 11 pulgadas)

function generarDocumentoFichas (tipoFicha, cantidadFichas) {
  (async () => {
    const pdfDoc = await PDFDocument.create()

    // Leer todas las imágenes en la carpeta 'images' hasta la cantidad especificada
    const imageDir = path.join(__dirname, 'images')
    const imageFiles = fs.readdirSync(imageDir)
      .filter(file => file.endsWith('.png'))
      .slice(0, cantidadFichas)

    const DIAMETER_POINTS = tipoFicha === 'Redondas' ? DIAMETER_REDONDO_POINTS : DIAMETER_CUADRADO_POINTS
    const PADDING = tipoFicha === 'Redondas' ? PADDING_REDONDO : PADDING_CUADRADO
    const MARGIN_INTERNO = tipoFicha === 'Redondas' ? MARGIN_INTERNO_REDONDO : 0

    const spacePerFicha = DIAMETER_POINTS + PADDING
    const imagesPerRow = Math.floor((PAGE_WIDTH - 2 * MARGIN) / spacePerFicha)
    const imagesPerColumn = Math.floor((PAGE_HEIGHT - 2 * MARGIN) / spacePerFicha)
    const imagesPerPage = imagesPerRow * imagesPerColumn

    let page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT])
    let x = 0
    let y = 0

    for (let i = 0; i < imageFiles.length; i++) {
      if (i % imagesPerPage === 0 && i !== 0) {
        page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT])
        x = 0
        y = 0
      }

      const imagePath = path.join(imageDir, imageFiles[i])
      const imageBytes = fs.readFileSync(imagePath)
      const image = await pdfDoc.embedPng(imageBytes)

      const posX = MARGIN + x * spacePerFicha
      const posY = PAGE_HEIGHT - MARGIN - ((y + 1) * spacePerFicha)

      if (tipoFicha === 'Redondas') {
        // Dibujar el marco redondo
        page.drawEllipse({
          x: posX + DIAMETER_POINTS / 2,
          y: posY + DIAMETER_POINTS / 2,
          xScale: DIAMETER_POINTS / 2,
          yScale: DIAMETER_POINTS / 2,
          borderColor: rgb(0, 0, 0),
          borderWidth: 1
        })
      } else {
        // Dibujar el marco cuadrado
        page.drawRectangle({
          x: posX,
          y: posY,
          width: DIAMETER_POINTS,
          height: DIAMETER_POINTS,
          borderColor: rgb(0, 0, 0),
          borderWidth: 1
        })
      }

      // Dibujar la imagen
      page.drawImage(image, {
        x: posX + MARGIN_INTERNO,
        y: posY + MARGIN_INTERNO,
        width: DIAMETER_POINTS - 2 * MARGIN_INTERNO,
        height: DIAMETER_POINTS - 2 * MARGIN_INTERNO
      })

      x++
      if (x >= imagesPerRow) { // Cambiar de fila cuando se alcanza el borde derecho
        x = 0
        y++
      }
    }

    const pdfBytes = await pdfDoc.save()
    fs.writeFileSync('fichas.pdf', pdfBytes)
  })().catch(err => {
    console.error('Error al generar el documento PDF:', err)
  })
}

// Exportar la función
export default generarDocumentoFichas
