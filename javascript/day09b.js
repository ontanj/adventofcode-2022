const data = require("fs")
  .readFileSync(`${process.env["INPUT_PATH"]}/input9.txt`)
  .toString()
  .trimEnd()
  .split("\n")
  .map((a) => a.split(" "))
  .map(([a, b]) => [a, parseInt(b)])

const start = [0, 0]

const tailPositions = data
  .reduce(
    ([tailPositions, headPositions], [newDirection, newLength]) => {
      const newHeads = goDirection(headPositions[0], [newDirection, newLength])
      const newTailPositions = []
      for (let posI = 0; posI < newHeads.length; posI += 1) {
        const newHeadPositions = Array.from({ length: headPositions.length })
        newHeadPositions[0] = newHeads[posI]
        let diagonalMovement = false
        for (let knotI = 1; knotI < headPositions.length; knotI += 1) {
          const ourPos = headPositions.at(knotI)
          const xs = [-1, 0, 1].map((a) => ourPos[0] + a)
          const tailSpace = new Set(
            [-1, 0, 1]
              .map((a) => xs.map((x) => [x, a + ourPos[1]]))
              .flat(1)
              .map((a) => a.join(","))
          )
          const preceedingKnotPos = newHeadPositions[knotI - 1]
          const preceedingKnotPrevPos = headPositions[knotI - 1]

          let newPos
          if (tailSpace.has(preceedingKnotPos.join(","))) {
            newPos = ourPos
          } else {
            if (diagonalMovement) {
              if (preceedingKnotPos[0] === ourPos[0]) {
                newPos = [ourPos[0], ourPos[1] + diagonalMovement[1]]
              } else if (preceedingKnotPos[1] === ourPos[1]) {
                newPos = [ourPos[0] + diagonalMovement[0], ourPos[1]]
              } else {
                newPos = [ourPos[0] + diagonalMovement[0], ourPos[1] + diagonalMovement[1]]
              }
            } else {
              newPos = preceedingKnotPrevPos
            }
          }
          newHeadPositions[knotI] = newPos
          const xDiff = newPos[0] - ourPos[0]
          const yDiff = newPos[1] - ourPos[1]
          if (xDiff !== 0 && yDiff !== 0) {
            diagonalMovement = [xDiff, yDiff]
          } else {
            diagonalMovement = undefined
          }
        }
        headPositions = newHeadPositions
        newTailPositions.push(headPositions.at(-1))
      }
      return [[...tailPositions, ...newTailPositions], headPositions]
    },
    [[start], Array.from({ length: 10 }).fill(start)]
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
