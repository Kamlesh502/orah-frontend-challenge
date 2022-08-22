import React, { useEffect } from "react"
import styled from "styled-components"
import Button from "@material-ui/core/Button"
import { BorderRadius, Spacing } from "shared/styles/styles"
import { RollStateList } from "staff-app/components/roll-state/roll-state-list.component"
import { DailyCareContext, DailyCareContextType } from "staff-app/context/dailyCareContext"
import { Person } from "shared/models/person"

export type ActiveRollAction = "filter" | "exit" | "complete"
interface Props {
  isActive: boolean
  onItemClick: (action: ActiveRollAction, value?: string) => void
}

export const ActiveRollOverlay: React.FC<Props> = (props) => {
  const { isActive, onItemClick } = props
  const { filteredArray } = React.useContext(DailyCareContext) as DailyCareContextType
  const [studentCount, setStudentCount] = React.useState({
    all: 0,
    present: 0,
    absent: 0,
    late: 0,
  })
  useEffect(() => {
    const allStudentCount = filteredArray?.length
    const presentStudentCount = filteredArray?.filter((s: Person) => s.rollStates === "present").length
    const absentStudentCount = filteredArray?.filter((s: Person) => s.rollStates === "absent").length
    const lateStudentCount = filteredArray?.filter((s: Person) => s.rollStates === "late").length
    setStudentCount({
      all: allStudentCount,
      present: presentStudentCount,
      absent: absentStudentCount,
      late: lateStudentCount,
    })
  }, [filteredArray])

  return (
    <S.Overlay isActive={isActive}>
      <S.Content>
        <div>Class Attendance</div>
        <div>
          <RollStateList
            stateList={[
              { type: "all", count: studentCount.all },
              { type: "present", count: studentCount.present },
              { type: "late", count: studentCount.late },
              { type: "absent", count: studentCount.absent },
            ]}
            onItemClick={onItemClick}
          />
          <div style={{ marginTop: Spacing.u6 }}>
            <Button color="inherit" onClick={() => onItemClick("exit")}>
              Exit
            </Button>
            <Button color="inherit" style={{ marginLeft: Spacing.u2 }} onClick={() => onItemClick("complete")}>
              Complete
            </Button>
          </div>
        </div>
      </S.Content>
    </S.Overlay>
  )
}

const S = {
  Overlay: styled.div<{ isActive: boolean }>`
    position: fixed;
    bottom: 0;
    left: 0;
    height: ${({ isActive }) => (isActive ? "120px" : 0)};
    width: 100%;
    background-color: rgba(34, 43, 74, 0.92);
    backdrop-filter: blur(2px);
    color: #fff;
  `,
  Content: styled.div`
    display: flex;
    justify-content: space-between;
    width: 52%;
    height: 100px;
    margin: ${Spacing.u3} auto 0;
    border: 1px solid #f5f5f536;
    border-radius: ${BorderRadius.default};
    padding: ${Spacing.u4};
  `,
}
