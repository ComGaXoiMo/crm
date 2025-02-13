import * as React from "react"

import { inject, observer } from "mobx-react"
import DataTable from "@components/DataTable"
import { L } from "@lib/abpUtility"
import { AppComponentListBase } from "@components/AppComponentBase"
import AppConsts from "@lib/appconst"
import withRouter from "@components/Layout/Router/withRouter"
import LeaseAgreementStore from "@stores/communication/leaseAgreementStore"
import Stores from "@stores/storeIdentifier"

import {
  inputCurrencyFormatter,
  inputPercentFormatter,
  renderDate,
  renderQuarter,
} from "@lib/helper"
import { Form, Table, Tag } from "antd"
const { align, billingStatus } = AppConsts
export interface IProps {
  leaseAgreementStore: LeaseAgreementStore
  dataTable: any[]
}

export interface IState {
  dataTable: any[]
}
@inject(Stores.LeaseAgreementStore)
@observer
class CommPhaseDealerTable extends AppComponentListBase<IProps, IState> {
  formRef: any = React.createRef()

  state = { dataTable: [] as any }
  rowClassName = (record, index) => {
    return record.isPhase ? "phase-row editable-row" : "editable-row"
  }

  componentDidMount = () => {
    this.initData()
  }
  async componentDidUpdate(prevProps) {
    if (prevProps.dataTable !== this.props.dataTable) {
      this.initData()
    }
  }

  initData = () => {
    this.setState({ dataTable: this.props.dataTable })
  }

  public render() {
    const columns = [
      {
        title: L("PHASE"),
        dataIndex: "phase",
        key: "phase",
        width: 180,
        ellipsis: false,
        render: (text: string) => <>{text}</>,
      },
      {
        title: L("BILLING_DATE"),
        dataIndex: "billingDate",
        key: "billingDate",
        width: 130,
        align: align.center,
        ellipsis: false,
        render: (text: string) => (
          <>
            {renderDate(text)}
            <br />
            {renderQuarter(text)}
          </>
        ),
      },
      {
        title: (
          <>
            {L("ACTUAL")} <br />
            {L("BILLING_DATE")}
          </>
        ),
        dataIndex: "actBillingDate",
        key: "actBillingDate",
        width: 130,
        align: align.center,
        ellipsis: false,
        render: (text: string) => (
          <>
            {renderDate(text)}
            <br />
            {renderQuarter(text)}
          </>
        ),
      },
      {
        title: L("BILLING_STATUS"),
        dataIndex: "statusId",
        key: "statusId",
        width: 150,
        align: align.center,

        ellipsis: false,
        render: (statusId) => (
          <>
            {statusId > -1 && (
              <Tag
                color={
                  statusId === 1 ? "blue" : statusId === 0 ? "red" : "default"
                }
              >
                <>{billingStatus.find((item) => item.id === statusId)?.label}</>
              </Tag>
            )}
          </>
        ),
      },

      {
        title: (
          <>
            {L("DEALER_COMMISSION")} <br />
            {L("AMOUNT_BY_PHASE")}
          </>
        ),
        dataIndex: "dealerCommissionAmountByPhase",
        key: "dealerCommissionAmountByPhase",
        width: 220,
        align: align.right,
        ellipsis: false,
        render: (text, record) => (
          <>{record.isPhase && inputCurrencyFormatter(text)}</>
        ),
      },
      {
        title: <div className="text-center">{L("DEALER")}</div>,
        dataIndex: "dealerName",
        key: "dealerName",
        width: 210,
        ellipsis: false,
        render: (text: string) => <>{text}</>,
      },
      {
        title: (
          <>
            {L("PERCENT")} <br />
            {L("FOR_EACH_DEALER")}
          </>
        ),
        dataIndex: "percent",
        key: "percent",
        width: 170,
        align: align.right,
        ellipsis: false,
        render: (text, record) => (
          <>{!record.isPhase && inputPercentFormatter(text)}</>
        ),
      },
      {
        title: (
          <>
            {L("COMMISSION_AMOUNT")} <br />
            {L("FOR_EACH_DEALER")}
          </>
        ),
        dataIndex: "commissionAmount",
        key: "commissionAmount",
        width: 200,
        align: align.right,
        ellipsis: false,
        render: (text, record) => (
          <>{!record.isPhase && inputCurrencyFormatter(text)}</>
        ),
      },
    ]
    const {
      leaseAgreementStore: { isLoading },
    } = this.props
    return (
      <>
        <Form ref={this.formRef} component={false}>
          <DataTable title={this.L("LEASE_DEPOSIT")}>
            <Table
              size="middle"
              className="comm-table"
              rowKey={(record, index) => `dp-${index}`}
              pagination={false}
              loading={isLoading}
              rowClassName={this.rowClassName}
              columns={columns}
              dataSource={this.props.dataTable ?? []}
            />
          </DataTable>
        </Form>
      </>
    )
  }
}

export default withRouter(CommPhaseDealerTable)
