import * as React from "react"
import gettColumns from "./column"

import { inject, observer } from "mobx-react"
import UnitFilterPanel from "./unitFilterPanel"
import { L } from "@lib/abpUtility"
import { Button, Dropdown, Menu, Table } from "antd"
import DataTable from "@components/DataTable"
import Stores from "@stores/storeIdentifier"
import UnitStore from "@stores/projects/unitStore"
import { AppComponentListBase } from "@components/AppComponentBase"
import withRouter from "@components/Layout/Router/withRouter"
import { renderDotActive } from "@lib/helper"
import AppConsts from "@lib/appconst"
import AddSiteVisitModal from "@components/AppComponentBase/addSiteVisitModal"
import AddReservationModal from "@components/AppComponentBase/addReservationModal"
import CreateProposalModal from "@scenes/activity/proposalActivity/components/createProposalModal"
import { portalLayouts } from "@components/Layout/Router/router.config"
import ProposalStore from "@stores/activity/proposalStore"
const { activityTypes } = AppConsts

export interface IUnitProps {
  history: any
  inquiryId: any
  proposalStore: ProposalStore
  unitStore: UnitStore
  visible: boolean
}

export interface IUnitState {
  maxResultCount: number
  skipCount: number
  filters: any
  visible: boolean
  unitId: any
  selectedRowKeys: any[]
  numberUnitChoose: number
  visibleDetailProject: boolean
  projectId: any
  siteVisitModalVisible: boolean
  reservationModalVisible: boolean
  createProposalModal: boolean
}

@inject(Stores.AppDataStore, Stores.UnitStore, Stores.ProposalStore)
@observer
class UnitMatching extends AppComponentListBase<IUnitProps, IUnitState> {
  formRef: any = React.createRef()
  state = {
    maxResultCount: 10,
    skipCount: 0,
    selectedRowKeys: [] as any,
    numberUnitChoose: 0,
    unitId: undefined,
    filters: {
      isActive: true,
    },
    visible: false,
    projectId: null,
    visibleDetailProject: false,
    siteVisitModalVisible: false,
    reservationModalVisible: false,
    createProposalModal: false,
  }

  async componentDidMount() {
    await this.getAll()
  }
  async componentDidUpdate(prevProps, prevState) {
    if (prevProps.visible !== this.props.visible) {
      if (this.props.visible) {
        await this.getAll()
      }
    }
  }
  getAll = async () => {
    this.props.unitStore.getAllUnitMatchingInquiry({
      inquiryId: this.props.inquiryId,
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
  handleFilterChange = async (filters) => {
    await this.setState({ filters })
    await this.getAll()
  }

  gotoDetailProject = (id?) => {
    if (id) {
      this.setState({ projectId: id })
      this.setState({ visibleDetailProject: true })
    } else {
      this.setState({ projectId: null })
      this.setState({ visibleDetailProject: true })
    }
  }
  onSelectChange = (newSelectedRowKeys) => {
    this.setState({ selectedRowKeys: newSelectedRowKeys })
    this.setState({ numberUnitChoose: newSelectedRowKeys.length ?? 0 })
  }

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
  }
  onCreateProposal = async (param) => {
    const model = {
      ...param,
      inquiryId: this.props.inquiryId,
      unitIds: this.state.selectedRowKeys,
    }
    this.setState({ createProposalModal: false })
    await this.props.proposalStore.createOrUpdate(model)
    await this.props.history.push(
      portalLayouts.proposalEditTemplate.path.replace(
        ":id",
        this.props.proposalStore.proposalDetail.id
      )
    )
  }
  public render() {
    const rowSelection = {
      onChange: this.onSelectChange,
      selectedRowKeys: this.state.selectedRowKeys,
      columnWidth: 40,
      hideSelectAll: true,
    }
    const {
      unitStore: { isLoading, listUnitByInquiry },
    } = this.props
    const columns = gettColumns({
      title: L("UNIT_NUMBER"),

      dataIndex: "unitName",
      key: "unitName",
      fixed: "left",
      width: 150,
      ellipsis: false,
      render: (unitName: string, item: any) => (
        <div className="flex gap-1">
          {renderDotActive(item.isActive)}
          {unitName}
        </div>
      ),
    })
    return (
      <>
        <DataTable
          filterComponent={
            <UnitFilterPanel
              inquiryId={this.props.inquiryId}
              filter={this.state.filters}
            />
          }
          handleSearch={this.handleFilterChange}
          onRefresh={() => {
            this.getAll()
          }}
          actionComponent={
            <>
              <Dropdown
                trigger={["click"]}
                disabled={this.state.numberUnitChoose < 1}
                overlay={
                  <Menu className="ant-dropdown-cusstom">
                    <Menu.Item
                      key={1}
                      disabled={this.state.numberUnitChoose > 3}
                      onClick={() =>
                        this.handleCreateActivity(activityTypes.proposal)
                      }
                    >
                      {L("CREATE_PROPOSAL")}
                    </Menu.Item>
                    <Menu.Item
                      key={2}
                      onClick={() =>
                        this.handleCreateActivity(activityTypes.siteVisit)
                      }
                    >
                      {L("CREATE_SITE_VISIT")}
                    </Menu.Item>
                    <Menu.Item
                      key={3}
                      onClick={() =>
                        this.handleCreateActivity(activityTypes.reservation)
                      }
                    >
                      {L("CREATE_RESERVATION_FROM")}
                    </Menu.Item>
                  </Menu>
                }
                placement="bottomLeft"
              >
                <Button className="button-primary">
                  {L("UNIT_CREATE_ACTIVITY")}
                </Button>
              </Dropdown>
            </>
          }
          searchPlaceholder={"UNIT_NAME"}
          pagination={{
            pageSize: this.state.maxResultCount,
            total:
              listUnitByInquiry === undefined
                ? 0
                : listUnitByInquiry.totalCount,
            onChange: this.handleTableChange,
          }}
        >
          <Table
            size="middle"
            className="custom-ant-row"
            rowKey={(record) => record.id}
            columns={columns}
            loading={isLoading}
            pagination={false}
            rowSelection={rowSelection}
            dataSource={
              listUnitByInquiry === undefined ? [] : listUnitByInquiry.items
            }
            scroll={{
              x: 1000,
              y: "calc(100vh - 23rem)",
              scrollToFirstRowOnChange: true,
            }}
          />
        </DataTable>
        <AddSiteVisitModal
          data={this.state.selectedRowKeys}
          inquiryId={this.props.inquiryId}
          visible={this.state.siteVisitModalVisible}
          onCancel={() => {
            this.setState({ siteVisitModalVisible: false })
          }}
          onOk={() => {
            this.setState({ siteVisitModalVisible: false })
          }}
        />
        <AddReservationModal
          data={this.state.selectedRowKeys}
          inquiryId={this.props.inquiryId}
          filter={this.state.filters}
          visible={this.state.reservationModalVisible}
          onCancel={() => {
            this.setState({ reservationModalVisible: false })
          }}
          onOk={() => {
            this.setState({ reservationModalVisible: false })
          }}
        />

        <CreateProposalModal
          visible={this.state.createProposalModal}
          onClose={() => this.setState({ createProposalModal: false })}
          onOk={this.onCreateProposal}
        />
        <style>
          {`
            .ant-col label{
              width: fit-content !important;
            }
          `}
        </style>
      </>
    )
  }
}

export default withRouter(UnitMatching)
