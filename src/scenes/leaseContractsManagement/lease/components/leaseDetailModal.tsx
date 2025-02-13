import { inject, observer } from "mobx-react"
import React from "react"
import CustomDrawer from "@components/Drawer/CustomDrawer"
import { L, LNotification } from "@lib/abpUtility"
import {
  Button,
  Col,
  Dropdown,
  Form,
  InputNumber,
  Menu,
  Modal,
  Row,
  Select,
  Table,
  Tabs,
  Tag,
  Tooltip,
} from "antd"
import withRouter from "@components/Layout/Router/withRouter"
import AppDataStore from "@stores/appDataStore"
import Stores from "@stores/storeIdentifier"
import { AppComponentListBase } from "@components/AppComponentBase"
import TabPane from "antd/lib/tabs/TabPane"

import FileStore from "@stores/common/fileStore"
import DataTable from "@components/DataTable"
import {
  formatCurrency,
  inputCurrencyFormatter,
  renderOptions,
} from "@lib/helper"
import TabDocument from "@scenes/inquiriesManagement/inquiriesList/components/detailInquiry/tabDocument"
import LeaseInfoModal from "./leaseInfoModal"
import LeaseAgreementStore from "@stores/communication/leaseAgreementStore"
import EditFeeModal from "./editFeeModal"
import AppConsts, {
  appPermissions,
  dateDifference,
  moduleNames,
} from "@lib/appconst"
import _ from "lodash"
import GeneratePaymentModal from "./generatePaymentModal"
import TerminateModal from "./leaseDetailComponent/terminateModal"
import moment from "moment"
import DroppedModal from "./leaseDetailComponent/droppedModal"
import { validateMessages } from "@lib/validation"
import TabAuditTrail from "./tabAuditTrail"
import ConfirmModal from "./leaseDetailComponent/confirmModal"
import TabCommission from "./tabCommission"
import TabDealerCommission from "./tabDealerCommission"
import TabDeposit from "./tabDeposit"
import LeaseAmendment from "./leaseAmendment"
import SelectAmendmentModal from "./leaseAmendment/components/selectAmendmentModal"
import TabOtherContact from "./tabOtherContact"
const {
  paymentTerm,
  positionUser,
  align,
  leaseStage,
  paymentStatus,
  leaseStatus,
  depositLAStatus,
} = AppConsts
const confirm = Modal.confirm

const tabKeys = {
  tabCurrentLA: "TAB_CURRENT_LA",
  tabInformation: "TAB_LA_INFORMATION",
  tabSchedulePayment: "TAB_SCHEDULE_PAYMENT",
  tabCommission: "TAB_COMMISSION",
  tabDealerCommission: "TAB_DEALER_COMMISSION",
  tabDeposit: "TAB_DEPOSIT",
  tabOtherContact: "TAB_OTHER_CONTACT",

  tabDocument: "TAB_DOCUMENT",
  tabAuditTrail: "TAB_AUDIT_TRAIL",
}
type Props = {
  visible: boolean
  isRenew: boolean
  history: any
  onClose: () => void
  onOk: () => void
  onAmendOk: () => void
  reNewLa: (id) => void
  appDataStore: AppDataStore
  leaseAgreementStore: LeaseAgreementStore
  fileStore: FileStore
  leaseAgreementId: any
}
type States = {
  tabActiveKey: any
  generateModalVisible: boolean
  editFeeModalVisible: boolean
  terminateModalVisible: boolean
  droppedModalVisible: boolean
  confirmModalVisible: boolean
  dataToEditFee: any
  isEdit: boolean
  dataPaymentForYear: any[]
  dataDiscountFee: any[]
  otherFeeData: any[]
  dataSchedulePayment: any[]
  selectedRowKeys: any[]
  unitChooseIds: any[]
  dataForGenrerate: any
  lockLA: boolean
  lockModalVisible: boolean
  listLaStatus: any[]
  headerContractAmount: number
  reservationPriority: any
  hasRent: boolean
  amendmentLAModalVisible: boolean
}

@inject(Stores.AppDataStore, Stores.LeaseAgreementStore)
@observer
class LeaseDetailModal extends AppComponentListBase<Props, States> {
  formRef = React.createRef<any>()
  formSchedule: any = React.createRef()

  formUnlockLA = React.createRef<any>()
  state = {
    dataPaymentForYear: [] as any,
    otherFeeData: [] as any,
    editFeeModalVisible: false,
    terminateModalVisible: false,
    droppedModalVisible: false,
    confirmModalVisible: false,
    dataToEditFee: {} as any,
    generateModalVisible: false,
    tabActiveKey: tabKeys.tabCurrentLA,
    isEdit: false,
    unitChooseIds: [] as any,
    dataSchedulePayment: [] as any,
    selectedRowKeys: [] as any,
    dataForGenrerate: {} as any,
    dataDiscountFee: [] as any,
    lockLA: false,
    lockModalVisible: false,
    listLaStatus: [] as any,
    headerContractAmount: 0,
    reservationPriority: 1,
    hasRent: false,
    amendmentLAModalVisible: false,
  }

  async componentDidUpdate(prevProps, prevState) {
    // const { leaseAgreementDetail } = this.props.leaseAgreementStore;
    if (prevProps.visible !== this.props.visible) {
      if (this.props.visible) {
        this.init()
      }
    }
    if (prevState.tabActiveKey !== this.state.tabActiveKey) {
      if (this.state.tabActiveKey === tabKeys.tabSchedulePayment) {
        this.getPaymentSchedule()
      }
    }
  }

  init = async () => {
    const { leaseAgreementDetail } = this.props.leaseAgreementStore
    this.setState({ reservationPriority: 1 })
    if (this.props.leaseAgreementId) {
      this.setState({
        headerContractAmount:
          leaseAgreementDetail?.contractAmountAfterDiscountExcludeVat,
      })
      this.setState({ isEdit: false })
      this.getLaStatus(
        this.props.leaseAgreementStore.leaseAgreementDetail.statusId
      )
    } else {
      this.setState({ isEdit: true })
      const listValue = this.props.appDataStore.leaseAgreementStatus.filter(
        (item) => item.parentId === leaseStage.new
      )
      this.setState({ listLaStatus: listValue })
    }
    this.checkIsblock()
    await this.formRef.current?.setFieldValue(
      "referenceNumber",
      leaseAgreementDetail.referenceNumber
    )
    await this.formRef.current?.setFieldsValue({
      ...leaseAgreementDetail,

      userId: leaseAgreementDetail?.leaseAgreementUserIncharge?.find(
        (item) => item.positionId === positionUser.dealer
      )?.userId,
      adminId: leaseAgreementDetail?.leaseAgreementUserIncharge?.find(
        (item) => item.positionId === positionUser.admin
      )?.userId,
    })

    if (leaseAgreementDetail?.leaseAgreementUnit[0]?.unitId) {
      await this.formRef.current?.setFieldValue(
        "unitInfo",
        `${
          leaseAgreementDetail?.leaseAgreementUnit[0]?.project?.projectCode ??
          ""
        } - ${
          leaseAgreementDetail?.leaseAgreementUnit[0]?.unit?.unitName ?? ""
        }`
      )
      this.setState({
        unitChooseIds: [
          {
            unitId: leaseAgreementDetail?.leaseAgreementUnit[0]?.unitId,
            projectId: leaseAgreementDetail?.leaseAgreementUnit[0]?.projectId,
          },
        ],
      })
    }

    if (this.props.isRenew) {
      this.formRef.current?.setFieldsValue({
        parentId: leaseAgreementDetail?.id,
        parentNumber: leaseAgreementDetail?.referenceNumber,
        commencementDate: undefined,
        moveInDate: undefined,
        expiryDate: undefined,
        leaseTerm: undefined,
        paymentDate: undefined,
        depositStatusId: undefined,
        depositSendDate: undefined,
      })
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

  checkIsblock = () => {
    const isLock = this.props.leaseAgreementStore.leaseAgreementDetail.isBlock
      ? true
      : false

    this.setState({ lockLA: isLock })
  }
  getLaStatus = (value) => {
    const sortOrder = this.props.appDataStore.leaseAgreementStatus.find(
      (item) => item.id === value
    ).sortOrder

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
  changeTab = (tabKey) => {
    this.setState({ tabActiveKey: tabKey })
  }
  changeStatusPaymentPeriod = async (row, newStatus) => {
    await this.props.leaseAgreementStore.updateStatusPaymentSchedule({
      id: row?.id,
      statusId: newStatus,
    })
    await this.getPaymentSchedule()
    this.setState({ selectedRowKeys: [] })
  }
  handleSave = async (id?) => {
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
        moment(formValues?.commencementDate).endOf("days"),
        moment(formValues?.expiryDate).endOf("days").add(1, "days")
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
        leaseAgreementUserTenant: formValues?.leaseAgreementUserTenant?.filter(
          (item) => item?.userTenantId
        ),
      }
      if (id) {
        res = { ...res, id: id }
      } else {
        res = { ...res, stageId: leaseStage.new }
      }
      if (this.props.isRenew) {
        const userTenant = res?.leaseAgreementUserTenant.map((item) => {
          return {
            userTenantId: item?.userTenantId,
            isPrimary: item?.isPrimary,
          }
        })

        res = { ...res, leaseAgreementUserTenant: userTenant }
      }

      await this.props.leaseAgreementStore.createOrUpdate(res)
      this.setState({ isEdit: false })
      if (!id) {
        this.handleClose()
      } else {
        await this.props.leaseAgreementStore.get(id)
        const statusId = this.formRef.current?.getFieldValue("statusId")

        await this.getLaStatus(statusId)
        await this.props.onOk()
      }
    }
  }

  getPaymentSchedule = async () => {
    await this.props.leaseAgreementStore.getPaymentSchedule({
      leaseAgreementId: this.props.leaseAgreementId,
    })
    await this.setState({
      dataSchedulePayment:
        this.props.leaseAgreementStore.listPaymentScheduleAmount,
    })
    const paymentChedule = [
      ...this.props.leaseAgreementStore.listPaymentScheduleAmount,
    ]

    let allRent = 0
    let paid = 0
    let unBill = 0
    for (const payment of paymentChedule) {
      if (payment.statusId !== paymentStatus.cancel) {
        allRent = allRent + payment.amount
        if (payment.statusId === paymentStatus.paid) {
          paid = paid + payment.amount
        } else {
          unBill = unBill + payment.amount
        }
      }
    }

    this.formSchedule.current?.setFieldsValue({
      allRent,
      paid,
      unBill,
    })
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

  isChooseUnit = (value) => {
    this.setState({ unitChooseIds: value })
  }
  changePriority = (value) => {
    this.setState({ reservationPriority: value })
  }

  handleGenerate = async () => {
    const form = this.formRef.current?.getFieldsValue()
    const dataForGenrerate = {
      paymentTerm:
        paymentTerm.find((item) => form.paymentTerm === item.id) ?? ({} as any),
      commencementDate: form.commencementDate,
      paymentDate: form.paymentDate,
      expiryDate: form.expiryDate,
      feeDetail: [...this.state.dataPaymentForYear].filter(
        (item) => item?.feeTypeId === 1 || item?.feeTypeId === 2
      ), //lấy fee type là Rent và ServiceCharge
      feeDiscount: this.state.dataDiscountFee,
    }
    this.setState({
      dataForGenrerate: dataForGenrerate,
    })
    this.setState({ generateModalVisible: true })
  }
  handleOkGeneratePayment = async (body) => {
    this.props.leaseAgreementStore.createPaymentSchedule(body).finally(() => {
      this.getPaymentSchedule()
    })
    this.setState({ generateModalVisible: false })
    this.handleSave(this.props.leaseAgreementId)
  }
  handleEditFee = () => {
    const composed = this.state.selectedRowKeys.map((id) =>
      this.state.dataSchedulePayment.find((item) => item?.id === id)
    )

    this.setState({ dataToEditFee: composed, editFeeModalVisible: true })
  }
  handleReNewLa = async () => {
    this.props.reNewLa(this.props.leaseAgreementId)
  }

  handleAmendmentLa = async () => {
    this.setState({ amendmentLAModalVisible: true })
  }

  handTerminate = async () => {
    this.setState({ terminateModalVisible: true })
  }
  handleTerminateOk = async (value) => {
    const params = {
      ...value,

      id: this.props.leaseAgreementId,
    }
    await this.props.leaseAgreementStore.UpdateStatusLA(params)
    await this.setState({ terminateModalVisible: false })
    await this.props.onOk()
    await this.init()
    await this.getPaymentSchedule()
  }
  handMarkDropped = async () => {
    this.setState({ droppedModalVisible: true })
  }
  handMarkDroppedOk = async (data) => {
    const params = {
      stageId: leaseStage.drop,

      statusId: data.statusId,
      reasonDrop: data.reasonDrop,
      id: this.props.leaseAgreementId,
    }
    confirm({
      title: LNotification("ARE_YOU_WANT_TO_DROPPED_LA"),
      // content: LNotification("."),
      okText: L("BTN_YES"),
      cancelText: L("BTN_NO"),
      onOk: async () => {
        await this.props.leaseAgreementStore.UpdateStatusLA(params)
        await this.setState({ droppedModalVisible: false })
        await this.props.onOk()
        await this.handleClose()
      },
    })
  }
  handMarkConfirm = async () => {
    this.setState({ confirmModalVisible: true })
  }
  handleMarkConfirmOk = async (statusId) => {
    const params = {
      stageId: leaseStage.confirm,
      statusId: leaseStatus.laConfirm,
      id: this.props.leaseAgreementId,
      unitStatusId: statusId,
    }
    confirm({
      title: LNotification("ARE_YOU_WANT_TO_CONFIRM_LA"),
      // content: LNotification("."),
      okText: L("BTN_YES"),
      cancelText: L("BTN_NO"),
      onOk: async () => {
        await this.props.leaseAgreementStore.UpdateStatusLA(params)
        await this.setState({ confirmModalVisible: false })
        await this.props.onOk()
        await this.handleClose()
      },
    })
  }
  handleClose = () => {
    this.formRef.current?.resetFields()
    this.setState({
      tabActiveKey: tabKeys.tabCurrentLA,
      dataSchedulePayment: [],
    })
    this.props.onAmendOk()
  }
  handleEdit = () => {
    this.setState({ isEdit: true })
  }
  onSelectChange = (newSelectedRowKeys) => {
    this.setState({ selectedRowKeys: newSelectedRowKeys })
  }

  handleClickLock = () => {
    if (this.state.lockLA) {
      this.setState({ lockModalVisible: true })
    } else {
      confirm({
        title: L("DO_YOU_WANT_TO_LOCK_THIS_LA_STATUS"),
        okText: L("BTN_YES"),
        cancelText: L("BTN_NO"),
        onOk: this.lockLa,
      })
    }
  }
  checkFullRent = (value) => {
    this.setState({ hasRent: value })
  }
  lockLa = () => {
    this.props.leaseAgreementStore
      .updateLABlock({
        id: this.props.leaseAgreementId,
        isBlock: true,
      })
      .then(() => this.setState({ lockLA: true }))
  }

  handleOkUnlock = async () => {
    const data = await this.formUnlockLA.current?.validateFields()
    this.props.leaseAgreementStore
      .updateLABlock({
        ...data,
        id: this.props.leaseAgreementId,
        isBlock: false,
      })
      .then(() => {
        this.setState({ lockLA: false })
        this.setState({ lockModalVisible: false })
        this.formRef.current?.setFieldValue("statusId", data?.statusId)
        this.getLaStatus(data?.statusId)
      })
  }
  handleCancelUnLock = () => {
    this.setState({ lockModalVisible: false })
  }
  render() {
    const {
      leaseAgreementId,
      leaseAgreementStore: { paymentScheduleStatus },
    } = this.props
    const { dataForGenrerate, otherFeeData } = this.state
    const columns = [
      {
        title: L("START_PERIOD"),
        dataIndex: "startDate",
        key: "startDate",
        align: align.center,
        width: 100,
        render: this.renderDate,
      },
      {
        title: L("END_PERIOD"),
        dataIndex: "endDate",
        key: "endDate",
        width: 100,
        align: align.center,
        render: this.renderDate,
      },

      {
        title: L("TOTAL_AMOUNT"),
        dataIndex: "totalAmount",
        align: align.right,
        width: 130,
        key: "totalAmount",
        render: (rentWithVat, row) => <h4>{formatCurrency(row?.amount)}</h4>,
      },

      {
        title: L("DUE_DATE"),
        dataIndex: "startDate",
        align: align.center,
        width: 100,
        key: "startDate",
        render: this.renderDate,
      },
      {
        title: L("STATUS"),
        dataIndex: "statusId",
        align: align.center,
        key: "statusId",
        width: 100,

        render: (statusId, row) => (
          <h4>
            <Dropdown
              trigger={["click"]}
              overlay={
                <Menu className="">
                  {paymentScheduleStatus
                    .filter((item) => item.id !== statusId)
                    .map((value, index) => (
                      <Menu.Item
                        key={index}
                        onClick={() =>
                          this.changeStatusPaymentPeriod(row, value?.id)
                        }
                      >
                        {value?.name}
                      </Menu.Item>
                    ))}
                </Menu>
              }
              placement="bottomLeft"
            >
              <a>
                <Tag color={row?.status?.color}>{row?.status?.name}</Tag>
              </a>
            </Dropdown>
          </h4>
        ),
      },
    ]
    const {
      leaseAgreementStore: { isLoading, leaseAgreementDetail },
    } = this.props

    const isLaConfirmed = this.props.isRenew
      ? false
      : leaseAgreementDetail?.stageId === leaseStage.confirm ?? false
    const isLaTerminate =
      leaseAgreementDetail?.stageId === leaseStage.terminate ||
      leaseAgreementDetail?.stageId === leaseStage.earlyTerminate
    const isLaNew = leaseAgreementDetail?.stageId === leaseStage.new
    const isDropped = leaseAgreementDetail?.stageId === leaseStage.drop
    const canConfirm =
      leaseAgreementDetail?.statusId === leaseStatus.LaSigned &&
      leaseAgreementDetail?.depositStatusId === depositLAStatus.paid
    const isFullEdit = this.isGranted(appPermissions.leaseAgreement.fullEdit)

    return (
      this.props.visible && (
        <CustomDrawer
          useBottomAction
          title={
            this.props.leaseAgreementId ? (
              <div>
                <Row gutter={[12, 0]} className="w-100">
                  <Col
                    sm={{ span: 11 }}
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
                  <Col sm={{ span: 7 }} className="item-header-drawer">
                    <span>{L("CURRENT_LA_AMOUNT_EXCL_VAT")}</span>
                  </Col>
                  <Col
                    sm={{ span: 5 }}
                    className="form-item-highlight-2 item-header-drawer"
                  >
                    <InputNumber
                      min={0}
                      className="w-100"
                      value={this.state.headerContractAmount}
                      formatter={(value) => inputCurrencyFormatter(value)}
                      disabled
                    />
                  </Col>
                </Row>
              </div>
            ) : (
              L("NEW")
            )
          }
          visible={this.props.visible}
          lock={this.state.lockLA}
          onLockAction={
            this.props.leaseAgreementId && isLaNew
              ? this.handleClickLock
              : undefined
          }
          onClose={this.handleClose}
          onCreate={
            this.props.leaseAgreementId
              ? undefined
              : async () => {
                  await this.handleSave()
                }
          }
          isEdit={this.state.isEdit}
          onRenewLa={
            isLaConfirmed && !isDropped ? () => this.handleReNewLa() : undefined
          }
          onAmendment={
            this.isGranted(appPermissions.amendment.create) &&
            isLaConfirmed &&
            !isDropped
              ? () => this.handleAmendmentLa()
              : undefined
          }
          onTerminate={
            this.isGranted(appPermissions.leaseAgreement.update) &&
            isLaConfirmed
              ? () => this.handTerminate()
              : undefined
          }
          markConfirm={
            this.isGranted(appPermissions.leaseAgreement.update) &&
            leaseAgreementId &&
            !isLaConfirmed &&
            !isDropped &&
            !isLaTerminate &&
            canConfirm
              ? () => this.handMarkConfirm()
              : undefined
          }
          markDropped={
            leaseAgreementId && !isLaConfirmed && !isLaTerminate && !isDropped
              ? () => this.handMarkDropped()
              : undefined
          }
          onEdit={
            this.props.leaseAgreementId && (!isDropped || isFullEdit)
              ? this.handleEdit
              : undefined
          }
          onSave={async () => {
            this.formRef.current?.validateFields() &&
              (await this.handleSave(this.props.leaseAgreementId))
          }}
          isLoading={isLoading}
          lockPermission={this.isGranted(appPermissions.leaseAgreement.lock)}
          updatePermission={
            this.isGranted(appPermissions.leaseAgreement.update) &&
            (!isLaTerminate || isFullEdit)
          }
          widthDrawer={"100%"}
        >
          <Tabs
            activeKey={this.state.tabActiveKey}
            onTabClick={this.changeTab}
            className={"antd-tab-cusstom"}
            type="card"
          >
            <TabPane tab={L(tabKeys.tabCurrentLA)} key={tabKeys.tabCurrentLA}>
              <LeaseInfoModal
                listAmendmentItem={[]}
                isRenew={this.props.isRenew}
                isEdit={this.state.isEdit}
                id={this.props.leaseAgreementId}
                formRef={this.formRef}
                checkFullRent={this.checkFullRent}
                listLaStatus={this.state.listLaStatus}
                editStatusLA={isLaTerminate || isLaConfirmed || isDropped}
                visible={this.props.visible}
                onDataPaymentChange={this.getDataPaymentForYear}
                onDataOtherFeeChange={this.getDataOtherFee}
                onDataDiscountChange={this.getDataDiscountFee}
                onUnitChoose={this.isChooseUnit}
                changePriorty={this.changePriority}
              />
            </TabPane>

            {this.props.leaseAgreementId &&
              this.isGranted(appPermissions.amendment.page) && (
                <TabPane
                  tab={L(tabKeys.tabInformation)}
                  key={tabKeys.tabInformation}
                >
                  <LeaseAmendment
                    leaseAgreementId={this.props.leaseAgreementId}
                    thisTabKey={tabKeys.tabInformation}
                    parentTabKeyChoose={this.state.tabActiveKey}
                    onCloseDrawer={() => this.props.onAmendOk()}
                  />
                </TabPane>
              )}
            {this.props.leaseAgreementId && (
              <>
                {this.isGranted(appPermissions.leaseAgreement.update) && (
                  <TabPane
                    tab={L(tabKeys.tabSchedulePayment)}
                    key={tabKeys.tabSchedulePayment}
                  >
                    <Form
                      ref={this.formSchedule}
                      layout={"vertical"}
                      validateMessages={validateMessages}
                      size="middle"
                    >
                      <Row gutter={[4, 4]}>
                        <Col sm={{ span: 6 }}>
                          <Form.Item label={L("ALL_RENT")} name={"allRent"}>
                            <InputNumber
                              min={0}
                              className="w-100"
                              formatter={(value) =>
                                inputCurrencyFormatter(value)
                              }
                              disabled
                            />
                          </Form.Item>
                        </Col>
                        <Col sm={{ span: 6 }}>
                          <Form.Item label={L("PAID")} name={"paid"}>
                            <InputNumber
                              min={0}
                              className="w-100"
                              formatter={(value) =>
                                inputCurrencyFormatter(value)
                              }
                              disabled
                            />
                          </Form.Item>
                        </Col>
                        <Col sm={{ span: 6 }}>
                          <Form.Item label={L("UN_BILL")} name={"unBill"}>
                            <InputNumber
                              min={0}
                              className="w-100"
                              formatter={(value) =>
                                inputCurrencyFormatter(value)
                              }
                              disabled
                            />
                          </Form.Item>
                        </Col>
                        <Col span={6} style={{ textAlign: "right" }}>
                          <Button
                            disabled={!this.state.isEdit}
                            onClick={() => this.handleGenerate()}
                            className="button-primary"
                          >
                            {L("GENERATE")}
                          </Button>
                        </Col>
                        <Col span={24}>
                          <style>
                            {`
                          .ant-col label{
                            width: fit-content !important;
                          }
                        `}
                          </style>
                          <DataTable
                            title={this.L("SCHEDULE_PAYMENT")}
                            pagination={false}
                          >
                            <Table
                              size="middle"
                              className="custom-ant-table"
                              rowKey={(record, index) => `${record.id}${index}`}
                              columns={columns}
                              bordered
                              loading={isLoading}
                              onRow={(record, rowIndex) => {
                                return {
                                  onClick: (event) => {
                                    // console.log(record);
                                  }, // click row
                                }
                              }}
                              pagination={false}
                              dataSource={this.state.dataSchedulePayment ?? []}
                              scroll={{
                                x: 500,
                                scrollToFirstRowOnChange: true,
                              }}
                            />
                          </DataTable>
                        </Col>
                      </Row>
                    </Form>
                  </TabPane>
                )}
                {this.isGranted(appPermissions.leaseAgreement.commission) && (
                  <Tabs.TabPane
                    tab={L(tabKeys.tabCommission)}
                    key={tabKeys.tabCommission}
                  >
                    <TabCommission
                      thisTabKey={tabKeys.tabCommission}
                      parentTabKeyChoose={this.state.tabActiveKey}
                      leaseAgreementId={this.props.leaseAgreementId}
                    />
                  </Tabs.TabPane>
                )}
                {this.isGranted(
                  appPermissions.leaseAgreement.dealerCommission
                ) && (
                  <Tabs.TabPane
                    tab={L(tabKeys.tabDealerCommission)}
                    key={tabKeys.tabDealerCommission}
                  >
                    <TabDealerCommission
                      thisTabKey={tabKeys.tabDealerCommission}
                      parentTabKeyChoose={this.state.tabActiveKey}
                      leaseAgreementId={this.props.leaseAgreementId}
                    />
                  </Tabs.TabPane>
                )}

                {this.isGranted(appPermissions.deposit.page) && (
                  <Tabs.TabPane
                    tab={L(tabKeys.tabDeposit)}
                    key={tabKeys.tabDeposit}
                  >
                    <TabDeposit
                      thisTabKey={tabKeys.tabDeposit}
                      parentTabKeyChoose={this.state.tabActiveKey}
                      leaseAgreementId={this.props.leaseAgreementId}
                    />
                  </Tabs.TabPane>
                )}

                <Tabs.TabPane
                  tab={L(tabKeys.tabDocument)}
                  key={tabKeys.tabDocument}
                >
                  <TabDocument
                    moduleId={moduleNames.contract}
                    inputId={
                      this.props.leaseAgreementStore.leaseAgreementDetail
                        ?.uniqueId
                    }
                    createPermission={this.isGranted(
                      appPermissions.leaseAgreement.create
                    )}
                    updatePermission={this.isGranted(
                      appPermissions.leaseAgreement.update
                    )}
                    deletePermission={this.isGranted(
                      appPermissions.leaseAgreement.delete
                    )}
                  />
                </Tabs.TabPane>
                <Tabs.TabPane
                  tab={L(tabKeys.tabOtherContact)}
                  key={tabKeys.tabOtherContact}
                >
                  <TabOtherContact
                    thisTabKey={tabKeys.tabOtherContact}
                    parentTabKeyChoose={this.state.tabActiveKey}
                    leaseAgreementId={this.props.leaseAgreementId}
                  />
                </Tabs.TabPane>

                <Tabs.TabPane
                  tab={L(tabKeys.tabAuditTrail)}
                  key={tabKeys.tabAuditTrail}
                  className={"color-tab"}
                >
                  <TabAuditTrail parentId={this.props.leaseAgreementId} />
                </Tabs.TabPane>
              </>
            )}
          </Tabs>
          <GeneratePaymentModal
            dataForGenrerate={dataForGenrerate}
            otherFee={otherFeeData}
            leaseAgreementId={this.props.leaseAgreementId}
            visible={this.state.generateModalVisible}
            onClose={() => {
              this.setState({ generateModalVisible: false })
            }}
            onOk={this.handleOkGeneratePayment}
          />
          <EditFeeModal
            dataToEditFee={this.state.dataToEditFee}
            visible={this.state.editFeeModalVisible}
            onClose={() => {
              this.setState({ editFeeModalVisible: false })
            }}
            onOk={async () => {
              await this.getPaymentSchedule()
              await this.setState({ editFeeModalVisible: false })
            }}
          />
          <Modal
            title={L("DO_YOU_WANT_TO_UNLOCK_THIS_LA")}
            open={this.state.lockModalVisible}
            onOk={this.handleOkUnlock}
            onCancel={this.handleCancelUnLock}
          >
            <Form
              ref={this.formUnlockLA}
              layout={"vertical"}
              validateMessages={validateMessages}
              size="middle"
            >
              <Row gutter={[4, 4]}>
                <Col sm={{ span: 24 }}>
                  <span>
                    {L("CURRENT_LA_STATUS_IS")}&nbsp;
                    <strong>{leaseAgreementDetail.status?.name}</strong>
                  </span>
                </Col>
                <Col sm={{ span: 24 }}>
                  <Form.Item
                    label={L("LA_STATUS")}
                    name="statusId"
                    rules={[{ required: true }]}
                  >
                    <Select filterOption={false} className="full-width">
                      {renderOptions(this.state.listLaStatus)}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </Modal>

          <TerminateModal
            visible={this.state.terminateModalVisible}
            expriedDate={leaseAgreementDetail?.expiryDate}
            onClose={() => {
              this.setState({ terminateModalVisible: false })
            }}
            onOk={(value) => this.handleTerminateOk(value)}
          />
          <DroppedModal
            visible={this.state.droppedModalVisible}
            expriedDate={leaseAgreementDetail?.expiryDate}
            onClose={() => {
              this.setState({ droppedModalVisible: false })
            }}
            onOk={(data) => this.handMarkDroppedOk(data)}
          />
          <ConfirmModal
            visible={this.state.confirmModalVisible}
            expriedDate={leaseAgreementDetail?.expiryDate}
            onClose={() => {
              this.setState({ confirmModalVisible: false })
            }}
            onOk={(data) => this.handleMarkConfirmOk(data)}
          />
          <SelectAmendmentModal
            leaseAgreementId={this.props.leaseAgreementId}
            visible={this.state.amendmentLAModalVisible}
            onClose={() => {
              this.setState({ amendmentLAModalVisible: false })
            }}
            onOk={async () => {
              this.setState({ amendmentLAModalVisible: false })
            }}
          />
          <style>
            {`
        .ant-card .ant-card-body{
            padding:4px 
        }
        
        `}
          </style>
        </CustomDrawer>
      )
    )
  }
}

export default withRouter(LeaseDetailModal)
