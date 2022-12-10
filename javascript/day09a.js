const data = require("fs")
  .readFileSync(`${process.env["INPUT_PATH"]}/input9.txt`)
  .toString()
  .trimEnd()
  .split("\n")
  .map((a) => a.split(" "))
  .map(([a, b]) => [a, parseInt(b)])

const startPosition = [0, 0]

const tailPositions = data
  .reduce(
    ([tailPositions, headPosition], [newDirection, newLength]) => {
      const newHeads = goDirection(headPosition, [newDirection, newLength])
      const newHeadPosition = newHeads.at(-1)
      const tailPos = tailPositions.at(-1)

      const xs = [-1, 0, 1].map((a) => tailPos[0] + a)
      const tailSpace = new Set(
        [-1, 0, 1]
          .map((a) => xs.map((x) => [x, a + tailPos[1]]))
          .flat(1)
          .map((a) => a.join(","))
      )
      const candidates = [headPosition, ...newHeads]
      const lastAdjacent =
        newLength - [...candidates].reverse().findIndex((a) => tailSpace.has(a.join(",")))
      const newTailPositions = candidates.slice(lastAdjacent, -1)
      return [[...tailPositions, ...newTailPositions], newHeadPosition]
    },
    [[startPosition], startPosition]
  )[0]
  .map((a) => a.join(","))

function goDirection([x, y], [direction, length]) {
  const steps = Array.from({ length }).map((a, i) => i + 1)
  if (direction === "R") {
    return steps.map((length) => [x + length, y])
  } else if (direction === "L") {
    return steps.map((length) => [x - length, y])
  } else if (direction === "U") {
    return steps.map((length) => [x, y + length])
  } else if (direction === "D") {
    return steps.map((length) => [x, y - length])
  }
}

console.log(new Set(tailPositions).size)
