import * as React from "react"

import {
  Button,
  Col,
  Dropdown,
  Form,
  Menu,
  Modal,
  Popconfirm,
  Row,
  Table,
  Tag,
  Tooltip,
} from "antd"
import { inject, observer } from "mobx-react"
import { L, LNotification } from "@lib/abpUtility"
import { AppComponentListBase } from "@components/AppComponentBase"
import AppConsts, { appPermissions, appStatusColors } from "@lib/appconst"
import withRouter from "@components/Layout/Router/withRouter"
import moment from "moment"
import {
  formatNumber,
  inputCurrencyFormatter,
  renderDate,
  renderDotActive,
} from "@lib/helper"
import Stores from "@stores/storeIdentifier"
import {
  CheckCircleFilled,
  CloseCircleFilled,
  DeleteOutlined,
  EditFilled,
  MoreOutlined,
} from "@ant-design/icons"
import {
  EditableCell,
  buildEditableCell,
} from "@components/DataTable/EditableCell"
import DepositStore from "@stores/activity/depositStore"
import CreateRefundModal from "./createRefundModal"
import AppDataStore from "@stores/appDataStore"
const { align } = AppConsts
export interface ILeaseDealerProps {
  selectItem: any
  tabKey: any
  disabled: any
  depositStore: DepositStore
  appDataStore: AppDataStore
  leaseAgreementId: any
  dataChange: () => void
}

export interface ILeaseDealerState {
  dataTable: any[]
  editingKey: any
  isEdited: any
  createRefundVisible: boolean
  maxRefundInput: number
}
@inject(Stores.DepositStore, Stores.AppDataStore)
@observer
class DepositRefund extends AppComponentListBase<
  ILeaseDealerProps,
  ILeaseDealerState
> {
  formRef: any = React.createRef()
  state = {
    dataTable: [] as any,
    editingKey: "",
    isEdited: "",
    createRefundVisible: false,
    maxRefundInput: 0,
  }
  isEditing = (record: any) => record.id === this.state.editingKey

  async componentDidUpdate(prevProps, prevState) {
    if (prevProps.selectItem !== this.props.selectItem) {
      if (this.props.selectItem === this.props.tabKey) {
        this.initData()
      }
    }
  }
  componentDidMount(): void {
    this.setState({ editingKey: "" })
    this.initData()
  }
  initData = async () => {
    this.setState({ editingKey: "" })
    await this.props.depositStore.getAllDepositRefund(
      this.props.leaseAgreementId
    )

    await this.setState({
      dataTable: this.props.depositStore.tableRefundData,
    })
  }
  onEditRow = async (record) => {
    const { dashboardDeposit } = this.props.depositStore
    await this.props.depositStore.getRefund(record.id)

    await this.formRef.current?.setFieldsValue({
      ...this.props.depositStore.refundDetail,
      voucherDate: this.props.depositStore.refundDetail?.voucherDate
        ? moment(this.props.depositStore.refundDetail?.voucherDate)
        : undefined,
      leaseAgreementDepositRefundTypeMap:
        this.props.depositStore.refundDetail?.leaseAgreementDepositRefundTypeMap?.map(
          (item) => {
            return item?.leaseAgreementDepositRefundTypeId
          }
        ),
    })
    const totalInput =
      dashboardDeposit?.totalCollected -
      (dashboardDeposit?.totalRefund -
        this.props.depositStore.refundDetail?.refundAmount)

    await this.setState({ maxRefundInput: totalInput })

    await this.setState({ editingKey: record.id })
  }

  saveRow = async (data: any) => {
    const values = await this.formRef.current?.validateFields()

    const newRes = {
      ...this.props.depositStore.refundDetail,
      ...values,
      leaseAgreementId: this.props.leaseAgreementId,
      refundTypeIds: values?.leaseAgreementDepositRefundTypeMap,
    }

    await this.props.depositStore.createOrUpdateRefund(newRes)
    await this.initData()
    await this.props.dataChange()

    this.setState({ isEdited: data?.key ?? "" })
    this.setState({ editingKey: "" })
  }
  deleteRow = async (record) => {
    await this.props.depositStore.deleteRefund(record?.id)
    await this.initData()
    await this.props.dataChange()
  }

  onCreateRefund = () => {
    this.setState({ createRefundVisible: false })
    this.initData()
    this.props.dataChange()
  }
  activateOrDeactivate = async (id: number, isActive) => {
    const self = this
    Modal.confirm({
      title: LNotification(
        isActive
          ? "DO_YOU_WANT_TO_ACTIVATE_THIS_ITEM"
          : "DO_YOU_WANT_TO_DEACTIVATE_THIS_ITEM"
      ),
      okText: L("BTN_YES"),
      cancelText: L("BTN_NO"),
      onOk: async () => {
        await self.props.depositStore.activateOrDeactivateRefund(id, isActive)
        await this.initData()
        await this.props.dataChange()
      },
    })
  }
  rowClassName = (record, index) => "editable-row"
  public render() {
    const {
      appDataStore: { depositRefundTypes },
    } = this.props
    const { maxRefundInput } = this.state

    const columns = [
      {
        title: L("VOUCHER_NO"),
        dataIndex: "voucherNo",
        key: "voucherNo",
        width: 200,
        render: (voucherNo: string, item: any) => (
          <Row>
            <Col sm={{ span: 21, offset: 0 }}>
              <div>
                {renderDotActive(item?.isActive)} {voucherNo}
              </div>
            </Col>
            {this.isGranted(appPermissions.deposit.update) && (
              <Col sm={{ span: 3, offset: 0 }}>
                <Dropdown
                  trigger={["click"]}
                  overlay={
                    <Menu>
                      <Menu.Item
                        key={1}
                        onClick={() =>
                          this.activateOrDeactivate(item.id, !item.isActive)
                        }
                      >
                        {L(item.isActive ? "BTN_DEACTIVATE" : "BTN_ACTIVATE")}
                      </Menu.Item>
                    </Menu>
                  }
                  placement="bottomLeft"
                >
                  <button className="button-action-hiden-table-cell">
                    <MoreOutlined />
                  </button>
                </Dropdown>
              </Col>
            )}
          </Row>
        ),
        onCell: (record) =>
          buildEditableCell(
            record,
            "text",
            "voucherNo",
            L(""),
            this.isEditing,
            false,
            [{ required: false }]
          ),
      },
      {
        title: L("VOUCHER_DATE"),
        dataIndex: "voucherDate",
        key: "voucherDate",
        width: 200,
        align: align.center,
        render: this.renderDate,
        onCell: (record) =>
          buildEditableCell(
            record,
            "date",
            "voucherDate",
            L(""),
            this.isEditing,
            true,
            [{ required: false }]
          ),
      },

      {
        title: <>{L("REFUND_AMOUNT_VND")}</>,
        dataIndex: "refundAmount",
        key: "refundAmount",
        width: 180,

        align: align.right,
        render: (title) => <>{inputCurrencyFormatter(title)}</>,
        onCell: (record) =>
          buildEditableCell(
            record,
            "number",
            "refundAmount",
            L(""),
            this.isEditing,
            null,
            [
              {
                required: true,
              },
              {
                validator: (rule, value) => {
                  if (value <= maxRefundInput) {
                    return Promise.resolve()
                  }
                  return Promise.reject(
                    `${L("MAX_REFUND_IS")} ${formatNumber(maxRefundInput)}`
                  )
                },
              },
            ]
          ),
      },
      {
        title: L("CREATE_BY_CREATE_DATE"),
        dataIndex: "createBy",
        key: "createBy",
        width: 180,
        align: align.center,
        render: (createBy, item) => (
          <>
            {item?.creatorUser?.displayName} <br />
            {renderDate(item?.creationTime)}
          </>
        ),
      },
      {
        title: L("REFUND_DESCRIPTION"),
        dataIndex: "leaseAgreementDepositRefundTypeMap",
        key: "leaseAgreementDepositRefundTypeMap",
        width: 180,
        align: align.left,
        render: (items) => (
          <>
            {items.map((item, index) => (
              <Tag key={index} color="purple">
                <>{item.leaseAgreementDepositRefundType?.name}</>
              </Tag>
            ))}
          </>
        ),
        onCell: (record) =>
          buildEditableCell(
            record,
            "selectMulti",
            "leaseAgreementDepositRefundTypeMap",
            L(""),
            this.isEditing,
            depositRefundTypes,
            [{ required: true, message: "Please input this field" }]
          ),
      },
      {
        title: L("REMARK"),
        dataIndex: "remark",
        key: "remark",
        width: 200,
        ellipsis: true,
        render: (description) => (
          <>
            <Tooltip placement="topLeft" title={description}>
              {description}
            </Tooltip>
          </>
        ),
        onCell: (record) =>
          buildEditableCell(
            record,
            "text",
            "remark",
            L(""),
            this.isEditing,
            false,
            [{ required: false }]
          ),
      },

      {
        title: <div>{L("ACTION")}</div>,
        dataIndex: "action",
        key: "action",
        width: 180,
        align: align.center,
        // fixed: 'right',
        render: (_: any, record, index) => {
          return this.state.editingKey === record.id ? (
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
                  })
                  this.initData()
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
              {this.isGranted(appPermissions.deposit.update) && (
                <Button
                  type="link"
                  icon={<EditFilled />}
                  disabled={this.props.disabled || this.state.editingKey !== ""}
                  onClick={async () => {
                    this.onEditRow(record)
                  }}
                />
              )}
              {this.isGranted(appPermissions.deposit.delete) && (
                <Popconfirm
                  title={L("ARE_YOU_SURE_YOU_WANT_TO_DELETE")}
                  onConfirm={async () => {
                    this.deleteRow(record)
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
          <Row gutter={[8, 16]}>
            {this.isGranted(appPermissions.deposit.create) && (
              <Col
                sm={{ span: 24 }}
                style={{ display: "flex", flexDirection: "row-reverse" }}
              >
                <Button
                  onClick={() => this.setState({ createRefundVisible: true })}
                  className="custom-buttom-drawe "
                  size="middle"
                >
                  {L("CREATE_REFUND")}
                </Button>
              </Col>
            )}
            <Col sm={{ span: 24 }}>
              <div className="deposit-table">
                <Table
                  size="middle"
                  pagination={false}
                  // className="table-font-size-12"
                  className="custom-ant-row"
                  rowClassName={this.rowClassName}
                  components={{
                    body: {
                      cell: EditableCell,
                    },
                  }}
                  columns={columns}
                  dataSource={this.state.dataTable ?? []}
                />
              </div>
            </Col>
          </Row>
        </Form>
        <CreateRefundModal
          visible={this.state.createRefundVisible}
          onClose={() => this.setState({ createRefundVisible: false })}
          onCreate={this.onCreateRefund}
          leaseAgreementId={this.props.leaseAgreementId}
        />
      </>
    )
  }
}

export default withRouter(DepositRefund)
