import * as React from "react"

import { Button, Form, Popconfirm, Table } from "antd"
import { inject, observer } from "mobx-react"
import DataTable from "@components/DataTable"
import { L } from "@lib/abpUtility"
import { AppComponentListBase } from "@components/AppComponentBase"
import { v4 as uuid } from "uuid"
import AppConsts, { appStatusColors } from "@lib/appconst"
import withRouter from "@components/Layout/Router/withRouter"
import dayjs from "dayjs"
import { inputCurrencyFormatter } from "@lib/helper"
import LeaseAgreementStore from "@stores/communication/leaseAgreementStore"
import Stores from "@stores/storeIdentifier"
import {
  CheckCircleFilled,
  CloseCircleFilled,
  EditFilled,
  SplitCellsOutlined,
} from "@ant-design/icons"
import {
  EditableCell,
  buildEditableCell,
} from "@components/DataTable/EditableCell"
const { align } = AppConsts
export interface ILeaseDealerProps {
  onDatatableChange: (value) => void
  dataTable: any
  disabled: boolean
  leaseTerm: any
  leaseAgreementStore: LeaseAgreementStore
  otherFeeDate: any
}

export interface ILeaseDealerState {
  dataTable: any[]
  editingKey: any
  isEdited: any
  isSlipFee: any
  backupData: any[]
}
@inject(Stores.LeaseAgreementStore)
@observer
class SCFeeTable extends AppComponentListBase<
  ILeaseDealerProps,
  ILeaseDealerState
> {
  formRef: any = React.createRef()

  state = {
    dataTable: [] as any,
    editingKey: "",
    isEdited: "",
    isSlipFee: false,
    backupData: [] as any,
  }

  isEditing = (record: any) => record.key === this.state.editingKey
  async componentDidUpdate(prevProps, prevState) {
    if (prevProps.otherFeeDate !== this.props.otherFeeDate) {
      this.initData()
    }

    if (prevProps.dataTable !== this.props.dataTable) {
      this.initHasData()
    }

    if (prevState.dataTable !== this.state.dataTable) {
      if (this.props.onDatatableChange)
        this.props.onDatatableChange(this.state.dataTable)
    }
  }

  async componentDidMount() {
    this.initData()
  }
  initHasData = () => {
    const numRow = [] as any
    if (this.props.dataTable.length > 0) {
      this.props.dataTable.map((item) => {
        numRow.push({
          key: item.id,
          feeTypeId: item.feeTypeId,
          typeId: item.feeType?.typeId,
          startDate: item.startDate,
          endDate: item.endDate,
          amount: item.amount,
          vatAmount: item.vatAmount,
        })
      })
    }
    this.setState({
      dataTable: numRow,
    })
  }
  initData = () => {
    const numRow = [] as any

    this.props.leaseAgreementStore.listSCFeeType.map((item) => {
      numRow.push({
        key: uuid(),
        feeTypeId: item.id,
        typeId: item.typeId,
        startDate: this.props.otherFeeDate.startDate,
        endDate: this.props.otherFeeDate.endDate,
        amount: 0,
        vatAmount: 0,
      })
    })

    this.setState({
      dataTable: numRow,
    })
  }
  onSlipFee = async (record?, index?) => {
    const newData = [...this.state.dataTable]
    this.formRef.current?.resetFields()
    await this.setState({ backupData: [...this.state.dataTable] })
    await this.setState({ isSlipFee: true })
    await this.setState({ editingKey: record.key })
    const newRow = { ...record, key: uuid() }

    await newData.splice(index, 0, newRow)
    await this.setState({ dataTable: newData })
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

      const mdforRes = {
        amountIncludeVat: values.amount,
        feeTypeId: row.feeTypeId,
        startDate: dayjs(row.startDate).toJSON(),
        endDate: values.endDate
          ? dayjs(values.endDate).toJSON()
          : dayjs(row.endDate).toJSON(),
      }
      const amountVat =
        await this.props.leaseAgreementStore.genVATAmountByFeeType([mdforRes])
      const newRes = { ...row, ...values, vatAmount: amountVat }
      newData.splice(index, 1, { ...newRes })

      // lấy endDate của record vừa lưu thế vào startDay của dòng tiếp theo nếu dòng tiếp theo là loại service Charge
      if (newData[index + 1] && newData[index + 1].typeId === 1) {
        const nextRow = newData[index + 1]

        const mdForNextRes = {
          amountIncludeVat: nextRow.amount,
          feeTypeId: nextRow.feeTypeId,
          startDate: dayjs(newRes.endDate).add(1, "d").toJSON(),
          endDate: dayjs(nextRow.endDate).toJSON(),
        }
        const nextRowAmountVat =
          await this.props.leaseAgreementStore.genVATAmountByFeeType([
            mdForNextRes,
          ])
        const nextRes = await {
          ...nextRow,
          startDate: dayjs(newRes.endDate).add(1, "d"),
          vatAmount: nextRowAmountVat,
        }
        await newData.splice(index + 1, 1, { ...nextRes })
      }
      this.setState({ dataTable: newData })
    }

    this.setState({ isEdited: data?.key ?? "" })
    this.setState({ editingKey: "", isSlipFee: false })
  }
  public render() {
    const columns = [
      {
        title: L("FEE_TYPE"),
        dataIndex: "feeTypeId",
        key: "feeTypeId",
        width: 150,
        //
        render: (feeTypeId) =>
          this.props.leaseAgreementStore.listSCFeeType.find(
            (item) => item.id === feeTypeId
          )?.name,
      },
      {
        title: L("AMOUNT_NOT_VAT"),
        dataIndex: "amount",
        key: "amount",
        width: 200,

        align: align.right,
        render: (title) => <>{inputCurrencyFormatter(title)}</>,
        onCell: (record) =>
          buildEditableCell(
            record,
            "number",
            "amount",
            L(""),
            this.isEditing,
            null,
            [{ required: true, message: "Please input this field" }]
          ),
      },

      {
        title: L("VAT_AMOUNT"),
        dataIndex: "vatAmount",
        key: "vatAmount",
        width: 200,
        align: align.right,
        render: (title) => <>{inputCurrencyFormatter(title)}</>,
      },
      {
        title: L("START_DATE"),
        dataIndex: "startDate",
        key: "startDate",
        width: 200,
        align: align.center,
        render: this.renderDate,
        // onCell: (record) =>
        //   this.state.isSlipFee
        //     ? {}
        //     : buildEditableCell(
        //         record,
        //         record.typeId === 1 ? "month" : "none",
        //         "startDate",
        //         L(""),
        //         this.isEditing
        //       ),
      },
      {
        title: L("END_DATE"),
        dataIndex: "endDate",
        key: "endDate",
        width: 200,
        align: align.center,
        render: this.renderDate,
        onCell: (record) =>
          this.state.isSlipFee
            ? buildEditableCell(
                record,
                record.typeId === 1 ? "date" : "none",
                "endDate",
                L(""),
                this.isEditing,
                true,
                [{ required: true, message: "Please input this field" }]
              )
            : {},
      },
      {
        title: <div className="mb-3">{L("ACTION")}</div>,
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
                    isSlipFee: false,
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
                disabled={this.props.disabled || this.state.editingKey !== ""}
                onClick={async () => {
                  await this.formRef.current?.setFieldsValue({
                    ...record,
                    depositDate: record.depositDate
                      ? dayjs(record.depositDate)
                      : "",
                  })
                  await this.setState({
                    backupData: [...this.state.dataTable],
                  })
                  await this.setState({ editingKey: record.key })
                }}
              />
              {record?.typeId === 1 && (
                <Button
                  disabled={this.props.disabled || this.state.editingKey !== ""}
                  onClick={() => {
                    this.onSlipFee(record, index)
                  }}
                  type="link"
                  icon={<SplitCellsOutlined />}
                />
              )}
            </>
          )
        },
      },
    ]

    return (
      <>
        <Form ref={this.formRef} component={false}>
          <DataTable title={this.L("LEASE_DEPOSIT")}>
            <div className="full-width header-table-cusstom">
              {L("SERVICE_CHARGE_FEE")}
            </div>

            <Table
              size="middle"
              // className="custom-ant-table custom-ant-row"
              //   rowKey={(record) => record.key}
              pagination={false}
              rowClassName={() => "editable-row"}
              onRow={(record, rowIndex) => {
                return {
                  onClick: (event) => {
                    // console.log(record);
                  }, // click row
                }
              }}
              components={{
                body: {
                  cell: EditableCell,
                },
              }}
              bordered
              columns={columns}
              dataSource={this.state.dataTable ?? []}
            />
          </DataTable>
        </Form>
      </>
    )
  }
}

export default withRouter(SCFeeTable)
