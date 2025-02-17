import * as React from "react"

import { inject, observer } from "mobx-react"
import DataTable from "@components/DataTable"
import gettColumns from "./components/companyColumn"
import { Col, Dropdown, Menu, Modal, Row, Table } from "antd"
import AppDataStore from "@stores/appDataStore"
import { L, LNotification } from "@lib/abpUtility"
import { MoreOutlined } from "@ant-design/icons/lib/icons"
import Stores from "@stores/storeIdentifier"
import withRouter from "@components/Layout/Router/withRouter"
import CompanyFilterPanel from "./components/companyFilterPanel"
import CompanyStore from "@stores/clientManagement/companyStore"
import CompanyModal from "./components/companyModal"
import { appPermissions } from "@lib/appconst"
import { AppComponentListBase } from "../../../components/AppComponentBase"
import { renderDotActive } from "@lib/helper"
const confirm = Modal.confirm

export interface IContactProps {
  appDataStore: AppDataStore
  companyStore: CompanyStore
}

export interface IContactState {
  maxResultCount: number
  skipCount: number
  filters: any
  projectProvinces: any[]
  visible: boolean
  projectId: number
}

@inject(Stores.CompanyStore)
@inject(Stores.AppDataStore)
@observer
class Company extends AppComponentListBase<IContactProps, IContactState> {
  state = {
    maxResultCount: 10,
    skipCount: 0,
    projectId: 0,
    projectProvinces: [],
    filters: {
      userId: undefined,
      isActive: true,
    },
    visible: false,
  }

  async componentDidMount() {
    await this.initData()
    await this.getAll()

    await Promise.all([])
  }
  initData = async () => {
    await Promise.all([])
  }
  getAll = async () => {
    await this.props.companyStore.getAll({
      maxResultCount: this.state.maxResultCount,
      skipCount: this.state.skipCount,
      isShowInActive: false,
      isShowNotVerified: false,
      ...this.state.filters,
    })
  }
  gotoDetail = async (id?) => {
    if (id) {
      await this.props.companyStore.get(id)

      this.setState({ visible: true })
    } else {
      await this.props.companyStore.createCompany()
      this.setState({ visible: true })
    }
  }
  exportExcel = () => {
    this.props.companyStore.exportExcel({ ...this.state.filters })
  }
  handleTableChange = (pagination: any) => {
    this.setState(
      {
        skipCount: (pagination.current - 1) * this.state.maxResultCount!,
        maxResultCount: pagination.pageSize,
      },
      async () => await this.getAll()
    )
  }
  handleFilterChange = async (filters) => {
    await this.setState({ filters })
    await this.handleTableChange({
      current: 1,
      pageSize: this.state.maxResultCount,
    })
  }
  activateOrDeactivate = async (id: number, isActive) => {
    const self = this
    confirm({
      title: LNotification(
        isActive
          ? "DO_YOU_WANT_TO_ACTIVATE_THIS_ITEM"
          : "DO_YOU_WANT_TO_DEACTIVATE_THIS_ITEM"
      ),
      okText: L("BTN_YES"),
      cancelText: L("BTN_NO"),
      onOk: async () => {
        await self.props.companyStore.activateOrDeactivate(id, isActive)
        self.handleTableChange({
          current: 1,
          pageSize: this.state.maxResultCount,
        })
      },
    })
  }
  public render() {
    const {
      companyStore: { isLoading, tableData },
    } = this.props
    const columns = gettColumns({
      title: L("COMPANY_NAME"),
      dataIndex: "businessName",
      key: "businessName",
      width: 350,
      ellipsis: false,
      render: (businessName: string, item: any) => (
        <Row>
          <Col
            sm={{ span: 22, offset: 0 }}
            style={{ overflow: "hidden", textOverflow: "ellipsis" }}
          >
            <a
              onClick={
                this.isGranted(appPermissions.company.detail)
                  ? () => this.gotoDetail(item.id)
                  : () => console.log("no permission")
              }
              className="link-text-table"
            >
              {renderDotActive(item.isActive)} {businessName}
            </a>
          </Col>
          <Col sm={{ span: 2, offset: 0 }}>
            <Dropdown
              trigger={["click"]}
              overlay={
                <Menu>
                  {this.isGranted(appPermissions.company.delete) && (
                    <Menu.Item
                      key={1}
                      onClick={() =>
                        this.activateOrDeactivate(item.id, !item.isActive)
                      }
                    >
                      {L(item.isActive ? "BTN_DEACTIVATE" : "BTN_ACTIVATE")}
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
        </Row>
      ),
    })
    return (
      <>
        <DataTable
          filterComponent={
            <CompanyFilterPanel handleSearch={this.handleFilterChange} />
          }
          handleSearch={this.handleFilterChange}
          exportExcel={this.exportExcel}
          onCreate={() => {
            this.gotoDetail()
          }}
          onRefresh={() => {
            this.getAll()
          }}
          searchPlaceholder={"FILTER_KEYWORD_COMPANY_NAME"}
          pagination={{
            pageSize: this.state.maxResultCount,
            total: tableData === undefined ? 0 : tableData.totalCount,
            onChange: this.handleTableChange,
          }}
        >
          <Table
            size="middle"
            className=" custom-ant-row"
            rowKey={(record) => record.id}
            columns={columns}
            pagination={false}
            loading={isLoading}
            dataSource={tableData === undefined ? [] : tableData.items}
            scroll={{ x: 1000, y: 500, scrollToFirstRowOnChange: true }}
          />
        </DataTable>
        {this.state.visible && (
          <CompanyModal
            companyStore={this.props.companyStore}
            appDataStore={this.props.appDataStore}
            data={this.props.companyStore?.editCompany}
            visible={this.state.visible}
            onCancel={() => {
              this.getAll(), this.setState({ visible: false })
            }}
          />
        )}
      </>
    )
  }
}
export default withRouter(Company)
