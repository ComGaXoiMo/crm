import * as React from "react"

import { Button, Form, Table } from "antd"
import { inject, observer } from "mobx-react"
import { v4 as uuid } from "uuid"
import DataTable from "@components/DataTable"
import { L } from "@lib/abpUtility"
import { AppComponentListBase } from "@components/AppComponentBase"
import { formatCurrency, renderDate } from "@lib/helper"
import {
  CheckCircleFilled,
  CloseCircleFilled,
  EditFilled,
  PlusOutlined,
} from "@ant-design/icons"
import AppConsts, { appStatusColors } from "@lib/appconst"
import dayjs from "dayjs"
import { buildEditableCell } from "@components/DataTable/EditableCell"
import { EditableCell } from "@components/DataTable/EditableCell"
const { align } = AppConsts
export interface ILeaseDepositProps {
  id: any
}

export interface ILeaseDepositState {
  maxResultCount: number
  skipCount: number
  editingKey: any
  isEdited: any
  data: any[]
}

@inject()
@observer
class LeaseDeposit extends AppComponentListBase<
  ILeaseDepositProps,
  ILeaseDepositState
> {
  formRef: any = React.createRef()

  state = {
    maxResultCount: 10,
    skipCount: 0,
    editingKey: "",
    isEdited: "",
    data: [] as any,
  }
  get currentPage() {
    return Math.floor(this.state.skipCount / this.state.maxResultCount) + 1
  }
  isEditing = (record: any) => record.key === this.state.editingKey

  async componentDidMount() {
    await this.setState({ data: fakedata })
    await this.getAll()
  }

  async getAll() {
    console.log("getAll")
  }

  handleAddRow = () => {
    this.formRef.current.resetFields()
    const newRow = { key: uuid() }
    const newData = [...this.state.data]
    newData.unshift(newRow)

    this.setState({ data: newData })
    this.setState({ editingKey: newRow.key })
  }

  saveRow = async (record?) => {
    const values = await this.formRef.current?.validateFields()
    const newData = [...this.state.data]
    const index = this.state.data.findIndex(
      (item) => this.state.editingKey === item.key
    )
    if (index > -1) {
      const row = newData[index]
      newData.splice(index, 1, {
        ...row,
        ...values,
      })
      this.setState({ data: newData })
    }
    this.setState({ isEdited: record?.key ?? "" })
    this.setState({ editingKey: "" })
  }
  public render() {
    const columns = [
      {
        title: L("DEPOSIT_TYPE"),
        dataIndex: "depositType",
        key: "depositType",
        width: "20%",
        render: (depositType) => <>{depositType}</>,
        onCell: (record) =>
          buildEditableCell(
            record,
            "select",
            "depositType",
            L(""),
            this.isEditing,
            [{ name: "Deposit" }, { name: "Secure" }]
          ),
      },
      {
        title: L("DEPOSIT_DATE"),
        dataIndex: "depositDate",
        key: "depositDate",
        align: align.center,
        width: "20%",
        render: (depositDate) => <>{renderDate(depositDate)}</>,
        onCell: (record) =>
          buildEditableCell(
            record,
            "date",
            "depositDate",
            L(""),
            this.isEditing
          ),
      },
      {
        title: L("DEPOSIT_AMOUNT"),
        dataIndex: "depositAmount",
        key: "depositAmount",
        width: "30%",
        render: (depositAmount) => <>{formatCurrency(depositAmount)}</>,
        onCell: (record) =>
          buildEditableCell(
            record,
            "number",
            "depositAmount",
            L(""),
            this.isEditing
          ),
      },
      {
        title: L("STATUS"),
        dataIndex: "depositStatus",
        key: "depositStatus",
        align: align.center,
        width: "20%",
        render: (depositStatus) => <>{depositStatus}</>,
        onCell: (record) =>
          buildEditableCell(
            record,
            "select",
            "depositStatus",
            L(""),
            this.isEditing,
            [
              { name: "Draft" },
              { name: "Sent" },
              { name: "Paid" },
              { name: "Delayed" },
            ]
          ),
      },
      {
        title: (
          <div className="h-100">
            <Button
              type="primary"
              disabled={this.state.editingKey !== ""}
              shape="circle"
              size="small"
              icon={<PlusOutlined />}
              onClick={this.handleAddRow}
            />
          </div>
        ),
        width: "10%",
        align: align.center,
        dataIndex: "action",
        key: "action",
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
              <Button
                type="text"
                icon={
                  <CloseCircleFilled style={{ color: appStatusColors.error }} />
                }
                onClick={() => {
                  this.setState({ editingKey: "" })
                }}
              />
            </>
          ) : (
            <>
              <Button
                type="link"
                icon={<EditFilled />}
                disabled={this.state.editingKey !== ""}
                onClick={() => {
                  this.formRef.current?.setFieldsValue({
                    ...record,

                    depositDate: record.depositDate
                      ? dayjs(record.depositDate)
                      : "",
                  })
                  this.setState({ editingKey: record.key })
                }}
              />
            </>
          )
        },
      },
    ]
    return (
      <>
        <Form ref={this.formRef} component={false}>
          <DataTable
            title={this.L("LEASE_DEPOSIT")}
            pagination={{
              pageSize: this.state.maxResultCount,
              current: this.currentPage,
            }}
          >
            <Table
              size="middle"
              className="custom-ant-table custom-ant-row"
              rowKey="key"
              pagination={false}
              onRow={(record, rowIndex) => {
                return {
                  onClick: (event) => {
                    console.log(record)
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
              dataSource={this.state.data ?? []}
            />
          </DataTable>
        </Form>
        <style>{`
       .ant-col-xxl-20{
        max-width:100%;
       }
       .ant-picker{
        display:flex;
       }
        `}</style>
      </>
    )
  }
}

export default LeaseDeposit
const fakedata = [
  {
    key: "14313a",
    id: 1,
    depositType: "Deposit",
    depositDate: "2023-04-01T00:00:00.000Z",
    depositAmount: 8000000,
    depositStatus: "Sent",
  },
  {
    key: "f3r123",
    id: 2,
    depositType: "Deposit",
    depositDate: "2023-02-01T00:00:00.000Z",
    depositAmount: 8000000,
    depositStatus: "Draft",
  },
  {
    key: "123sdf",
    id: 3,
    depositType: "Deposit",
    depositDate: "2023-01-01T00:00:00.000Z",
    depositAmount: 8000000,
    depositStatus: "Draft",
  },
]
