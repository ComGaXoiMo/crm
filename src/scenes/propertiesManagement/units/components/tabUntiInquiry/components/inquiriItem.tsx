import * as React from "react"

import { inject, observer } from "mobx-react"

import { Card, Col, Row } from "antd"
import { AppComponentListBase } from "@components/AppComponentBase"

import { L } from "@lib/abpUtility"
// import { Table } from "antd";

export interface IInquiriItemProps {
  data: any;
}

@inject()
@observer
class InquiriItem extends AppComponentListBase<IInquiriItemProps> {
  formRef: any = React.createRef();
  state = {};

  public render() {
    const { data } = this.props

    return (
      <>
        <Card className="card-item-detail-modal">
          <Row gutter={[4, 4]}>
            <Col span={12}>
              <label style={{ fontSize: 12 }}>
                {this.L("INQUIRY_NAME")}: <strong>{data?.inquiryName}</strong>
              </label>
            </Col>
            <Col span={12}>
              <label style={{ fontSize: 12 }}>
                {this.L("INQUIRY_STATUS")}:<strong>{data?.status?.name}</strong>
              </label>
            </Col>
            <Col span={12}>
              <label style={{ fontSize: 12 }}>
                {L("DEALER")}: <strong>{data?.creatorUser?.displayName}</strong>
              </label>
            </Col>

            <Col span={12}>
              <label style={{ fontSize: 12 }}>
                {L("CONTACT")}: <strong>{data?.contact?.contactName}</strong>
              </label>
            </Col>
            <Col span={12}>
              <label style={{ fontSize: 12 }}>
                {L("COMPANY")}: <strong>{data?.company?.companyName}</strong>
              </label>
            </Col>
            <Col span={12}>
              <label style={{ fontSize: 12 }}>
                {L("OCCUPIER")}: <strong>{data?.occupierName}</strong>
              </label>
            </Col>
            <Col span={12}>
              <label style={{ fontSize: 12 }}>
                {L("EST_MOVEIN_DATE")}:
                <strong>{this.renderDate(data?.moveInDate)}</strong>
              </label>
            </Col>
            <Col span={12}>
              <label style={{ fontSize: 12 }}>
                {L("LEASE_TEARM")}: <strong>{data?.leaseTerm} Year</strong>
              </label>
            </Col>
            {/* <Col span={12}>
              <div className="text-muted small">
                <label style={{ fontSize: 12 }}>
                  Created By Admin PMH a year ago AT 18/03/2022 14:23
                </label>
              </div>
            </Col> */}
          </Row>
        </Card>
      </>
    )
  }
}

export default InquiriItem
