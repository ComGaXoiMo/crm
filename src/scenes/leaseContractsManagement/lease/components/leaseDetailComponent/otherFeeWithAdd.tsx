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
  DeleteOutlined,
  EditFilled,
  PlusCircleFilled,
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
  isAmendment: any
  feeRentOption: any[]
}

export interface ILeaseDealerState {
  dataTable: any[]
  editingKey: any
  isEdited: any
  backupData: any[]
}
@inject(Stores.LeaseAgreementStore)
@observer
class OtherFeesWithAdd extends AppComponentListBase<
  ILeaseDealerProps,
  ILeaseDealerState
> {
  formRef: any = React.createRef()

  state = {
    dataTable: [] as any,
    editingKey: "",
    isEdited: "",
    backupData: [] as any,
  }

  isEditing = (record: any) => record.key === this.state.editingKey
  async componentDidUpdate(prevProps, prevState) {
    if (prevProps.otherFeeDate !== this.props.otherFeeDate) {
      this.fetchData()
      this.setState({ editingKey: "" })
    }

    if (prevProps.dataTable !== this.props.dataTable) {
      if (this.props.dataTable?.length > 0) {
        this.initData()
      }
    }

    if (prevState.dataTable !== this.state.dataTable) {
      if (this.props.onDatatableChange)
        this.props.onDatatableChange(this.state.dataTable)
    }
  }

  async componentDidMount() {
    this.initData()
  }
  initData = () => {
    const numRow = [] as any
    if (this.props.dataTable.length > 0) {
      this.props.dataTable.map((item) => {
        numRow.push({
          ...item,
          key: item.id,
          typeId: item.feeType?.typeId,
        })
      })
    }
    this.setState({
      dataTable: numRow,
    })
  }
  fetchData = async () => {
    this.setState({ dataTable: [] })
  }

  addRecordToTable = async () => {
    await this.setState({
      backupData: [...this.state.dataTable],
    })
    const newTable = [...this.state.dataTable]
    this.formRef.current?.resetFields()
    const unique = uuid()

    const newRow = { key: unique, uniqueId: unique } as any

    await newTable.splice(newTable.length, 0, newRow)
    await this.setState({ dataTable: newTable })
    this.setState({
      editingKey: newRow.key,
    })
  }
  deleteRow = async (index) => {
    const newData = [...this.state.dataTable]
    await newData.splice(index, 1)
    await this.setState({ dataTable: newData })
  }
  saveRow = async (data: any) => {
    const values = await this.formRef.current?.validateFields()
    const newData = [...this.state.dataTable]
    const index = this.state.dataTable.findIndex(
      (item) => this.state.editingKey === item.key
    )

    if (index > -1) {
      const row = newData[index]
      const startDate = this.props.feeRentOption?.find(
        (item) => item?.id === values?.parentId
      )?.startDate
      const endDate = this.props.feeRentOption?.find(
        (item) => item?.id === values?.parentId
      )?.endDate
      const mdforRes = {
        amountIncludeVat: values.amountIncludeVat,
        feeTypeId: values.feeTypeId,
        startDate: startDate,
        endDate: endDate,
      }
      const res = await this.props.leaseAgreementStore.genVATAmountByFeeType([
        mdforRes,
      ])
      const newRes = {
        ...row,
        ...values,

        vatAmount: res?.vatAmount,
        amount: res?.amount,
        startDate: startDate,
        endDate: endDate,
      }
      newData.splice(index, 1, { ...newRes })

      this.setState({ dataTable: newData })
    }

    this.setState({ isEdited: data?.key ?? "" })
    this.setState({ editingKey: "" })
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
          this.props.leaseAgreementStore.listOtherFeeType.find(
            (item) => item.id === feeTypeId
          )?.name,

        onCell: (record) =>
          buildEditableCell(
            record,
            "select",
            "feeTypeId",
            L(""),
            this.isEditing,
            this.props.leaseAgreementStore?.listOtherFeeType,
            [{ required: true }]
          ),
      },
      {
        title: L("DESCRIPTION"),
        dataIndex: "name",
        key: "name",
        width: 250,
        render: (name) => <>{name}</>,
        onCell: (record) =>
          buildEditableCell(
            record,
            "text",
            "name",
            L(""),
            this.isEditing,
            false
          ),
      },

      {
        title: L("RENT"),
        dataIndex: "parentId",
        key: "parentId",
        width: 150,
        //
        render: (parentId) =>
          this.props.feeRentOption.find((item) => item.id === parentId)?.label,

        onCell: (record) =>
          buildEditableCell(
            record,
            "select",
            "parentId",
            L(""),
            this.isEditing,
            this.props.feeRentOption,
            [{ required: true }]
          ),
      },
      {
        title: (
          <>
            {L("AMOUNT")}
            <br /> {L("INCL_VAT")}
          </>
        ),
        dataIndex: "amountIncludeVat",
        key: "amountIncludeVat",
        width: 200,

        align: align.right,
        render: (title) => <>{inputCurrencyFormatter(title)}</>,
        onCell: (record) =>
          buildEditableCell(
            record,
            "number",
            "amountIncludeVat",
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
        title: (
          <>
            {L("AMOUNT")}
            <br /> {L("EXCL_VAT")}
          </>
        ),
        dataIndex: "amount",
        key: "amount",
        width: 200,
        align: align.right,
        render: (title) => <>{inputCurrencyFormatter(title)}</>,
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
              <Popconfirm
                title={L("ARE_YOU_SURE_YOU_WANT_TO_DELETE")}
                onConfirm={async () => {
                  this.deleteRow(index)
                }}
              >
                <Button
                  type="link"
                  icon={<DeleteOutlined />}
                  disabled={this.props.disabled || this.state.editingKey !== ""}
                />
              </Popconfirm>
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
              <span
                className={this.props.isAmendment ? "amendment-highlight" : ""}
              >
                {L("OTHER_FEES")}
              </span>
            </div>

            <Table
              size="middle"
              className="table-font-size-12"
              // className=" custom-ant-row"
              //   rowKey={(record) => record.key}
              pagination={false}
              rowClassName={() => "editable-row"}
              components={{
                body: {
                  cell: EditableCell,
                },
              }}
              columns={columns}
              dataSource={this.state.dataTable ?? []}
            />
          </DataTable>
          <Button
            onClick={this.addRecordToTable}
            icon={<PlusCircleFilled />}
            disabled={this.props.disabled || this.state.editingKey !== ""}
            className="full-width"
          >
            {L("ADD_ONE_RECORD")}
          </Button>
        </Form>
      </>
    )
  }
}

export default withRouter(OtherFeesWithAdd)
