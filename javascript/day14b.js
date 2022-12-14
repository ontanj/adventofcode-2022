const min = [Infinity, Infinity]
const max = [-Infinity, -Infinity]
const data = require("fs")
  .readFileSync(`${process.env["INPUT_PATH"]}/input14.txt`)
  .toString()
  .trimEnd()
  .split("\n")
  .map((a) =>
    a.split(" -> ").map((b) =>
      b.split(",").map((c, dir) => {
        const v = Number(c)
        min[dir] = Math.min(v, min[dir])
        max[dir] = Math.max(v, max[dir])
        return v
      })
    )
  )

const prependingX = max[1]

const field = Array.from({ length: max[1] + 3 }).map((_, y) =>
  Array.from({ length: max[1] * 2 + max[0] + 2 }).map(() => y === max[1] + 2)
)

data.forEach((r) => {
  for (let i = 0; i < r.length - 1; i += 1) {
    const [sx, sy] = r[i]
    const [ex, ey] = r[i + 1]
    if (r[i][0] !== r[i + 1][0] && r[i][1] !== r[i + 1][1]) throw new Error("DIAG")
    if (sx !== ex) {
      for (let x = sx; x != ex; x += (ex - sx) / Math.abs(ex - sx)) {
        field[sy][x + prependingX] = true
      }
    }
    if (sy !== ey) {
      for (let y = sy; y != ey; y += (ey - sy) / Math.abs(ey - sy)) {
        field[y][ex + prependingX] = true
      }
    }
    field[ey][ex + prependingX] = true
  }
})

function newSand(x, y) {
  const i =
    y +
    field
      .map((r) => r[x + prependingX])
      .slice(y)
      .indexOf(true)
  if (i === y && i === 0 && x === 500) {
    return -1
  } else if (i === y) {
    return 0
  } else {
    const left = newSand(x - 1, i)
    if (left === -1 || left === 1) {
      return left
    }
    const right = newSand(x + 1, i)
    if (right === -1 || right === 1) {
      return right
    }
    field[i - 1][x + prependingX] = true
    return 1
  }
}

let count = 0
while (true) {
  if (newSand(500, 0) === -1) {
    break
  }
  count += 1
}

console.log(count)
