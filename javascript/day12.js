let start
let end
const heights = require("fs")
  .readFileSync(`${process.env["INPUT_PATH"]}/input12.txt`)
  .toString()
  .trimEnd()
  .split("\n")
  .map((a, y) => {
    return a.split("").map((b, x) => {
      if (b === "S") {
        start = [x, y]
        return "a".charCodeAt()
      } else if (b === "E") {
        end = [x, y]
        return "z".charCodeAt() + 1
      } else {
        return b.charCodeAt()
      }
    })
  })

xlimit = heights[0].length
ylimit = heights.length

function findPath(heights, end, isDone) {
  const posQueue = [end]
  let lengths = heights.map((r) => r.map(() => undefined))
  lengths[end[1]][end[0]] = 0
  while (posQueue.length > 0) {
    const [x, y] = posQueue.shift()
    const currentHeight = heights[y][x]
    for (yd of [-1, 0, 1]) {
      for (xd of [-1, 0, 1]) {
        if (xd !== 0 && yd !== 0) continue
        const neighboringHeight = heights[y + yd]?.[x + xd]
        if (
          neighboringHeight &&
          neighboringHeight - currentHeight >= -1 &&
          lengths[y + yd][x + xd] === undefined
        ) {
          lengths[y + yd][x + xd] = lengths[y][x] + 1
          if (isDone(x + xd, y + yd)) {
            return lengths[y + yd][x + xd]
          }
          posQueue.push([x + xd, y + yd])
        }
      }
    }
  }
}

const a = findPath(heights, end, (x, y) => start[0] === x && start[1] === y)
const b = findPath(heights, end, (x, y) => heights[y][x] === "a".charCodeAt())
console.log(a)
console.log(b)
