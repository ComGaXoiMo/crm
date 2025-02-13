import * as React from "react"
import BadgeList from "./badgeList"

type Props = {
  showStar?: boolean
  items: any[]
}
GradeList.defaultProps = {
  showStar: false,
  items: [],
}

export default function GradeList({ showStar, items }: Props) {
  if (showStar) {
    return <>star</>
  }
  return <BadgeList items={items} color="red" />
}
