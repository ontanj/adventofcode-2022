const data = require("fs")
  .readFileSync(`${process.env["INPUT_PATH"]}/input11.txt`)
  .toString()
  .trimEnd()
  .split("\n\n")
  .map((monkey) => {
    const [, items, opOperator, opValue, test, trueReceiver, falseReceiver] = monkey.match(
      /^Monkey \d+:\s+Starting items: (.+)\s+Operation: new = old (.) (.+)\s+Test: divisible by (\d+)\s+If true: throw to monkey (\d+)\s+If false: throw to monkey (\d+)$/
    )
    return {
      items: items.split(", ").map(Number),
      operation: { operator: opOperator, value: opValue },
      test: Number(test),
      receivers: [Number(falseReceiver), Number(trueReceiver)],
    }
  })

function play(noRounds, worryReductionFunction) {
  const monkeyItems = data.map((monkey) => [...monkey.items])
  const inspections = data.map(() => 0)
  for (let round = 0; round < noRounds; round += 1) {
    data.forEach((monkey, monkeyIndex) => {
      monkeyItems[monkeyIndex].forEach((item) => {
        const operatorValue =
          monkey.operation.value === "old" ? item : parseInt(monkey.operation.value)
        const newWorryLevel = worryReductionFunction(
          monkey.operation.operator === "*" ? item * operatorValue : item + operatorValue
        )
        monkeyItems[monkey.receivers[Number(newWorryLevel % monkey.test === 0)]].push(newWorryLevel)
        inspections[monkeyIndex] += 1
      })
      monkeyItems[monkeyIndex] = []
    })
  }
  return inspections
}

function monkeyBusiness(inspections) {
  return inspections
    .sort((a, b) => b - a)
    .slice(0, 2)
    .reduce((product, inspection) => inspection * product, 1)
}

const resA = play(20, (v) => Math.floor(v / 3))
const resB = play(10000, (v) => v % data.map((monkey) => monkey.test).reduce((a, b) => a * b))

console.log(monkeyBusiness(resA))
console.log(monkeyBusiness(resB))
