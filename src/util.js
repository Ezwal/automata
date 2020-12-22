const halfChance = () => Math.random() > 0.5

const scramble = (a, b) => Math.floor(a / 100) % 2 === 0 ? [a, b] : [b, a]

export { scramble }
