import * as React from "react"

import { inject, observer } from "mobx-react"

import { Tag } from "antd"
import withRouter from "@components/Layout/Router/withRouter"
import { AppComponentListBase } from "@components/AppComponentBase"
import dayjs from "dayjs"
import AppConsts, { dateTimeFormat } from "@lib/appconst"
import { FlagOutlined, UserOutlined } from "@ant-design/icons"
import { L } from "@lib/abpUtility"
// import { Table } from "antd";
const { unitReservationStatus } = AppConsts

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
          <div className="line-color" style={{ backgroundColor: "#ae2735" }} />
          <div className="monition-detail">
            <div
              className="icon-monition-detail"
              style={{ backgroundColor: "#ae2735", marginTop: "6px" }}
            >
              <FlagOutlined />
            </div>
            <div className="monition-content">
              <div className="h-100 board-item">
                <label>
                  {L("INQUIRY_NAME")}:
                  <strong> {data?.inquiry?.inquiryName}</strong>
                </label>
                <label>
                  {this.L("RESERVATION_DESCRIPTION")} :
                  <strong>{data?.description}</strong>
                </label>
                {/* <label>Numerical Order: 001</label> */}
                <label>
                  {this.L("RESERVATION_UNIT")} :
                  <strong>
                    {data?.reservationUnit?.map((item, index) => {
                      let color = "default"
                      switch (item.unitStatusId) {
                        case unitReservationStatus.close:
                          color = "#87d068"
                          break
                        case unitReservationStatus.new:
                          color = "blue"
                          break
                        case unitReservationStatus.cancel:
                          color = "red"
                          break
                        case unitReservationStatus.expried:
                          color = "red"
                          break
                        case unitReservationStatus.userCancel:
                          color = "red"
                          break

                        default:
                          color = "default"
                      }
                      let CLASSNAME = ""
                      switch (item.unitStatusId) {
                        case unitReservationStatus.cancel:
                          CLASSNAME = "strike-text"
                          break
                        case unitReservationStatus.userCancel:
                          CLASSNAME = "strike-text"
                          break
                        default:
                          CLASSNAME = ""
                      }
                      return (
                        <Tag key={index} className={CLASSNAME} color={color}>
                          {item.unitStatusId ===
                            unitReservationStatus.userCancel && (
                            <UserOutlined />
                          )}
                          {item?.unit?.projectCode} - {item?.unit?.unitName}
                          {item?.number > 0 && `- (${item?.number})`}
                        </Tag>
                      )
                    })}
                  </strong>
                </label>
                <label>
                  {this.L("RESERVATION_DATE_TIME")} :
                  <strong>
                    {dayjs(data?.reservationTime).format(dateTimeFormat)}
                  </strong>
                </label>
                <label>
                  {this.L("EXPRIY_DATE")} :
                  {data?.expiryDate && (
                    <strong>
                      {dayjs(data?.expiryDate).format(dateTimeFormat)}
                    </strong>
                  )}
                </label>
                <label>
                  Created by<strong> {data?.creatorUser?.displayName}</strong>{" "}
                  at {dayjs(data?.creationTime).format(dateTimeFormat)}
                </label>
              </div>
            </div>
          </div>
        </div>
      </>
    )
  }
}

export default withRouter(ProposalBoardItem)
