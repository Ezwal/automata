import handleClick from './user.js'
import { materiaColor } from './physics.js'
import * as World from './world.js'

const canvas = document.getElementById('mainCanvas')
const ctx = canvas.getContext('2d')
ctx.imageSmoothingEnabled = false

ctx.fillStyle = 'white'
ctx.fillRect(0, 0, canvas.width, canvas.height)
ctx.createImageData(canvas.width, canvas.height)

const dataOffset = (w, h) => ((canvas.width * w) + h) * 4
const offsetRgb = data => (offset, [r, g, b]) => {
    data[offset] = r
    data[offset+1] = g
    data[offset+2] = b
}
const getImageData = () => ctx.getImageData(0, 0, canvas.width, canvas.height)
const imageData = getImageData()
const paintData = offsetRgb(imageData.data)

function paintPixels(changedId) {
    let world = World.get()
    changedId.forEach(pixelOffset => {
        paintData(pixelOffset * 4,
                  materiaColor[world[pixelOffset]])
    })

    ctx.putImageData(imageData, 0, 0)
}

function loop() {
    const changedId = World.tick()
    paintPixels(changedId)
}

function main() {
    handleClick()
    World.init(canvas.width, canvas.height)
    createjs.Ticker.addEventListener('tick', loop)
    createjs.Ticker.framerate = 30
}

main()
