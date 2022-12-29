const data = require("fs")
  .readFileSync(`${process.env["INPUT_PATH"]}/input16.txt`)
  .toString()
  .trimEnd()
  .split("\n")
  .map((a) => a.match(/^Valve (.+) has flow rate=(.+); tunnels? leads? to valves? (.+)$/))
  .map(([, position, speed, neighbors]) => ({
    position,
    speed: Number(speed),
    neighbors: new Set(neighbors.split(", ")),
  }))

const endTime = 26

const distances = new Map(
  data.map((node) => [
    node.position,
    new Map(
      data.map((neighborNode) => [
        neighborNode.position,
        node.neighbors.has(neighborNode.position) ? 1 : Infinity,
      ])
    ),
  ])
)

data.forEach(() => {
  data.forEach(({ position, neighbors }) => {
    neighbors.forEach((n) => newNeighbor(position, n))
  })
})

const cavesWithValves = data.filter((cave) => cave.speed).map((cave) => cave.position)

const paths = [
  ...cavesWithValves.flatMap((cave) => next([], 0, distances.get("AA").get(cave), cave)),
].sort((a, b) => b[0] - a[0])

let best = 0
let elephantPaths = [...paths]
for (let i = 0; i < paths.length; i += 1) {
  const [scoreA, pathA] = paths[i]
  if (scoreA <= best / 2 || i > elephantPaths.length) {
    break
  }
  const bestElephantPath = elephantPaths
    .slice(i)
    .find(([, pathB]) => pathA.every((pos) => !pathB.includes(pos)))
  if (bestElephantPath) {
    const sumScore = scoreA + bestElephantPath[0]
    if (sumScore > best) {
      const end = elephantPaths.findIndex(([score]) => score < best - scoreA)
      best = sumScore
      if (end !== -1) elephantPaths = elephantPaths.slice(0, end)
    }
  }
}

console.log(best)

function newNeighbor(nodeA, nodeB) {
  distances.forEach((distances, start) => {
    if (start !== nodeA && start !== nodeB) {
      distances.set(nodeA, Math.min(distances.get(nodeA), distances.get(nodeB) + 1))
      distances.set(nodeB, Math.min(distances.get(nodeB), distances.get(nodeA) + 1))
    }
  })
}

function next(previousVisitedNodes, score, time, currentNode) {
  const visited = [...previousVisitedNodes, currentNode]
  const node = data.find((d) => d.position === currentNode)
  const timeAfterOpen = time + 1
  const newScore = score + node.speed * Math.max(0, endTime - timeAfterOpen)
  const furtherPaths =
    time < endTime && visited.length < cavesWithValves.length
      ? cavesWithValves
          .filter((cave) => !visited.includes(cave))
          .flatMap((neigh) =>
            next(visited, newScore, timeAfterOpen + distances.get(currentNode).get(neigh), neigh)
          )
      : []
  return [...furtherPaths, [newScore, visited]]
}
