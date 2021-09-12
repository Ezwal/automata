import { Idx, spawn, spawnByName, applyPainting } from './world'
import { sim } from './physics';

let lastTouched: Array<Idx> = []

let tickNb = 0
export function tick(): Array<Idx> {
    let currentChange: Array<Idx> = []
    for (let i of lastTouched) {
        if (!currentChange.includes(i)) {
            const touched = sim(i)
            currentChange = currentChange.concat(touched)
        }
    }
    if (tickNb < 100 && tickNb > 0) {
        currentChange.push(spawnByName(90, 'water'),
                           spawnByName(78, 'sand'))
    }
    const paintIndex = applyPainting()
    if (paintIndex) currentChange.push(paintIndex)

    tickNb += 1
    lastTouched = currentChange
    return currentChange
}
