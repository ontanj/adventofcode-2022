const sum = require("fs")
  .readFileSync(`${process.env["INPUT_PATH"]}/input3.txt`)
  .toString()
  .trimEnd()
  .split("\n")
  .map((row) => {
    const div = row.length / 2
    return [row.slice(0, div).split(""), row.slice(div).split("")]
  })
  .map(([left, right]) =>
    left.find((leftItem) => right.find((rightItem) => leftItem === rightItem))
  )
  .map((sharedItem) => {
    const c = sharedItem.charCodeAt()
    return c > 95 ? c - 96 : c - 65 + 27
  })
  .reduce((acc, v) => acc + v)

console.log(sum)
