import { paint, stopPainting } from './world'
import { propsRegistry } from './properties'

const canvas = document.getElementById('mainCanvas')
const infos = document.getElementById('infos')

const materiaKeyCode = Object.values(propsRegistry)
      .reduce((acc, el) => ({[el.key]: el, ...acc}), {})

function displayPaintInfo(materia) {
    console.debug('Painting with', materia.name)
    infos.innerText = materia.name
}

function handleClick() {
    let painting = undefined
    let currentPaintingMateria = 2

    canvas.addEventListener('mousedown', e => {
        if (e.buttons === 1) {
            console.log('start painting', e.offsetX, e.offsetY)
            painting = 1
        }
    })
    canvas.addEventListener('mousemove', e => {
        if (painting) {
            paint(e.offsetX, e.offsetY, currentPaintingMateria)
        }
    })
    canvas.addEventListener('mouseup', e => {
        if (e.buttons === 0) {
            painting = false
            stopPainting()
            console.log('stopped painting');
        }
    })

    document.addEventListener('keydown', e => {
        if (materiaKeyCode[e.key]) {
            currentPaintingMateria = materiaKeyCode[e.key].id
            displayPaintInfo(materiaKeyCode[e.key])
        }
    })
}

export default handleClick
