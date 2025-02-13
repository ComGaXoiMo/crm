import * as React from "react"

import { Button, Form, Popconfirm, Table } from "antd"
import { inject, observer } from "mobx-react"
import DataTable from "@components/DataTable"
import { L } from "@lib/abpUtility"
import { AppComponentListBase } from "@components/AppComponentBase"
import AppConsts, { appStatusColors, dateDifference } from "@lib/appconst"
import withRouter from "@components/Layout/Router/withRouter"
import moment from "moment"
import { inputCurrencyFormatter, inputCurrencyUSAFormatter } from "@lib/helper"
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
  leaseTerm: any;
  paymentTermChoose: any;
  onDatatableChange: (value) => void;
  dataTable: any;
  disabled: any;
  datePayment: any;
  form: any;
  leaseAgreementStore: LeaseAgreementStore;
  totalOtherFee: number;
}

export interface ILeaseDealerState {
  dataTable: any[];
  editingKey: any;
  isEdited: any;
  isSlipFee: any;
  backupData: any[];
}
@inject(Stores.LeaseAgreementStore)
@observer
class PaymentRentTable extends AppComponentListBase<
  ILeaseDealerProps,
  ILeaseDealerState
> {
  formRef: any = React.createRef();
  formParent: any = this.props.form;
  state = {
    dataTable: [] as any,
    editingKey: "",
    isEdited: "",
    isSlipFee: false,
    backupData: [] as any,
  };

  isEditing = (record: any) => record.key === this.state.editingKey;

  async componentDidUpdate(prevProps, prevState) {
    if (prevProps.leaseTerm !== this.props.leaseTerm) {
      this.fetchData()
    }
    if (prevProps.totalOtherFee !== this.props.totalOtherFee) {
      this.totalOtherFeeChange()
    }
    if (prevProps.dataTable !== this.props.dataTable) {
      if (this.props.dataTable?.length > 0) {
        this.initData()
      }
    }
    if (prevProps.datePayment !== this.props.datePayment) {
      this.fetchData()
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
  initData = () => {
    this.setState({ dataTable: this.props.dataTable })
  };
  totalOtherFeeChange = async () => {
    const newTBSubtractOtherFee = [] as any
    await this.state.dataTable.map((item) => {
      newTBSubtractOtherFee.push({
        ...item,
        rentOnly: item?.amountIncludeVat - this.props.totalOtherFee,
      })
    })
    await this.setState({ dataTable: newTBSubtractOtherFee })
  };
  fetchData = async () => {
    const {
      leaseTerm,
      leaseAgreementStore: { listMainFeeType },
      datePayment,
    } = this.props
    const numRow = [] as any
    let i = 0

    if (moment(leaseTerm?.startDate).endOf("day") < moment(datePayment)) {
      const afterDateDiff = dateDifference(
        moment(leaseTerm?.startDate).endOf("days"),
        moment(moment(datePayment)).endOf("days")
      )
      listMainFeeType.map((item) => {
        numRow.push({
          key: `afterPayment`,
          startDate: moment(leaseTerm?.startDate),
          endDate: moment(datePayment)?.subtract(1, "d"),
          year: L("AFTER_PAYMENT"),
          leaseTermMonth: `${
            afterDateDiff?.years > 0 || afterDateDiff?.months > 0
              ? `${afterDateDiff?.years * 12 + afterDateDiff?.months}`
              : ""
          }`,
          leaseTermDay: `${
            afterDateDiff?.days > 0 ? `${afterDateDiff?.days}` : ""
          }`,
          feeTypeId: item.id,
          amount: 0,
          vatAmount: 0,
        })
      })
    }

    const dateBeforPayment = await dateDifference(
      moment(datePayment).endOf("days"),
      moment(leaseTerm?.endDate).endOf("days").add(1, "days")
    )
    let startDate = datePayment
    for (i = 0; i < dateBeforPayment?.years; i++) {
      const paymentDateDiff = dateDifference(
        moment(startDate).endOf("days"),
        moment(moment(startDate).endOf("days").add(1, "years"))
      )
      listMainFeeType.map((item) => {
        numRow.push({
          key: `${item.id}${i}`,
          year: `Year ${i + 1}`,
          startDate: moment(startDate),
          endDate: moment(startDate).add(1, "years")?.subtract(1, "d"),
          leaseTermMonth: `${
            paymentDateDiff?.years > 0 || paymentDateDiff?.months > 0
              ? `${paymentDateDiff?.years * 12 + paymentDateDiff?.months}`
              : ""
          }`,
          leaseTermDay: `${
            paymentDateDiff?.days > 0 ? `${paymentDateDiff?.days}` : ""
          }`,
          feeTypeId: item.id,
          amount: 0,
          vatAmount: 0,
        })
      })
      startDate = moment(startDate).add(1, "years")
    }
    if (dateBeforPayment?.months > 0 || dateBeforPayment?.days > 0) {
      listMainFeeType.map((item) => {
        numRow.push({
          key: "surplus",
          year: `Year ${i + 1} `,
          startDate: moment(startDate),
          endDate: moment(leaseTerm?.endDate),
          feeTypeId: item.id,
          leaseTermMonth: `${
            dateBeforPayment?.months > 0 ? `${dateBeforPayment?.months}` : ""
          }`,

          leaseTermDay: `${
            dateBeforPayment?.days > 0 ? `${dateBeforPayment?.days}` : ""
          }`,
          amount: 0,
          vatAmount: 0,
        })
      })
    }
    await this.setState({ dataTable: numRow })
  };

  saveRow = async (data: any) => {
    const values = await this.formRef.current?.validateFields()
    const formParent = await this.formParent.current?.validateFields()

    const newData = [...this.state.dataTable]
    const index = this.state.dataTable.findIndex(
      (item) => this.state.editingKey === item.key
    )

    if (index > -1) {
      const row = newData[index]

      const dateBeforPayment = await dateDifference(
        moment(values.startDate ?? row.startDate).endOf("days"),
        moment(row.endDate).endOf("days").add(1, "days")
      )

      const mdforRes = {
        amountIncludeVat: values.amountIncludeVat,
        feeTypeId: row.feeTypeId,
        startDate: values.startDate
          ? moment(values.startDate).toJSON()
          : moment(row.startDate).toJSON(),
        endDate: moment(row.endDate).toJSON(),
        numMonth: dateBeforPayment?.years * 12 + dateBeforPayment?.months,
        numDay: dateBeforPayment?.days,
      }
      const amountVat =
        await this.props.leaseAgreementStore.genVATAmountByFeeType([mdforRes])

      const newRes = {
        ...row,
        ...values,
        ...amountVat,
        rentNotVatUsd: Math.round(amountVat?.amount) / formParent?.rate,
      }

      console.log(Math.round(amountVat?.amount) / formParent?.rate)
      newData.splice(index, 1, { ...newRes })

      this.setState({ dataTable: newData })
    }

    this.setState({ isEdited: data?.key ?? "" })
    this.setState({ editingKey: "", isSlipFee: false })
  };

  public render() {
    const columns = [
      {
        title: L("YEAR"),
        dataIndex: "year",
        key: "year",
        width: 150,
        render: (year) => <>{year}</>,
      },
      {
        title: L("FROM"),
        dataIndex: "startDate",
        key: "startDate",
        width: 130,
        align: align.center,
        render: this.renderDate,
        onCell: (record) =>
          this.state.isSlipFee
            ? buildEditableCell(
                record,
                "date",
                "startDate",
                L(""),
                this.isEditing,
                true,
                [{ required: true, message: "Please input this field" }]
              )
            : {},
      },
      {
        title: L("TO"),
        dataIndex: "endDate",
        key: "endDate",
        width: 130,
        align: align.center,
        render: this.renderDate,
      },
      {
        title: L("LEASE_TERM"),

        children: [
          {
            title: L("MONTH"),
            dataIndex: "leaseTermMonth",
            key: "leaseTermMonth",
            width: 70,
            align: align.center,
            render: (leaseTermMonth) => <>{leaseTermMonth}</>,
          },
          {
            title: L("DATE"),
            dataIndex: "leaseTermDay",
            key: "leaseTermDay",
            width: 70,
            align: align.center,
            render: (leaseTermDay) => <>{leaseTermDay}</>,
          },
        ],
      },
      {
        title: L("RENT_AMOUNT_INCL_VAT"),
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
        title: L("RENT_ONLY_INCL_VAT"),
        dataIndex: "rentOnly",
        key: "rentOnly",
        align: align.right,
        width: 150,
        render: (rentOnly) => <>{inputCurrencyFormatter(rentOnly)}</>,
      },

      {
        title: L("RENT_EXCL_VAT"),
        dataIndex: "amount",
        key: "amount",
        width: 150,
        align: align.right,
        render: (amount) => <>{inputCurrencyFormatter(amount)}</>,
      },
      {
        title: L("RENT_EXCL_VAT_USD"),
        dataIndex: "rentNotVatUsd",
        key: "rentNotVatUsd",
        width: 150,
        align: align.right,
        render: (rentNotVatUsd) => (
          <>{inputCurrencyUSAFormatter(rentNotVatUsd)}</>
        ),
      },
      {
        title: L("TOTAL_AMOUNT"),
        dataIndex: "totalAmount",
        key: "totalAmount",
        width: 150,
        align: align.right,
        render: (totalAmount) => <>{inputCurrencyFormatter(totalAmount)}</>,
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
                      ? moment(record.depositDate)
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
              {L("RENT(DEMO)")}
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

export default withRouter(PaymentRentTable)
