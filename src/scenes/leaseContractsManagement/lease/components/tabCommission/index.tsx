import React from "react"
// import TextArea from "antd/lib/input/TextArea";
import { AppComponentListBase } from "@components/AppComponentBase"
import withRouter from "@components/Layout/Router/withRouter"
import { inject, observer } from "mobx-react"
import { v4 as uuid } from "uuid"
import {
  Button,
  Card,
  Col,
  Collapse,
  Form,
  InputNumber,
  Modal,
  Popconfirm,
  Row,
  Table,
  Tooltip,
} from "antd"
import {
  formatCurrency,
  inputCurrencyFormatter,
  inputNumberFormatter,
} from "@lib/helper"
import { validateMessages } from "@lib/validation"
import { L } from "@lib/abpUtility"
import totalColumn from "./components/totalColumns"
import DealerComm from "./components/dealerComm"
import PhaseConfigComm from "./components/phaseConfigComm"
import LeaseAgreementStore from "@stores/communication/leaseAgreementStore"
import Stores from "@stores/storeIdentifier"
import { EditOutlined, RollbackOutlined, SaveOutlined } from "@ant-design/icons"
import CommissionPhaseDealer from "./components/commissionPhaseDealer"
import rules from "./validation"
import dayjs from "dayjs"
import _ from "lodash"
import AppConsts, { appPermissions, dateFormat } from "@lib/appconst"
const { Panel } = Collapse
const { positionUser } = AppConsts
interface Props {
  leaseAgreementStore: LeaseAgreementStore
  leaseAgreementId: any
  thisTabKey: any
  parentTabKeyChoose: any
}
interface States {
  departmentAmount: number
  dealerAmount: number
  dealerAmountHasInitValue: number
  isEditDeparmentPercent: boolean
  dataDealerTable: any[]
  dataPhaseTable: any[]
  commissionDataTable: any[]
  listMainDealer: any[]
  listOtherDealer: any[]
  activeKeyCollapse: any[]
  percentPhaseTable: number
  isManualCal: boolean
}

@inject(Stores.LeaseAgreementStore)
@observer
class Commission extends AppComponentListBase<Props, States> {
  formRef = React.createRef<any>()

  constructor(props) {
    super(props)
    this.state = {
      departmentAmount: 0,
      dealerAmount: 0,
      dealerAmountHasInitValue: 0,

      isEditDeparmentPercent: false,
      dataDealerTable: [] as any,
      dataPhaseTable: [] as any,
      commissionDataTable: [] as any,
      listMainDealer: [] as any,
      listOtherDealer: [] as any,
      activeKeyCollapse: [] as any,
      percentPhaseTable: 0,
      isManualCal: false,
    }
  }
  async componentDidMount() {
    this.getLACommission()
    this.getTotalCommDealer()
  }
  componentDidUpdate = async (prevProps: any) => {
    if (this.props.parentTabKeyChoose !== prevProps.parentTabKeyChoose) {
      if (this.props.parentTabKeyChoose === this.props.thisTabKey) {
        this.getTotalCommDealer()
        this.getLACommission()
      }
    }
  }

  getTotalCommDealer = async () => {
    await this.props.leaseAgreementStore.getLACommissionDealer(
      this.props.leaseAgreementId
    )
  }

  getLACommission = async () => {
    await this.props.leaseAgreementStore.getLACommission(
      this.props.leaseAgreementId
    )
    if (this.props.leaseAgreementStore.lACommission?.id) {
      this.setState({
        dealerAmount:
          this.props.leaseAgreementStore.lACommission?.dealerCommissionAmount,
        departmentAmount:
          this.props.leaseAgreementStore.lACommission
            ?.departmentCommissionAmount,
        isManualCal: this.props.leaseAgreementStore.lACommission?.isManual,
      })
      this.formRef.current?.setFieldsValue({
        ...this.props.leaseAgreementStore.lACommission,
      })
      const dataDealerTable =
        this.props.leaseAgreementStore.lACommission?.leaseAgreementCommissionUser.map(
          (item) => {
            return {
              ...item,
              key: uuid(),
              dealerName: item?.user?.displayName,
            }
          }
        )
      const dataPhaseTable =
        this.props.leaseAgreementStore.lACommission?.leaseAgreementCommissionPhase.map(
          (item) => {
            return {
              ...item,
              key: uuid(),
              billingDate: dayjs(item?.billingDate).toJSON(),
              departmentCommissionAmount:
                this.props.leaseAgreementStore.lACommission
                  ?.departmentCommissionAmount,
              dealerCommissionAmount:
                this.props.leaseAgreementStore.lACommission
                  ?.dealerCommissionAmount,
            }
          }
        )
      this.setState({ dataDealerTable })
      this.setState({ dataPhaseTable })

      await this.getInitLACommDetail()

      const newUser =
        this.props.leaseAgreementStore.leaseAgreementDetail.leaseAgreementUserIncharge.find(
          (item) => item.positionId === positionUser.dealer
        )?.user
      const oldUser =
        this.props.leaseAgreementStore.lACommission?.leaseAgreementCommissionUser.map(
          (item) => {
            return { id: item?.user?.id, label: item?.user?.displayName }
          }
        )
      const list = [
        ...oldUser,
        { id: newUser?.id, label: newUser?.displayName },
      ]

      const listMainDealer = _.uniqWith(
        [oldUser[0], { id: newUser?.id, label: newUser?.displayName }],
        _.isEqual
      )

      const listOtherDealer = _.uniqWith(list, _.isEqual)
      this.setState({
        listMainDealer: listMainDealer,
        listOtherDealer: listOtherDealer,
      })
    } else {
      const newUser =
        this.props.leaseAgreementStore.leaseAgreementDetail.leaseAgreementUserIncharge.find(
          (item) => item.positionId === positionUser.dealer
        )?.user
      this.setState({
        listMainDealer: [{ id: newUser?.id, label: newUser?.displayName }],
        listOtherDealer: [{ id: newUser?.id, label: newUser?.displayName }],
      })

      this.setState({ isEditDeparmentPercent: true })
    }
  }
  getInitLACommDetail = () => {
    const commissionDataTable = [] as any

    for (const phase of this.props.leaseAgreementStore.lACommission
      ?.leaseAgreementCommissionPhase) {
      const { leaseAgreementCommissionDetails, ...phaseParent } = phase
      commissionDataTable.push({ ...phaseParent, isPhase: true, key: uuid() })
      for (const dealer of leaseAgreementCommissionDetails) {
        commissionDataTable.push({
          ...dealer,
          dealerName: dealer?.user?.displayName,
          key: uuid(),
        })
      }
    }
    this.setState({
      activeKeyCollapse: ["3"],
    })
    this.setState({ commissionDataTable })
  }

  changeDeparmentCommPercent = (value) => {
    const amount =
      this.props.leaseAgreementStore.leaseAgreementDetail
        .contractAmountAfterDiscountExcludeVat > 0
        ? this.props.leaseAgreementStore.leaseAgreementDetail
            .contractAmountAfterDiscountExcludeVat
        : this.props.leaseAgreementStore.leaseAgreementDetail.contractAmount
    const departmentAmount = (amount * value) / 100
    this.formRef.current?.setFieldValue(
      "departmentCommissionAmount",
      departmentAmount
    )
    this.setState({ departmentAmount })
    const dealerPercent = this.formRef.current?.getFieldValue("dealerPercent")
    if (dealerPercent) {
      const dealerAmount = (departmentAmount * dealerPercent) / 100
      this.formRef.current?.setFieldValue(
        "dealerCommissionAmount",
        dealerAmount
      )
    }
  }
  changeDealerCommPercent = (value) => {
    const dealerAmount = (this.state.departmentAmount * value) / 100
    this.formRef.current?.setFieldValue("dealerCommissionAmount", dealerAmount)
  }

  dataDealerChange = async (data) => {
    this.setState({ dataDealerTable: data })
  }
  dataPhaseChange = async (data) => {
    this.setState({ dataPhaseTable: data })
  }
  commissionDataTableChange = async (data) => {
    this.setState({ commissionDataTable: data })
  }
  isManualChange = (value) => {
    this.setState({ isManualCal: value })
    if (value === true) {
      this.saveConfigureCommission(false, true)
    }
  }
  saveConfigureCommission = async (reset?, saveIsManual?) => {
    const formValue = await this.formRef.current?.validateFields()
    let dataPhaseTable = [] as any
    if (reset) {
      dataPhaseTable = this.state.dataPhaseTable.map((item, index) => {
        return {
          ...item,
          dealerCommissionAmountByPhase:
            (item?.dealerCommissionAmount * item?.percent) / 100,
          departmentCommissionAmountByPhase:
            (item?.departmentCommissionAmount * item?.percent) / 100,
          billingDate: dayjs(item.billingDate).toJSON(),
          numPhase: index + 1,
          actBillingDate: dayjs(item.actBillingDate).toJSON(),
        }
      })
    } else {
      dataPhaseTable = this.state.dataPhaseTable.map((item, index) => {
        return {
          ...item,
          billingDate: dayjs(item.billingDate).toJSON(),
          numPhase: index + 1,
          actBillingDate: dayjs(item.actBillingDate).toJSON(),
        }
      })
    }
    const params = {
      ...this.props.leaseAgreementStore.lACommission,
      ...formValue,
      leaseAgreementId: this.props.leaseAgreementId,
      leaseAgreementCommissionPhase: dataPhaseTable,
      leaseAgreementCommissionUser: this.state.dataDealerTable,
      isManual: this.state.isManualCal,
    }

    await this.props.leaseAgreementStore.createOrUpdateCommission({
      ...params,
    })
    if (!saveIsManual) {
      await this.getLACommission()
      await this.getTotalCommDealer()
    }
  }
  PhaseConfigChagePercent = (percent) => {
    this.setState({ percentPhaseTable: percent })
  }
  generateCommission = async () => {
    await this.saveConfigureCommission()
    const dataTable = [] as any
    for (const phase of this.state.dataPhaseTable) {
      const rowDataPhase = {
        ...phase,
        isPhase: true,
      }
      dataTable.push(rowDataPhase)
      for (const dealer of this.state.dataDealerTable) {
        const rowDataDealer = {
          ...dealer,
          id: undefined,
          key: uuid(),
          leaseAgreementCommissionPhaseId: phase.id,
          commissionAmount:
            (phase.dealerCommissionAmountByPhase * dealer.percent) / 100,
        }

        dataTable.push(rowDataDealer)
      }
    }

    this.setState({ commissionDataTable: dataTable })
    this.setState({
      activeKeyCollapse: [...this.state.activeKeyCollapse, "3"],
    })
    await this.saveLACommDetail()
  }

  resetCommission = async () => {
    await this.saveConfigureCommission(true)
    const dataTable = [] as any
    for (const phase of this.state.dataPhaseTable) {
      const rowDataPhase = {
        ...phase,
        isPhase: true,
      }
      dataTable.push(rowDataPhase)
      for (const dealer of this.state.dataDealerTable) {
        const rowDataDealer = {
          ...dealer,
          id: undefined,
          key: uuid(),
          leaseAgreementCommissionPhaseId: phase.id,
          commissionAmount:
            (phase.dealerCommissionAmountByPhase * dealer.percent) / 100,
        }

        dataTable.push(rowDataDealer)
      }
    }

    this.setState({ commissionDataTable: dataTable })
    this.setState({
      activeKeyCollapse: ["2"],
    })
  }

  onCollapChange = (value) => {
    this.setState({ activeKeyCollapse: value })
  }
  clearAll = () => {
    this.setState({
      dataDealerTable: [],
      dataPhaseTable: [],
      commissionDataTable: [],
    })
  }

  cancelEditComm = () => {
    this.getLACommission()
    this.setState({ isEditDeparmentPercent: false })
  }
  saveLACommDetail = async () => {
    const ListPhase = [...this.state.commissionDataTable].filter(
      (item) => item.isPhase === true
    )

    for (const phase of ListPhase) {
      phase.leaseAgreementCommissionDetails = []
      for (const dealer of this.state.commissionDataTable) {
        if (dealer?.leaseAgreementCommissionPhaseId === phase.id) {
          phase.leaseAgreementCommissionDetails.push({ ...dealer })
        }
      }
    }
    for (const phase of ListPhase) {
      _.uniqWith(phase.leaseAgreementCommissionDetails, _.isEqual)
    }
    await this.props.leaseAgreementStore.createOrUpdateCommissionPhaseDetail([
      ...ListPhase,
    ])
    await this.getLACommission()
    await this.getTotalCommDealer()
  }

  saveCommAmount = async () => {
    const params = await this.formRef.current?.validateFields()

    if (
      this.props.leaseAgreementStore.lACommission?.id ||
      this.state.dataDealerTable.length > 0
    ) {
      Modal.confirm({
        title: (
          <>
            <strong>{L("THIS_IS_OVERRIDE_CONFIGURE_COMM_PHASE")}</strong>
            <br />
            <span>{L("ARE_YOU_WANT_TO_CONFIRM_OVERRIDE")}</span>
          </>
        ),
        // content: LNotification("."),
        okText: L("BTN_YES"),
        cancelText: L("BTN_NO"),
        onOk: async () => {
          this.setState({
            dealerAmount: params.dealerCommissionAmount,
            dealerAmountHasInitValue: params.dealerCommissionAmount,
          })
          this.setState({ isEditDeparmentPercent: false })
          this.setState({
            activeKeyCollapse: ["2"],
          })
        },
      })
    } else {
      this.setState({
        dealerAmount: params.dealerCommissionAmount,
        dealerAmountHasInitValue: params.dealerCommissionAmount,
      })
      this.setState({ isEditDeparmentPercent: false })
      this.setState({
        activeKeyCollapse: ["2"],
      })
    }
  }
  render(): React.ReactNode {
    const totalColumns = totalColumn()
    const {
      leaseAgreementStore: { isLoading, leaseAgreementDetail },
    } = this.props
    const { activeKeyCollapse } = this.state
    const editPermission = this.isGranted(
      appPermissions.leaseAgreement.editCommission
    )
    return (
      <>
        <Row gutter={[8, 4]}>
          <Col sm={{ span: 24 }}>
            <div className="comm-info">
              <div className="webkit-flow">
                <div className="row-comm-info">
                  <div className="width-max-content">
                    <strong>{L("COMPANY_NAME")}: </strong>
                    <span>{leaseAgreementDetail?.company?.businessName}</span>
                  </div>
                  <div className="width-max-content">
                    <strong>{L("UNIT")}: </strong>
                    <span>
                      {
                        leaseAgreementDetail?.leaseAgreementUnit[0]?.unit
                          ?.unitName
                      }
                    </span>
                  </div>
                  <div className="width-max-content">
                    <strong>{L("PROJECT")}: </strong>
                    <span>
                      {
                        leaseAgreementDetail?.leaseAgreementUnit[0]?.unit
                          ?.projectName
                      }
                    </span>
                  </div>
                </div>
                <div className="row-comm-info">
                  <div className="width-max-content">
                    <strong>{L("LEASE_TERM")}: </strong>
                    <span>{leaseAgreementDetail?.leaseTerm}</span>
                  </div>
                  <div className="width-max-content">
                    <strong>{L("COMMENCEMENT_DATE")}: </strong>
                    <span>
                      {dayjs(leaseAgreementDetail.commencementDate).format(
                        dateFormat
                      )}
                    </span>
                  </div>
                  <div className="width-max-content">
                    <strong>{L("EXPIRY_DATE")}: </strong>
                    <span>
                      {dayjs(leaseAgreementDetail.expiryDate).format(
                        dateFormat
                      )}
                    </span>
                  </div>
                </div>
              </div>
              <div className="comm-info-scroll">
                {leaseAgreementDetail.leaseAgreementDetails
                  .filter((item) => item?.feeType?.typeId === 0)
                  .map((item, index) => (
                    <div key={index} className="row-comm-info">
                      <div>
                        <strong>{L("RENT_INCLUDE_VAT")}: </strong>
                        <span>{formatCurrency(item?.amountIncludeVat)}</span>
                      </div>
                      <div>
                        <strong>{L("RENT_EXCL_VAT")}: </strong>
                        <span>{formatCurrency(item?.amount)}</span>
                      </div>
                      <div>
                        <strong>{L("START_DATE")}: </strong>
                        <span>{dayjs(item?.startDate).format(dateFormat)}</span>
                      </div>
                      <div>
                        <strong>{L("END_DATE")}: </strong>
                        <span>{dayjs(item?.endDate).format(dateFormat)}</span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </Col>
          <Col sm={{ span: 12 }}>
            <Card bordered={false} className="card-detail-modal">
              <Form
                ref={this.formRef}
                layout={"vertical"}
                validateMessages={validateMessages}
                size="middle"
              >
                <Row gutter={[8, 0]}>
                  {editPermission && (
                    <Col
                      sm={{ span: 24 }}
                      style={{ display: "flex", flexDirection: "row-reverse" }}
                    >
                      <Tooltip
                        title={
                          this.state.isEditDeparmentPercent
                            ? L("SAVE")
                            : L("EDIT_COMMISSION")
                        }
                      >
                        <Button
                          className="custom-buttom-drawe"
                          onClick={() => {
                            this.state.isEditDeparmentPercent
                              ? this.saveCommAmount()
                              : this.setState({ isEditDeparmentPercent: true })
                          }}
                          size="middle"
                          icon={
                            this.state.isEditDeparmentPercent ? (
                              <SaveOutlined />
                            ) : (
                              <EditOutlined />
                            )
                          }
                        />
                      </Tooltip>
                      &ensp;
                      {this.state.isEditDeparmentPercent &&
                        this.props.leaseAgreementStore.lACommission?.id && (
                          <Tooltip title={L("CANCEL_EDIT_COMMISSION")}>
                            <Button
                              className="custom-buttom-drawe"
                              onClick={() => {
                                this.cancelEditComm()
                              }}
                              size="middle"
                              icon={<RollbackOutlined />}
                            />
                          </Tooltip>
                        )}
                    </Col>
                  )}
                  <br />
                  <br />
                  <Col sm={{ span: 12 }}>
                    <Form.Item
                      label={L("DEPARMENT_COMMISSION_PERCENT")}
                      name="departmentPercent"
                      rules={rules.percent}
                    >
                      <InputNumber
                        min={0}
                        disabled={!this.state.isEditDeparmentPercent}
                        onChange={this.changeDeparmentCommPercent}
                        className="w-100"
                        formatter={(value) => inputNumberFormatter(value)}
                      />
                    </Form.Item>
                  </Col>
                  <Col sm={{ span: 12 }}>
                    <Form.Item
                      label={L("DEPARMENT_COMMISSION_AMOUNT")}
                      name="departmentCommissionAmount"
                    >
                      <InputNumber
                        min={0}
                        disabled
                        className="w-100"
                        formatter={(value) => inputCurrencyFormatter(value)}
                      />
                    </Form.Item>
                  </Col>
                  <Col sm={{ span: 12 }}>
                    <Form.Item
                      label={L("DEALER_COMMISSION_PERCENT")}
                      rules={rules.percent}
                      name="dealerPercent"
                    >
                      <InputNumber
                        min={0}
                        disabled={!this.state.isEditDeparmentPercent}
                        onChange={this.changeDealerCommPercent}
                        className="w-100"
                        formatter={(value) => inputNumberFormatter(value)}
                      />
                    </Form.Item>
                  </Col>
                  <Col sm={{ span: 12 }}>
                    <Form.Item
                      label={L("DEALER_COMMISSION_AMOUNT")}
                      name="dealerCommissionAmount"
                    >
                      <InputNumber
                        min={0}
                        className="w-100"
                        disabled
                        formatter={(value) => inputCurrencyFormatter(value)}
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </Form>
            </Card>
          </Col>
          <Col sm={{ span: 12 }}>
            <Table
              size="middle"
              className="comm-table"
              rowKey={(record, index) => `tt-${index}`}
              bordered
              loading={isLoading}
              columns={totalColumns}
              dataSource={this.props.leaseAgreementStore.lACommissionDealer}
              pagination={false}
            />
          </Col>
          {/* COLLAPSE */}
          <Col sm={{ span: 24 }}>
            <Collapse
              className="collapse-parent-cusstom"
              bordered={false}
              ghost
              onChange={this.onCollapChange}
              activeKey={activeKeyCollapse}
              collapsible={
                this.state.isEditDeparmentPercent ? "disabled" : "header"
              }
            >
              <Panel
                className="collapse-panel-cusstom"
                header={
                  <strong>
                    {L("SELECT_DEALER_AND_CONFIGURE_COMMISSION_PHASES")}
                  </strong>
                }
                disabled={this.state.isManualCal}
                key="2"
              >
                <Row gutter={[8, 8]}>
                  <Col sm={{ span: 12 }}>
                    <DealerComm
                      listMainDealer={this.state.listMainDealer}
                      dealerCommissionAmount={this.state.dealerAmount}
                      parentTabKeyChoose={this.props.parentTabKeyChoose}
                      thisTabKey={this.props.thisTabKey}
                      onDatatableChange={this.dataDealerChange}
                      dataTable={this.state.dataDealerTable}
                      leaseAgreementId={this.props.leaseAgreementId}
                    />
                  </Col>
                  <Col sm={{ span: 24 }}>
                    <PhaseConfigComm
                      dealerAmountHasInitValue={
                        this.state.dealerAmountHasInitValue
                      }
                      departmentCommissionAmount={this.state.departmentAmount}
                      tablePercentChange={this.PhaseConfigChagePercent}
                      dealerCommissionAmount={this.state.dealerAmount}
                      onDatatableChange={this.dataPhaseChange}
                      leaseAgreementId={this.props.leaseAgreementId}
                      dataTable={this.state.dataPhaseTable}
                    />
                  </Col>
                  {editPermission && (
                    <Col
                      sm={{ span: 24 }}
                      className="mt-1"
                      style={{ display: "flex", flexDirection: "row-reverse" }}
                    >
                      <Popconfirm
                        disabled={this.state.percentPhaseTable !== 100}
                        title={
                          <span className="width-max-content">
                            {L("SAVE_AND_GENERATE")}
                          </span>
                        }
                        onConfirm={this.generateCommission}
                      >
                        <Button
                          disabled={this.state.percentPhaseTable !== 100}
                          type="primary"
                          className="custom-buttom"
                        >
                          {L("GENERATE")}
                        </Button>
                      </Popconfirm>
                      <Popconfirm
                        title={L("CLEAR_ALL_CONFIGURE")}
                        onConfirm={this.clearAll}
                      >
                        <Button type="default" className="custom-buttom mr-1">
                          {L("CLEAR_ALL")}
                        </Button>
                      </Popconfirm>
                    </Col>
                  )}
                </Row>
              </Panel>
              <Panel
                className="collapse-panel-cusstom"
                header={<strong>{L("COMMISSION_PHASES")}</strong>}
                key="3"
              >
                <Row gutter={[8, 8]}>
                  <Col sm={{ span: 24 }}>
                    <CommissionPhaseDealer
                      listMainDealer={this.state.listMainDealer}
                      listOtherDealer={this.state.listOtherDealer}
                      dataTable={this.state.commissionDataTable}
                      onResetCommissionPhase={this.resetCommission}
                      onDatatableChange={this.commissionDataTableChange}
                      onIsManualChange={this.isManualChange}
                      isManual={this.state.isManualCal}
                    />
                  </Col>
                  {editPermission && (
                    <Col
                      sm={{ span: 24 }}
                      className="mt-1"
                      style={{ display: "flex", flexDirection: "row-reverse" }}
                    >
                      <Button
                        onClick={this.saveLACommDetail}
                        type="primary"
                        className="custom-buttom"
                      >
                        {L("SAVE")}
                      </Button>
                    </Col>
                  )}
                </Row>
              </Panel>
            </Collapse>
          </Col>
        </Row>
      </>
    )
  }
}
export default withRouter(Commission)
