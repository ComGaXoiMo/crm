import * as React from "react"

import {
  Button,
  Col,
  Form,
  Menu,
  Modal,
  Popconfirm,
  Row,
  Table,
  Tooltip,
} from "antd"
import { inject, observer } from "mobx-react"
import { L, LNotification } from "@lib/abpUtility"
import { AppComponentListBase } from "@components/AppComponentBase"
import AppConsts, { appPermissions, appStatusColors } from "@lib/appconst"
import withRouter from "@components/Layout/Router/withRouter"
import dayjs from "dayjs"
import {
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
import Dropdown from "antd/es/dropdown"
const { align } = AppConsts
export interface ILeaseDealerProps {
  selectItem: any
  tabKey: any
  disabled: any
  leaseAgreementId: any
  depositStore: DepositStore
  dataChange: () => void
}

export interface ILeaseDealerState {
  dataTable: any[]
  editingKey: any
  isEdited: any
}
@inject(Stores.DepositStore)
@observer
class DepositCollect extends AppComponentListBase<
  ILeaseDealerProps,
  ILeaseDealerState
> {
  formRef: any = React.createRef()
  state = {
    dataTable: [] as any,
    editingKey: "",
    isEdited: "",
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
    await this.props.depositStore.getAllDepositCollect(
      this.props.leaseAgreementId
    )

    await this.setState({
      dataTable: this.props.depositStore.tableCollectData,
    })
  }
  onEditRow = async (record) => {
    await this.props.depositStore.getCollect(record?.id)

    await this.formRef.current?.setFieldsValue({
      ...this.props.depositStore.collectDetail,
      receiptDate: this.props.depositStore.collectDetail?.receiptDate
        ? dayjs(this.props.depositStore.collectDetail?.receiptDate)
        : undefined,
      paymentDate: this.props.depositStore.collectDetail?.paymentDate
        ? dayjs(this.props.depositStore.collectDetail?.paymentDate)
        : undefined,
    })

    await this.setState({ editingKey: record?.id })
  }
  saveRow = async (data: any) => {
    const values = await this.formRef.current?.validateFields()

    const newRes = {
      ...this.props.depositStore.collectDetail,
      ...values,
      leaseAgreementId: this.props.leaseAgreementId,
    }

    await this.props.depositStore.createOrUpdateCollect(newRes)
    await this.initData()
    await this.props.dataChange()
    this.setState({ isEdited: data?.key ?? "" })
    this.setState({ editingKey: "" })
  }
  deleteRow = async (record) => {
    await this.props.depositStore.deleteCollect(record?.id)
    await this.initData()
    await this.props.dataChange()
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
        await self.props.depositStore.activateOrDeactivateCollect(id, isActive)
        await this.initData()
        await this.props.dataChange()
      },
    })
  }
  rowClassName = (record, index) => "editable-row"
  public render() {
    const columns = [
      {
        title: L("RECEIPT_NO"),
        dataIndex: "receiptNo",
        key: "receiptNo",
        width: 200,
        render: (receiptNo: string, item: any) => (
          <Row>
            <Col sm={{ span: 21, offset: 0 }}>
              <div>
                {renderDotActive(item?.isActive)} {receiptNo}
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
            "receiptNo",
            L(""),
            this.isEditing,
            false,
            [{ required: false, message: "Please input this field" }]
          ),
      },
      {
        title: L("RECEIPT_DATE"),
        dataIndex: "receiptDate",
        key: "receiptDate",
        width: 180,
        align: align.center,
        render: this.renderDate,
        onCell: (record) =>
          buildEditableCell(
            record,
            "date",
            "receiptDate",
            L(""),
            this.isEditing,
            true,
            [{ required: false, message: "Please input this field" }]
          ),
      },
      {
        title: L("PAYMENT_DATE"),
        dataIndex: "paymentDate",
        key: "paymentDate",
        width: 180,
        align: align.center,
        render: this.renderDate,
        onCell: (record) =>
          buildEditableCell(
            record,
            "date",
            "paymentDate",
            L(""),
            this.isEditing,
            true,
            [{ required: false, message: "Please input this field" }]
          ),
      },
      {
        title: <>{L("DEPOSIT_AMOUNT_VND")}</>,
        dataIndex: "receiptAmount",
        key: "receiptAmount",
        width: 180,

        align: align.right,
        render: (receiptAmount) => <>{inputCurrencyFormatter(receiptAmount)}</>,
        onCell: (record) =>
          buildEditableCell(
            record,
            "number",
            "receiptAmount",
            L(""),
            this.isEditing,
            null,
            [{ required: true, message: "Please input this field" }]
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
        title: L("REMARK"),
        dataIndex: "remark",
        key: "remark",
        width: 180,
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
            [{ required: false, message: "Please input this field" }]
          ),
      },

      {
        title: L("DEPOSIT_ID"),
        dataIndex: "leaseAgreementDepositId",
        key: "leaseAgreementDepositId",
        width: 90,
        align: align.right,
        render: (leaseAgreementDepositId) => <>{leaseAgreementDepositId}</>,
      },

      {
        title: <div>{L("ACTION")}</div>,
        dataIndex: "action",
        key: "action",
        width: 150,
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
      </>
    )
  }
}

export default withRouter(DepositCollect)
