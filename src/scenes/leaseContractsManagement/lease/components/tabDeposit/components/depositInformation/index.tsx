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
  Tooltip,
} from "antd"
import { inject, observer } from "mobx-react"
import { L, LNotification } from "@lib/abpUtility"
import { AppComponentListBase } from "@components/AppComponentBase"
import AppConsts, { appPermissions, appStatusColors } from "@lib/appconst"
import withRouter from "@components/Layout/Router/withRouter"
import {
  formatNumberFloat,
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
  PlusCircleFilled,
} from "@ant-design/icons"
import {
  EditableCell,
  buildEditableCell,
} from "@components/DataTable/EditableCell"
import { DolarIcon } from "@components/Icon"
import DepositNoteModal from "./depositNoteModal"
import CollecttDepositModal from "./collectDepositModal"
import DepositStore from "@stores/activity/depositStore"
import dayjs from "dayjs"

const { align } = AppConsts
export interface IProps {
  selectItem: any
  tabKey: any
  disabled: any
  depositStore: DepositStore
  leaseAgreementId: any

  dataChange: () => void
}

export interface IState {
  dataTable: any[]
  editingKey: any
  isEdited: any
  depositNoteVisible: boolean
  collectDepositVisible: boolean
}
@inject(Stores.DepositStore)
@observer
class DepositInformation extends AppComponentListBase<IProps, IState> {
  formRef: any = React.createRef()
  state = {
    dataTable: [] as any,
    editingKey: "",
    isEdited: "",
    depositNoteVisible: false,
    collectDepositVisible: false,
  }

  isEditing = (record: any) => record.id === this.state.editingKey

  async componentDidUpdate(prevProps, prevState) {
    if (prevProps.selectItem !== this.props.selectItem) {
      if (this.props.selectItem === this.props.tabKey) {
        this.setState({ editingKey: "" })
        this.initData()
      }
    }
  }
  componentDidMount(): void {
    this.setState({ editingKey: "" })
    this.initData()
  }

  initData = async () => {
    await this.props.depositStore.getAllDeposit(this.props.leaseAgreementId)

    await this.setState({
      dataTable: this.props.depositStore.tableDepositData,
    })
  }

  addRecordToTable = async () => {
    const newTable = [...this.state.dataTable]
    const newRow = { id: "new" } as any
    this.formRef.current?.resetFields()
    this.props.depositStore.initDeposit()
    await newTable.splice(newTable.length, 0, newRow)
    await this.setState({ dataTable: newTable })
    this.setState({
      editingKey: newRow.id,
    })
  }
  onEditRow = async (record) => {
    await this.props.depositStore.getDeposit(record?.id)

    await this.formRef.current?.setFieldsValue({
      ...this.props.depositStore.depositDetail,
      depositDate: dayjs(this.props.depositStore.depositDetail?.depositDate),
    })

    await this.setState({ editingKey: record?.id })
  }
  saveRow = async (data: any) => {
    const values = await this.formRef.current?.validateFields()

    const newRes = {
      ...this.props.depositStore.depositDetail,
      ...values,
      leaseAgreementId: this.props.leaseAgreementId,
      vatAmount: (values.depositAmount * values.vatPercent) / 100,
    }

    await this.props.depositStore.createOrUpdateDeposit(newRes)
    await this.initData()
    await this.props.dataChange()
    this.setState({ isEdited: data?.key ?? "" })
    this.setState({ editingKey: "" })
  }
  deleteRow = async (record) => {
    await this.props.depositStore.deleteDeposit(record?.id)
    await this.initData()
    await this.props.dataChange()
  }
  createDepositCollect = async (record) => {
    await this.props.depositStore.getDeposit(record?.id)
    await this.setState({ collectDepositVisible: true })
  }
  onCreateCollect = async () => {
    this.setState({ collectDepositVisible: false })
    await this.initData()
    await this.props.dataChange()
  }
  rowClassName = (record, index) => "editable-row"
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
        await self.props.depositStore.activateOrDeactivateDeposit(id, isActive)
        await this.initData()
        await this.props.dataChange()
      },
    })
  }
  public render() {
    const columns = [
      {
        title: L("ID"),
        dataIndex: "id",
        key: "id",
        width: 80,
        align: align.center,
        render: (id) => <>{id}</>,
      },
      {
        title: L("LA_REF_NO"),
        dataIndex: "leaseAgreement",
        key: "leaseAgreement",
        width: 220,
        ellipsis: false,

        render: (leaseAgreement: any, item: any) => (
          <Row>
            <Col sm={{ span: 21, offset: 0 }}>
              <div>
                {renderDotActive(item?.isActive)}&nbsp;
                {leaseAgreement?.referenceNumber}
              </div>
            </Col>
            {this.isGranted(appPermissions.deposit.update) && (
              <Col sm={{ span: 3, offset: 0 }}>
                <Dropdown
                  trigger={["click"]}
                  overlay={
                    <Menu>
                      {item?.collectAmount === 0 ? (
                        <Menu.Item
                          key={1}
                          onClick={() =>
                            this.activateOrDeactivate(item.id, !item.isActive)
                          }
                        >
                          {L(item.isActive ? "BTN_DEACTIVATE" : "BTN_ACTIVATE")}
                        </Menu.Item>
                      ) : (
                        <Menu.Item key={2}>
                          <span className="text-danger">
                            {L("CAN_NOT_DEACTIVE")}
                          </span>
                        </Menu.Item>
                      )}
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
      },

      {
        title: <>{L("DEPOSIT_AMOUNT_VND")}</>,
        dataIndex: "depositAmount",
        key: "depositAmount",
        width: 180,

        align: align.center,
        render: (title, item) => (
          <>
            <div>{inputCurrencyFormatter(title)}</div>
            {item.collectAmount > 0 && (
              <div className="text-small">
                ( {L("COLLECTED")}: {inputCurrencyFormatter(item.collectAmount)}
                )
              </div>
            )}
          </>
        ),

        onCell: (record) =>
          buildEditableCell(
            record,
            "number",
            "depositAmount",
            L(""),
            this.isEditing,
            null,
            [{ required: true, message: "Please input this field" }]
          ),
      },

      {
        title: L("DESCRIPTION"),
        dataIndex: "description",
        key: "description",
        width: 210,
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
            "description",
            L(""),
            this.isEditing,
            false,
            [{ required: true, message: "Please input this field" }]
          ),
      },
      {
        title: L("VAT_RATE_PERCENT"),
        dataIndex: "vatPercent",
        key: "vatPercent",
        width: 110,
        align: align.right,
        render: (vatPercent) => <>{formatNumberFloat(vatPercent) ?? 0}</>,
        onCell: (record) =>
          buildEditableCell(
            record,
            "number",
            "vatPercent",
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
        width: 140,
        align: align.right,
        render: (vatAmount) => <>{inputCurrencyFormatter(vatAmount)}</>,
      },
      {
        title: L("DEPOSIT_DATE"),
        dataIndex: "depositDate",
        key: "depositDate",
        width: 130,
        align: align.center,
        render: this.renderDate,
        onCell: (record) =>
          buildEditableCell(
            record,
            "date",
            "depositDate",
            L(""),
            this.isEditing,
            true,
            [{ required: true, message: "Please input this field" }]
          ),
      },
      {
        title: L("CREATE_BY_CREATE_DATE"),
        dataIndex: "createBy",
        key: "createBy",
        width: 170,
        align: align.center,
        render: (createBy, item) => (
          <>
            {item?.creatorUser?.displayName} <br />
            {renderDate(item?.creationTime)}
          </>
        ),
      },
      {
        title: <div>{L("ACTION")}</div>,
        dataIndex: "action",
        key: "action",
        width: 120,
        align: align.center,
        // fixed: 'right',
        render: (_: any, record, index) => {
          return this.state.editingKey === record.id ? (
            <div>
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
            </div>
          ) : (
            <div className="flex center-content">
              {this.isGranted(appPermissions.deposit.update) && (
                <Button
                  type="link"
                  onClick={() => this.createDepositCollect(record)}
                  icon={<DolarIcon />}
                  disabled={
                    this.props.disabled ||
                    this.state.editingKey !== "" ||
                    !record.isActive
                  }
                ></Button>
              )}
              {this.isGranted(appPermissions.deposit.update) && (
                <Button
                  type="link"
                  icon={<EditFilled />}
                  disabled={
                    this.props.disabled ||
                    this.state.editingKey !== "" ||
                    !record.isActive
                  }
                  onClick={async () => {
                    this.onEditRow(record)
                  }}
                />
              )}
              {this.isGranted(appPermissions.deposit.delete) && index !== 0 && (
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
            </div>
          )
        },
      },
    ]

    return (
      <>
        <Form ref={this.formRef} component={false}>
          <Row gutter={[8, 16]}>
            <Col
              sm={{ span: 24 }}
              style={{ display: "flex", flexDirection: "row-reverse" }}
            >
              <Button
                onClick={() => this.setState({ depositNoteVisible: true })}
                className="custom-buttom-drawe"
                size="middle"
              >
                {L("CREATE_DEPOSIT_NOTE")}
              </Button>
            </Col>

            <Col sm={{ span: 24 }}>
              <div className="deposit-table">
                <Table
                  size="middle"
                  rowKey={(record, index) => `${index}`}
                  pagination={false}
                  // className="table-font-size-12"
                  className="custom-ant-row"
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
                {this.isGranted(appPermissions.deposit.create) && (
                  <Button
                    onClick={this.addRecordToTable}
                    icon={<PlusCircleFilled />}
                    disabled={
                      this.props.disabled || this.state.editingKey !== ""
                    }
                    className="full-width"
                  >
                    {L("ADD_ONE_RECORD")}
                  </Button>
                )}
              </div>
            </Col>
          </Row>
        </Form>
        <DepositNoteModal
          visible={this.state.depositNoteVisible}
          onClose={() => this.setState({ depositNoteVisible: false })}
        />
        <CollecttDepositModal
          visible={this.state.collectDepositVisible}
          onClose={() => this.setState({ collectDepositVisible: false })}
          onCreate={this.onCreateCollect}
          leaseAgreementId={this.props.leaseAgreementId}
        />
      </>
    )
  }
}

export default withRouter(DepositInformation)
