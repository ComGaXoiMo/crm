import * as React from "react"

import { inject, observer } from "mobx-react"
import { AppComponentListBase } from "@components/AppComponentBase"
import { Button, Form, Popconfirm, Table } from "antd"
import { L } from "@lib/abpUtility"
import withRouter from "@components/Layout/Router/withRouter"
import getColumns from "./columns"
import AppConsts, { appPermissions } from "@lib/appconst"
import { CloseOutlined, EditOutlined, SaveOutlined } from "@ant-design/icons"
import { EditableCell } from "@components/DataTable/EditableCell"
import { validateMessages } from "@lib/validation"
import Stores from "@stores/storeIdentifier"
import dayjs from "dayjs"
const { align } = AppConsts
//

export interface IProps {
  tableData: any
  isLoading: any
  onDatatableChange: (value) => void
  budgetType: any
}
export interface IState {
  maxResultCount: number
  skipCount: number
  filters: any
  editingRowKey: any
  dataTable: any[]
  listProject: any[]
}

@inject(Stores.BudgetAppStore)
@observer
class TableBudgetApp extends AppComponentListBase<IProps, IState> {
  formRef: any = React.createRef()

  constructor(props: IProps) {
    super(props)
    this.state = {
      maxResultCount: 100,
      skipCount: 0,
      editingRowKey: "",
      filters: { year: dayjs().year() },
      dataTable: [] as any,
      listProject: [] as any,
    }
  }

  async componentDidMount() {
    this.initData()
  }
  async componentDidUpdate(prevProps, prevState) {
    if (this.props.tableData !== prevProps.tableData) {
      this.initData()
    }
    if (prevState.dataTable !== this.state.dataTable) {
      this.props.onDatatableChange(this.state.dataTable)
    }
  }

  initData = () => {
    this.setState({ dataTable: this.props.tableData })
  }
  isEditing = (record) => record.key === this.state.editingRowKey

  editRow = (record) => {
    this.formRef.current?.setFieldsValue({ ...record })
    this.setState({ editingRowKey: record.key })
  }

  cancelEditRow = (record) => {
    this.setState({ editingRowKey: "" })
  }

  saveRow = async (record?) => {
    const values = await this.formRef.current?.validateFields()
    const newData = [...this.state.dataTable]
    const index = this.state.dataTable.findIndex(
      (item) => this.state.editingRowKey === item.key
    )
    if (index > -1) {
      const row = newData[index]
      newData.splice(index, 1, {
        ...row,
        ...values,
      })
      this.setState({ dataTable: newData })
    }
    this.setState({ editingRowKey: "" })
  }

  public render() {
    const { dataTable } = this.state
    const { isLoading } = this.props

    const columns = getColumns(
      {
        title: L("ACTIONS"),
        dataIndex: "action",
        width: 100,
        align: align.center,
        render: (_: any, record: any) => {
          const editable = this.isEditing(record)
          return editable ? (
            <span>
              <Button
                size="small"
                className="ml-1"
                shape="circle"
                icon={<SaveOutlined />}
                disabled={!this.isGranted(appPermissions.budget.update)}
                onClick={() => this.saveRow(record)}
              />
              <Popconfirm
                title={L("ARE_YOU_SURE_YOU_WANT_CANCEL")}
                onConfirm={() => this.cancelEditRow(record)}
              >
                <Button
                  size="small"
                  className="ml-1"
                  shape="circle"
                  icon={<CloseOutlined />}
                />
              </Popconfirm>
            </span>
          ) : (
            <span>
              <Button
                size="small"
                className="ml-1"
                shape="circle"
                icon={<EditOutlined />}
                onClick={() => this.editRow(record)}
                disabled={
                  !this.isGranted(appPermissions.budget.update) &&
                  this.state.editingRowKey?.length > 0
                }
              />
            </span>
          )
        },
      },
      this.isEditing,
      this.props.budgetType
    )
    return (
      <>
        <Form
          ref={this.formRef}
          component={false}
          validateMessages={validateMessages}
          layout={"vertical"}
        >
          <Table
            size="middle"
            className="custom-ant-row"
            rowKey={(record) => record.id}
            loading={isLoading}
            columns={columns}
            pagination={false}
            dataSource={dataTable}
            bordered
            components={{
              body: {
                cell: EditableCell,
              },
            }}
          />
        </Form>
      </>
    )
  }
}

export default withRouter(TableBudgetApp)
