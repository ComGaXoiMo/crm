import * as React from "react"

import { inject, observer } from "mobx-react"
import { AppComponentListBase } from "@components/AppComponentBase"
import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  Popconfirm,
  Row,
  Table,
} from "antd"
import { L } from "@lib/abpUtility"
import withRouter from "@components/Layout/Router/withRouter"
import getColumns from "./components/columns"
import DataTable from "@components/DataTable"
import AppConsts, { appPermissions, monthFormat } from "@lib/appconst"
import {
  CloseOutlined,
  EditOutlined,
  PlusCircleFilled,
  ReloadOutlined,
  SaveOutlined,
  SyncOutlined,
} from "@ant-design/icons"
import { EditableCell } from "@components/DataTable/EditableCell"
import { validateMessages } from "@lib/validation"
import LeaseAgreementStore from "@stores/communication/leaseAgreementStore"
import Stores from "@stores/storeIdentifier"
import SettingVatStore from "@stores/settingVatStore"
import { SettingVatModel } from "@models/settingVat/settingVatModel"
import { debounce } from "lodash"
import moment from "moment"
const { align } = AppConsts
//
const Search = Input.Search

export interface IVatConfigProps {
  leaseAgreementStore: LeaseAgreementStore;
  settingVatStore: SettingVatStore;
}
export interface IVatConfigState {
  maxResultCount: number;
  skipCount: number;
  filters: any;
  editingRowKey: any;
  dataTable: any[];
  pageSize: any;
}

@inject(Stores.LeaseAgreementStore, Stores.SettingVatStore)
@observer
class VatConfig extends AppComponentListBase<IVatConfigProps, IVatConfigState> {
  formRef: any = React.createRef();
  formRefProjectAddress: any = React.createRef();

  constructor(props: IVatConfigProps) {
    super(props)
    this.state = {
      maxResultCount: 10,
      skipCount: 0,
      editingRowKey: "",
      filters: { isActive: true },
      dataTable: [] as any,
      pageSize: 0,
    }
  }

  async componentDidMount() {
    this.getAll()
  }
  getAll = async () => {
    await this.props.settingVatStore.getAll({
      maxResultCount: this.state.maxResultCount,
      skipCount: this.state.skipCount,
      ...this.state.filters,
    })
    this.setState({
      dataTable: this.props.settingVatStore.pageResult?.items,
      pageSize: this.props.settingVatStore.pageResult?.totalCount,
      editingRowKey: "",
    })
  };

  updateRentRoll = (id) => {
    this.props.settingVatStore.synVATToPaymentUnBill(id)
  };
  get currentPage() {
    return Math.floor(this.state.skipCount / this.state.maxResultCount) + 1
  }
  handleTableChange = (pagination: any) => {
    this.setState(
      {
        skipCount: (pagination.current - 1) * this.state.maxResultCount!,
        maxResultCount: pagination.pageSize,
      },
      async () => await this.getAll()
    )
  };
  isEditing = (record) => record.key === this.state.editingRowKey;
  handleAddRow = () => {
    const newRow = new SettingVatModel()
    this.formRef.current?.setFieldsValue({ ...newRow })
    this.setState({
      dataTable: [newRow, ...this.state.dataTable],
      editingRowKey: newRow.key,
    })
  };
  editRow = (record) => {
    this.formRef.current?.setFieldsValue({ ...record })
    this.setState({ editingRowKey: record.key })
  };

  cancelEditRow = (record) => {
    const dataTable = this.props.settingVatStore.pageResult?.items

    this.setState({ dataTable, editingRowKey: undefined })
  };
  handleCreateOrUpdate = async (record) => {
    try {
      const form = this.formRef.current
      const editedRowIndex = this.state.dataTable.findIndex(
        (item) => item.key === record.key
      )
      if (editedRowIndex === -1) {
        return
      }
      // Update case
      form?.validateFields().then(async (values: any) => {
        const formValue = form?.getFieldsValue()
        const editRecord = this.state.dataTable.find(
          (item) => item.id === record.id
        )
        if (editRecord?.id) {
          await this.props.settingVatStore.createOrUpdate({
            ...formValue,
            id: editRecord?.id,
          })
        } else {
          await this.props.settingVatStore.createOrUpdate({
            ...formValue,
          })
        }

        await this.setState({ editingRowKey: "" })
        await this.getAll()
      })
    } catch (errInfo) {
      console.log("Validate Failed:", errInfo)
    }
  };
  updateSearch = debounce((name, value) => {
    const { filters } = this.state
    this.setState({ filters: { ...filters, [name]: value } })
    if (value?.length === 0) {
      this.handleSearch("keyword", value)
    }
  }, 100);

  handleSearch = async (name, value) => {
    {
      // this.setState({ [name]: value });
      await this.setState({
        filters: { ...this.state.filters, [name]: value },
      })
      await this.getAll()
    }
  };
  renderFilterComponent = () => {
    return (
      <Row gutter={[8, 8]}>
        <Col sm={{ span: 6, offset: 0 }}>
          <Search
            placeholder={L("FEE_TYPE")}
            onChange={(value) =>
              this.updateSearch("keyword", value.target?.value)
            }
            onSearch={(value) => this.handleSearch("keyword", value)}
          />
        </Col>
        <Col sm={{ span: 3, offset: 0 }}>
          <DatePicker
            className="full-width"
            format={monthFormat}
            picker="month"
            placeholder={L("START_DATE")}
            onChange={(value) =>
              this.handleSearch("startDate", moment(value).toJSON())
            }
          />
        </Col>
        <div style={{ position: "absolute", display: "flex", right: 10 }}>
          {this.isGranted(appPermissions.setting.create) && (
            <Button
              icon={<PlusCircleFilled />}
              className="button-primary"
              onClick={this.handleAddRow}
            ></Button>
          )}
          <Button
            icon={<ReloadOutlined />}
            className="button-primary"
            onClick={() => this.getAll()}
          ></Button>
        </div>
      </Row>
    )
  };
  public render() {
    const { dataTable, pageSize } = this.state
    const { isLoading } = this.props.settingVatStore

    const columns = getColumns(
      {
        title: L("ACTIONS"),
        dataIndex: "action",
        width: "10%",
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
                disabled={!this.isGranted(appPermissions.setting.update)}
                onClick={() => this.handleCreateOrUpdate(record)}
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
                  !this.isGranted(appPermissions.setting.update) &&
                  this.state.editingRowKey?.length > 0
                }
              />
              <Popconfirm
                title={
                  <>
                    <strong>{L("ARE_YOU_SURE_YOU_WANT_SYNC_VAT")}</strong>
                    <p>{L("THIS_WILL_BE_CHANGE_PAYMENT_SCHEDULE")}</p>
                  </>
                }
                onConfirm={() => this.updateRentRoll(record.id)}
              >
                <Button
                  size="small"
                  className="ml-1"
                  shape="circle"
                  icon={<SyncOutlined />}
                  disabled={
                    !this.isGranted(appPermissions.setting.delete) &&
                    this.state.editingRowKey?.length > 0
                  }
                />
              </Popconfirm>
            </span>
          )
        },
      },
      this.isEditing,
      this.props.leaseAgreementStore.listFeeType
    )
    return (
      <>
        <Form
          ref={this.formRef}
          component={false}
          validateMessages={validateMessages}
          layout={"vertical"}
        >
          <DataTable
            pagination={{
              pageSize: this.state.maxResultCount,
              current: this.currentPage,
              total: dataTable === undefined ? 0 : pageSize,
              onChange: this.handleTableChange,
            }}
            filterComponent={this.renderFilterComponent()}
            disable={this.state.editingRowKey?.length > 0}
          >
            <Table
              size="middle"
              className="custom-ant-row"
              rowKey={(record) => record.id}
              loading={isLoading}
              columns={columns}
              pagination={false}
              dataSource={dataTable}
              // scroll={{ x: 200, scrollToFirstRowOnChange: true }}
              bordered
              components={{
                body: {
                  cell: EditableCell,
                },
              }}
            />
          </DataTable>
        </Form>
      </>
    )
  }
}

export default withRouter(VatConfig)
