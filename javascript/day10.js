const data = require("fs")
  .readFileSync(`${process.env["INPUT_PATH"]}/input10.txt`)
  .toString()
  .trimEnd()
  .split("\n")

const cycleValues = data.reduce(
  (registerValues, instruction) =>
    instruction === "noop"
      ? [...registerValues, registerValues.at(-1)]
      : [
          ...registerValues,
          registerValues.at(-1),
          registerValues.at(-1) + parseInt(instruction.match(/^addx (.*)$/)[1]),
        ],
  [1]
)

const sum = cycleValues.reduce((acc, v, i) => ((i + 21) % 40 === 0 ? v * (i + 1) + acc : acc), 0)

console.log(sum)

const screenString = cycleValues.reduce(
  (screen, value, cycle) => screen + (Math.abs(value - (cycle % 40)) <= 1 ? "#" : "."),
  ""
)

const screen = Array.from({ length: 6 })
  .map((_, i) => screenString.slice(i * 40, (i + 1) * 40))
  .join("\n")

console.log(screen)
