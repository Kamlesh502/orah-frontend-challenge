import React, { useState, useEffect } from "react"
import styled from "styled-components"
import Button from "@material-ui/core/ButtonBase"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSort } from "@fortawesome/free-solid-svg-icons"
import { Spacing, BorderRadius, FontWeight } from "shared/styles/styles"
import { Colors } from "shared/styles/colors"
import { CenteredContainer } from "shared/components/centered-container/centered-container.component"
import { Person } from "shared/models/person"
import { useApi } from "shared/hooks/use-api"
import { StudentListTile } from "staff-app/components/student-list-tile/student-list-tile.component"
import { ActiveRollOverlay, ActiveRollAction } from "staff-app/components/active-roll-overlay/active-roll-overlay.component"

export const HomeBoardPage: React.FC = () => {
  const [isRollMode, setIsRollMode] = useState(false)
  const [getStudents, data, loadState] = useApi<{ students: Person[] }>({ url: "get-homeboard-students" })
  const [firstNameSortType, setFirstNameSortType] = useState("asc")
  const [lastNameSortType, setLastNameSortType] = useState("asc")
  const [inputStudent, setInputStudent] = useState("")
  const [filterStudentMode, setFilterStudentMode] = useState(false)
  const [filteredStudentData, setFilteredStudentData] = useState<Person[] | undefined>([])
  useEffect(() => {
    void getStudents()
    setInputStudent("")
    setFilterStudentMode(false)
  }, [getStudents])

  const onToolbarAction = (action: ToolbarAction) => {
    if (action === "roll") {
      setIsRollMode(true)
    }
    if (action === "sort_first_name") {
      if (firstNameSortType === "asc") {
        filterStudentMode ? filteredStudentData?.sort((a, b) => a.first_name.localeCompare(b.first_name)) : data?.students.sort((a, b) => a.first_name.localeCompare(b.first_name))
        setFirstNameSortType(firstNameSortType === "asc" ? "desc" : "asc")
      } else {
        filterStudentMode ? filteredStudentData?.sort((a, b) => b.first_name.localeCompare(a.first_name)) : data?.students.sort((a, b) => b.first_name.localeCompare(a.first_name))
        setFirstNameSortType(firstNameSortType === "asc" ? "desc" : "asc")
      }
    }
    if (action === "sort_last_name") {
      if (lastNameSortType === "asc") {
        filterStudentMode ? filteredStudentData?.sort((a, b) => a.last_name.localeCompare(b.last_name)) : data?.students.sort((a, b) => a.last_name.localeCompare(b.last_name))
        setLastNameSortType(lastNameSortType === "asc" ? "desc" : "asc")
      } else {
        filterStudentMode ? filteredStudentData?.sort((a, b) => b.last_name.localeCompare(a.last_name)) : data?.students.sort((a, b) => b.last_name.localeCompare(a.last_name))
        setLastNameSortType(lastNameSortType === "asc" ? "desc" : "asc")
      }
    }
    if (action === "search_by_name") {
      if (inputStudent === "") {
        setFilterStudentMode(false)
      }
      const filteredStudent = data?.students.filter(
        (student) => student.first_name.toLowerCase().includes(inputStudent.toLowerCase()) || student.last_name.toLowerCase().includes(inputStudent.toLowerCase())
      )
      setFilteredStudentData(filteredStudent)
    }
  }

  const onActiveRollAction = (action: ActiveRollAction) => {
    if (action === "exit") {
      setIsRollMode(false)
    }
  }

  return (
    <>
      <S.PageContainer>
        <Toolbar onItemClick={onToolbarAction} setInputStudent={setInputStudent} setFilterStudentMode={setFilterStudentMode} />

        {loadState === "loading" && (
          <CenteredContainer>
            <FontAwesomeIcon icon="spinner" size="2x" spin />
          </CenteredContainer>
        )}

        {loadState === "loaded" && data?.students && (
          <>
            {filterStudentMode
              ? filteredStudentData?.map((student) => <StudentListTile student={student} key={student.id} isRollMode={isRollMode} />)
              : data?.students.map((student) => <StudentListTile student={student} key={student.id} isRollMode={isRollMode} />)}
          </>
        )}

        {loadState === "error" && (
          <CenteredContainer>
            <div>Failed to load</div>
          </CenteredContainer>
        )}
      </S.PageContainer>
      <ActiveRollOverlay isActive={isRollMode} onItemClick={onActiveRollAction} />
    </>
  )
}

type ToolbarAction = "roll" | "sort_first_name" | "sort_last_name" | "search_by_name"
interface ToolbarProps {
  onItemClick: (action: ToolbarAction, value?: string) => void
  setInputStudent: (value: string) => void
  setFilterStudentMode: (value: boolean) => void
}
const Toolbar: React.FC<ToolbarProps> = (props) => {
  const { onItemClick, setInputStudent, setFilterStudentMode } = props
  return (
    <S.ToolbarContainer>
      <div onClick={() => onItemClick("sort_first_name")} style={{ cursor: "pointer" }}>
        First Name <FontAwesomeIcon icon={faSort} />
      </div>
      <div onClick={() => onItemClick("sort_last_name")} style={{ cursor: "pointer" }}>
        Last Name <FontAwesomeIcon icon={faSort} />
      </div>
      <div>
        <input
          onChange={(e) => setInputStudent(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              setFilterStudentMode(true)
              onItemClick("search_by_name")
            }
          }}
        />
        <button
          onClick={() => {
            setFilterStudentMode(true)
            onItemClick("search_by_name")
          }}
        >
          Search
        </button>
      </div>
      <S.Button onClick={() => onItemClick("roll")}>Start Roll</S.Button>
    </S.ToolbarContainer>
  )
}

const S = {
  PageContainer: styled.div`
    display: flex;
    flex-direction: column;
    width: 50%;
    margin: ${Spacing.u4} auto 140px;
  `,
  ToolbarContainer: styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #fff;
    background-color: ${Colors.blue.base};
    padding: 6px 14px;
    font-weight: ${FontWeight.strong};
    border-radius: ${BorderRadius.default};
  `,
  Button: styled(Button)`
    && {
      padding: ${Spacing.u2};
      font-weight: ${FontWeight.strong};
      border-radius: ${BorderRadius.default};
    }
  `,
}
