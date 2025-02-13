import * as React from "react"

import { inject, observer } from "mobx-react"

import { Card, Col, Row } from "antd"
import withRouter from "@components/Layout/Router/withRouter"
import { AppComponentListBase } from "@components/AppComponentBase"
import { L } from "@lib/abpUtility"
import moment from "moment"
import { dateFormat } from "@lib/appconst"
import { formatCurrency } from "@lib/helper"
// import { Table } from "antd";

export interface IContractItemProps {
  data: any;
}

@inject()
@observer
class ContractBoardItem extends AppComponentListBase<IContractItemProps> {
  formRef: any = React.createRef();
  state = {};

  public render() {
    const { data } = this.props

    return (
      <>
        <Card className="card-item-detail-modal">
          <Row gutter={[4, 4]}>
            <Col span={12}>
              <label>
                {this.L("LA_NAME")}: <strong>{data?.referenceNumber}</strong>
              </label>
            </Col>
            <Col span={12}>
              <label>
                {L("LA_STATUS")}: <strong>{data?.status?.name}</strong>
              </label>
            </Col>
            <Col span={12}>
              <label>
                {L("DEALER")}:
                <strong>
                  {
                    data?.leaseAgreementUserIncharge?.find(
                      (item) => item.positionId === 0
                    )?.user?.displayName
                  }
                </strong>
              </label>
            </Col>
            <Col span={12}>
              <label>
                {L("ADMIN_INCHARGE")}:
                <strong>
                  {
                    data?.leaseAgreementUserIncharge?.find(
                      (item) => item.positionId === 1
                    )?.user?.displayName
                  }
                </strong>
              </label>
            </Col>
            <Col span={12}>
              <label>
                {L("CONTACT")}: <strong>{data?.contact?.contactName}</strong>
              </label>
            </Col>
            <Col span={12}>
              <label>
                {L("COMPANY")}:<strong>{data?.company?.businessName}</strong>
              </label>
            </Col>
            <Col span={12}>
              <label>
                {L("OCCUPIER")}: <strong>{data?.occupier}</strong>
              </label>
            </Col>
            <Col span={12}>
              <label>
                {L("LEASE_TERM")}: <strong>{data?.leaseTerm}</strong>
              </label>
            </Col>
            <Col span={12}>
              <label>
                {L("COMMENCEMENT_DATE")}:
                <strong>
                  {moment(data?.commencementDate).format(dateFormat)}
                </strong>
              </label>
            </Col>
            <Col span={12}>
              <label>
                {L("EXPIRED_DATE")}:
                <strong>{moment(data?.expiryDate).format(dateFormat)}</strong>
              </label>
            </Col>
            <Col span={12}>
              <label>
                {L("EXTEND_DATE")}:
                <strong>
                  {moment(data?.extensionDate).format(dateFormat)}
                </strong>
              </label>
            </Col>
            <Col span={12}>
              <label>
                {L("TERMINATE_DATE")}:
                <strong>
                  {moment(data?.terminationDate).format(dateFormat)}
                </strong>
              </label>
            </Col>
            <Col span={12}>
              <label>
                {L("MOVEIN_DATE")}:
                <strong>{moment(data?.moveInDate).format(dateFormat)}</strong>
              </label>
            </Col>
            <Col span={12}>
              <label>
                {L("MOVE_OUT_DATE")}:
                <strong>{moment(data?.moveOutDate).format(dateFormat)}</strong>
              </label>
            </Col>
            <Col span={12}>
              <label>
                {L("RENT_SC_INC_VAT")}:
                <strong>{formatCurrency(data?.rentSCIncVAT)}</strong>
              </label>
            </Col>
            <Col span={12}>
              <label>
                {L("RENT_ONLY")}:
                <strong>{formatCurrency(data?.rentOnly)}</strong>
              </label>
            </Col>
          </Row>
        </Card>
      </>
    )
  }
}

export default withRouter(ContractBoardItem)
