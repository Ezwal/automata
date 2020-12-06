import {initWorld, tickWorld, materiaColor} from './physics.js'

const canvas = document.getElementById('mainCanvas')
const ctx = canvas.getContext('2d')
ctx.imageSmoothingEnabled = false

ctx.fillRect(0,0, canvas.width, canvas.height)
ctx.createImageData(canvas.width, canvas.height)

const dataOffset = (w, h) => ((canvas.width * w) + h) * 4
const offsetRgb = data => (offset, [r, g, b]) => {
    data[offset] = r
    data[offset+1] = g
    data[offset+2] = b
}
const getImageData = () => ctx.getImageData(0, 0, canvas.width, canvas.height)

function paintPixel(offset, [r, g, b]) {
    const imageData = getImageData()
    const data = imageData.data

    offsetRgb(data)(offset, [r, g, b])

    ctx.putImageData(imageData, 0, 0)
}

function paintPixels(pixels) {
    const imageData = getImageData()
    const paintData = offsetRgb(imageData.data)
    pixels.forEach(({w, h, color}) => {
        const offset = dataOffset(w, h)
        paintData(offset, color)
    })

    ctx.putImageData(imageData, 0, 0)
}

function loop() {
    const [world, changed] = tickWorld()
    const imageData = getImageData()
    const paintData = offsetRgb(imageData.data)
    changed.forEach(pixelOffset => {
        const newColor = materiaColor[world[pixelOffset]]
        paintData(pixelOffset * 4, newColor)
    })
    ctx.putImageData(imageData, 0, 0)
}

function main() {
    initWorld(canvas.width, canvas.height)
    createjs.Ticker.addEventListener('tick', loop)
    createjs.Ticker.interval = 500
}

main()
