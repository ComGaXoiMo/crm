import * as React from "react"

import { Col, Dropdown, Input, Menu, Modal, Row, Table, Select } from "antd"
import { MoreOutlined } from "@ant-design/icons"

import { AppComponentListBase } from "../../../components/AppComponentBase"
import Filter from "../../../components/Filter"
import DataTable from "../../../components/DataTable"
import { L, LNotification } from "@lib/abpUtility"
import MasterDataStore from "../../../stores/administrator/masterDataStore"
import { inject, observer } from "mobx-react"
import Stores from "../../../stores/storeIdentifier"
import AppConst from "../../../lib/appconst"
import { portalLayouts } from "@components/Layout/Router/router.config"
import { CalendarOutlined, UserOutlined } from "@ant-design/icons"
import { filterOptions } from "@lib/helper"
import debounce from "lodash/debounce"
const { align, activeStatus } = AppConst

export interface IMasterDataProps {
  history: any
  masterDataStore: MasterDataStore
}

export interface IMasterDataState {
  modalVisible: boolean
  maxResultCount: number
  skipCount: number
  buildingId?: number
  filters: any
}

const confirm = Modal.confirm
const Search = Input.Search

@inject(Stores.MasterDataStore)
@observer
class MasterDataComponent extends AppComponentListBase<
  IMasterDataProps,
  IMasterDataState
> {
  formRef: any = React.createRef()

  state = {
    modalVisible: false,
    maxResultCount: 10,
    skipCount: 0,
    filters: { isActive: "true" },
  }

  get currentPage() {
    return Math.floor(this.state.skipCount / this.state.maxResultCount) + 1
  }

  getAll = async () => {
    console.log("getAll")
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

  Modal = () => {
    this.setState({ modalVisible: !this.state.modalVisible })
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
        await self.props.masterDataStore.activateOrDeactivate(id, isActive)
        self.handleTableChange({ current: 1, pageSize: 10 })
      },
    })
  }

  handleCreate = () => {
    const form = this.formRef.current

    form.validateFields().then(async (values: any) => {
      if (this.props.masterDataStore.editMasterData?.id) {
        await this.props.masterDataStore.update({
          ...this.props.masterDataStore.editMasterData,
          ...values,
        })
      } else {
        await this.props.masterDataStore.create(values)
      }

      await this.getAll()
      this.setState({ modalVisible: false })
      form.resetFields()
    })
  }

  updateSearch = debounce((name, value) => {
    const { filters } = this.state
    this.setState({ filters: { ...filters, [name]: value } })
    if (value?.length === 0) {
      this.handleSearch("keyword", value)
    }
  }, 100)

  handleSearch = (name, value) => {
    const { filters } = this.state
    this.setState(
      { filters: { ...filters, [name]: value }, skipCount: 0 },
      async () => await this.getAll()
    )
  }

  gotoDetail = (id?) => {
    const { history } = this.props
    id
      ? history.push(
          portalLayouts.adminMasterDataDetail.path.replace(":id", id)
        )
      : history.push(portalLayouts.adminMasterDataCreate.path)
  }

  public render() {
    const {
      masterDataStore: { masterDatas, targetOptions },
    } = this.props
    const { filters } = this.state
    const columns = [
      {
        title: L("TARGET"),
        dataIndex: "target",
        key: "target",
        ellipsis: false,
        width: 100,
        render: (text: string) => <>{text}</>,
      },
      {
        title: L("NAME"),
        dataIndex: "name",
        key: "name",
        width: 250,
        render: (text: string) => <div>{text}</div>,
      },
      {
        title: L("CODE"),
        dataIndex: "code",
        key: "code",
        width: 100,
        render: (text: string) => <div>{text}</div>,
      },
      {
        title: L("ACTIVE_STATUS"),
        dataIndex: "isActive",
        key: "isActive",
        width: 100,
        align: align.center,
        render: this.renderIsActive,
      },
      {
        title: L("LAST_UPDATE_TIME"),
        dataIndex: "lastModificationTime",
        key: "lastModificationTime",
        width: 150,
        ellipsis: false,
        render: (text, row) => (
          <div className="text-muted small">
            <CalendarOutlined className="mr-1" /> {this.renderDate(text)}
            <div>
              <UserOutlined className="mr-1" />
              {row.lastModifierUser?.displayName}
            </div>
          </div>
        ),
      },
      {
        title: L("CREATED_AT"),
        dataIndex: "creationTime",
        key: "creationTime",
        width: 150,
        ellipsis: false,
        render: (text, row) => (
          <div className="text-muted small">
            <CalendarOutlined className="mr-1" /> {this.renderDate(text)}
            <div>
              <UserOutlined className="mr-1" /> {row.creatorUser?.displayName}
            </div>
          </div>
        ),
      },
      {
        title: L("ACTIONS"),
        dataIndex: "operation",
        key: "operation",
        fixed: align.right,
        align: align.right,
        width: 90,
        render: (text: string, item: any) => (
          <div>
            <Dropdown
              trigger={["click"]}
              overlay={
                <Menu>
                  <Menu.Item onClick={() => this.gotoDetail(item.id)}>
                    {L("BTN_EDIT")}
                  </Menu.Item>

                  <Menu.Item
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
              <MoreOutlined />
            </Dropdown>
          </div>
        ),
      },
    ]

    const keywordPlaceHolder = `${this.L("NAME")}, ${this.L("CODE")}`
    return (
      <>
        <Filter title={this.L("FILTER")} handleRefresh={this.getAll}>
          <Row gutter={[16, 8]}>
            <Col sm={{ span: 6, offset: 0 }}>
              <label>{this.L("FILTER_KEYWORD")}</label>
              <Search
                placeholder={keywordPlaceHolder}
                onChange={(value) =>
                  this.updateSearch("keyword", value.target?.value)
                }
                onSearch={(value) => this.handleSearch("keyword", value)}
              />
            </Col>
            <Col sm={{ span: 6, offset: 0 }}>
              <label>{this.L("FILTER_TARGET")}</label>
              <Select
                getPopupContainer={(trigger) => trigger.parentNode}
                showSearch
                allowClear
                className="full-width"
                filterOption={filterOptions}
                onChange={(value) => this.handleSearch("target", value)}
              >
                {this.renderOptions(targetOptions)}
              </Select>
            </Col>
            <Col sm={{ span: 6, offset: 0 }}>
              <label>{this.L("FILTER_ACTIVE_STATUS")}</label>
              <Select
                getPopupContainer={(trigger) => trigger.parentNode}
                defaultValue={filters.isActive}
                onChange={(value) => this.handleSearch("isActive", value)}
                style={{ width: "100%" }}
              >
                {this.renderOptions(activeStatus)}
              </Select>
            </Col>
          </Row>
        </Filter>
        <DataTable
          title={this.L("MASTER_DATA_LIST")}
          onCreate={this.gotoDetail}
          pagination={{
            pageSize: this.state.maxResultCount,
            current: this.currentPage,
            total: masterDatas === undefined ? 0 : masterDatas.totalCount,
            onChange: this.handleTableChange,
          }}
        >
          <Table
            size="middle"
            className=""
            rowKey={(record) => record.id}
            columns={columns}
            loading={this.props.masterDataStore.isLoading}
            dataSource={masterDatas === undefined ? [] : masterDatas.items}
            pagination={false}
            scroll={{ x: 1000, scrollToFirstRowOnChange: true }}
          />
        </DataTable>
      </>
    )
  }
}

export default MasterDataComponent
