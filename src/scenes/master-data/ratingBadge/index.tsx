import React from "react"
import { AppComponentListBase } from "@components/AppComponentBase"
import { inject, observer } from "mobx-react"
import Stores from "@stores/storeIdentifier"
import { Col, Input, Row, Modal, Table, Select } from "antd"
import AppConst, { appPermissions, moduleIds } from "@lib/appconst"
import { L, LNotification } from "@lib/abpUtility"
import debounce from "lodash/debounce"
import DataTable from "@components/DataTable"
import { getColumns } from "./columns"
import RatingBadgeStore from "@stores/master-data/ratingBadgeStore"
import {
  SortAscendingOutlined,
  CloseOutlined,
  CheckOutlined,
} from "@ant-design/icons"
import Button from "antd/es/button"
import RatingBadgeModal from "@scenes/master-data/ratingBadge/components/RatingBadgeModal"
import ActionFooter from "@components/ActionFooter"
import RatingBadgeSortDrawer from "@components/SortDrawer"
const { activeStatus } = AppConst

export interface IRatingBadgeProps {
  history: any;
  ratingBadgeStore: RatingBadgeStore;
}

export interface IRatingBadgeState {
  maxResultCount: number;
  skipCount: number;
  currentPage: number;
  filters: any;
  loading: boolean;
  visible: boolean;
  visibleDrawer: boolean;
  selectedIds: any[];
  selectedItem: any;
  disableActivate: boolean;
  disableDeactivate: boolean;
}

@inject(Stores.RatingBadgeStore)
@observer
class RatingBadge extends AppComponentListBase<
  IRatingBadgeProps,
  IRatingBadgeState
> {
  constructor(props) {
    super(props)
    this.state = {
      maxResultCount: 10,
      skipCount: 0,
      currentPage: 1,
      filters: { moduleId: moduleIds.ratingBadge, isActive: "true" },
      loading: false,
      visible: false,
      visibleDrawer: false,
      selectedIds: [],
      selectedItem: {},
      disableActivate: true,
      disableDeactivate: true,
    }
  }

  get currentPage() {
    return Math.floor(this.state.skipCount / this.state.maxResultCount) + 1
  }

  async componentDidMount() {
    await Promise.all([this.getAll()])
  }

  openOrCloseModal = (id?) => {
    const visible = !this.state.visible
    this.setState({ visible }, async () => {
      if (visible) {
        id
          ? await this.props.ratingBadgeStore.getById(id)
          : await this.props.ratingBadgeStore.createRatingBadge()
        this.setState({
          selectedItem: this.props.ratingBadgeStore.editRatingBadge,
        })
      }
    })
  };

  openOrCloseDrawer = () => {
    const visibleDrawer = !this.state.visibleDrawer
    this.setState({ visibleDrawer }, async () => {
      if (visibleDrawer) {
        await this.props.ratingBadgeStore.getAll({})
      }
    })
  };

  getAll = async () => {
    await this.props.ratingBadgeStore.filter({
      maxResultCount: this.state.maxResultCount,
      skipCount: this.state.skipCount,
      ...this.state.filters,
    })
    const currentPage = (this.state.skipCount % this.state.maxResultCount) + 1
    this.setState({ currentPage })
  };

  handleSearch = debounce(async (key, value) => {
    const { filters } = this.state
    this.setState(
      { filters: { ...filters, [key]: value }, skipCount: 0 },
      async () => {
        await this.getAll()
      }
    )
  }, 300);

  updateOrder = async (ids) => {
    const { ratingBadgeStore } = this.props
    return await ratingBadgeStore.updateSortList(ids)
  };

  activateOrDeactivate = (ids, isActive: boolean) => {
    const { ratingBadgeStore } = this.props
    Modal.confirm({
      title: LNotification(
        isActive
          ? "DO_YOU_WANT_TO_ACTIVATE_THIS_ITEM"
          : "DO_YOU_WANT_TO_DEACTIVATE_THIS_ITEM"
      ),
      okText: this.L("BTN_YES"),
      cancelText: this.L("BTN_NO"),
      onOk: async () => {
        await ratingBadgeStore.activateOrDeactivate(ids, isActive)
        await this.handleSearch("keyword", this.state.filters.keyword)
        this.setState({ selectedIds: [] })
      },
      onCancel() {
        console.log("Cancel")
      },
    })
  };

  handleTableChange = async (pagination) => {
    this.setState(
      { skipCount: (pagination.current - 1) * this.state.maxResultCount! },
      async () => await this.getAll()
    )
  };

  handleRowSelect = (selectedIds) => {
    const {
      pagedData: { items },
    } = this.props.ratingBadgeStore
    const disableActivate = items.some(
      (item) =>
        item.isActive &&
        selectedIds.some((selectedId) => selectedId === item.id)
    )
    const disableDeactivate = items.some(
      (item) =>
        !item.isActive &&
        selectedIds.some((selectedId) => selectedId === item.id)
    )
    this.setState({ selectedIds, disableActivate, disableDeactivate })
  };

  renderFilterComponent = () => {
    const { filters } = this.state
    const keywordPlaceHolder = `${this.L("RATING_BADGE_NAME")}, ${this.L(
      "RATING_BADGE_CODE"
    )}`
    return (
      <Row gutter={[8, 8]}>
        <Col sm={{ span: 12, offset: 0 }}>
          <Input.Search
            placeholder={keywordPlaceHolder}
            onSearch={(value) => this.handleSearch("keyword", value)}
          />
        </Col>
        <Col md={{ span: 12, offset: 0 }}>
          <Select
            getPopupContainer={(trigger) => trigger.parentNode}
            showArrow
            allowClear
            value={filters.isActive}
            onChange={(value) => this.handleSearch("isActive", value)}
            style={{ width: "100%" }}
            placeholder={L("IS_ACTIVE")}
          >
            {this.renderOptions(activeStatus)}
          </Select>
        </Col>
      </Row>
    )
  };

  renderActionGroups = () => {
    return (
      <>
        {this.isGranted(appPermissions.ratingBadge.update) && (
          <Button
            shape="circle"
            className="mr-1"
            onClick={this.openOrCloseDrawer}
            icon={<SortAscendingOutlined />}
          />
        )}
      </>
    )
  };

  public render() {
    const { ratingBadgeStore } = this.props
    const { selectedIds, disableActivate, disableDeactivate } = this.state
    const columns = getColumns(
      this.openOrCloseModal,
      this.activateOrDeactivate
    )
    const rowSelection = {
      selectedRowKeys: selectedIds,
      onChange: this.handleRowSelect,
    }
    return (
      <>
        <DataTable
          title={this.L("RATING_BADGE_LIST")}
          onCreate={this.openOrCloseModal}
          createPermission={appPermissions.ratingBadge.create}
          pagination={{
            pageSize: this.state.maxResultCount,
            current: this.currentPage,
            total:
              ratingBadgeStore.pagedData === undefined
                ? 0
                : ratingBadgeStore.pagedData.totalCount,
            onChange: this.handleTableChange,
          }}
          filterComponent={this.renderFilterComponent()}
          actionComponent={this.renderActionGroups}
        >
          <Table
            size="middle"
            className="custom-ant-table"
            rowKey={(record) => record.id}
            columns={columns}
            pagination={false}
            loading={ratingBadgeStore.isLoading}
            dataSource={ratingBadgeStore.pagedData.items}
            scroll={{ x: 1000, scrollToFirstRowOnChange: true }}
            rowSelection={rowSelection}
          />
        </DataTable>
        <RatingBadgeModal
          visible={this.state.visible}
          ratingBadgeStore={ratingBadgeStore}
          handleOK={this.handleSearch}
          handleCancel={this.openOrCloseModal}
          data={this.state.selectedItem}
        />
        <RatingBadgeSortDrawer
          visible={this.state.visibleDrawer}
          setVisibleDrawer={this.openOrCloseDrawer}
          data={ratingBadgeStore.ratingBadges}
          handleSave={this.updateOrder}
        />
        <ActionFooter
          show={
            this.isGranted(appPermissions.ratingBadge.delete) &&
            selectedIds.length > 0
          }
        >
          <Button
            shape="round"
            size={"large"}
            className="mr-1 primary btn-icon-customize"
            type="primary"
            onClick={() => this.activateOrDeactivate(selectedIds, true)}
            icon={
              <span className="btn-icon">
                <CheckOutlined className="color-success" />
              </span>
            }
            disabled={disableActivate || !selectedIds.length}
          >
            {L("ACTIVATE")}
          </Button>
          <Button
            shape="round"
            size={"large"}
            className="mr-1 primary btn-icon-customize"
            type="primary"
            onClick={() => this.activateOrDeactivate(selectedIds, false)}
            icon={
              <span className="btn-icon">
                <CloseOutlined className="color-error" />
              </span>
            }
            disabled={disableDeactivate || !selectedIds.length}
          >
            {L("DEACTIVATE")}
          </Button>
        </ActionFooter>
      </>
    )
  }
}

export default RatingBadge
