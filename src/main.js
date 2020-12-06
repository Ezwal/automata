import {initWorld, tickWorld, materiaColor} from './physics.js'

const canvas = document.getElementById('mainCanvas')
const ctx = canvas.getContext('2d')
ctx.imageSmoothingEnabled = false

// ctx.fillStyle = 'white'
ctx.fillRect(0, 0, canvas.width, canvas.height)
ctx.createImageData(canvas.width, canvas.height)

const dataOffset = (w, h) => ((canvas.width * w) + h) * 4
const offsetRgb = data => (offset, [r, g, b]) => {
    data[offset] = r
    data[offset+1] = g
    data[offset+2] = b
}
const getImageData = () => ctx.getImageData(0, 0, canvas.width, canvas.height)

function paintPixels(pixels, world) {
    const imageData = getImageData()
    const paintData = offsetRgb(imageData.data)
    pixels.forEach((pixelOffset) => {
        const offset = pixelOffset * 4
        paintData(offset, materiaColor[world[pixelOffset]])
    })

    ctx.putImageData(imageData, 0, 0)
}

function loop() {
    const [world, changed] = tickWorld()
    paintPixels(changed, world)
}

function main() {
    initWorld(canvas.width, canvas.height)
    createjs.Ticker.addEventListener('tick', loop)
    createjs.Ticker.framerate = 30
}

main()
