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
}

export interface ILeaseDealerState {
  dataTable: any[]
  editingKey: any
  isEdited: any
  backupData: any[]
}
@inject(Stores.LeaseAgreementStore)
@observer
class OtherFeesTable extends AppComponentListBase<
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
      this.initData()
      this.setState({ editingKey: "" })
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
          amountIncludeVat: item.amountIncludeVat,
        })
      })
    }
    this.setState({
      dataTable: numRow,
    })
  }
  initData = () => {
    const numRow = [] as any

    this.props.leaseAgreementStore.listOtherFeeType.map((item) => {
      numRow.push({
        key: uuid(),
        feeTypeId: item.id,
        typeId: item.typeId,
        startDate: this.props.otherFeeDate.startDate,
        endDate: this.props.otherFeeDate.endDate,
        amount: 0,
        vatAmount: 0,
        amountIncludeVat: 0,
      })
    })

    this.setState({
      dataTable: numRow,
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
        amountIncludeVat: values.amountIncludeVat,
        feeTypeId: row.feeTypeId,
        startDate: dayjs(row.startDate).toJSON(),
        endDate: dayjs(row.endDate).toJSON(),
      }
      const res = await this.props.leaseAgreementStore.genVATAmountByFeeType([
        mdforRes,
      ])
      const newRes = {
        ...row,
        ...values,
        name: "other fee",
        vatAmount: res?.vatAmount,
        amount: res?.amount,
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
      },
      {
        title: L("DESCRIPTION"),
        dataIndex: "description",
        key: "description",
        width: 350,
        render: (name) => <>{name}</>,
        onCell: (record) =>
          buildEditableCell(
            record,
            "text",
            "description",
            L(""),
            this.isEditing,
            false
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
        </Form>
      </>
    )
  }
}

export default withRouter(OtherFeesTable)
