import * as React from "react"

import { Button, Form, Popconfirm, Table } from "antd"
import { inject, observer } from "mobx-react"
import { L } from "@lib/abpUtility"
import { AppComponentListBase } from "@components/AppComponentBase"
import { v4 as uuid } from "uuid"
import AppConsts, { appPermissions, appStatusColors } from "@lib/appconst"
import withRouter from "@components/Layout/Router/withRouter"
import dayjs from "dayjs"
import LeaseAgreementStore from "@stores/communication/leaseAgreementStore"
import Stores from "@stores/storeIdentifier"
import {
  CheckCircleFilled,
  CloseCircleFilled,
  DeleteOutlined,
  EditFilled,
  PlusCircleFilled,
} from "@ant-design/icons"
import {
  EditableCell,
  buildEditableCell,
} from "@components/DataTable/EditableCell"
import {
  inputCurrencyFormatter,
  inputPercentFormatter,
  renderDate,
} from "@lib/helper"
import { round } from "lodash"
const { align } = AppConsts
export interface IProps {
  leaseAgreementStore: LeaseAgreementStore
  onDatatableChange: (value) => void
  leaseAgreementId: any
  dealerCommissionAmount: number
  departmentCommissionAmount: number
  dataTable: any
  dealerAmountHasInitValue: any
  tablePercentChange: (percent) => void
}

export interface IState {
  dataTable: any[]
  editingKey: any
  isEdited: any
  backupData: any[]
  totalPercent: number
}
@inject(Stores.LeaseAgreementStore)
@observer
class phaseConfigCommTable extends AppComponentListBase<IProps, IState> {
  formRef: any = React.createRef()

  state = {
    dataTable: [] as any,
    editingKey: "",
    isEdited: "",
    backupData: [] as any,
    totalPercent: 0,
  }

  isEditing = (record: any) => record.key === this.state.editingKey
  async componentDidUpdate(prevProps, prevState) {
    if (prevState.dataTable !== this.state.dataTable) {
      this.props.onDatatableChange(this.state.dataTable)
      let sumPercent = 0

      this.state.dataTable.map((item) => {
        sumPercent = sumPercent + item?.percent
      })
      this.setState({ totalPercent: round(sumPercent) })
      this.props.tablePercentChange(round(sumPercent))
    }
    if (
      prevProps.dealerAmountHasInitValue !== this.props.dealerAmountHasInitValue
    ) {
      this.initData()
    }
    if (prevProps.dataTable !== this.props.dataTable) {
      this.setState({ dataTable: this.props.dataTable })
    }
  }

  async componentDidMount() {
    if (this.props.dataTable.length > 0) {
      this.setState({ dataTable: this.props.dataTable })
    } else {
      this.initData()
    }
  }

  initData = () => {
    const {
      leaseAgreementStore: { leaseAgreementDetail },
    } = this.props
    const isMorePhare =
      (leaseAgreementDetail.leaseTermMonth > 0 &&
        leaseAgreementDetail.leaseTermDay > 0 &&
        leaseAgreementDetail.leaseTermYear > 0) ||
      leaseAgreementDetail.leaseTermYear > 1
    const dataTable = [
      {
        key: uuid(),
        phase: "Phase 1",
        numPhase: 1,
        leaseAgreementId: this.props.leaseAgreementId,
        billingDate: dayjs(leaseAgreementDetail.commencementDate).toJSON(),
        actBillingDate: dayjs(leaseAgreementDetail.commencementDate).toJSON(),
        percent: isMorePhare ? 30 : 100,
        departmentCommissionAmount: this.props.departmentCommissionAmount,
        departmentCommissionAmountByPhase:
          (this.props.departmentCommissionAmount * (isMorePhare ? 30 : 100)) /
          100,
        dealerCommissionAmount: this.props.dealerCommissionAmount,
        dealerCommissionAmountByPhase:
          (this.props.dealerCommissionAmount * (isMorePhare ? 30 : 100)) / 100,
      },
    ]

    if (isMorePhare) {
      if (leaseAgreementDetail.leaseTermMonth >= 6) {
        for (let i = 0; i < leaseAgreementDetail.leaseTermYear + 1; i++) {
          const currentDate =
            i != leaseAgreementDetail.leaseTermYear
              ? dayjs(leaseAgreementDetail.commencementDate).add(i + 1, "y")
              : dayjs(leaseAgreementDetail.expiryDate)

          dataTable.push({
            key: uuid(),
            numPhase: i + 2,
            phase: `Phase ${i + 2}`,
            leaseAgreementId: this.props.leaseAgreementId,
            billingDate: currentDate.toJSON(),
            actBillingDate: currentDate.toJSON(),
            percent: 70 / (leaseAgreementDetail.leaseTermYear + 1),

            departmentCommissionAmount: this.props.departmentCommissionAmount,
            departmentCommissionAmountByPhase:
              (this.props.departmentCommissionAmount *
                (70 / (leaseAgreementDetail.leaseTermYear + 1))) /
              100,
            dealerCommissionAmount: this.props.dealerCommissionAmount,

            dealerCommissionAmountByPhase:
              (this.props.dealerCommissionAmount *
                (70 / (leaseAgreementDetail.leaseTermYear + 1))) /
              100,
          })
        }
      } else {
        for (let i = 0; i < leaseAgreementDetail.leaseTermYear; i++) {
          const currentDate =
            i + 1 != leaseAgreementDetail.leaseTermYear
              ? dayjs(leaseAgreementDetail.commencementDate).add(i + 1, "y")
              : dayjs(leaseAgreementDetail.expiryDate)

          dataTable.push({
            key: uuid(),
            numPhase: i + 2,
            phase: `Phase ${i + 2}`,
            leaseAgreementId: this.props.leaseAgreementId,
            billingDate: currentDate.toJSON(),
            actBillingDate: currentDate.toJSON(),
            percent: 70 / leaseAgreementDetail.leaseTermYear,

            departmentCommissionAmount: this.props.departmentCommissionAmount,
            departmentCommissionAmountByPhase:
              (this.props.departmentCommissionAmount *
                (70 / leaseAgreementDetail.leaseTermYear)) /
              100,
            dealerCommissionAmount: this.props.dealerCommissionAmount,

            dealerCommissionAmountByPhase:
              (this.props.dealerCommissionAmount *
                (70 / leaseAgreementDetail.leaseTermYear)) /
              100,
          })
        }
      }
    }
    this.setState({ dataTable })
  }

  addRecordToTable = async () => {
    await this.setState({
      backupData: [...this.state.dataTable],
    })
    const newTable = [...this.state.dataTable]
    const newRow = {
      key: uuid(),
      leaseAgreementId: this.props.leaseAgreementId,
    } as any
    this.formRef.current?.resetFields()

    await newTable.splice(newTable.length, 0, newRow)
    await this.setState({ dataTable: newTable })
    this.setState({
      editingKey: newRow.key,
    })
  }
  saveRow = async (data: any) => {
    const values = await this.formRef.current?.validateFields()
    const newData = [...this.state.dataTable]
    const index = this.state.dataTable.findIndex(
      (item) => this.state.editingKey === item.key
    )

    if (index > -1) {
      const row = newData[index]
      newData.splice(index, 1, {
        ...row,
        ...values,
        leaseAgreementId: this.props.leaseAgreementId,
        actBillingDate: dayjs(values.billingDate).toJSON(),

        departmentCommissionAmount: this.props.departmentCommissionAmount,
        departmentCommissionAmountByPhase:
          (this.props.departmentCommissionAmount * values.percent) / 100,
        dealerCommissionAmount: this.props.dealerCommissionAmount,
        dealerCommissionAmountByPhase:
          (this.props.dealerCommissionAmount * values.percent) / 100,
      })
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

  public render() {
    const editPermission = this.isGranted(
      appPermissions.leaseAgreement.editCommission
    )
    const columns = [
      {
        title: L("PHASE"),
        dataIndex: "phase",
        key: "phase",
        width: 150,
        ellipsis: false,
        render: (text: any) => <>{text}</>,
        onCell: (record) =>
          buildEditableCell(
            record,
            "text",
            "phase",
            L(""),
            this.isEditing,
            false,
            [{ required: true, message: "Please input this field" }]
          ),
      },
      {
        title: <>{L("BILLING_DATE")}</>,
        dataIndex: "billingDate",
        key: "billingDate",
        width: 170,
        align: align.center,
        ellipsis: false,
        render: renderDate,
        onCell: (record) =>
          buildEditableCell(
            record,
            "date",
            "billingDate",
            L(""),
            this.isEditing,
            true,
            [{ required: true, message: "Please input this field" }]
          ),
      },
      {
        title: <>{L("PERCENT")}</>,
        dataIndex: "percent",
        key: "percent",
        width: 100,
        align: align.right,
        ellipsis: false,
        render: (text) => (
          <div className={this.state.totalPercent !== 100 ? "text-error" : ""}>
            {inputPercentFormatter(text)}
          </div>
        ),
        onCell: (record) =>
          buildEditableCell(
            record,
            "number",
            "percent",
            L(""),
            this.isEditing,
            false,
            [{ required: true, message: "Please input this field" }]
          ),
      },
      // {
      //   title: (
      //     <>
      //       {L("DEPARTMENT_COMMISSION")} <br />
      //       {L("AMOUNT")}
      //     </>
      //   ),
      //   dataIndex: "departmentCommissionAmount",
      //   key: "departmentCommissionAmount",
      //   width: 180,
      //   align: align.right,
      //   ellipsis: false,
      //   render: (text) => <>{inputCurrencyFormatter(text)}</>,
      // },
      {
        title: (
          <>
            {L("DEPARTMENT_COMMISSION")} <br />
            {L("AMOUNT_BY_PHASE")}
          </>
        ),
        dataIndex: "departmentCommissionAmountByPhase",
        key: "departmentCommissionAmountByPhase",
        width: 210,
        align: align.right,
        ellipsis: false,
        render: (text) => <>{inputCurrencyFormatter(text)}</>,
      },
      // {
      //   title: (
      //     <>
      //       {L("DEALER_COMMISSION")} <br />
      //       {L("AMOUNT")}
      //     </>
      //   ),
      //   dataIndex: "dealerCommissionAmount",
      //   key: "dealerCommissionAmount",
      //   width: 170,
      //   align: align.right,
      //   ellipsis: false,
      //   render: (text) => <>{inputCurrencyFormatter(text)}</>,
      // },
      {
        title: (
          <>
            {L("DEALER_COMMISSION")} <br />
            {L("AMOUNT_BY_PHASE")}
          </>
        ),
        dataIndex: "dealerCommissionAmountByPhase",
        key: "dealerCommissionAmountByPhase",
        width: 150,
        align: align.right,
        ellipsis: false,
        render: (text) => <>{inputCurrencyFormatter(text)}</>,
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
                        billingDate: record.billingDate
                          ? dayjs(record.billingDate)
                          : "",
                      })
                      await this.setState({
                        backupData: [...this.state.dataTable],
                      })
                      await this.setState({ editingKey: record.key })
                    }}
                  />
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
        <Form ref={this.formRef} component={false}>
          <div className="comm-table full-width">
            <Table
              size="middle"
              className="custom-ant-row"
              rowKey={(record, index) => `cf-${index}`}
              pagination={false}
              loading={isLoading}
              rowClassName={() => "editable-row"}
              components={{
                body: {
                  cell: EditableCell,
                },
              }}
              columns={columns}
              dataSource={this.state.dataTable ?? []}
              summary={(pageData) => {
                let totalDepartment = 0
                let totalDealer = 0
                pageData.forEach((item) => {
                  totalDepartment += item.departmentCommissionAmountByPhase
                  totalDealer += item.dealerCommissionAmountByPhase
                })

                return (
                  <Table.Summary.Row className="bg-total">
                    <Table.Summary.Cell index={1}></Table.Summary.Cell>
                    <Table.Summary.Cell index={1}></Table.Summary.Cell>
                    <Table.Summary.Cell index={1}></Table.Summary.Cell>
                    <Table.Summary.Cell index={1} className="text-right">
                      <strong>{L("TOTAL")}: </strong>
                      <strong>{inputCurrencyFormatter(totalDepartment)}</strong>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={1} className="text-right">
                      <strong>{L("TOTAL")}: </strong>
                      <strong>{inputCurrencyFormatter(totalDealer)}</strong>
                    </Table.Summary.Cell>
                  </Table.Summary.Row>
                )
              }}
            />
            {editPermission && (
              <Button
                onClick={this.addRecordToTable}
                icon={<PlusCircleFilled />}
                disabled={this.state.editingKey !== ""}
                className="full-width"
              >
                {L("ADD_ONE_RECORD")}
              </Button>
            )}
          </div>
        </Form>
      </>
    )
  }
}

export default withRouter(phaseConfigCommTable)
