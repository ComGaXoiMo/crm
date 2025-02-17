import * as React from "react"

import { Button, Form, Table } from "antd"
import { inject, observer } from "mobx-react"
import { v4 as uuid } from "uuid"
import DataTable from "@components/DataTable"
import { L } from "@lib/abpUtility"
import { AppComponentListBase } from "@components/AppComponentBase"
import { formatCurrency } from "@lib/helper"
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
import withRouter from "@components/Layout/Router/withRouter"
const { align } = AppConsts
export interface ILeaseDealerProps {
  id: any
}

export interface ILeaseDealerState {
  maxResultCount: number
  skipCount: number
  editingKey: any
  isEdited: any
  data: any[]
}

@inject()
@observer
class LeaseDealer extends AppComponentListBase<
  ILeaseDealerProps,
  ILeaseDealerState
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
        title: L("DEALER"),
        dataIndex: "dealer",
        key: "dealer",
        width: "40%",
        render: (dealer) => <h4>{dealer}</h4>,
        onCell: (record) =>
          buildEditableCell(record, "select", "dealer", L(""), this.isEditing, [
            { name: "Viet Nguyen" },
            { name: "Bao Le" },
          ]),
      },
      {
        title: L("COMMISSON_AMOUNT"),
        dataIndex: "commissionAmount",
        width: "50%",
        key: "commissionAmount",
        render: (commissionAmount) => (
          <h4>{formatCurrency(commissionAmount)}</h4>
        ),
        onCell: (record) =>
          buildEditableCell(
            record,
            "number",
            "commissionAmount",
            L(""),
            this.isEditing
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
              className=" custom-ant-row"
              rowKey="id"
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
              columns={columns}
              dataSource={this.state.data ?? []}
            />
          </DataTable>
        </Form>
      </>
    )
  }
}

export default withRouter(LeaseDealer)
const fakedata = [
  { key: "718281723a", dealer: "Viet Nguyen", commissionAmount: 3000000 },
  { key: "sdf343242", dealer: "Bao le", commissionAmount: 4000000 },
]
