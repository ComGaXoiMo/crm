import * as React from "react"
import { L, isGranted } from "../../lib/abpUtility"
import { Avatar, AutoComplete, Tag } from "antd"
import {
  getFirstLetterAndUpperCase,
  renderDate,
  renderAvatar,
  renderGender,
  renderIsActive,
} from "../../lib/helper"
import { moduleAvatar } from "@lib/appconst"

const { Option } = AutoComplete
const { colorByLetter } = moduleAvatar

class AppComponentBase<P = any, S = any, SS = any> extends React.Component<
  P,
  S,
  SS
> {
  L(key: string): string {
    return L(key)
  }

  isGranted(permissionName: string): boolean {
    return isGranted(permissionName)
  }

  isHasValue(list: any[], value: any): boolean {
    const hasValue = list.findIndex((item) => item === value)
    if (hasValue > -1) {
      return true
    } else {
      return false
    }
  }

  renderOptions(options, log?) {
    if (log) {
      console.log(options)
    }

    return (options || []).map((option, index) => (
      <Option
        className={option.isHightlight ? "select-option-hightlight" : "sasdasd"}
        key={index}
        value={option.value || option.id}
      >
        {option.label || option.name}
      </Option>
    ))
  }

  renderAvatar = renderAvatar

  renderLogo(logoUrl, projectName, size = 64) {
    const firstLetter = getFirstLetterAndUpperCase(projectName || "G")
    const color = colorByLetter(firstLetter)
    return (
      <>
        <div className="table-cell-profile">
          <div>
            <Avatar
              shape="square"
              size={size}
              src={logoUrl}
              style={{ background: color }}
            >
              {firstLetter}
            </Avatar>
          </div>
        </div>
      </>
    )
  }

  renderGender = renderGender
}

export class AppComponentListBase<
  P = any,
  S = any,
  SS = any
> extends AppComponentBase<P, S, SS> {
  renderDate = renderDate

  renderIsActive = renderIsActive

  renderTag(value, color) {
    return (
      <Tag className="cell-round mr-0" color={color}>
        {value}
      </Tag>
    )
  }
}

export default AppComponentBase
