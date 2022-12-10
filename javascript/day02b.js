const data = require("fs")
  .readFileSync(`${process.env["INPUT_PATH"]}/input2.txt`)
  .toString()
  .trimEnd()
  .split("\n")
  .map((a) => a.split(" "))

const matchScore = data.reduce(
  (sum, [, outcome]) => (outcome === "X" ? sum + 0 : outcome === "Y" ? sum + 3 : sum + 6),
  0
)

const shapeScore = data
  .map(([theirShape, outcome]) =>
    theirShape === "A" ? [0, outcome] : theirShape === "B" ? [1, outcome] : [2, outcome]
  )
  .map(([theirShape, outcome]) =>
    outcome === "X" ? [theirShape, 0] : outcome === "Y" ? [theirShape, 1] : [theirShape, 2]
  )
  .map(([theirShape, outcome]) => [theirShape, (theirShape + outcome + 2) % 3])
  .reduce((sum, [, ourShape]) => (ourShape === 0 ? sum + 1 : ourShape === 1 ? sum + 2 : sum + 3), 0)

console.log(matchScore + shapeScore)
