const data = require("fs")
  .readFileSync(`${process.env["INPUT_PATH"]}/input1.txt`)
  .toString()
  .split("\n\n")
  .map((section) =>
    section
      .split("\n")
      .map((item) => Number(item))
      .reduce((acc, val) => acc + val, 0)
  )
  .sort((a, b) => b - a)

console.log(data[0])
console.log(data.slice(0, 3).reduce((a, b) => a + b))
