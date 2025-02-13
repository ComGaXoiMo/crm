import * as React from "react"

import {
  Button,
  Col,
  Form,
  Modal,
  Popconfirm,
  Row,
  Switch,
  Table,
  Tag,
} from "antd"
import { inject, observer } from "mobx-react"
import DataTable from "@components/DataTable"
import { L } from "@lib/abpUtility"
import { AppComponentListBase } from "@components/AppComponentBase"
import AppConsts, { appPermissions, appStatusColors } from "@lib/appconst"
import withRouter from "@components/Layout/Router/withRouter"
import dayjs from "dayjs"
import LeaseAgreementStore from "@stores/communication/leaseAgreementStore"
import Stores from "@stores/storeIdentifier"
import { v4 as uuid } from "uuid"
import {
  CheckCircleFilled,
  CloseCircleFilled,
  DeleteOutlined,
  EditFilled,
} from "@ant-design/icons"
import {
  EditableCell,
  buildEditableCell,
} from "@components/DataTable/EditableCell"
import {
  inputCurrencyFormatter,
  inputPercentFormatter,
  isNumber,
  renderDate,
  renderQuarter,
} from "@lib/helper"
import { validateMessages } from "@lib/validation"
const { align, billingStatus } = AppConsts
export interface IProps {
  leaseAgreementStore: LeaseAgreementStore
  dataTable: any[]
  onDatatableChange: (value) => void
  listMainDealer: any[]
  listOtherDealer: any[]
  onResetCommissionPhase: () => void
  onIsManualChange: (value) => void
  isManual: boolean
}

export interface IState {
  dataTable: any[]
  editingKey: any
  isEdited: any
  backupData: any[]
  isManualCal: boolean
}
@inject(Stores.LeaseAgreementStore)
@observer
class CommPhaseDealerTable extends AppComponentListBase<IProps, IState> {
  formRef: any = React.createRef()
  formRez: any = React.createRef()
  state = {
    dataTable: [] as any,
    editingKey: "",
    isEdited: "",
    backupData: [] as any,
    isManualCal: false,
  }
  rowClassName = (record, index) => {
    let totalPercent = 0
    if (record.leaseAgreementCommissionPhaseId) {
      this.state.dataTable.map((item) => {
        if (
          item.leaseAgreementCommissionPhaseId ===
          record.leaseAgreementCommissionPhaseId
        )
          totalPercent = totalPercent + item.percent
      })
    }
    const classReturn =
      totalPercent != 100 ? `not-100-percent-row editable-row` : `editable-row`
    return classReturn
    // record.isPhase  ? "phase-row editable-row" : "editable-row";
  }
  isEditing = (record: any) => record.key === this.state.editingKey

  componentDidMount = () => {
    this.initData()
  }
  async componentDidUpdate(prevProps, prevState) {
    if (prevState.dataTable !== this.state.dataTable) {
      this.props.onDatatableChange(this.state.dataTable)
    }
    if (prevProps.dataTable !== this.props.dataTable) {
      this.initData()
    }
    if (prevProps.isManual !== this.props.isManual) {
      this.setState({ isManualCal: this.props.isManual })
    }
  }

  initData = () => {
    this.setState({ dataTable: this.props.dataTable })
  }

  saveRow = async (data: any) => {
    const values = await this.formRef.current?.validateFields()
    const baseData = [...this.state.dataTable]
    const newData = [...this.state.dataTable]
    const index = this.state.dataTable.findIndex(
      (item) => this.state.editingKey === item.key
    )

    if (index > -1) {
      const row = baseData[index]

      if (!row.isPhase) {
        let rent = {} as any
        const actAmount = row.commissionAmount / (row.percent / 100)
        if (values.percent) {
          const newCommAmount = actAmount * (values.percent / 100)
          rent = {
            percent: values.percent,
            commissionAmount: newCommAmount,
          }
        } else {
          const newPercent = (values.commissionAmount / actAmount) * 100
          rent = {
            percent: newPercent,
            commissionAmount: values.commissionAmount,
          }
        }
        let userId: any
        let dealerName: any

        if (row?.userId && !isNumber(values?.dealerName)) {
          userId = this.props.listOtherDealer.find(
            (item) => item.label === values.dealerName
          )?.id
          dealerName = values?.dealerName
        } else {
          userId = values?.dealerName
          dealerName = this.props.listOtherDealer.find(
            (item) => item.id === values.dealerName
          )?.label
        }

        newData.splice(index, 1, {
          ...row,
          ...rent,
          userId: userId,
          dealerName: dealerName,
        })
      } else {
        newData.splice(index, 1, {
          ...row,
          ...values,
        })
        if (this.state.isManualCal) {
          baseData.map((dealerItem, dealerIndex) => {
            if (dealerItem?.leaseAgreementCommissionPhaseId === row?.id) {
              const newRent = {
                commissionAmount:
                  (values.dealerCommissionAmountByPhase * dealerItem?.percent) /
                  100,
              }

              newData.splice(dealerIndex, 1, {
                ...dealerItem,
                ...newRent,
              })
            }
          })
        }
      }

      this.setState({ dataTable: newData })
    }

    this.setState({ isEdited: data?.key ?? "" })
    this.setState({ editingKey: "" })
  }

  deleteRow = async (index) => {
    const newData = [...this.state.dataTable]
    await newData.splice(index, 1)
    await this.setState({ dataTable: [...newData] })
  }

  handleChangeSwitch = async (value: boolean) => {
    if (value === false) {
      const sef = this
      Modal.confirm({
        title: L("SWITCH_OF_WILL_BE_RETURN_COMMISSION_TO_DEFAULT"),
        okText: L("BTN_YES"),
        cancelText: L("BTN_NO"),
        onOk() {
          sef.setState({ isManualCal: value })
          sef.props.onResetCommissionPhase()
          sef.props.onIsManualChange(value)
        },
        onCancel() {
          sef.setState({ isManualCal: true })
          sef.formRez.current?.setFieldsValue({ manualCal: true })
          sef.props.onIsManualChange(true)
        },
      })
    } else {
      this.props.onIsManualChange(value)
      this.setState({ isManualCal: value })
    }
  }

  public render() {
    const editPermission = this.isGranted(
      appPermissions.leaseAgreement.editCommission
    )
    const columns = [
      {
        title: L("PHASE"),
        dataIndex: "phase",
        key: "phase",
        width: 180,
        ellipsis: false,
        render: (text: string) => <>{text}</>,
      },
      {
        title: L("BILLING_DATE"),
        dataIndex: "billingDate",
        key: "billingDate",
        width: 130,
        align: align.center,
        ellipsis: false,
        render: (text: string) => (
          <>
            {renderDate(text)}
            <br />
            {renderQuarter(text)}
          </>
        ),
      },
      {
        title: (
          <>
            {L("ACTUAL")} <br />
            {L("BILLING_DATE")}
          </>
        ),
        dataIndex: "actBillingDate",
        key: "actBillingDate",
        width: 130,
        align: align.center,
        ellipsis: false,
        render: (text: string) => (
          <>
            {renderDate(text)}
            <br />
            {renderQuarter(text)}
          </>
        ),
        onCell: (record) =>
          !record.isPhase
            ? {}
            : buildEditableCell(
                record,
                "date",
                "actBillingDate",
                L(""),
                this.isEditing,
                true,
                [{ required: true, message: "Please input this field" }]
              ),
      },
      {
        title: L("BILLING_STATUS"),
        dataIndex: "statusId",
        key: "statusId",
        width: 150,
        align: align.center,

        ellipsis: false,
        render: (statusId) => (
          <>
            {statusId > -1 && (
              <Tag
                color={
                  statusId === 1 ? "blue" : statusId === 0 ? "red" : "default"
                }
              >
                <>{billingStatus.find((item) => item.id === statusId)?.label}</>
              </Tag>
            )}
          </>
        ),
        onCell: (record) =>
          !record.isPhase
            ? {}
            : buildEditableCell(
                record,
                "selectStatus",
                "statusId",
                L(""),
                this.isEditing,
                billingStatus,
                [{ required: true, message: "Please input this field" }]
              ),
      },

      {
        title: (
          <>
            {L("DEPARTMENT_COMMISSION")} <br />
            {L("AMOUNT_BY_PHASE")}
          </>
        ),
        dataIndex: "departmentCommissionAmountByPhase",
        key: "departmentCommissionAmountByPhase",
        width: 220,
        align: align.right,
        ellipsis: false,
        render: (text, record) => (
          <>{record.isPhase && inputCurrencyFormatter(text)}</>
        ),
        onCell: (record) =>
          this.state.isManualCal && record.isPhase
            ? buildEditableCell(
                record,
                "number",
                "departmentCommissionAmountByPhase",
                L(""),
                this.isEditing,
                false
              )
            : {},
      },
      {
        title: (
          <>
            {L("DEALER_COMMISSION")} <br />
            {L("AMOUNT_BY_PHASE")}
          </>
        ),
        dataIndex: "dealerCommissionAmountByPhase",
        key: "dealerCommissionAmountByPhase",
        width: 220,
        align: align.right,
        ellipsis: false,
        render: (text, record) => (
          <>{record.isPhase && inputCurrencyFormatter(text)}</>
        ),
        onCell: (record) =>
          this.state.isManualCal && record.isPhase
            ? buildEditableCell(
                record,
                "number",
                "dealerCommissionAmountByPhase",
                L(""),
                this.isEditing,
                false
              )
            : {},
      },
      {
        title: <div className="text-center">{L("DEALER")}</div>,
        dataIndex: "dealerName",
        key: "dealerName",
        width: 210,
        ellipsis: false,
        render: (text: string) => <>{text}</>,
        onCell: (record) =>
          record.isPhase
            ? {}
            : buildEditableCell(
                record,
                "select2",
                "dealerName",
                L(""),
                this.isEditing,
                this.props.listOtherDealer,
                [{ required: true, message: "Please input this field" }]
              ),
      },
      {
        title: (
          <>
            {L("PERCENT")} <br />
            {L("FOR_EACH_DEALER")}
          </>
        ),
        dataIndex: "percent",
        key: "percent",
        width: 170,
        align: align.right,
        ellipsis: false,
        render: (text, record) => (
          <div className="has-warring">
            {!record.isPhase && inputPercentFormatter(text)}
          </div>
        ),
        onCell: (record) =>
          record.isPhase
            ? {}
            : buildEditableCell(
                record,
                "number",
                "percent",
                L(""),
                this.isEditing,
                false
              ),
      },
      {
        title: (
          <>
            {L("COMMISSION_AMOUNT")} <br />
            {L("FOR_EACH_DEALER")}
          </>
        ),
        dataIndex: "commissionAmount",
        key: "commissionAmount",
        width: 200,
        align: align.right,
        ellipsis: false,
        render: (text, record) => (
          <>{!record.isPhase && inputCurrencyFormatter(text)}</>
        ),
        onCell: (record) =>
          record.isPhase
            ? {}
            : buildEditableCell(
                record,
                "number",
                "commissionAmount",
                L(""),
                this.isEditing,
                false
              ),
      },
      editPermission
        ? {
            title: L("ACTION"),
            dataIndex: "action",
            key: "action",
            width: 100,
            align: align.center,
            // fixed: 'right',
            render: (_: any, record, index) => {
              return this.state.editingKey === record.key ? (
                <>
                  <Button
                    type="text"
                    icon={
                      <CheckCircleFilled
                        style={{ color: appStatusColors.success }}
                      />
                    }
                    onClick={() => this.saveRow(record)}
                  />
                  <Popconfirm
                    title={L("ARE_YOU_SURE_YOU_WANT_CANCEL")}
                    onConfirm={() => {
                      this.setState({
                        editingKey: "",
                        dataTable: this.state.backupData,
                      })
                    }}
                  >
                    <Button
                      type="text"
                      icon={
                        <CloseCircleFilled
                          style={{ color: appStatusColors.error }}
                        />
                      }
                      // onClick={() => }
                    />
                  </Popconfirm>
                </>
              ) : (
                <>
                  <Button
                    type="link"
                    icon={<EditFilled />}
                    disabled={this.state.editingKey !== ""}
                    onClick={async () => {
                      await this.formRef.current?.setFieldsValue({
                        ...record,
                        actBillingDate: record.actBillingDate
                          ? dayjs(record.actBillingDate)
                          : "",
                      })
                      await this.setState({
                        backupData: [...this.state.dataTable],
                      })
                      await this.setState({ editingKey: record.key })
                    }}
                  />
                  {!record.isPhase && (
                    <Popconfirm
                      title={L("ARE_YOU_SURE_YOU_WANT_TO_DELETE")}
                      onConfirm={async () => {
                        this.deleteRow(index)
                      }}
                    >
                      <Button
                        type="link"
                        icon={<DeleteOutlined />}
                        disabled={this.state.editingKey !== ""}
                      />
                    </Popconfirm>
                  )}
                </>
              )
            },
          }
        : {
            title: L(""),
            dataIndex: "action",
            key: "action",
            width: 1,
          },
    ]
    const {
      leaseAgreementStore: { isLoading },
    } = this.props
    return (
      <>
        <Row gutter={[8, 0]}>
          <Form
            ref={this.formRez}
            layout={"vertical"}
            validateMessages={validateMessages}
            size="middle"
          >
            <Col sm={{ span: 24 }} className="flex center-items ">
              <div style={{ width: "fit-content" }}>
                <Form.Item
                  valuePropName="checked"
                  name={"manualCal"}
                  initialValue={this.props.isManual}
                >
                  <Switch onChange={this.handleChangeSwitch} />
                </Form.Item>
              </div>
              &ensp;
              <div style={{ marginBottom: "10px" }}>
                {L("MANUAL_COMMISSION_CALCULATING")}
              </div>
            </Col>
          </Form>
          <Col sm={{ span: 24 }}>
            <Form
              ref={this.formRef}
              layout={"vertical"}
              validateMessages={validateMessages}
              size="middle"
            >
              <DataTable title={this.L("LEASE_DEPOSIT")}>
                <Table
                  size="middle"
                  className="comm-table"
                  rowKey={(record) => uuid()}
                  pagination={false}
                  loading={isLoading}
                  rowClassName={this.rowClassName}
                  components={{
                    body: {
                      cell: EditableCell,
                    },
                  }}
                  columns={columns}
                  dataSource={this.state.dataTable ?? []}
                />
              </DataTable>
            </Form>{" "}
          </Col>
        </Row>
      </>
    )
  }
}

export default withRouter(CommPhaseDealerTable)
