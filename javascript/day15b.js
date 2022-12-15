const data = require("fs")
  .readFileSync(`${process.env["INPUT_PATH"]}/input15.txt`)
  .toString()
  .trimEnd()
  .split("\n")
  .map((a) => {
    return a
      .match(/^Sensor at x=([-\d]+), y=([-\d]+): closest beacon is at x=([-\d]+), y=([-\d]+)$/)
      .slice(1)
      .map(Number)
  })

const minborder = 0
const maxborder = 4000000

for (let y = minborder; y <= maxborder; y += 1) {
  const covered = data
    .map(([sx, sy, bx, by]) => {
      const manhattan = manhattanDistance([sx, sy], [bx, by])
      const distanceToY = Math.abs(sy - y)
      const widthAtY = manhattan - distanceToY

      if (widthAtY <= 0) return null
      else return [sx - widthAtY, sx + widthAtY]
    })
    .filter((a) => a)

  const sections = mergeCoveredRowSections([
    ...covered,
    [minborder - 1, minborder - 1],
    [maxborder + 1, maxborder + 1],
  ])

  if (sections.length === 2) {
    sections.sort((a, b) => a[0] - b[0])
    const x = sections[0][1] + 1
    console.log(x * 4000000 + y)
    break
  }
}

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
