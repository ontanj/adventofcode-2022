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

const scores = cavesWithValves.map((cave) => next([], 0, distances.get("AA").get(cave), cave))

console.log(Math.max(...scores))

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
  const newScore = score + node.speed * Math.max(0, 30 - timeAfterOpen)
  if (time >= 30 || visited.length >= cavesWithValves.length) {
    return score
  } else {
    const scores = cavesWithValves
      .filter((cave) => !visited.includes(cave))
      .map((neigh) =>
        next(visited, newScore, timeAfterOpen + distances.get(currentNode).get(neigh), neigh)
      )
    return Math.max(...scores)
  }
}
