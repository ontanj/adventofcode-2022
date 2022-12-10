const data = require("fs")
  .readFileSync(`${process.env["INPUT_PATH"]}/input7.txt`)
  .toString()
  .trimEnd()
  .split("$ ")
  .slice(1)
  .map((a) => a.trim().split("\n"))

const sizes = { name: "/", size: 0, children: [], parent: undefined }
let currentDir = sizes

data.forEach((command) => {
  const newDir = command[0].match(/^cd (.*)/)?.[1]
  if (newDir) {
    currentDir =
      newDir === "/"
        ? sizes
        : newDir === ".."
        ? currentDir.parent
        : currentDir.children.find((p) => p.name === newDir)
  } else {
    currentDir.children = command.slice(1).map((pathListing) => {
      const [type, name] = pathListing.split(" ")

      return type === "dir"
        ? { name, parent: currentDir }
        : { name, parent: currentDir, size: parseInt(type) }
    })
  }
})

let totalSize = 0
const dirSize = (dir) => {
  if (!dir.children) {
    return dir.size
  } else {
    dir.size = dir.children.map((a) => dirSize(a)).reduce((acc, v) => acc + v)
    if (dir.size <= 100000) {
      totalSize += dir.size
    }
    return dir.size
  }
}
dirSize(sizes)

console.log(totalSize)

const freeSpaze = 70000000 - sizes.size

const goal = 30000000 - freeSpaze

let closest = { name: "/", size: goal - sizes.size, origS: sizes.size }
const dirSearch = (dir) => {
  if (!dir.children) {
    return
  } else {
    const d = goal - dir.size
    if (d < 0 && d > closest.size) {
      closest = { name: dir.name, size: d, origS: dir.size }
    }
    dir.children.forEach((a) => dirSearch(a))
  }
}
dirSearch(sizes)

console.log(closest.origS)
