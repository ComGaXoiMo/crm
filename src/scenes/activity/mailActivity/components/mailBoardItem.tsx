import * as React from "react"

import { inject, observer } from "mobx-react"

import withRouter from "@components/Layout/Router/withRouter"
import { AppComponentListBase } from "@components/AppComponentBase"
import { MailOutlined } from "@ant-design/icons"
import dayjs from "dayjs"
import { dateTimeFormat } from "@lib/appconst"
import { L } from "@lib/abpUtility"
// import { Table } from "antd";

export interface IMailItemProps {
  data: any
}

@inject()
@observer
class MailBoardItem extends AppComponentListBase<IMailItemProps> {
  formRef: any = React.createRef()
  state = {}

  public render() {
    const { data } = this.props

    return (
      <>
        <div className="monition-container">
          <div className="line-color" style={{ backgroundColor: "#2783ae" }} />
          <div className="monition-detail">
            <div
              className="icon-monition-detail"
              style={{ backgroundColor: "#2783ae", marginTop: "6px" }}
            >
              <MailOutlined />
            </div>
            <div className="monition-content">
              <label>
                {L("INQUIRY_NAME")}:
                <strong> {data?.inquiry?.inquiryName}</strong>
              </label>
              <label>
                {this.L("EMAIL_NAME")}: <strong> {data?.subject}</strong>
              </label>
              <label>
                {this.L("MAIL_SEND_DATE")}:
                <strong>{dayjs(data?.sendDate).format(dateTimeFormat)}</strong>
              </label>
              <label>
                {this.L("EMAIL_DESCRIPTION")}:
                <strong> {data?.description}</strong>
              </label>

              <label>
                Created by<strong> {data?.creatorUser?.displayName}</strong> at{" "}
                {dayjs(data?.creationTime).format(dateTimeFormat)}
              </label>
            </div>
          </div>
        </div>
      </>
    )
  }
}

export default withRouter(MailBoardItem)
