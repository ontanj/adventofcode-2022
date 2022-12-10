const data = require("fs")
  .readFileSync(`${process.env["INPUT_PATH"]}/input6.txt`)
  .toString()
  .trimEnd()
  .split("")
  .map((a) => a)

function searchUnique(length) {
  let index = length
  const marker = data.slice(0, index - 1)

  for (const character of data.slice(index - 1)) {
    const markerSet = new Set(marker)
    if (!markerSet.has(character) && markerSet.size === marker.length) {
      return index
    }
    marker.shift()
    marker.push(character)
    index += 1
  }
}

console.log(searchUnique(4))

console.log(searchUnique(14))
