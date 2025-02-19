import React from "react"
import { Col, InputNumber, Modal, Row, Tag, Tooltip } from "antd"
import _ from "lodash"
import { L } from "@lib/abpUtility"
import Stores from "@stores/storeIdentifier"
import { inject, observer } from "mobx-react"
import withRouter from "@components/Layout/Router/withRouter"
import { AppComponentListBase } from "@components/AppComponentBase"

import { inputCurrencyFormatter } from "@lib/helper"
import AppConsts, { appPermissions, dateDifference } from "@lib/appconst"

import LeaseAgreementStore from "@stores/communication/leaseAgreementStore"

import ReservationStore from "@stores/activity/reservationStore"

import LeaseInfoModal from "@scenes/leaseContractsManagement/lease/components/leaseInfoModal"
import AppDataStore from "@stores/appDataStore"
import dayjs from "dayjs"
const { positionUser, leaseStage } = AppConsts
type Props = {
  leaseAgreementStore: LeaseAgreementStore
  reservationStore: ReservationStore
  appDataStore: AppDataStore
  leaseAgreementId: any
  visible: boolean
  onClose: () => void
  onOk: () => Promise<any>
}
type State = {
  listLaStatus: any[]
  reservationPriority: any
  headerContractAmount: number
  unitChooseIds: any[]
  dataPaymentForYear: any[]
  dataDiscountFee: any[]
  otherFeeData: any[]
  hasRent: boolean
}
@inject(
  Stores.ReservationStore,
  Stores.LeaseAgreementStore,
  Stores.AppDataStore
)
@observer
class EditContractModal extends AppComponentListBase<Props, State> {
  formRef = React.createRef<any>()
  constructor(props) {
    super(props)
    this.state = {
      listLaStatus: [] as any,
      reservationPriority: 1,
      headerContractAmount: 0,
      unitChooseIds: [] as any,
      dataPaymentForYear: [] as any,
      dataDiscountFee: [] as any,
      otherFeeData: [] as any,
      hasRent: false,
    }
  }
  componentDidMount(): void {
    this.getLaStatus(
      this.props.leaseAgreementStore.leaseAgreementDetail?.statusId
    )
  }
  async componentDidUpdate(prevProps) {
    const { leaseAgreementDetail } = this.props.leaseAgreementStore
    if (prevProps.visible !== this.props.visible) {
      if (this.props.visible) {
        this.setState({ reservationPriority: 1 })

        if (leaseAgreementDetail?.leaseAgreementUnit[0]?.unitId) {
          await this.formRef.current?.setFieldValue(
            "unitInfo",
            `${
              leaseAgreementDetail?.leaseAgreementUnit[0]?.project
                ?.projectCode ?? ""
            } - ${
              leaseAgreementDetail?.leaseAgreementUnit[0]?.unit?.unitName ?? ""
            }`
          )
          this.setState({
            unitChooseIds: [
              {
                unitId: leaseAgreementDetail?.leaseAgreementUnit[0]?.unitId,
                projectId:
                  leaseAgreementDetail?.leaseAgreementUnit[0]?.projectId,
              },
            ],
          })
        }
        await this.formRef.current?.setFieldsValue({
          ...leaseAgreementDetail,
          unitInfo: `${
            leaseAgreementDetail?.leaseAgreementUnit[0]?.project?.projectCode ??
            ""
          } - ${
            leaseAgreementDetail?.leaseAgreementUnit[0]?.unit?.unitName ?? ""
          }`,
          userId: leaseAgreementDetail?.leaseAgreementUserIncharge?.find(
            (item) => item.positionId === positionUser.dealer
          )?.userId,
          adminId: leaseAgreementDetail?.leaseAgreementUserIncharge?.find(
            (item) => item.positionId === positionUser.admin
          )?.userId,
        })

        if (this.props.leaseAgreementId) {
          this.setState({
            headerContractAmount:
              leaseAgreementDetail?.contractAmountAfterDiscountExcludeVat,
          })
          this.getLaStatus(
            this.props.leaseAgreementStore.leaseAgreementDetail.statusId
          )
        } else {
          const listValue = this.props.appDataStore.leaseAgreementStatus.filter(
            (item) => item.parentId === leaseStage.new
          )
          this.setState({ listLaStatus: listValue })
        }

        if (leaseAgreementDetail?.parentId) {
          this.formRef.current?.setFieldValue(
            "parentNumber",
            leaseAgreementDetail?.parent?.referenceNumber
          )
          this.formRef.current?.setFieldValue(
            "parentId",
            leaseAgreementDetail?.parentId
          )
        }
      }
    }
  }
  getLaStatus = (value) => {
    const sortOrder = this.props.appDataStore.leaseAgreementStatus.find(
      (item) => item.id === value
    )?.sortOrder

    const listValue = this.props.appDataStore.leaseAgreementStatus
      .map((data) => {
        if (data?.sortOrder < sortOrder) {
          return { ...data, disabled: true }
        } else {
          return { ...data }
        }
      })
      .filter((item) => item.parentId === leaseStage.new)
    this.setState({ listLaStatus: listValue })
  }

  getDataPaymentForYear = async (data) => {
    let totalAmount = 0
    let totalAmountInclVat = 0
    await data.map((item) => {
      totalAmount = totalAmount + item?.totalAmount
      totalAmountInclVat = totalAmountInclVat + item?.totalAmountIncludeVat
    })

    await this.formRef.current?.setFieldValue("contractAmount", totalAmount)
    await this.formRef.current?.setFieldValue(
      "contractAmountIncludeVat",
      totalAmountInclVat
    )
    if (this.state.dataDiscountFee.length === 0) {
      this.formRef.current?.setFieldValue(
        "contractAmountAfterDiscountIncludeVat",
        totalAmountInclVat
      )
      this.formRef.current?.setFieldValue(
        "contractAmountAfterDiscountExcludeVat",
        totalAmount
      )
      this.setState({
        headerContractAmount: totalAmount,
      })
    }
    const newData = data.map((item) => {
      const { ...newObj } = item
      return newObj
    })
    this.setState({ dataPaymentForYear: newData })
  }
  getDataOtherFee = (data) => {
    const newData = data.map((item) => {
      const { ...newObj } = item
      return newObj
    })
    this.setState({ otherFeeData: newData })
  }
  getDataDiscountFee = (data?) => {
    const { leaseAgreementDetail } = this.props.leaseAgreementStore
    const newData = data.map((item) => {
      const { ...newObj } = item
      return newObj
    })
    this.formRef.current?.setFieldsValue({
      contractAmountAfterDiscountIncludeVat:
        leaseAgreementDetail?.contractAmountAfterDiscountIncludeVat,
      contractAmountAfterDiscountExcludeVat:
        leaseAgreementDetail?.contractAmountAfterDiscountExcludeVat,
    })
    this.setState({ dataDiscountFee: newData })
    const lasItem = newData[newData.length - 1]
    if (lasItem?.contractRentAfterDiscountIncludeVat) {
      this.formRef.current?.setFieldValue(
        "contractAmountAfterDiscountIncludeVat",
        lasItem?.contractRentAfterDiscountIncludeVat
      )
      this.formRef.current?.setFieldValue(
        "contractAmountAfterDiscountExcludeVat",
        lasItem?.contractRentAfterDiscountExcludeVat
      )
      this.setState({
        headerContractAmount: lasItem?.contractRentAfterDiscountExcludeVat,
      })
    } else {
      this.setState({
        headerContractAmount:
          this.formRef.current?.getFieldValue("contractAmount"),
      })
    }
  }
  checkFullRent = (value) => {
    this.setState({ hasRent: value })
  }
  isChooseUnit = (value) => {
    this.setState({ unitChooseIds: value })
  }
  changePriority = (value) => {
    this.setState({ reservationPriority: value })
  }

  onSave = async () => {
    if (!this.state.hasRent) {
      Modal.warning({
        title: L("LA_RENT_IS_NOT_MATCH"),
        content: L("REVIEW_RENT_OF_THIS_LA"),
      })
    } else if (this.state.reservationPriority !== 1) {
      Modal.warning({
        title: L("CANNOT_CREATE_LA_REQUEST"),
        content: L("ONLY_UNIT_OF_RESERVATION_WITH_PROROTY_1"),
      })
    } else {
      const formValues = await this.formRef.current?.validateFields()
      const leaseTerm = await dateDifference(
        dayjs(formValues?.commencementDate).endOf("days"),
        dayjs(formValues?.expiryDate).endOf("days").subtract(1, "days")
      )
      let res = {
        ...formValues,
        leaseTermYear: leaseTerm.years,
        leaseTermMonth: leaseTerm.months,
        leaseTermDay: leaseTerm.days,
        leaseAgreementDetails: [
          ...this.state.dataPaymentForYear,
          ...this.state.otherFeeData,
        ],
        leaseAgreementDiscount: [...this.state.dataDiscountFee],
        leaseAgreementUnit: this.state.unitChooseIds,
        leaseAgreementUserIncharge: [
          {
            userId: this.formRef.current?.getFieldValue("userId"),
            positionId: positionUser.dealer,
          },
          {
            userId: this.formRef.current?.getFieldValue("adminId"),
            positionId: positionUser.admin,
          },
        ],
      }
      if (this.props.leaseAgreementId) {
        res = { ...res, id: this.props.leaseAgreementId }
      }
      await this.props.leaseAgreementStore.createOrUpdate(res)
      await this.props.onOk()
    }
  }

  render() {
    const {
      visible,
      onClose,
      leaseAgreementStore: { isLoading, leaseAgreementDetail },
    } = this.props
    const isLaConfirmed =
      leaseAgreementDetail?.stageId === leaseStage.confirm ?? false
    const isLaTerminate =
      leaseAgreementDetail?.stageId === leaseStage.terminate ||
      leaseAgreementDetail?.stageId === leaseStage.earlyTerminate

    const isDropped = leaseAgreementDetail?.stageId === leaseStage.drop
    const isFullEdit = this.isGranted(appPermissions.leaseAgreement.fullEdit)
    const isEditPermission = this.isGranted(
      appPermissions.leaseAgreement.update
    )
    return (
      this.props.visible && (
        <Modal
          open={visible}
          width={"99%"}
          style={{ top: 20 }}
          destroyOnClose
          maskClosable={false}
          title={
            <>
              <Row gutter={[12, 0]} className="w-100">
                <Col
                  sm={{ span: 6 }}
                  className="form-item-highlight header-content"
                >
                  {leaseAgreementDetail?.referenceNumber} -
                  {leaseAgreementDetail?.stageId === leaseStage.drop ? (
                    <Tooltip
                      placement="bottom"
                      title={`${leaseAgreementDetail?.reasonDrop}`}
                    >
                      <Tag color={leaseAgreementDetail?.stage?.color}>
                        {leaseAgreementDetail?.stage?.name}
                      </Tag>
                    </Tooltip>
                  ) : (
                    <Tag color={leaseAgreementDetail?.stage?.color}>
                      {leaseAgreementDetail?.stage?.name}
                    </Tag>
                  )}
                </Col>
                <Col sm={{ span: 6 }} className="item-header-drawer">
                  <span>{L("CURRENT_LA_AMOUNT_EXCL_VAT")}</span>
                </Col>
                <Col sm={{ span: 3 }} className="form-item-highlight-2">
                  <InputNumber
                    min={0}
                    className="w-100"
                    value={this.state.headerContractAmount}
                    formatter={(value) => inputCurrencyFormatter(value)}
                    disabled
                  />
                </Col>
              </Row>
            </>
          }
          // footer={
          //   <div className="footer-modal">
          //     <div>
          //       <Button onClick={onClose}>{L("BTN_CANCEL")}</Button>
          //       {(isEditPermission || isFullEdit) && (
          //         <Button
          //           loading={isLoading}
          //           className="button-primary"
          //           onClick={this.onSave}
          //         >
          //           {L("BTN_OK")}
          //         </Button>
          //       )}
          //     </div>
          //   </div>
          // }
          cancelText={L("BTN_CANCEL")}
          okText={L("BTN_OK")}
          onCancel={() => {
            onClose()
          }}
          onOk={() => {
            isEditPermission || isFullEdit
              ? this.onSave()
              : console.log("not permission")
          }}
          confirmLoading={isLoading}
        >
          <LeaseInfoModal
            listAmendmentItem={[]}
            isRenew={false}
            isEdit={isFullEdit || isEditPermission}
            id={this.props.leaseAgreementId}
            formRef={this.formRef}
            listLaStatus={this.state.listLaStatus}
            editStatusLA={isLaTerminate || isLaConfirmed || isDropped}
            visible={this.props.visible}
            checkFullRent={this.checkFullRent}
            onDataPaymentChange={this.getDataPaymentForYear}
            onDataOtherFeeChange={this.getDataOtherFee}
            onDataDiscountChange={this.getDataDiscountFee}
            onUnitChoose={this.isChooseUnit}
            changePriorty={this.changePriority}
          />
          <style>
            {`
              .ant-modal-body{
                padding: 0px;
              }

            `}
          </style>
        </Modal>
      )
    )
  }
}

export default withRouter(EditContractModal)
