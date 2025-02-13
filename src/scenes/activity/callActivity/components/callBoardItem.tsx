import * as React from "react"

import { inject, observer } from "mobx-react"

import withRouter from "@components/Layout/Router/withRouter"
import { AppComponentListBase } from "@components/AppComponentBase"
import { L } from "@lib/abpUtility"
import dayjs from "dayjs"
import { dateTimeFormat } from "@lib/appconst"
import { PhoneOutlined } from "@ant-design/icons"
// import { Table } from "antd";

export interface IProposalItemProps {
  data: any
}

@inject()
@observer
class ProposalBoardItem extends AppComponentListBase<IProposalItemProps, any> {
  formRef: any = React.createRef()
  state = {}

  public render() {
    const { data } = this.props

    return (
      <>
        <div className="monition-container">
          <div className="line-color" style={{ backgroundColor: "#3027ae" }} />
          <div className="monition-detail">
            <div
              className="icon-monition-detail"
              style={{ backgroundColor: "#3027ae", marginTop: "6px" }}
            >
              <PhoneOutlined />
            </div>
            <div className="monition-content">
              <label>
                {L("INQUIRY_NAME")}:
                <strong> {data?.inquiry?.inquiryName}</strong>
              </label>
              <label>
                {L("CALL_DESCRIPTION")}: <strong> {data?.description}</strong>
              </label>
              <label>
                {L("CALL_DATE")}:
                <strong>{dayjs(data?.callDate).format(dateTimeFormat)}</strong>
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

export default withRouter(ProposalBoardItem)
