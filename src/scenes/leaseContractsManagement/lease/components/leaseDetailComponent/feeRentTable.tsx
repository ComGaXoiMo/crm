import * as React from "react"

import { Button, Form, Popconfirm, Space, Table } from "antd"
import { inject, observer } from "mobx-react"
import DataTable from "@components/DataTable"
import { L } from "@lib/abpUtility"
import { AppComponentListBase } from "@components/AppComponentBase"
import AppConsts, { appStatusColors, dateDifference } from "@lib/appconst"
import withRouter from "@components/Layout/Router/withRouter"
import { v4 as uuid } from "uuid"
import dayjs from "dayjs"
import { inputCurrencyFormatter, inputCurrencyUSAFormatter } from "@lib/helper"
import LeaseAgreementStore from "@stores/communication/leaseAgreementStore"
import Stores from "@stores/storeIdentifier"
import {
  CheckCircleFilled,
  CloseCircleFilled,
  DeleteOutlined,
  EditFilled,
  PlusCircleFilled,
  WarningOutlined,
} from "@ant-design/icons"
import {
  EditableCell,
  buildEditableCell,
} from "@components/DataTable/EditableCell"
const { align } = AppConsts
export interface ILeaseDealerProps {
  leaseTerm: any
  onDatatableChange: (value) => void
  checkFullRent: (value) => void
  dataTable: any
  disabled: any
  form: any
  leaseAgreementStore: LeaseAgreementStore
  totalOtherFee: any[]
  rate: number
  isAmendment: any
}

export interface ILeaseDealerState {
  dataTable: any[]
  editingKey: any
  isEdited: any
  backupData: any[]
  listIndexFalseDate: any[]
  isNotFullDate: boolean
}
@inject(Stores.LeaseAgreementStore)
@observer
class FeeRentTable extends AppComponentListBase<
  ILeaseDealerProps,
  ILeaseDealerState
> {
  formRef: any = React.createRef()
  formParent: any = this.props.form
  state = {
    dataTable: [] as any,
    editingKey: "",
    isEdited: "",
    backupData: [] as any,
    listIndexFalseDate: [] as any,
    isNotFullDate: false,
  }

  isEditing = (record: any) => record.key === this.state.editingKey

  async componentDidUpdate(prevProps, prevState) {
    if (prevProps.leaseTerm !== this.props.leaseTerm) {
      this.fetchData()
      this.setState({ editingKey: "" })
    }
    if (prevProps.totalOtherFee !== this.props.totalOtherFee) {
      if (this.props.totalOtherFee?.length > 0) {
        this.totalOtherFeeChange()
      }
    }
    if (prevProps.rate !== this.props.rate) {
      if (this.props.rate) {
        this.rateChange()
      }
    }
    if (prevProps.dataTable !== this.props.dataTable) {
      if (this.props.dataTable?.length > 0) {
        this.initData()
      }
    }

    if (prevState.dataTable !== this.state.dataTable) {
      this.props.onDatatableChange(this.state.dataTable)
      this.hasDuplicateDates(this.state.dataTable)

      this.checkFullDate()
    }
    if (prevState.isNotFullDate !== this.state.isNotFullDate) {
      this.props.checkFullRent(!this.state.isNotFullDate)
    }
  }

  async componentDidMount() {
    if (this.props.dataTable?.length > 0) {
      this.initData()
    } else {
      this.fetchData()
    }
  }
  checkFullDate = () => {
    const firstItem = this.state.dataTable[0]
    const lastItem = this.state.dataTable[this.state.dataTable?.length - 1]
    if (
      dayjs(firstItem?.startDate).startOf("day") >
        dayjs(this.props.leaseTerm?.startDate) ||
      dayjs(lastItem?.endDate).endOf("day") <
        dayjs(this.props.leaseTerm?.endDate)
    ) {
      this.setState({ isNotFullDate: true })
    } else {
      this.setState({ isNotFullDate: false })
    }
  }
  hasDuplicateDates = async (dateList) => {
    const data = [...dateList]
    const listIndex = [] as any
    for (let i = 0; i < data.length - 1; i++) {
      if (
        dayjs(data[i].endDate).add(1, "days").endOf("day").toJSON() !==
        dayjs(data[i + 1].startDate)
          .endOf("day")
          .toJSON()
      ) {
        listIndex.push(i + 1)
      } else {
        const index = listIndex.indexOf(i + 1)
        listIndex.splice(index, 1)
      }
    }
    const uniq = [...new Set(listIndex)]
    this.setState({ listIndexFalseDate: uniq })
  }
  initData = () => {
    this.setState({ dataTable: this.props.dataTable })
  }
  totalOtherFeeChange = () => {
    const newTBSubtractOtherFee = [] as any
    this.state.dataTable.map((item) => {
      let otherFeeInclVat = 0
      let otherFeeExclVat = 0
      const thisOtherFees = this.props.totalOtherFee.filter(
        (otherFee) => otherFee?.parentId === item?.uniqueId
      )
      thisOtherFees.map((fee) => {
        ;(otherFeeInclVat += fee?.amountIncludeVat),
          (otherFeeExclVat += fee?.amount)
      })
      newTBSubtractOtherFee.push({
        ...item,
        rentOnly: item?.amountIncludeVat - otherFeeInclVat,
        rentOnlyExcludeVat: item?.amount - otherFeeExclVat,
      })
    })

    // let dataForGetVat = newTBSubtractOtherFee.map((item) => {
    //   return { feeTypeId: item?.feeTypeId };
    // });
    this.setState({ dataTable: newTBSubtractOtherFee })
  }
  rateChange = async () => {
    const newTBwithRate = [] as any
    await this.state.dataTable.map((item) => {
      newTBwithRate.push({
        ...item,
        rentNotVatUsd: item?.amount / this.props.rate,
      })
    })
    await this.setState({ dataTable: newTBwithRate })
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
    let startD = dayjs(this.props.leaseTerm?.startDate)

    if (this.state.dataTable.length > 0) {
      startD = dayjs(
        this.state.dataTable[this.state.dataTable.length - 1]?.endDate
      ).add(1, "days")
    }
    const unique = uuid()

    const newRow = {
      key: unique,
      uniqueId: unique,
      startDate: dayjs(startD).toJSON(),
    } as any

    this.formRef.current?.setFieldsValue({
      startDate: dayjs(startD),
      endDate: dayjs(this.props.leaseTerm?.endDate),
    })

    await newTable.splice(newTable.length, 0, newRow)
    await this.setState({ dataTable: newTable })
    this.setState({
      editingKey: newRow.key,
    })
  }
  saveRow = async (data: any) => {
    const values = await this.formRef.current?.validateFields()
    const formParent = await this.formParent.current?.getFieldsValue()

    const newData = [...this.state.dataTable]
    const index = this.state.dataTable.findIndex(
      (item) => this.state.editingKey === item.key
    )

    if (index > -1) {
      const row = newData[index]

      const dateBeforPayment = await dateDifference(
        dayjs(values.startDate).endOf("days"),
        dayjs(values.endDate).endOf("days").add(1, "days")
      )

      const mdforRes = {
        amountIncludeVat: values.amountIncludeVat,
        rentAmount: values.amountIncludeVat,
        feeTypeId: 1,
        startDate: values.startDate
          ? dayjs(values.startDate).toJSON()
          : dayjs(row.startDate).toJSON(),
        endDate: values.endDate
          ? dayjs(values.endDate).toJSON()
          : dayjs(row.endDate).toJSON(),
        numMonth: dateBeforPayment?.years * 12 + dateBeforPayment?.months,
        numDay: dateBeforPayment?.days,
      }
      let otherFeeInclVat = 0
      let otherFeeExclVat = 0
      if (row.id) {
        const thisOtherFees = this.props.totalOtherFee.filter(
          (otherFee) => otherFee?.parentId === row.uniqueId
        )
        thisOtherFees.map((fee) => {
          ;(otherFeeInclVat += fee?.amountIncludeVat),
            (otherFeeExclVat += fee?.amount)
        })
      }

      const amountVat =
        await this.props.leaseAgreementStore.genVATAmountByFeeType([mdforRes])
      const newRes = {
        ...row,
        feeTypeId: 1,
        ...values,
        ...amountVat,
        amount: amountVat?.amount,
        month: dateBeforPayment?.years * 12 + dateBeforPayment?.months,
        day: dateBeforPayment?.days,
        rentNotVatUsd: formParent?.rateUSD
          ? amountVat?.amount / formParent?.rateUSD
          : 0,
        rentOnly: values.amountIncludeVat - otherFeeInclVat,
        rentOnlyExcludeVat: amountVat.rentExcludeVAT - otherFeeExclVat,
      }

      await newData.splice(index, 1, { ...newRes })

      await this.setState({ dataTable: newData })
    }

    this.setState({ isEdited: data?.key ?? "" })
    this.setState({ editingKey: "" })
  }
  deleteRow = async (index) => {
    const newData = [...this.state.dataTable]
    await newData.splice(index, 1)
    await this.setState({ dataTable: newData })
  }
  rowClassName = (record, index) => {
    return this.state.listIndexFalseDate?.includes(index)
      ? "highlighted-row editable-row"
      : "editable-row"
  }
  public render() {
    const columns = [
      {
        title: L("DESCRIPTION"),
        dataIndex: "name",
        key: "name",
        width: 150,
        render: (name) => <>{name}</>,
        onCell: (record) =>
          buildEditableCell(
            record,
            "text",
            "name",
            L(""),
            this.isEditing,
            false,
            [{ required: true, message: "Please input this field" }]
          ),
      },
      {
        title: L("FROM"),
        dataIndex: "startDate",
        key: "startDate",
        width: 130,
        align: align.center,
        render: this.renderDate,
        onCell: (record) =>
          buildEditableCell(
            record,
            "date",
            "startDate",
            L(""),
            this.isEditing,
            false,
            [{ required: true, message: "Please input this field" }],
            {
              startDate: dayjs(this.props.leaseTerm?.startDate).toJSON(),
              endDate: dayjs(this.props.leaseTerm?.endDate).toJSON(),
            }
          ),
      },
      {
        title: L("TO"),
        dataIndex: "endDate",
        key: "endDate",
        width: 130,
        align: align.center,
        render: this.renderDate,
        onCell: (record) =>
          buildEditableCell(
            record,
            "date",
            "endDate",
            L(""),
            this.isEditing,
            true,
            [{ required: true, message: "Please input this field" }],
            {
              startDate: dayjs(this.props.leaseTerm?.startDate).toJSON(),
              endDate: dayjs(this.props.leaseTerm?.endDate).toJSON(),
            }
          ),
      },
      {
        title: L("LEASE_TERM"),

        children: [
          {
            title: L("MONTH_S"),
            dataIndex: "month",
            key: "month",
            width: 50,
            align: align.center,
            render: (leaseTermMonth) => <>{leaseTermMonth}</>,
          },
          {
            title: L("DAY_S"),
            dataIndex: "day",
            key: "day",
            width: 50,
            align: align.center,
            render: (leaseTermDay) => <>{leaseTermDay}</>,
          },
        ],
      },
      {
        title: (
          <>
            {L("RENT")}
            <br /> {L("INCL_VAT")}
          </>
        ),
        dataIndex: "amountIncludeVat",
        key: "amountIncludeVat",
        width: 150,

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
        title: (
          <>
            {L("RENT_ONLY_IN_MONTH")}
            <br /> {L("INCL_VAT")}
          </>
        ),
        dataIndex: "rentOnly",
        key: "rentOnly",
        align: align.right,
        width: 150,
        render: (rentOnly) => <>{inputCurrencyFormatter(rentOnly)}</>,
      },
      {
        title: L("VAT_AMOUNT"),
        dataIndex: "vatAmount",
        key: "vatAmount",
        width: 150,
        align: align.right,
        render: (totalAmount) => <>{inputCurrencyFormatter(totalAmount)}</>,
      },
      {
        title: (
          <>
            {L("RENT")}
            <br /> {L("EXCL_VAT")}
          </>
        ),
        dataIndex: "amount",
        key: "amount",
        width: 150,
        align: align.right,
        render: (amount) => <>{inputCurrencyFormatter(amount)}</>,
      },
      {
        title: (
          <>
            {L("RENT_USD")}
            <br /> {L("EXCL_VAT")}
          </>
        ),
        dataIndex: "rentNotVatUsd",
        key: "rentNotVatUsd",
        width: 150,
        align: align.right,
        render: (rentNotVatUsd) => (
          <>{inputCurrencyUSAFormatter(rentNotVatUsd)}</>
        ),
      },
      {
        title: (
          <>
            {L("TOTAL_LA_AMOUNT")}
            <br /> {L("EXCL_VAT")}
          </>
        ),
        dataIndex: "totalAmount",
        key: "totalAmount",
        width: 150,
        align: align.right,
        render: (totalAmount) => <>{inputCurrencyFormatter(totalAmount)}</>,
      },
      // {
      //   title: L("TOTAL_AMOUNT_INCL_VAT"),
      //   dataIndex: "totalAmountIncludeVat",
      //   key: "totalAmountIncludeVat",
      //   width: 150,
      //   align: align.right,
      //   render: (totalAmountIncludeVat) => (
      //     <>{inputCurrencyFormatter(totalAmountIncludeVat)}</>
      //   ),
      // },
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
                    startDate: record.startDate ? dayjs(record.startDate) : "",
                    endDate: record.endDate ? dayjs(record.endDate) : "",
                  })
                  await this.setState({
                    backupData: [...this.state.dataTable],
                  })
                  await this.setState({ editingKey: record.key })
                }}
              />
              {this.state.dataTable.length === index + 1 && (
                <Popconfirm
                  title={L("ARE_YOU_SURE_YOU_WANT_TO_DELETE")}
                  onConfirm={async () => {
                    this.deleteRow(index)
                  }}
                >
                  <Button
                    type="link"
                    icon={<DeleteOutlined />}
                    disabled={
                      this.props.disabled || this.state.editingKey !== ""
                    }
                  />
                </Popconfirm>
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
              <Space>
                <span
                  className={
                    this.props.isAmendment ? "amendment-highlight" : ""
                  }
                >
                  {L("RENT_INCL_VAT")}
                </span>

                {this.state.isNotFullDate && (
                  <span className="warning-text">
                    <WarningOutlined />
                    {L("START_OR_END_DATE_IS_NOT_EQUAL_LEASE_TERM_DATE")}
                  </span>
                )}
              </Space>
            </div>
            <Table
              size="middle"
              pagination={false}
              className="table-font-size-12"
              rowClassName={this.rowClassName}
              locale={{
                emptyText: L("NO_RECORD_HAVVE_BEEN_CREATED"),
              }}
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
            disabled={
              this.props.disabled ||
              !this.state.isNotFullDate ||
              this.state.editingKey !== ""
            }
            className="full-width"
          >
            {L("ADD_ONE_RECORD")}
          </Button>
        </Form>
      </>
    )
  }
}

export default withRouter(FeeRentTable)
