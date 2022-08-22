import * as React from "react"
import { Person } from "shared/models/person"
import { RolllStateType } from "shared/models/roll"

export type DailyCareContextType = {
  studentArray: Person[]
  filteredArray: Person[]
  updateStudent: (rollState: RolllStateType, student: Person) => void
  saveStudent: (student: Person[]) => void
  filterStudent: (searchText: string) => void
}

const DailyCareDefaultValues: DailyCareContextType = {
  studentArray: [],
  filteredArray: [],
  updateStudent: (rollState: RolllStateType, student: Person) => {},
  saveStudent: (student: Person[]) => {},
  filterStudent: (searchText: string) => {},
}

export const DailyCareContext = React.createContext<DailyCareContextType>(DailyCareDefaultValues)

const DailyCareContextProvider: React.FC<React.ReactNode> = ({ children }) => {
  const [studentArray, setStudentArray] = React.useState<Person[]>([])
  const [filteredArray, setFilteredArray] = React.useState<Person[]>([])
  const updateStudent = (rollState: RolllStateType, student: Person) => {
    const id = student.id
    const updatedStudents = filteredArray.map((element) => {
      if (element.id === id) {
        return { ...element, rollStates: rollState }
      }
      return element
    })
    updatedStudents && setFilteredArray(updatedStudents)
  }

  const filterStudent = (searchText: string) => {
    switch (searchText) {
      case "all":
        const allS = filteredArray.filter((student) => {
          return student
        })
        return allS
      case "present":
        const presentS = filteredArray.filter((student) => {
          return student.rollStates === "present"
        })
        return presentS
      case "late":
        const lateS = filteredArray.filter((student) => {
          return student.rollStates === "late"
        })
        return lateS
      case "absent":
        const absentS = filteredArray.filter((student) => {
          return student.rollStates === "absent"
        })
        return absentS
    }
  }
  const saveStudent = (student: Person[]) => {
    student && setStudentArray([...student])
    student && setFilteredArray([...student])
  }
  return <DailyCareContext.Provider value={{ studentArray, filteredArray, filterStudent, updateStudent, saveStudent }}>{children}</DailyCareContext.Provider>
}

export default DailyCareContextProvider
