const data = require("fs")
  .readFileSync(`${process.env["INPUT_PATH"]}/input15.txt`)
  // .readFileSync("/home/anton/programmering/adventofcode-2022/inputs/input15-test.txt")
  .toString()
  .trimEnd()
  .split("\n")
  .map((a) =>
    a
      .match(/^Sensor at x=([-\d]+), y=([-\d]+): closest beacon is at x=([-\d]+), y=([-\d]+)$/)
      .slice(1)
      .map(Number)
  )

const y = 2000000

const covered = data
  .map(([sx, sy, bx, by]) => {
    const manhattan = manhattanDistance([sx, sy], [bx, by])
    const distanceToY = Math.abs(sy - y)
    const widthAtY = manhattan - distanceToY

    if (widthAtY <= 0) return null
    else return [sx - widthAtY, sx + widthAtY]
  })
  .filter((a) => a)

const coveredSum = mergeCoveredRowSections(covered)
  .map(([min, max]) => max - min)
  .reduce((a, b) => a + b)

console.log(coveredSum)

function manhattanDistance([x1, y1], [x2, y2]) {
  return Math.abs(x1 - x2) + Math.abs(y1 - y2)
}

function mergeCoveredRowSections(covered) {
  let oldLength
  do {
    oldLength = covered.length
    covered = covered.reduce((mergedRows, [newX, newY]) => {
      const i = mergedRows.findIndex(([x, y]) => newY >= x - 1 && newX <= y + 1)
      if (i !== -1) {
        const [x, y] = mergedRows[i]
        const mergedRow = [Math.min(newX, x), Math.max(newY, y)]
        return [...mergedRows.slice(0, i), ...mergedRows.slice(i + 1), mergedRow]
      } else return [...mergedRows, [newX, newY]]
    }, [])
  } while (oldLength !== covered.length)
  return covered
}
