const [startingStacks, instructions] = require("fs")
  .readFileSync(`${process.env["INPUT_PATH"]}/input5.txt`)
  .toString()
  .trimEnd()
  .split("\n\n")
  .map((section) => section.split("\n"))

const stacks = []

startingStacks.reverse().forEach((row) => {
  for (let i = 0; i < row.length; i += 4) {
    const rowI = i / 4
    if (row[i] === "[") {
      if (stacks[rowI] === undefined) stacks.push([])
      stacks[rowI].push(row[i + 1])
    }
  }
})

stacks.forEach((r) => r.reverse())
const stacksA = [...stacks]
const stacksB = [...stacks]

instructions
  .map((a) => a.match(/move (\d+) from (\d+) to (\d+)/).slice(1))
  .forEach(([count, start1, end1]) => {
    const start = start1 - 1
    const end = end1 - 1
    {
      const movingCrates = stacksA[start].slice(0, count).reverse()
      stacksA[start] = stacksA[start].slice(count)
      stacksA[end] = [...movingCrates, ...stacksA[end]]
    }
    {
      const movingCrates = stacksB[start].slice(0, count)
      stacksB[start] = stacksB[start].slice(count)
      stacksB[end] = [...movingCrates, ...stacksB[end]]
    }
  })

const endA = stacksA.map((s) => s[0]).join("")
const endB = stacksB.map((s) => s[0]).join("")

console.log(endA)
console.log(endB)
