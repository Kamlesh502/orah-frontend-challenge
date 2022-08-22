import { getRandomInt, generateRange } from "shared/helpers/math-utils"
import { RolllStateType } from "shared/models/roll"
import { Person } from "shared/models/person"
const nameTokens = ["Alan", "John", "Brandon", "Key", "Branda", "Morris", "Carlos", "Lee"]

export function generateStudent(id: number) {
  const person: Person = {
    id,
    first_name: nameTokens[getRandomInt(0, nameTokens.length - 1)],
    last_name: nameTokens[getRandomInt(0, nameTokens.length - 1)],
    rollStates: "unmark",
  }
  return person
}

export function generateStudents(number: number) {
  return generateRange(number).map((_, id) => generateStudent(id + 1))
}
