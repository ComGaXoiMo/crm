import * as React from "react"

import { inject, observer } from "mobx-react"
import { Tag } from "antd"
import withRouter from "@components/Layout/Router/withRouter"
import { AppComponentListBase } from "@components/AppComponentBase"
import { dateTimeFormat } from "@lib/appconst"
import dayjs from "dayjs"
import { HomeOutlined } from "@ant-design/icons"
import { L } from "@lib/abpUtility"
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
          <div
            className="line-color"
            style={{ backgroundColor: "#c7292978" }}
          />
          <div className="monition-detail">
            <div
              className="icon-monition-detail"
              style={{ backgroundColor: "#c7292978", marginTop: "6px" }}
            >
              <HomeOutlined />
            </div>
            <div className="monition-content">
              <label>
                {L("INQUIRY_NAME")}:
                <strong> {data?.inquiry?.inquiryName}</strong>
              </label>
              <label>
                {this.L("SITE_VISIT_DESCRIPTION")} :
                <strong>{data?.description}</strong>
              </label>
              <label>
                {this.L("SITE_VISIT_DATE_TIME")} :
                <strong>
                  {dayjs(data?.siteVisitTime).format(dateTimeFormat)}
                </strong>
              </label>

              <label>
                {this.L("SITE_VISIT_UNIT")} :
                <strong>
                  {data?.siteVisitUnit?.map((item, index) => {
                    return (
                      <Tag key={index}>
                        {item?.unit?.projectCode} - {item?.unit?.unitName}
                      </Tag>
                    )
                  })}
                </strong>
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
