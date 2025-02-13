import * as React from "react"

import { inject, observer } from "mobx-react"

import { Tag } from "antd"
import withRouter from "@components/Layout/Router/withRouter"
import { AppComponentListBase } from "@components/AppComponentBase"
import dayjs from "dayjs"
import { dateFormat, dateTimeFormat } from "@lib/appconst"
import { SolutionOutlined } from "@ant-design/icons"

// import { Table } from "antd";

export interface AllTaskBoardItemProps {
  data: any
  key: any
}

@inject()
@observer
class AllTaskBoardItem extends AppComponentListBase<
  AllTaskBoardItemProps,
  any
> {
  formRef: any = React.createRef()
  state = {}

  public render() {
    const { data } = this.props

    return (
      <>
        <div className="monition-container" key={this.props.key}>
          <div className="line-color" style={{ backgroundColor: "#9e27ae" }} />
          <div className="monition-detail">
            <div
              className="icon-monition-detail"
              style={{ backgroundColor: "#9e27ae", marginTop: "6px" }}
            >
              <SolutionOutlined />
            </div>
            <div className="monition-content">
              <label>
                {this.L("TASK_SUBJECT")} : <strong>{data?.subject}</strong>
              </label>
              <label>
                {this.L("TASK_STATUS")} :
                <Tag color={data?.inquiryTaskStatus?.color}>
                  {data?.inquiryTaskStatus?.name}
                </Tag>
              </label>
              <label>
                {this.L("TASK_ASSIGN_TO")} :
                <strong>
                  {data?.inquiryTaskUser.map((item, index) => (
                    <Tag key={index}>{item?.user?.displayName}</Tag>
                  ))}
                </strong>
              </label>
              <label>
                {this.L("DUE_DATE")} :
                <strong>{dayjs(data?.dueDate).format(dateFormat)}</strong>
              </label>
              <label>
                {this.L("TASK_DESCRIPTION")} :
                <strong>{data?.description}</strong>
              </label>
              <label>
                Created by<strong> {data?.creatorUser?.displayName}</strong> at
                {dayjs(data?.creationTime).format(dateTimeFormat)}
              </label>
            </div>
          </div>
        </div>
      </>
    )
  }
}

export default withRouter(AllTaskBoardItem)
