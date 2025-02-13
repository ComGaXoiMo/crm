import * as React from "react"

import { inject, observer } from "mobx-react"

import withRouter from "@components/Layout/Router/withRouter"
import { AppComponentListBase } from "@components/AppComponentBase"
import dayjs from "dayjs"
import AppConsts, { dateTimeFormat } from "@lib/appconst"
import { FileSearchOutlined } from "@ant-design/icons"
import { Tag } from "antd"
import { publicLayout } from "@components/Layout/Router/router.config"
import { L } from "@lib/abpUtility"
const { proposalTemplateType } = AppConsts

export interface ICallItemProps {
  data: any
}

@inject()
@observer
class CallBoardItem extends AppComponentListBase<ICallItemProps, any> {
  formRef: any = React.createRef()
  state = {}

  // goProposal = (id?) => {
  //   const { history } = this.props;
  //   history.push(portalLayouts.proposals.path.replace(":id", id));
  // };
  public render() {
    const { data } = this.props

    return (
      <>
        <div className="monition-container">
          <div className="line-color" style={{ backgroundColor: "#0b7b18" }} />
          <div className="monition-detail">
            <div
              className="icon-monition-detail"
              style={{ backgroundColor: "#0b7b18", marginTop: "6px" }}
            >
              <FileSearchOutlined />
            </div>
            <div className="monition-content">
              <label>
                {L("INQUIRY_NAME")}:
                <strong> {data?.inquiry?.inquiryName}</strong>
              </label>
              <label>
                {this.L("PROPOSAL_TITLE")} : <strong>{data?.title}</strong>
              </label>
              <label>
                {this.L("PROPOSAL_LINK")} :
                <strong>
                  {location.protocol +
                    "//" +
                    location.host +
                    publicLayout.proposalPublic.path.replace(
                      ":id",
                      data?.uniqueId
                    )}
                </strong>
              </label>
              {proposalTemplateType.unit === data?.proposalType && (
                <label>
                  {this.L("PROPOSAL_UNIT")} :
                  {data?.proposalUnit.map((item, index) => (
                    <Tag key={index}>
                      {item?.unit?.projectCode}-{item?.unit?.unitName}
                    </Tag>
                  ))}
                </label>
              )}
              {proposalTemplateType.project === data?.proposalType && (
                <label>
                  {this.L("PROPOSAL_PROJECT")} :
                  {data?.proposalProject.map((item, index) => (
                    <Tag key={index}>{item?.project?.projectCode}</Tag>
                  ))}
                </label>
              )}
              <label>
                {this.L("PROPOSAL_NUM_VIEW_LINK")}:
                <strong>{data?.linkView}</strong>
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

export default withRouter(CallBoardItem)
