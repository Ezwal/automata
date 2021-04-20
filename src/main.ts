import handleClick from './user'
import { getProps } from './properties'
import * as World from './world'

const canvas = <HTMLCanvasElement> document.getElementById('mainCanvas')
const ctx = canvas.getContext('2d')
ctx.imageSmoothingEnabled = false

ctx.fillStyle = 'white'
ctx.fillRect(0, 0, canvas.width, canvas.height)
ctx.createImageData(canvas.width, canvas.height)

const dataOffset = (w: number, h: number): number => ((canvas.width * w) + h) * 4
const paintData = data => (offset, [red, green, blue]) => {
    data[offset] = red
    data[offset+1] = green
    data[offset+2] = blue
}
const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
const paintOffsetRgb = paintData(imageData.data)

function paintPixels(changedId) {
    for (const pixelOffset of changedId) {
        const colorFunc = getProps(World.at(pixelOffset)).color
        paintOffsetRgb(pixelOffset * 4, colorFunc())
    }

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
