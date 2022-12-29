const data = require("fs")
  .readFileSync(`${process.env["INPUT_PATH"]}/input17.txt`)
  .toString()
  .trimEnd()
  .split("")

let structure = []
let maxHeight = -1
let jetPosition = 0
const stop = 2022

for (let i = 0; i < stop; i += 1) {
  const verticalStartingPosition = maxHeight + 4
  const horizontalStartingPosition = 2
  let pos = moveShape(shape(i, [horizontalStartingPosition, verticalStartingPosition]), [
    horizontalStartingPosition,
    verticalStartingPosition,
  ])
  while (true) {
    const jet = data[jetPosition]
    jetPosition = (jetPosition + 1) % data.length
    const sidewaysPosition = moveSide(pos, jet)
    if (!isConflict(sidewaysPosition)) {
      pos = sidewaysPosition
    }
    const downPosition = moveDown(pos)
    if (isConflict(downPosition)) {
      structure.push(...pos)
      maxHeight = Math.max(maxHeight, ...pos.map(([, y]) => y))
      break
    }
    pos = downPosition
  }
}

console.log(maxHeight + 1)

function moveSide(shape, jet) {
  return shape.map(([x, y]) => [jet === ">" ? x + 1 : x - 1, y])
}

function moveDown(shape) {
  return shape.map(([x, y]) => [x, y - 1])
}

function isConflict(shape) {
  return shape.some(
    ([x, y]) => x < 0 || x >= 7 || y < 0 || structure.some(([sx, sy]) => sx === x && sy === y)
  )
}

function moveShape(shape, [x, y]) {
  return shape.map(([sx, sy]) => [sx + x, sy + y])
}

function shape(i) {
  switch (i % 5) {
    case 0:
      return [
        [0, 0],
        [1, 0],
        [2, 0],
        [3, 0],
      ]
    case 1:
      return [
        [1, 0],
        [0, 1],
        [1, 1],
        [2, 1],
        [1, 2],
      ]
    case 2:
      return [
        [0, 0],
        [1, 0],
        [2, 0],
        [2, 1],
        [2, 2],
      ]
    case 3:
      return [
        [0, 0],
        [0, 1],
        [0, 2],
        [0, 3],
      ]
    case 4:
      return [
        [0, 0],
        [0, 1],
        [1, 0],
        [1, 1],
      ]
  }
}
