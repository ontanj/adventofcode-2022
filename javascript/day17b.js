const data = require("fs")
  .readFileSync(`${process.env["INPUT_PATH"]}/input17.txt`)
  .toString()
  .trimEnd()
  .split("")

const stop = 1000000000000
let round = 0
let structure = { structure: Array.from({ length: 7 }).map((_, x) => [x, 0]), norm: 0 }
let structureSnapshots = []
let nextJetPosition = 0
let stoneTotalCount = 0
let jetPosition = 0
let periodicity

stoneLoop: while (true) {
  if (jetPosition > nextJetPosition) {
    if (round >= 0) {
      const lastStruct = structureSnapshots[round]
      for (const olderStruct of [...structureSnapshots.slice(0, -1)].reverse()) {
        if (
          olderStruct.structure.every((pixel, pixelIndex) =>
            pixel.every((c, j) => c === lastStruct.structure[pixelIndex][j])
          ) &&
          olderStruct.jetPosition === lastStruct.jetPosition &&
          olderStruct.stoneCount % 5 === lastStruct.stoneCount % 5
        ) {
          periodicity = lastStruct.round - olderStruct.round
          break stoneLoop
        }
      }
    }
    round += 1
  }
  jetPosition = nextJetPosition
  ;({ nextJetPosition, structure } = fallNextStone(jetPosition, stoneTotalCount, structure, data))
  takeSnapshot(stoneTotalCount, structureSnapshots, round, structure, nextJetPosition)
  stoneTotalCount += 1
}

const refNew = structureSnapshots[round]
const refOld = structureSnapshots[round - periodicity]
const stonesPerRound = refNew.stoneCount - refOld.stoneCount
const lastFallenStone = refNew.stoneCount
const roundsToSkip = Math.floor((stop - lastFallenStone) / stonesPerRound)
jetPosition = refNew.jetPosition
structure = {
  structure: refNew.structure,
  norm: refNew.norm + roundsToSkip * (refNew.currentMax - refOld.currentMax),
}

for (let stone = lastFallenStone + roundsToSkip * stonesPerRound + 1; stone < stop; stone += 1) {
  ;({ nextJetPosition: jetPosition, structure } = fallNextStone(
    jetPosition,
    stone,
    structure,
    data
  ))
}

console.log(Math.max(...structure.structure.map(([x, y]) => y)) + structure.norm)

function takeSnapshot(stoneTotalCount, structureSnapshots, round, structure, jetPosition) {
  if (!structureSnapshots[round]) {
    const currentMax = structure.norm + structure.structure.at(-1)?.[1] + 1
    structureSnapshots[round] = {
      structure: structure.structure,
      norm: structure.norm,
      stoneCount: stoneTotalCount,
      round,
      currentMax,
      jetPosition,
    }
  }
}

function fallNextStone(startJetPosition, stoneTotalCount, structure, jetStream) {
  const maxHeight = Math.max(...structure.structure.map(([, y]) => y))
  let nextJetPosition = startJetPosition
  const verticalStartingPosition = maxHeight + 4
  const horizontalStartingPosition = 2
  let pos = moveShape(
    shape(stoneTotalCount, [horizontalStartingPosition, verticalStartingPosition]),
    [horizontalStartingPosition, verticalStartingPosition]
  )
  let jetPosition
  while (true) {
    jetPosition = nextJetPosition
    const jetDirection = jetStream[jetPosition]
    nextJetPosition = (jetPosition + 1) % jetStream.length
    const sidewaysPosition = moveSide(pos, jetDirection)
    if (!isConflict(sidewaysPosition, structure)) {
      pos = sidewaysPosition
    }
    const downPosition = moveDown(pos)
    if (isConflict(downPosition, structure)) {
      const newStructure = [...structure.structure, ...pos].sort(
        ([ax, ay], [bx, by]) => ay - by || ax - bx
      )
      const lowerLimit = Math.max(0, newStructure.at(-1)[1] - 30)
      const normalizedStructure = newStructure
        .filter(([, y]) => {
          return y >= lowerLimit
        })
        .map(([x, y]) => {
          return [x, y - lowerLimit]
        })

      return {
        nextJetPosition,
        structure: { structure: normalizedStructure, norm: structure.norm + lowerLimit },
      }
    }
    pos = downPosition
  }
}

function moveSide(shape, jet) {
  return shape.map(([x, y]) => [jet === ">" ? x + 1 : x - 1, y])
}

function moveDown(shape) {
  return shape.map(([x, y]) => [x, y - 1])
}

function isConflict(shape, structure) {
  return shape.some(([x, y]) => {
    if (y < 0) throw new Error("Depth to shallow")
    return x < 0 || x >= 7 || structure.structure.some(([ax, ay]) => ax === x && ay === y)
  })
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
