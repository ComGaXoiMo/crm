import * as React from "react"

import { Button, Form, Popconfirm, Table, message } from "antd"
import { inject, observer } from "mobx-react"
import DataTable from "@components/DataTable"
import { L } from "@lib/abpUtility"
import { AppComponentListBase } from "@components/AppComponentBase"
import AppConsts, { appStatusColors, dateDifference } from "@lib/appconst"
import withRouter from "@components/Layout/Router/withRouter"
import { v4 as uuid } from "uuid"
import moment from "moment"
import { formatNumber, inputCurrencyFormatter } from "@lib/helper"
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
  leaseTerm: any
  paymentTermChoose: any
  onDatatableChange: (value) => void
  dataTable: any
  disabled: any
  form: any
  dataTableRent: any
  isAmendment: any

  leaseAgreementStore: LeaseAgreementStore
}

export interface ILeaseDealerState {
  dataTable: any[]
  editingKey: any
  isEdited: any
  backupData: any[]
}
@inject(Stores.LeaseAgreementStore)
@observer
class DiscountFeeTable extends AppComponentListBase<
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
  }

  isEditing = (record: any) => record.key === this.state.editingKey

  async componentDidUpdate(prevProps, prevState) {
    if (prevProps.leaseTerm !== this.props.leaseTerm) {
      this.fetchData()
      this.setState({ editingKey: "" })
    }
    if (prevProps.dataTableRent !== this.props.dataTableRent) {
      // this.fetchData();
    }
    if (prevProps.dataTable !== this.props.dataTable) {
      if (this.props.dataTable?.length > 0) {
        this.initData()
      } else {
        this.fetchData()
      }
    }

    if (prevState.dataTable !== this.state.dataTable) {
      this.props.onDatatableChange(this.state.dataTable)
    }
  }

  async componentDidMount() {
    if (this.props.dataTable?.length > 0) {
      this.initData()
    } else {
      this.fetchData()
    }
  }

  initData = async () => {
    await this.setState({ dataTable: [...this.props.dataTable] })
  }

  fetchData = async () => {
    this.setState({ dataTable: [] })
  }

  addRecordToTable = async () => {
    await this.setState({
      backupData: [...this.state.dataTable],
    })
    const newTable = [...this.state.dataTable]
    const newRow = { key: uuid() } as any
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
    const DataWithNotItemChoose = [...newData]
    DataWithNotItemChoose.splice(index, 1)
    if (index > -1) {
      const row = newData[index]

      const dateBeforPayment = await dateDifference(
        moment(values.startDate).endOf("days"),
        moment(values.endDate).endOf("days").add(1, "days")
      )
      const rentInTime = this.props.dataTableRent.find(
        (item) =>
          moment(item?.startDate).startOf("days") <= moment(values.startDate) &&
          moment(item?.endDate).endOf("days") >= moment(values.endDate)
      )
      const rentIsDuplicate = DataWithNotItemChoose.find(
        (item) =>
          moment(values.startDate).isBetween(
            moment(item?.startDate).startOf("day"),
            moment(item?.endDate).endOf("day"),
            null,
            "[]"
          ) ||
          moment(values.endDate).isBetween(
            moment(item?.startDate).startOf("day"),
            moment(item?.endDate).endOf("day"),
            null,
            "[]"
          )
      )
      if (rentIsDuplicate) {
        message.error(L("THIS_RECORD_IS_DUPLICATE_DATE"))
      } else if (!rentInTime) {
        message.error(L("IT_NOT_RENT_FOR_THIS_RANGE_DATE"))
      } else {
        let amountVat: any = {
          rentIncludeVat: rentInTime?.rentOnly ?? 0,
          rentExcludeVat: rentInTime?.rentOnlyExcludeVat ?? 0,
          feeTypeId: 5,
        }
        if (values?.discountIncludeVatPerMonth) {
          amountVat = {
            ...amountVat,
            discountPercent:
              (values?.discountIncludeVatPerMonth / amountVat?.rentIncludeVat) *
              100,
            rentBeforeDiscount:
              amountVat?.rentIncludeVat - values?.discountIncludeVatPerMonth,
            discountExcludeVatPerMonth:
              amountVat.rentExcludeVat *
              (values?.discountIncludeVatPerMonth / amountVat?.rentIncludeVat),
          }
        } else {
          amountVat = {
            ...amountVat,
            discountIncludeVatPerMonth:
              (amountVat?.rentIncludeVat * values?.discountPercent) / 100,
            rentBeforeDiscount:
              amountVat?.rentIncludeVat -
              (amountVat?.rentIncludeVat * values?.discountPercent) / 100,
            discountExcludeVatPerMonth:
              (amountVat?.rentExcludeVat * values?.discountPercent) / 100,
          }
        }
        const newRes = {
          ...row,
          ...values,
          ...amountVat,
          month: dateBeforPayment?.years * 12 + dateBeforPayment?.months,
          day: dateBeforPayment?.days,
        }

        //to get LA amont after discount
        await newData.splice(index, 1, {
          ...newRes,
        })

        const dataWithAmount = [] as any
        for (const [indx, element] of newData.entries()) {
          const laAmountInclVat =
            dataWithAmount[indx - 1]?.contractRentAfterDiscountIncludeVat ??
            this.formParent.current?.getFieldValue("contractAmountIncludeVat")
          const laAmountExclVat =
            dataWithAmount[indx - 1]?.contractRentAfterDiscountExcludeVat ??
            this.formParent.current?.getFieldValue("contractAmount")
          const amount = await this.getAmount(
            element,
            laAmountInclVat,
            laAmountExclVat
          )
          dataWithAmount.push({
            ...element,
            contractRentAfterDiscountExcludeVat:
              amount?.laDiscountAmountExcludeVat,
            contractRentAfterDiscountIncludeVat:
              amount?.laDiscountAmountIncludeVat,
            discountAmountIncludeVat: amount?.discountAmountIncludeVat,
            discountAmountExcludeVat: amount?.discountAmountExcludeVat,
          })
        }
        const newDtTable = await [...dataWithAmount]
        await this.setState({ dataTable: [...newDtTable] })

        // this.setState({ dataTable: newData })

        this.setState({ isEdited: data?.key ?? "" })
        this.setState({ editingKey: "" })
      }
    }
  }

  deleteRow = async (index) => {
    const newData = [...this.state.dataTable]
    const dataWithAmount = [] as any
    await newData.splice(index, 1)

    for (const [indx, element] of newData.entries()) {
      const laAmountInclVat =
        dataWithAmount[indx - 1]?.contractRentAfterDiscountIncludeVat ??
        this.formParent.current?.getFieldValue("contractAmountIncludeVat")
      const laAmountExclVat =
        dataWithAmount[indx - 1]?.contractRentAfterDiscountExcludeVat ??
        this.formParent.current?.getFieldValue("contractAmount")
      const amount = await this.getAmount(
        element,
        laAmountInclVat,
        laAmountExclVat
      )

      dataWithAmount.push({
        ...element,
        contractRentAfterDiscountExcludeVat: amount?.laDiscountAmountExcludeVat,
        contractRentAfterDiscountIncludeVat: amount?.laDiscountAmountIncludeVat,
        discountAmountIncludeVat: amount?.discountAmountIncludeVat,
        discountAmountExcludeVat: amount?.discountAmountExcludeVat,
      })
    }
    const newDtTable = await [...dataWithAmount]
    await this.setState({ dataTable: [...newDtTable] })
  }
  rowClassName = (record, index) => {
    return "editable-row"
  }
  getAmount = (data, laAmountInclVat, laAmountExclVat) => {
    const dataToGetAmountAfterDiscount = {
      startDate: moment(data?.startDate).toJSON(),
      endDate: moment(data?.endDate).toJSON(),
      lAAmountDiscountIncludeVAT: laAmountInclVat,
      lAAmountDiscountExcludeVat: laAmountExclVat,
      discountIncludeVatPerMonth: data?.discountIncludeVatPerMonth,
      discountExcludeVatPerMonth: data?.discountExcludeVatPerMonth,
    }
    const amountAfterDiscount =
      this.props.leaseAgreementStore.getLAAmountAfterDiscount(
        dataToGetAmountAfterDiscount
      )
    return amountAfterDiscount
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
        width: 110,
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
              startDate: moment(this.props.leaseTerm?.startDate).toJSON(),
              endDate: moment(this.props.leaseTerm?.endDate)
                .add(1, "days")
                .toJSON(),
            }
          ),
      },
      {
        title: L("TO"),
        dataIndex: "endDate",
        key: "endDate",
        width: 110,
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
              startDate: moment(this.props.leaseTerm?.startDate).toJSON(),
              endDate: moment(this.props.leaseTerm?.endDate).toJSON(),
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
            width: 70,
            align: align.center,
            render: (leaseTermMonth) => <>{leaseTermMonth}</>,
          },
          {
            title: L("DAY_S"),
            dataIndex: "day",
            key: "day",
            width: 70,
            align: align.center,
            render: (leaseTermDay) => <>{leaseTermDay}</>,
          },
        ],
      },
      {
        title: L("PECENT_DISCOUNT"),
        dataIndex: "discountPercent",
        key: "discountPercent",
        width: 80,
        align: align.right,

        render: (title) => <>{formatNumber(title)}</>,
        onCell: (record) =>
          buildEditableCell(
            record,
            "number",
            "discountPercent",
            L(""),
            this.isEditing,
            null
            // [{ required: true, message: "Please input this field" }]
          ),
      },
      {
        title: (
          <>
            {L("RENT_ONLY_IN_MONTH")}
            <br /> {L("INCL_VAT")}
          </>
        ),

        dataIndex: "rentIncludeVat",
        key: "rentIncludeVat",
        width: 150,

        align: align.right,
        render: (title) => <>{inputCurrencyFormatter(title)}</>,
      },

      {
        title: (
          <>
            {L("DISCOUNT_IN_MONTH")}
            <br /> {L("INCL_VAT")}
          </>
        ),
        dataIndex: "discountIncludeVatPerMonth",
        key: "discountIncludeVatPerMonth",
        width: 150,
        align: align.right,
        render: (amount) => <>{inputCurrencyFormatter(amount)}</>,
        onCell: (record) =>
          buildEditableCell(
            record,
            "number",
            "discountIncludeVatPerMonth",
            L(""),
            this.isEditing,
            null
            //   [{ required: true, message: "Please input this field" }]
          ),
      },
      // {
      //   title: (
      //     <>
      //       {L("RENT_AFTER_DISCOUNT_IN_MONTH")}
      //       <br /> {L("INCL_VAT")}
      //     </>
      //   ),
      //   dataIndex: "rentBeforeDiscount",
      //   key: "rentBeforeDiscount",
      //   width: 150,
      //   align: align.right,
      //   render: (rentNotVatUsd) => <>{inputCurrencyFormatter(rentNotVatUsd)}</>,
      // },
      {
        title: (
          <>
            {L("TOTAL_DISCOUNT")}
            <br /> {L("INCL_VAT")}
          </>
        ),
        dataIndex: "discountAmountIncludeVat",
        key: "discountAmountIncludeVat",
        align: align.right,
        width: 0,
        render: (discountAmountIncludeVat) => (
          <>{inputCurrencyFormatter(discountAmountIncludeVat)}</>
          // <></>
        ),
      },
      // {
      //   title: L(""),
      //   dataIndex: "contractRentAfterDiscountIncludeVat",
      //   key: "contractRentAfterDiscountIncludeVat",
      //   width: 0,
      //   // align: align.right,
      //   render: (contractRentAfterDiscountIncludeVat) => (
      //     <>{inputCurrencyFormatter(contractRentAfterDiscountIncludeVat)}</>
      //     // <></>
      //   ),
      // },
      {
        title: <div className="mb-3">{L("ACTION")}</div>,
        dataIndex: "action",
        key: "action",
        width: 80,
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
                    startDate: record.startDate ? moment(record.startDate) : "",
                    endDate: record.endDate ? moment(record.endDate) : "",
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
                {L("DISCOUNT")}
              </span>
            </div>
            <Table
              size="middle"
              //   rowKey={(record) => record.key}
              className="table-font-size-12"
              pagination={false}
              // rowClassName={() => "editable-row"}
              rowClassName={this.rowClassName}
              locale={{
                emptyText: L("NO_RECORD_HAVE_BEEN_CREATED"),
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

export default withRouter(DiscountFeeTable)
