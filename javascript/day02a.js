const data = require("fs")
  .readFileSync(`${process.env["INPUT_PATH"]}/input2.txt`)
  .toString()
  .trimEnd()
  .split("\n")
  .map((a) => a.split(" "))
  .map(([theirShape, ourShape]) => {
    if (theirShape === "A") return [0, ourShape]
    else if (theirShape === "B") return [1, ourShape]
    else return [2, ourShape]
  })
  .map(([theirShape, ourShape]) => {
    if (ourShape === "X") return [theirShape, 0]
    else if (ourShape === "Y") return [theirShape, 1]
    else return [theirShape, 2]
  })

const shapeScore = data.reduce((sum, [, ourShape]) => ourShape + 1 + sum, 0)

const matchScore = data.reduce((sum, [a, b]) => {
  const d = (a - b + 3) % 3
  if (d === 2) return sum + 6
  else if (d === 0) return sum + 3
  else return sum
}, 0)

console.log(shapeScore + matchScore)
