import * as React from "react"

import { inject, observer } from "mobx-react"

import { AppComponentListBase } from "@components/AppComponentBase"
import { Button, Card, Col, Row, Tag } from "antd"
import withRouter from "@components/Layout/Router/withRouter"
import { L } from "@lib/abpUtility"
import dayjs from "dayjs"
import AppConsts, { appPermissions, dateFormat } from "@lib/appconst"
import { formatCurrency } from "@lib/helper"
import TextArea from "antd/lib/input/TextArea"
// import { Table } from "antd";
const { leaseFeeType, amendmentItem } = AppConsts
export interface IProposalItemProps {
  data: any
  viewInfo: (info) => void
}

@inject()
@observer
class AmendmentCardItem extends AppComponentListBase<IProposalItemProps, any> {
  formRef: any = React.createRef()
  state = {}

  public render() {
    const { data } = this.props

    const dataRent = data?.leaseAgreementDetails?.filter(
      (item) => item?.feeType?.typeId === leaseFeeType?.rent
    )
    const dataOtherFee = data?.leaseAgreementDetails?.filter(
      (item) => item?.feeType?.typeId === leaseFeeType?.otherFee
    )
    return (
      <>
        {!data?.leaseAgreementAmendmentId ? (
          <Card className="card-detail-modal px-2 full-width">
            <Row gutter={[8, 8]}>
              <Col sm={{ span: 8 }}>
                <strong className="card-title">
                  {L("AMENDMENT_LEASE_AGREEMENT")}
                </strong>
              </Col>
              <Col sm={{ span: 10 }}>
                <strong className="card-title">{L("UNIT")}</strong>{" "}
                <span className="card-title">
                  {" "}
                  {data?.leaseAgreementUnit[0]?.unit?.unitName}
                </span>
              </Col>
              <Col sm={{ span: 6 }} className="flex right-content">
                <Tag className="" color={data?.status?.color}>
                  {data?.status?.name}
                </Tag>
              </Col>
            </Row>

            <Row gutter={[8, 8]}>
              {/* COL 1 */}
              <Col sm={{ span: 8 }}>
                <div className="grid-auto-row-2">
                  <div className="">
                    <strong>{L("REF_NUMBER")}</strong>
                  </div>
                  <div className=""> {data?.referenceNumber}</div>

                  <div className="">
                    <strong>{L("OCCUPIER")}</strong>
                  </div>
                  <div className=""> {data?.occupier}</div>

                  <div className="">
                    <strong>{L("COMMENCEMENT_DATE")}</strong>
                  </div>
                  <div className="">
                    {dayjs(data?.commencementDate).format(dateFormat)}
                  </div>
                  <div className="">
                    <strong>{L("EXPIRY_DATE")}</strong>
                  </div>
                  <div className="">
                    {dayjs(data?.expiryDate).format(dateFormat)}
                  </div>
                  <div className="">
                    <strong>{L("TERMINATE")}</strong>
                  </div>
                  <div className="">
                    {data?.terminationDate
                      ? dayjs(data?.terminationDate).format(dateFormat)
                      : "-"}
                  </div>
                </div>
              </Col>
              {/* COL 2 */}
              <Col sm={{ span: 10 }}>
                <div className="grid-auto-row-2">
                  <div className="">
                    <strong>{L("LA_AMOUNT_INCL_VAT")}</strong>
                  </div>
                  <div className="flex right-content">
                    {" "}
                    {formatCurrency(data?.contractAmountIncludeVat)}
                  </div>

                  <div className="">
                    <strong>{L("LA_AMOUNT_EXCL_VAT")}</strong>
                  </div>
                  <div className="flex right-content">
                    {" "}
                    {formatCurrency(data?.contractAmount)}
                  </div>
                  {data?.contractAmountAfterDiscountIncludeVat > 0 && (
                    <>
                      <div className="">
                        <strong>
                          {L("LA_AMOUNT_INCL_VAT_AFTER_DISCOUNT")}
                        </strong>
                      </div>
                      <div className="flex right-content">
                        {formatCurrency(
                          data?.contractAmountAfterDiscountIncludeVat
                        )}
                      </div>
                    </>
                  )}
                  {data?.contractAmountAfterDiscountExcludeVat > 0 && (
                    <>
                      <div className="">
                        <strong>
                          {L("LA_AMOUNT_EXCL_VAT_AFTER_DISCOUNT")}
                        </strong>
                      </div>
                      <div className="flex right-content">
                        {formatCurrency(
                          data?.contractAmountAfterDiscountExcludeVat
                        )}
                      </div>
                    </>
                  )}
                  <div className="">
                    <strong>{L("RENT_COLLECTED_AMOUNT")}</strong>
                  </div>
                  <div className="flex right-content">
                    {formatCurrency(data?.rentCollectedAmount)}
                  </div>
                </div>
              </Col>
              <Col
                sm={{ span: 6 }}
                className="flex right-content align-items-end"
              >
                <Button
                  onClick={() => this.props.viewInfo(data)}
                  className="button-secondary"
                >
                  {L("VIEW_INFORMATION")}
                </Button>
              </Col>
            </Row>
          </Card>
        ) : (
          <Card className="card-detail-modal full-width">
            <Row gutter={[8, 8]}>
              <Col sm={{ span: 8 }}>
                <strong className="card-title">{L("AMENDMENT")}</strong>
              </Col>
              <Col sm={{ span: 10 }}>
                <strong
                  className={
                    this.isHasValue(
                      data?.leaseAgreementAmendmentTypeMap?.map(
                        (item) => item?.amendmentTypeId
                      ),
                      amendmentItem?.unit
                    )
                      ? "amendment-highlight card-title"
                      : "card-title"
                  }
                >
                  {L("UNIT")}
                </strong>{" "}
                <span className="card-title">
                  {data?.leaseAgreementUnit[0]?.unit?.unitName}
                </span>
              </Col>
              <Col sm={{ span: 6 }} className="flex right-content">
                <Tag className="" color={data?.status?.color}>
                  {data?.status?.name}
                </Tag>
              </Col>
            </Row>

            <Row gutter={[8, 8]}>
              {/* COL 1 */}
              <Col sm={{ span: 8 }}>
                <div className="grid-auto-row-2">
                  <div className="">
                    <strong>{L("COMMENCEMENT_DATE")}</strong>
                  </div>
                  <div className="flex right-content">
                    {dayjs(data?.commencementDate).format(dateFormat)}
                  </div>

                  {dataRent.map((rentItem) => (
                    <>
                      <div
                        className={
                          this.isHasValue(
                            data?.leaseAgreementAmendmentTypeMap?.map(
                              (item) => item?.amendmentTypeId
                            ),
                            amendmentItem?.rent
                          )
                            ? "amendment-highlight"
                            : ""
                        }
                      >
                        <strong>
                          {L("RENT_INCL_VAT")} {L("INCL_VAT")}
                        </strong>
                      </div>
                      <div className="flex right-content">
                        {formatCurrency(rentItem?.amountIncludeVat)}
                      </div>
                    </>
                  ))}

                  {dataOtherFee.map((otherFeeItem) => (
                    <>
                      <div
                        className={
                          this.isHasValue(
                            data?.leaseAgreementAmendmentTypeMap?.map(
                              (item) => item?.amendmentTypeId
                            ),
                            amendmentItem?.otherFee
                          )
                            ? "amendment-highlight"
                            : ""
                        }
                      >
                        <strong>
                          {otherFeeItem?.feeType?.name} {L("INCL_VAT")}
                        </strong>
                      </div>
                      <div className="flex right-content">
                        {formatCurrency(otherFeeItem?.amountIncludeVat)}
                      </div>
                    </>
                  ))}

                  {data?.leaseAgreementDiscount.map((discountItem) => (
                    <>
                      <div
                        className={
                          this.isHasValue(
                            data?.leaseAgreementAmendmentTypeMap?.map(
                              (item) => item?.amendmentTypeId
                            ),
                            amendmentItem?.discount
                          )
                            ? "amendment-highlight"
                            : ""
                        }
                      >
                        <strong>{L("DISCOUNT_PER_MONTH_INCL_VAT")}</strong>
                      </div>
                      <div className="flex right-content">
                        {formatCurrency(
                          discountItem?.discountIncludeVatPerMonth
                        )}
                      </div>
                    </>
                  ))}
                </div>
              </Col>
              {/* COL 2 */}
              <Col sm={{ span: 10 }}>
                <div className="grid-auto-row-4">
                  <div className="">
                    <strong>{L("EXPIRY_DATE")}</strong>
                  </div>
                  <div className="flex right-content">
                    {dayjs(data?.expiryDate).format(dateFormat)}
                  </div>
                  <div></div>
                  <div> </div>
                  {dataRent.map((rentItem) => (
                    <>
                      <div className="">
                        <strong>{L("FROM")}</strong>
                      </div>
                      <div className="flex right-content">
                        {dayjs(rentItem?.startDate).format(dateFormat)}
                      </div>{" "}
                      <div className="">
                        <strong>{L("TO")}</strong>
                      </div>
                      <div className="flex right-content">
                        {dayjs(rentItem?.endDate).format(dateFormat)}
                      </div>
                    </>
                  ))}

                  {dataOtherFee.map((otherFeeItem) => (
                    <>
                      <div className="">
                        <strong>{L("FROM")}</strong>
                      </div>
                      <div className="flex right-content">
                        {dayjs(otherFeeItem?.startDate).format(dateFormat)}
                      </div>{" "}
                      <div className="">
                        <strong>{L("TO")}</strong>
                      </div>
                      <div className="flex right-content">
                        {dayjs(otherFeeItem?.endDate).format(dateFormat)}
                      </div>
                    </>
                  ))}

                  {data?.leaseAgreementDiscount.map((discountItem) => (
                    <>
                      <div className="">
                        <strong>{L("FROM")}</strong>
                      </div>
                      <div className="flex right-content">
                        {dayjs(discountItem?.startDate).format(dateFormat)}
                      </div>{" "}
                      <div className="">
                        <strong>{L("TO")}</strong>
                      </div>
                      <div className="flex right-content">
                        {dayjs(discountItem?.endDate).format(dateFormat)}
                      </div>
                    </>
                  ))}
                </div>
              </Col>

              <Col
                sm={{ span: 6 }}
                className="flex right-content align-items-end"
              >
                {this.isGranted(appPermissions.amendment.read) && (
                  <Button
                    onClick={() => this.props.viewInfo(data)}
                    className="button-secondary"
                  >
                    {L("VIEW_INFORMATION")}
                  </Button>
                )}
              </Col>
              <Col sm={{ span: 24 }}>
                <TextArea
                  rows={3}
                  disabled
                  defaultValue={data?.amendmentDescription}
                />
              </Col>
            </Row>
          </Card>
        )}
      </>
    )
  }
}

export default withRouter(AmendmentCardItem)
