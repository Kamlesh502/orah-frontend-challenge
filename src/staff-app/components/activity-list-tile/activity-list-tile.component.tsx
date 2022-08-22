import React, { useEffect } from "react"
import styled from "styled-components"
import { Spacing, BorderRadius, FontWeight } from "shared/styles/styles"
import { Images } from "assets/images"
import { Colors } from "shared/styles/colors"
import { Person, PersonHelper } from "shared/models/person"
import { RollStateSwitcher } from "staff-app/components/roll-state/roll-state-switcher.component"
import { RollInput } from "shared/models/roll"

interface Props {
  type?: string
  entity: any
  date: Date
}
export const ActivityListTile: React.FC<Props> = ({ type, entity, date }) => {
  const d = new Date(date)
  const d2 = d.getMonth() + "-" + d.getDate() + "-" + d.getFullYear()
  const h2 = d.getHours() + ":" + d.getMinutes()
  const [studentCount, setStudentCount] = React.useState({
    all: 0,
    present: 0,
    absent: 0,
    late: 0,
    unmark: 0,
  })
  console.log("first", entity)
  useEffect(() => {
    const allStudentCount = entity.student_roll_states?.length
    const presentStudentCount = entity.student_roll_states?.filter((s: any) => s.roll_state === "present").length
    const absentStudentCount = entity.student_roll_states?.filter((s: any) => s.roll_state === "absent").length
    const lateStudentCount = entity.student_roll_states?.filter((s: any) => s.roll_state === "late").length
    const unmarktudentCount = entity.student_roll_states?.filter((s: any) => s.roll_state === "unmark").length
    setStudentCount({
      all: allStudentCount,
      present: presentStudentCount,
      absent: absentStudentCount,
      late: lateStudentCount,
      unmark: unmarktudentCount,
    })
  }, [entity])
  return (
    <S.Container>
      {/* <S.Avatar url={Images.avatar}></S.Avatar> */}
      <S.Content>
        <div>{`Name: ${entity.name}`}</div>
        <div>{`Date: ${d2}`}</div>
        <div>{`Time : ${h2}`}</div>
      </S.Content>
      <S.Roll>
        <div>{`All: ${studentCount.all}`}</div>
        <div>{`Present: ${studentCount.present}`}</div>
        <div>{`Late: ${studentCount.late}`}</div>
        <div>{`Absent: ${studentCount.absent}`}</div>
        <div>{`Unmark: ${studentCount.unmark}`}</div>
      </S.Roll>
    </S.Container>
  )
}

const S = {
  Container: styled.div`
    margin-top: ${Spacing.u3};
    padding-right: ${Spacing.u2};
    display: flex;
    height: 60px;
    border-radius: ${BorderRadius.default};
    background-color: #fff;
    box-shadow: 0 2px 7px rgba(5, 66, 145, 0.13);
    transition: box-shadow 0.3s ease-in-out;

    &:hover {
      box-shadow: 0 2px 7px rgba(5, 66, 145, 0.26);
    }
  `,
  Avatar: styled.div<{ url: string }>`
    width: 60px;
    background-image: url(${({ url }) => url});
    border-top-left-radius: ${BorderRadius.default};
    border-bottom-left-radius: ${BorderRadius.default};
    background-size: cover;
    background-position: 50%;
    align-self: stretch;
  `,
  Content: styled.div`
    flex-grow: 1;
    padding: ${Spacing.u2};
    color: ${Colors.dark.base};
    font-weight: ${FontWeight.strong};
  `,
  Roll: styled.div`
    display: flex;
    align-items: center;
    margin-right: ${Spacing.u4};
    div {
      padding: ${Spacing.u4};
    }
  `,
}
