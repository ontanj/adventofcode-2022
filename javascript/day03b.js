const sum = require("fs")
  .readFileSync(`${process.env["INPUT_PATH"]}/input3.txt`)
  .toString()
  .trimEnd()
  .split("\n")
  .map((a) => a.split(""))
  .reduce(
    (data, row, i) =>
      i % 3 === 0
        ? { ...data, a: new Set(row) }
        : i % 3 === 1
        ? { ...data, b: new Set(row) }
        : {
            sharedItems: [...data.sharedItems, row.find((rv) => data.a.has(rv) && data.b.has(rv))],
          },
    { sharedItems: [] }
  )
  .sharedItems.map((a) => {
    const c = a.charCodeAt()
    return c > 95 ? c - 96 : c - 65 + 27
  })
  .reduce((acc, v) => acc + v)

console.log(sum)
