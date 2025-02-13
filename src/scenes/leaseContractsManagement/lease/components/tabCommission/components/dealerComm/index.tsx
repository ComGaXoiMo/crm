import * as React from "react"

import { Button, Form, Popconfirm, Table } from "antd"
import { inject, observer } from "mobx-react"
import { L } from "@lib/abpUtility"
import { AppComponentListBase } from "@components/AppComponentBase"
import { v4 as uuid } from "uuid"
import AppConsts, { appPermissions, appStatusColors } from "@lib/appconst"
import withRouter from "@components/Layout/Router/withRouter"
import dayjs from "dayjs"
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
import UserStore from "@stores/administrator/userStore"
import _, { debounce } from "lodash"
import { inputPercentFormatter, isNumber } from "@lib/helper"
const { align } = AppConsts
export interface IProps {
  leaseAgreementStore: LeaseAgreementStore
  userStore: UserStore
  thisTabKey: any
  parentTabKeyChoose: any
  dataTable: any
  leaseAgreementId: any
  dealerCommissionAmount: number
  listMainDealer: any[]
  onDatatableChange: (value) => void
}

export interface IState {
  dataTable: any[]
  editingKey: any
  isEdited: any
  backupData: any[]
  listUser: any[]
  totalPercent: number
}
@inject(Stores.LeaseAgreementStore, Stores.UserStore)
@observer
class dealerCommTable extends AppComponentListBase<IProps, IState> {
  formRef: any = React.createRef()

  state = {
    dataTable: [] as any,
    editingKey: "",
    isEdited: "",
    backupData: [] as any,
    totalPercent: 0,
    listUser: [] as any,
  }

  isEditing = (record: any) => record.key === this.state.editingKey

  componentDidMount = () => {
    if (this.props.dataTable.length > 0) {
      this.setState({ dataTable: this.props.dataTable })
    } else {
      this.initData()
    }
    this.getStaff("")
  }
  async componentDidUpdate(prevProps, prevState) {
    if (prevState.dataTable !== this.state.dataTable) {
      this.props.onDatatableChange(this.state.dataTable)

      let sumPercent = 0

      this.state.dataTable.map((item) => {
        sumPercent = sumPercent + item?.percent
      })
      this.setState({ totalPercent: sumPercent })
    }
    if (prevProps.dataTable !== this.props.dataTable) {
      if (this.props.dataTable.length > 0) {
        this.setState({ dataTable: this.props.dataTable })
      } else {
        this.initData()
      }
    }
  }
  getStaff = async (keyword) => {
    await this.props.userStore.getAll({
      maxResultCount: 10,
      skipCount: 0,
      keyword: keyword,
    })
    const lsitUser = [...this.props.userStore.users.items]
    const newListUser = [] as any
    lsitUser.map((i) => {
      const finddata = this.state.dataTable.find(
        (dealer) => dealer.userId === i.id
      )
      if (finddata === undefined) {
        newListUser.push({ id: i.id, label: i.name })
      }
    })
    this.setState({ listUser: newListUser })
  }
  onSearchDealer = debounce((value) => {
    this.getStaff(value)
  }, 500)

  initData = () => {
    const {
      leaseAgreementStore: { leaseAgreementDetail },
    } = this.props
    const dataTable = [
      {
        key: uuid(),
        userId: leaseAgreementDetail.leaseAgreementUserIncharge.find(
          (item) => item.positionId === 0
        )?.userId,
        dealerName: leaseAgreementDetail.leaseAgreementUserIncharge.find(
          (item) => item.positionId === 0
        )?.user.displayName,
        percent: 100,
        commissionAmount: this.props.dealerCommissionAmount,
        leaseAgreementId: this.props.leaseAgreementId,
      },
    ]
    this.setState({ dataTable })
  }

  addRecordToTable = async () => {
    await this.setState({
      backupData: [...this.state.dataTable],
    })
    const newTable = [...this.state.dataTable]
    const newRow = {
      key: uuid(),
      leaseAgreementId: this.props.leaseAgreementId,
    } as any
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

    if (index === 0) {
      const row = newData[index]

      if (row?.userId && !isNumber(values?.dealerName)) {
        const userId = this.props.listMainDealer.find(
          (item) => item.label === values.dealerName
        )?.id
        newData.splice(index, 1, {
          ...row,
          userId: userId,
          dealerName: values.dealerName,
          percent: values.percent,
          commissionAmount:
            (this.props.dealerCommissionAmount * values.percent) / 100,
        })
      } else {
        const dealerName = this.props.listMainDealer.find(
          (item) => item.id === values.dealerName
        )?.label
        newData.splice(index, 1, {
          ...row,
          userId: values.dealerName,
          dealerName: dealerName,
          percent: values.percent,
          commissionAmount:
            (this.props.dealerCommissionAmount * values.percent) / 100,
        })
      }

      this.setState({ dataTable: newData })
    }
    if (index > 0) {
      const row = newData[index]

      if (row?.userId && !isNumber(values?.dealerName)) {
        newData.splice(index, 1, {
          ...row,
          percent: values.percent,
          commissionAmount:
            (this.props.dealerCommissionAmount * values.percent) / 100,
        })
      } else {
        const userId = values.dealerName
        const dealerName = this.state.listUser.find(
          (item) => item.id === values.dealerName
        )?.label
        newData.splice(index, 1, {
          ...row,
          userId: userId,
          dealerName: dealerName,
          percent: values.percent,
          commissionAmount:
            (this.props.dealerCommissionAmount * values.percent) / 100,
        })
      }

      // const dealerArr = values.dealerName.split("#$");

      this.setState({ dataTable: newData })

      const listUser = _.remove([...this.state.listUser], function (n) {
        return n.id !== values.dealerName
      })
      this.setState({ listUser })
    }

    this.setState({ isEdited: data?.key ?? "" })
    this.setState({ editingKey: "" })
  }

  deleteRow = async (index) => {
    const newData = [...this.state.dataTable]
    await newData.splice(index, 1)
    await this.setState({ dataTable: [...newData] })
  }

  public render() {
    const editPermission = this.isGranted(
      appPermissions.leaseAgreement.editCommission
    )
    const columns = [
      {
        title: L("DEALER"),
        dataIndex: "dealerName",
        key: "dealerName",
        width: 200,
        ellipsis: false,
        render: (text: string) => <>{text}</>,
        onCell: (record, index) =>
          buildEditableCell(
            record,
            "select2",
            "dealerName",
            L(""),
            this.isEditing,
            index === 0 ? this.props.listMainDealer : this.state.listUser,
            [{ required: true, message: "Please input this field" }],
            [],
            null,
            index === 0 ? undefined : this.onSearchDealer
          ),
      },
      {
        title: L("PERCENT_FOR_EACH_PHASE"),
        dataIndex: "percent",
        key: "percent",
        width: 150,
        align: align.right,
        ellipsis: false,
        render: (text) => (
          <div className={this.state.totalPercent !== 100 ? "text-error" : ""}>
            {inputPercentFormatter(text)}
          </div>
        ),
        onCell: (record) =>
          buildEditableCell(
            record,
            "number",
            "percent",
            L(""),
            this.isEditing,
            false,
            [{ required: true, message: "Please input this field" }]
          ),
      },
      editPermission
        ? {
            title: L("ACTION"),
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
                    disabled={this.state.editingKey !== ""}
                    onClick={async () => {
                      await this.formRef.current?.setFieldsValue({
                        ...record,
                        depositDate: record.depositDate
                          ? dayjs(record.depositDate)
                          : "",
                        // dealerName: record.dealerName
                        //   ? `${record.userId}#$${record.dealerName}`
                        //   : "",
                      })
                      await this.setState({
                        backupData: [...this.state.dataTable],
                      })
                      await this.setState({ editingKey: record.key })
                    }}
                  />
                  {index !== 0 && (
                    <Popconfirm
                      title={L("ARE_YOU_SURE_YOU_WANT_TO_DELETE")}
                      onConfirm={async () => {
                        this.deleteRow(index)
                      }}
                    >
                      <Button
                        type="link"
                        icon={<DeleteOutlined />}
                        disabled={this.state.editingKey !== ""}
                      />
                    </Popconfirm>
                  )}
                </>
              )
            },
          }
        : { title: L(""), dataIndex: "action", key: "action", width: 1 },
    ]

    const {
      leaseAgreementStore: { isLoading },
    } = this.props

    return (
      <>
        <Form ref={this.formRef} component={false}>
          <div className="comm-table ">
            <Table
              size="middle"
              className="custom-ant-row "
              rowKey={(record, index) => `dc-${index}`}
              pagination={false}
              loading={isLoading}
              rowClassName={() => "editable-row"}
              components={{
                body: {
                  cell: EditableCell,
                },
              }}
              columns={columns}
              dataSource={this.state.dataTable ?? []}
            />
            {editPermission && (
              <Button
                onClick={this.addRecordToTable}
                icon={<PlusCircleFilled />}
                disabled={this.state.editingKey !== ""}
                className="full-width"
              >
                {L("ADD_ONE_RECORD")}
              </Button>
            )}
          </div>
        </Form>
      </>
    )
  }
}

export default withRouter(dealerCommTable)
