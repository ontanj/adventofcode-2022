const data = require("fs")
  .readFileSync(`${process.env["INPUT_PATH"]}/input18.txt`)
  .toString()
  .trimEnd()
  .split("\n")
  .map((a) => a.split(",").map(Number))

const sides = data.reduce((sides, [px, py, pz], i, all) => {
  const neighbors = all
    .slice(0, i)
    .reduce(
      (neighborSides, [x, y, z]) =>
        Math.abs(x - px) + Math.abs(y - py) + Math.abs(z - pz) === 1
          ? neighborSides + 1
          : neighborSides,
      0
    )
  return sides + 6 - neighbors * 2
}, 0)

console.log(sides)
