import * as React from "react"

import { inject, observer } from "mobx-react"
import "./pipeline.less"

import { Card, Tag } from "antd"
import withRouter from "@components/Layout/Router/withRouter"
import { AppComponentListBase } from "@components/AppComponentBase"
import { L } from "@lib/abpUtility"
import TaskStore from "@stores/activity/taskStore"
import Stores from "@stores/storeIdentifier"
import { appPermissions, dateFormat } from "@lib/appconst"
import dayjs from "dayjs"
// import { Table } from "antd";

export interface AllTaskBoardItemProps {
  data: any
  goDetail: () => void
  key: any
  taskStore: TaskStore
}

@inject(Stores.TaskStore)
@observer
class AllTaskBoardItem extends AppComponentListBase<AllTaskBoardItemProps> {
  formRef: any = React.createRef()
  state = {}

  public render() {
    const {
      taskStore: { taskDetail },
    } = this.props
    return (
      <>
        <>
          <style>
            {`
     .card-detail:hover{
      background-color: #fffdf9 !important;
      border: 1px solid #696969 !important;
       }
       p {
        margin-top: 0;
        margin-bottom: 3px;
      }
      .ant-card-body{
        width: 100%;
      }
      p {
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
        overflow: hidden;
        text-overflow: ellipsis;
}
      `}
          </style>
          <Card
            onClick={
              this.isGranted(appPermissions.inquiry.detail)
                ? () => this.props.goDetail()
                : () => console.log("no permission")
            }
            className="card-detail"
            key={this.props.data?.id}
            style={{
              borderColor: this.props.data?.isActive ? "#e4e4e4" : "#ff8989",

              border:
                taskDetail?.id === this.props.data?.id
                  ? "1px solid #838383"
                  : "1px solid #f0f0f0",
            }}
          >
            <div className="h-100 board-item">
              <strong style={{ whiteSpace: "break-spaces" }}>
                {this.props.data?.subject ?? ""}
              </strong>
              <p>
                {L("DUE_DATE")}:
                <strong>
                  {dayjs(this.props.data.dueDate).format(dateFormat)}
                </strong>
              </p>
              <p>
                {L("PIC")}:
                {this.props.data.inquiryTaskUser?.map((item, index) => {
                  return <Tag key={index}>{item.user?.displayName}</Tag>
                })}
              </p>
              <p>
                {L("REMARK")}: {this.props.data.description}
              </p>
              <p>
                {L("CREATE_BY")}:
                <strong>{this.props.data?.creatorUser?.displayName}</strong>
              </p>
            </div>
          </Card>
        </>
      </>
    )
  }
}

export default withRouter(AllTaskBoardItem)
