const halfChance = () => Math.random() > 0.5

const scramble = (a, b) => (a % 200) % 2 === 0 ? [a, b] : [b, a]

export { scramble }
