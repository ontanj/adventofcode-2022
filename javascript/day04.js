const sectionPairs = require("fs")
  .readFileSync(`${process.env["INPUT_PATH"]}/input4.txt`)
  .toString()
  .trimEnd()
  .split("\n")
  .map((row) => row.split(",").map((sections) => sections.split("-").map(Number)))

const sumA = sectionPairs.filter(
  ([sectionsLeft, sectionsRight]) =>
    (sectionsLeft[0] <= sectionsRight[0] && sectionsLeft[1] >= sectionsRight[1]) ||
    (sectionsRight[0] <= sectionsLeft[0] && sectionsRight[1] >= sectionsLeft[1])
).length

const sumB = sectionPairs.filter(
  ([sectionsLeft, sectionsRight]) =>
    (sectionsLeft[0] >= sectionsRight[0] && sectionsLeft[0] <= sectionsRight[1]) ||
    (sectionsLeft[1] >= sectionsRight[0] && sectionsLeft[0] <= sectionsRight[1])
).length

console.log(sumA)

console.log(sumB)
