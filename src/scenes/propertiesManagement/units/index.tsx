import * as React from "react"
import gettColumns from "./components/unitColumn"

import { inject, observer } from "mobx-react"
import UnitFilterPanel from "./components/unitFilterPanel"
import { L, LNotification } from "@lib/abpUtility"
import { Col, Dropdown, Menu, Modal, Row, Table } from "antd"
import { MoreOutlined } from "@ant-design/icons/lib/icons"
import DataTable from "@components/DataTable"
import Stores from "@stores/storeIdentifier"
import UnitStore from "@stores/projects/unitStore"
import UnitModal from "./components/unitModal"
import StackPland from "./components/stackPland"
import { AppComponentListBase } from "@components/AppComponentBase"
import withRouter from "@components/Layout/Router/withRouter"
import AppConsts, { appPermissions } from "@lib/appconst"
import { renderDotActive } from "@lib/helper"
import AddSiteVisitModal from "@components/AppComponentBase/addSiteVisitModal"
import AddReservationModal from "@components/AppComponentBase/addReservationModal"
import ChooseInquiryToProposalModal from "@components/AppComponentBase/chooseInquiryToProposalModal"
import CreateProposalModal from "@scenes/activity/proposalActivity/components/createProposalModal"
import ProposalStore from "@stores/activity/proposalStore"
import { portalLayouts } from "@components/Layout/Router/router.config"
import ProjectStore from "@stores/projects/projectStore"
const { align, activityTypes } = AppConsts
const confirm = Modal.confirm
export interface IUnitProps {
  history: any;
  projectId: any;
  unitStore: UnitStore;
  proposalStore: ProposalStore;
  projectStore: ProjectStore;
}

export interface IUnitState {
  maxResultCount: number;
  skipCount: number;
  filters: any;
  visible: boolean;
  tabView: string;
  unitId: any;
  projectId: any;
  selectedRowKeys: any[];
  numberUnitChoose: number;
  siteVisitModalVisible: boolean;
  reservationModalVisible: boolean;
  createProposalModal: boolean;
  proposalChooseTemplateVisible: boolean;
  unitAndInquiryProposal: any;
  StackngPlandLoad: boolean;
}
const tabKeys = {
  gridView: L("GRID_VIEW"),
  listView: L("LIST_VIEW"),
}
@inject(Stores.UnitStore, Stores.ProposalStore, Stores.ProjectStore)
@observer
class Units extends AppComponentListBase<IUnitProps, IUnitState> {
  formRef: any = React.createRef();
  printRef: any = React.createRef();
  state = {
    maxResultCount: 10,
    skipCount: 0,
    unitId: undefined,
    filters: {
      projectId: this.props.projectId ?? undefined,
      sorting: undefined,
      isActive: true,
    },
    visible: false,
    tabView: tabKeys.listView,
    projectId: undefined,
    selectedRowKeys: [] as any,
    numberUnitChoose: 0,
    siteVisitModalVisible: false,
    reservationModalVisible: false,
    createProposalModal: false,
    proposalChooseTemplateVisible: false,
    unitAndInquiryProposal: {} as any,
    StackngPlandLoad: false,
  };

  async componentDidMount() {
    await this.getAll()
  }
  async componentDidUpdate(prevProps, prevState) {
    if (prevState.tabView !== this.state.tabView) {
      if (this.state.tabView === tabKeys.listView) {
        await this.getAll()
      }
    }
  }
  exportExcel = () => {
    this.props.unitStore.exportExcel({ ...this.state.filters })
  };
  getAll = async () => {
    if (this.state.tabView === tabKeys.gridView) {
      this.setState({ StackngPlandLoad: !this.state.StackngPlandLoad })
    } else {
      await this.props.unitStore.getAllRes({
        ProjectId: this.props.projectId,
        maxResultCount: this.state.maxResultCount,
        skipCount: this.state.skipCount,
        ...this.state.filters,
      })
    }
  };
  handleTableChange = (pagination: any) => {
    this.setState(
      {
        skipCount: (pagination.current - 1) * this.state.maxResultCount!,
        maxResultCount: pagination.pageSize,
      },
      async () => await this.getAll()
    )
  };
  onChangeTableSorting = async (pagination, filters, sorter) => {
    let sortType = ""
    if (sorter?.order === "descend") {
      sortType = "desc"
    } else if (sorter?.order === "ascend") {
      sortType = "asc"
    }
    if (sorter.order) {
      await this.setState({
        filters: {
          ...this.state.filters,

          sorting: `${sorter.columnKey} ${sortType}`,
        },
      })
    } else {
      await this.setState({
        filters: {
          ...this.state.filters,
          sorting: undefined,
        },
      })
    }

    await this.getAll()
  };
  handleFilterChange = async (filters) => {
    await this.setState({ filters })
    if (this.state.tabView === tabKeys.listView) {
      await this.handleTableChange({
        current: 1,
        pageSize: this.state.maxResultCount,
      })
    }
  };
  handleCreateActivity = async (typeId) => {
    switch (typeId) {
      case activityTypes.proposal: {
        this.setState({ createProposalModal: true })
        break
      }
      case activityTypes.siteVisit: {
        this.setState({ siteVisitModalVisible: true })
        break
      }
      case activityTypes.reservation: {
        this.setState({ reservationModalVisible: true })
        break
      }
    }
  };
  gotoDetail = async (id?) => {
    if (id) {
      await this.props.unitStore.getUnitRes(id)
      await this.setState({ unitId: id, visible: true })
    } else {
      // this.setState({ idBatch: null })
      await this.props.unitStore.createUnitRes()
      this.setState({ unitId: undefined, visible: true })
    }
  };
  changeTab = async (value) => {
    await this.setState({ tabView: value.target.value })
  };
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
        await self.props.unitStore.activateOrDeactivate(id, isActive)
        self.handleTableChange({
          current: 1,
          pageSize: this.state.maxResultCount,
        })
      },
    })
  };

  onSelectChange = (newSelectedRowKeys) => {
    this.setState({ selectedRowKeys: newSelectedRowKeys })
    this.setState({ numberUnitChoose: newSelectedRowKeys.length ?? 0 })
  };

  onCreateProposal = async (param) => {
    const model = { ...this.state.unitAndInquiryProposal, ...param }
    this.setState({ proposalChooseTemplateVisible: false })
    await this.props.proposalStore.createOrUpdate(model)
    await this.props.history.push(
      portalLayouts.proposalEditTemplate.path.replace(
        ":id",
        this.props.proposalStore.proposalDetail.id
      )
    )
  };
  public render() {
    const rowSelection = {
      onChange: this.onSelectChange,
      selectedRowKeys: this.state.selectedRowKeys,
      columnWidth: 40,
      hideSelectAll: true,
    }
    const {
      unitStore: { isLoading, tableData },
    } = this.props
    const columns = gettColumns({
      title: L("UNIT_NO"),
      align: align.left,
      dataIndex: "unitName",
      key: "unitName",
      fixed: "left",
      width: 200,
      ellipsis: false,
      render: (unitName: string, item: any) => (
        <Row>
          <Col
            sm={{ span: 18, offset: 0 }}
            style={{ overflow: "hidden", textOverflow: "ellipsis" }}
          >
            <a
              onClick={
                this.isGranted(appPermissions.unit.detail)
                  ? () => this.gotoDetail(item.id)
                  : () => {
                      console.log("No permission")
                    }
              }
              className="link-text-table"
            >
              {renderDotActive(item.isActive)} {unitName}
            </a>
          </Col>
          <Col sm={{ span: 1, offset: 0 }}></Col>
          <Col sm={{ span: 3, offset: 0 }}>
            <Dropdown
              trigger={["click"]}
              overlay={
                <Menu>
                  {this.isGranted(appPermissions.unit.delete) && (
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
        <div>
          <UnitFilterPanel
            projectId={this.props.projectId}
            tabKeys={tabKeys}
            changeTab={this.changeTab}
            handleSearch={this.handleFilterChange}
            filter={this.state.filters}
            onCreate={() => {
              this.gotoDetail(undefined)
            }}
            onCreateActiviy={this.handleCreateActivity}
            onRefresh={() => {
              this.getAll()
            }}
            exportExcel={this.exportExcel}
            numberUnitChoose={this.state.numberUnitChoose}
            printRef={this.printRef}
          />
          {this.state.tabView === tabKeys.listView && (
            <DataTable
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
                onChange={this.onChangeTableSorting}
                loading={isLoading}
                pagination={false}
                rowSelection={rowSelection}
                dataSource={tableData === undefined ? [] : tableData.items}
                scroll={{ x: 800, y: 500, scrollToFirstRowOnChange: true }}
                bordered
              />
            </DataTable>
          )}
          {this.state.tabView === tabKeys.gridView && (
            <div style={{ overflow: "hidden" }}>
              <StackPland
                goDetail={this.gotoDetail}
                isLoadding={this.state.StackngPlandLoad}
                loading={isLoading}
                projectId={this.state.filters.projectId}
                filter={this.state.filters}
                printRef={this.printRef}
              />
            </div>
          )}
        </div>
        <UnitModal
          id={this.props.unitStore.editUnitRes?.id}
          visible={this.state.visible}
          onCancel={() => {
            this.setState({ visible: false })
          }}
          onOk={() => {
            this.getAll()
          }}
        />
        <AddSiteVisitModal
          data={this.state.selectedRowKeys}
          visible={this.state.siteVisitModalVisible}
          onCancel={() => {
            this.setState({ siteVisitModalVisible: false })
          }}
          onOk={() => {
            this.setState({ siteVisitModalVisible: false })
          }}
        />
        <AddReservationModal
          filter={this.state.filters}
          data={this.state.selectedRowKeys}
          visible={this.state.reservationModalVisible}
          onCancel={() => {
            this.setState({ reservationModalVisible: false })
          }}
          onOk={() => {
            this.setState({ reservationModalVisible: false })
          }}
        />
        <ChooseInquiryToProposalModal
          unitIds={this.state.selectedRowKeys}
          visible={this.state.createProposalModal}
          onCancel={() => {
            this.setState({ createProposalModal: false })
          }}
          onOk={(param) => {
            this.setState({
              createProposalModal: false,
              proposalChooseTemplateVisible: true,
              unitAndInquiryProposal: param,
            })
          }}
        />
        <CreateProposalModal
          visible={this.state.proposalChooseTemplateVisible}
          onClose={() =>
            this.setState({ proposalChooseTemplateVisible: false })
          }
          onOk={this.onCreateProposal}
        />
      </>
    )
  }
}

export default withRouter(Units)
