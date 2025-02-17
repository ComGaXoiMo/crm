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
} from "@ant-design/icons"
import AppConsts, { appStatusColors } from "@lib/appconst"
import dayjs from "dayjs"
import { buildEditableCell } from "@components/DataTable/EditableCell"
import { EditableCell } from "@components/DataTable/EditableCell"
import withRouter from "@components/Layout/Router/withRouter"
const { align } = AppConsts
export interface ILeaseDealerProps {
  commisionAmount: any
  onDatatableChange: (value) => void
  dataTable: any
  disabled: boolean
  leaseTerm: any
}

export interface ILeaseDealerState {
  maxResultCount: number
  skipCount: number
  editingKey: any
  isEdited: any
  dataTable: any[]
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
    dataTable: [] as any,
  }
  get currentPage() {
    return Math.floor(this.state.skipCount / this.state.maxResultCount) + 1
  }
  isEditing = (record: any) => record.key === this.state.editingKey

  async componentDidMount() {
    await this.fetchData()
  }
  async componentDidUpdate(prevProps, prevState) {
    if (prevProps.leaseTerm !== this.props.leaseTerm) {
      this.fetchData()
    }

    if (prevProps.commisionAmount !== this.props.commisionAmount) {
      const newData = this.state.dataTable.map((item) => {
        return {
          ...item,
          commissionAmount:
            ((this.props.commisionAmount ?? 0) * (item.percent ?? 0)) / 100,
        }
      })
      this.setState({ dataTable: newData })
    }

    if (prevProps.dataTable !== this.props.dataTable) {
      if (this.props.dataTable && this.props.dataTable?.length === 0) {
        this.fetchData()
      } else {
        this.initDataTable()
      }
    }
    if (prevState.dataTable !== this.state.dataTable) {
      this.props.onDatatableChange(this.state.dataTable)
    }
  }

  initDataTable = async () => {
    const numRow = [] as any

    await this.props.dataTable.map((item, index) => {
      numRow.push({
        ...item,
        fromYear: `Year ${index + 1}`,
      })
    })
    await this.setState({ dataTable: numRow })
  }
  fetchData = async () => {
    const numRow = [] as any
    let i = 0
    for (i; i < this.props.leaseTerm?.years; i++) {
      numRow.push({
        key: i,
        percent: 0,
        commissionAmount: 0,
        fromYear: `Year ${i + 1}`,
      })
    }
    if (this.props.leaseTerm?.months > 0 || this.props.leaseTerm?.days > 0) {
      numRow.push({
        key: i,
        percent: 0,
        commissionAmount: 0,
        fromYear: `Year ${i + 1}`,
      })
    }
    await this.setState({ dataTable: numRow })
  }

  handleAddRow = () => {
    this.formRef.current.resetFields()
    const newRow = { key: uuid() }
    const newData = [...this.state.dataTable]
    newData.unshift(newRow)

    this.setState({ dataTable: newData })
    this.setState({ editingKey: newRow.key })
  }

  saveRow = async (record?) => {
    const values = await this.formRef.current?.validateFields()
    const newData = [...this.state.dataTable]
    const index = this.state.dataTable.findIndex(
      (item) => this.state.editingKey === item.key
    )

    if (index > -1) {
      const row = newData[index]
      const newRes = {
        ...values,
        commissionAmount: (this.props.commisionAmount * values.percent) / 100,
      }
      newData.splice(index, 1, {
        ...row,
        ...newRes,
      })
      this.setState({ dataTable: newData })
    }
    this.setState({ isEdited: record?.key ?? "" })
    this.setState({ editingKey: "" })
  }
  public render() {
    const columns = [
      {
        title: L("YEAR"),
        dataIndex: "fromYear",
        key: "fromYear",
        width: "20%",
        render: (fromYear) => <h4>{fromYear}</h4>,
      },

      {
        title: L("PERCENT"),
        dataIndex: "percent",
        key: "percent",
        align: align.center,
        width: "20%",
        render: (percent) => <h4>{percent}</h4>,
        onCell: (record) =>
          buildEditableCell(
            record,
            "number",
            "percent",
            L(""),
            this.isEditing,
            null,
            [{ required: true, message: "Please input this field" }]
          ),
      },
      {
        title: L("COMMISSON_AMOUNT"),
        dataIndex: "commissionAmount",
        width: "40%",
        align: align.center,
        key: "commissionAmount",
        render: (commissionAmount) => (
          <h4>{formatCurrency(commissionAmount)}</h4>
        ),
      },
      {
        title: "",

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
                disabled={this.props.disabled || this.state.editingKey !== ""}
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
              rowKey={(record) => record?.key}
              pagination={false}
              components={{
                body: {
                  cell: EditableCell,
                },
              }}
              columns={columns}
              dataSource={this.state.dataTable ?? []}
            />
          </DataTable>
        </Form>
      </>
    )
  }
}

export default withRouter(LeaseDealer)
