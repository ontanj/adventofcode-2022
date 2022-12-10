const data = require("fs")
  .readFileSync(`${process.env["INPUT_PATH"]}/input8.txt`)
  .toString()
  .trimEnd()
  .split("\n")
  .map((a) => a.split(""))

const visible = data.reduce(
  (totalCount, row, rowIndex) =>
    totalCount +
    row.reduce((rowCount, treeHeight, columnIndex) => {
      const column = data.map((r) => r[columnIndex])
      if (
        row.slice(0, columnIndex).every((height) => height < treeHeight) ||
        row.slice(columnIndex + 1).every((height) => height < treeHeight) ||
        column.slice(0, rowIndex).every((height) => height < treeHeight) ||
        column.slice(rowIndex + 1).every((height) => height < treeHeight)
      ) {
        return rowCount + 1
      } else {
        return rowCount
      }
    }, 0),
  0
)

console.log(visible)

const max = data.reduce((totalMax, row, ri) => {
  const rowMax = row.reduce((rowMax, treeHeight, ci) => {
    const column = data.map((r) => r[ci])
    const left = row.slice(0, ci).reverse()
    const right = row.slice(ci + 1)
    const up = column.slice(0, ri).reverse()
    const bottom = column.slice(ri + 1)
    const product = [left, right, up, bottom]
      .map(
        (direction) => direction.findIndex((height) => height >= treeHeight) + 1 || direction.length
      )
      .reduce((product, value) => product * value)
    return Math.max(product, rowMax)
  }, 0)
  return Math.max(rowMax, totalMax)
}, 0)

console.log(max)
