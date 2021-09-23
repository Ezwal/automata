import handleClick from './user'
import { propsById } from './properties'
import { init, Idx, at } from './world'
import { tick } from './time'

const canvas = <HTMLCanvasElement> document.getElementById('mainCanvas')
const ctx = canvas.getContext('2d')
ctx.imageSmoothingEnabled = false

ctx.fillStyle = 'white'
ctx.fillRect(0, 0, canvas.width, canvas.height)
ctx.createImageData(canvas.width, canvas.height)

const paintData = (data: Uint8ClampedArray) => (offset: Idx, [red, green, blue]: Array<number>) => {
    data[offset] = red
    data[offset+1] = green
    data[offset+2] = blue
}
const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
const paintOffsetRgb = paintData(imageData.data)

function paintPixels(changedId: Set<Idx>) {
    for (const pixelOffset of changedId) {
        const colorFunc = propsById(at(pixelOffset)).color
        paintOffsetRgb(pixelOffset * 4, colorFunc())
    }
    ctx.putImageData(imageData, 0, 0)
}

function loop() {
    const changedId = tick()
    paintPixels(changedId)
}

function main() {
    handleClick()
    init(canvas.width, canvas.height)
    // @ts-ignore
    createjs.Ticker.addEventListener('tick', () => {
        try {
            loop()
        } catch (error) {
            // @ts-ignore
            createjs.Ticker.removeAllEventListeners()
            throw error
        }
    })
    // @ts-ignore
    createjs.Ticker.framerate = 30
}

main()
