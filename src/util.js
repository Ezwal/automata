const halfChance = () => Math.random() > 0.5

const scramble = (a, b) => halfChance() ? [a, b] : [b, a]

export { scramble }
