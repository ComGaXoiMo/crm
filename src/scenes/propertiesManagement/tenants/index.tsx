import * as React from "react"

import { inject, observer } from "mobx-react"
import DataTable from "@components/DataTable"
import gettColumns from "./components/tenantsColumn"
import { Col, Dropdown, Menu, Modal, Row, Table } from "antd"
import { L, LNotification } from "@lib/abpUtility"

import { HomeOutlined, MoreOutlined } from "@ant-design/icons/lib/icons"
import withRouter from "@components/Layout/Router/withRouter"
import TenantDetailModal from "./components/tenantDetailModal"
import TenantStore from "@stores/administrator/tenantStore"
import Stores from "@stores/storeIdentifier"
import dayjs from "dayjs"
import { appPermissions, dateFormat } from "@lib/appconst"
import { AppComponentListBase } from "@components/AppComponentBase"
const confirm = Modal.confirm

export interface ITenantProps {
  tenantStore: TenantStore
}

export interface ITenantState {
  maxResultCount: number
  skipCount: number
  visible: boolean
  filters: any
}

@inject(Stores.TenantStore)
@observer
class Tenants extends AppComponentListBase<ITenantProps, ITenantState> {
  formRef: any = React.createRef()

  state = {
    maxResultCount: 10,
    skipCount: 0,
    visible: false,

    filters: {},
  }

  async componentDidMount() {
    await this.getAll()

    await Promise.all([])
  }
  getAll = async () => {
    await this.props.tenantStore.getAll({
      maxResultCount: this.state.maxResultCount,
      skipCount: this.state.skipCount,
      ...this.state.filters,
    })
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
  handleFilterChange = (filters) => {
    this.setState({ filters }, this.getAll)
  }
  gotoDetail = async (id?) => {
    if (id) {
      await this.props.tenantStore.get(id)
      this.setState({ visible: true })
    } else {
      await this.props.tenantStore.createTenant()
      this.formRef.current?.resetFields()

      this.setState({ visible: true })
    }
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
        await self.props.tenantStore.activateOrDeactivate(id, isActive)
        self.handleTableChange({ current: 1, pageSize: 10 })
      },
    })
  }
  public render() {
    const {
      tenantStore: { tableData, isLoading },
    } = this.props

    const columns = gettColumns({
      title: L("GUEST_NAME"),
      dataIndex: "name",
      key: "name",
      width: "15%",
      ellipsis: false,
      render: (tenantName: string, item: any) => (
        <Row>
          <Col sm={{ span: 19, offset: 0 }}>
            <a
              onClick={
                this.isGranted(appPermissions.userTenant.detail)
                  ? () => this.gotoDetail(item.id)
                  : () => console.log()
                // () => this.gotoDetail(item.id)
              }
              className="link-text-table"
            >
              {tenantName}
            </a>
          </Col>
          <Col sm={{ span: 5, offset: 0 }}>
            <Dropdown
              trigger={["click"]}
              overlay={
                <Menu>
                  {this.isGranted(appPermissions.userTenant.delete) && (
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
          searchPlaceholder={"FILTER_KEYWORD_TENENT"}
          handleSearch={this.handleFilterChange}
          onCreate={() => {
            this.gotoDetail()
          }}
          onRefresh={() => {
            this.getAll()
          }}
          pagination={{
            pageSize: this.state.maxResultCount,
            total: tableData === undefined ? 0 : tableData.totalCount,
            onChange: this.handleTableChange,
          }}
        >
          <Table
            size="middle"
            className="custom-ant-row"
            rowKey={(record) => record.id}
            columns={columns}
            pagination={false}
            loading={isLoading}
            dataSource={tableData === undefined ? [] : tableData.items}
            scroll={{ x: 1000, scrollToFirstRowOnChange: true }}
            expandable={{
              expandedRowRender: (record) => (
                <Row style={{ padding: "0 50px" }} gutter={[8, 8]}>
                  {record?.unitTenant?.map((unit, index) => (
                    <Col span={4} key={index}>
                      <strong>
                        <HomeOutlined /> {unit.unit?.projectCode} -
                        {unit.unit?.unitName}
                      </strong>
                      <div
                        className="text-truncate small text-muted"
                        // style={{ marginLeft: "22px" }}
                      >
                        <label>
                          {L("MOVE_IN")}:
                          {dayjs(unit.moveInDate).format(dateFormat)}
                        </label>
                      </div>
                    </Col>
                  ))}
                </Row>
              ),
              columnWidth: 50,
              rowExpandable: (record) =>
                record.unitTenant && record.unitTenant.length > 0,
            }}
          />
        </DataTable>

        <TenantDetailModal
          id={this.props.tenantStore.tenantModel?.id}
          visible={this.state.visible}
          onOk={() => {
            this.getAll()
          }}
          onCancel={() => {
            this.getAll(), this.setState({ visible: false })
          }}
        />
      </>
    )
  }
}
export default withRouter(Tenants)
