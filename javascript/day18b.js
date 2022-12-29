const data = require("fs")
  .readFileSync(`${process.env["INPUT_PATH"]}/input18.txt`)
  .toString()
  .trimEnd()
  .split("\n")
  .map((a) => a.split(",").map(Number))

const allSides = findSides()

let remainingSides = [...allSides]
const connectedSidesQueue = []
const exteriorDropletSizes = []

while (remainingSides.length > 0) {
  const startSideData = remainingSides.shift()
  const startSideDirection = startSideData[3]
  connectedSidesQueue.push(startSideData)
  let sideCount = 0
  let innerCount = 1
  while (connectedSidesQueue.length > 0) {
    sideCount += 1
    const sideData = connectedSidesQueue.shift()
    const sideCoordinates = sideData.slice(0, 3)
    const sideDirection = sideData[3]
    const isInLineWithStart = sideCoordinates.reduce(
      (inline, v, i) =>
        inline &&
        (startSideDirection % 3 === i
          ? startSideDirection - 3 < 0
            ? v > startSideData[i]
            : v < startSideData[i]
          : v === startSideData[i]),
      true
    )
    if (startSideDirection % 3 === sideDirection % 3 && isInLineWithStart) {
      innerCount += 1
    }
    const adjacentCoordinates = sideCoordinates.map((v, i) =>
      sideDirection % 3 === i ? (sideDirection - 3 < 0 ? v + 1 : v - 1) : v
    )
    const neighbors = adjacentCoordinates.flatMap(
      (coordinateValue, coordinateIndex, allCoordinates) =>
        coordinateIndex === sideDirection % 3
          ? []
          : [coordinateValue - 1, coordinateValue + 1].map(
              (directionCoordinateValue, directionIndex) => {
                const diagonalNeighbor = [
                  ...allCoordinates.slice(0, coordinateIndex),
                  directionCoordinateValue,
                  ...allCoordinates.slice(coordinateIndex + 1),
                ]
                if (blockIsPresent(diagonalNeighbor)) {
                  return [...diagonalNeighbor, coordinateIndex + directionIndex * 3]
                } else {
                  const sideNeighbor = diagonalNeighbor.map((d, i) =>
                    i === sideDirection % 3 ? sideCoordinates[i] : d
                  )
                  if (blockIsPresent(sideNeighbor)) {
                    return [...sideNeighbor, sideDirection]
                  } else {
                    return [...sideCoordinates, Math.abs(directionIndex - 1) * 3 + coordinateIndex]
                  }
                }
              }
            )
    )
    const remainingNeighbors = neighbors.filter((n) => sideIsPresent(n, remainingSides))
    connectedSidesQueue.push(...remainingNeighbors)
    remainingSides = remainingSides.filter((s) => !sideIsPresent(s, neighbors))
  }
  if (innerCount % 2 === 1) {
    exteriorDropletSizes.push(sideCount)
  }
}

console.log(exteriorDropletSizes.sort((a, b) => b - a)[0])

function findSides() {
  return data.flatMap(([x, y, z]) => {
    const thisSide = []
    if (!blockIsPresent([x + 1, y, z])) {
      thisSide.push([x, y, z, 0])
    }
    if (!blockIsPresent([x, y + 1, z])) {
      thisSide.push([x, y, z, 1])
    }
    if (!blockIsPresent([x, y, z + 1])) {
      thisSide.push([x, y, z, 2])
    }
    if (!blockIsPresent([x - 1, y, z])) {
      thisSide.push([x, y, z, 3])
    }
    if (!blockIsPresent([x, y - 1, z])) {
      thisSide.push([x, y, z, 4])
    }
    if (!blockIsPresent([x, y, z - 1])) {
      thisSide.push([x, y, z, 5])
    }
    return thisSide
  })
}

function blockIsPresent([x, y, z]) {
  return data.some(([px, py, pz]) => px === x && py == y && pz == z)
}

function sideIsPresent([x, y, z, r], l) {
  return l.some(([px, py, pz, pr]) => px === x && py == y && pz == z && pr === r)
}
