const data = require("fs")
  .readFileSync("/home/anton/programmering/adventofcode-2022/inputs/input13.txt")
  // .readFileSync("/home/anton/programmering/adventofcode-2022/inputs/input13-test.txt")
  .toString()
  .trimEnd()
  .split("\n\n")
  .map((a) =>
    a.split("\n").map((row) => {
      const aggregated = []
      row.split(",").reduce(
        (positions, value) => {
          const match = value.match(/(\[*)(\d*)(\]*)/)
          for (let part of match.slice(1).filter((a) => a)) {
            let current = aggregated
            for (let pos of positions.slice(0, -1)) {
              current = current.at(pos)
            }
            if (part.includes("[")) {
              part.split("").forEach(() => {
                const n = []
                current.push(n)
                current = n
                positions = [...positions, 0]
              })
            } else if (part.includes("]")) {
              part.split("").forEach(() => {
                positions = [...positions.slice(0, -2), positions.at(-2) + 1]
              })
            } else {
              current.push(Number(part))
              positions = [...positions.slice(0, -1), positions.at(-1) + 1]
            }
          }
          return positions
        },
        [0]
      )
      return aggregated[0]
    })
  )

function compare(list1, list2) {
  for (let i = 0; i < list2.length; i += 1) {
    const v1 = list1[i]
    const v2 = list2[i]
    if (list1[i] === undefined) {
      return -1
    }
    if (list1[i] !== list2[i]) {
      if (typeof v1 === "number" && typeof v2 === "number") {
        return v1 - v2
      } else if (typeof v1 === "object" && typeof v2 === "object") {
        const r = compare(v1, v2)
        if (r !== 0) return r
      } else if (typeof v1 === "object") {
        const r = compare(v1, [v2])
        if (r !== 0) return r
      } else if (typeof v2 === "object") {
        const r = compare([v1], v2)
        if (r !== 0) return r
      }
    }
  }
  if (list1.length > list2.length) {
    return 1
  }
  return 0
}

const rightOrderIndexSum = data
  .map((pair, i) => (compare(...pair) < 0 ? i + 1 : 0))
  .reduce((a, b) => a + b)
console.log(rightOrderIndexSum)

const dividers = [[[2]], [[6]]]
const withDividers = [...data.flat(1), ...dividers].sort(compare)
const distressSignal = dividers.map((d) => withDividers.indexOf(d) + 1).reduce((a, b) => a * b)
console.log(distressSignal)
