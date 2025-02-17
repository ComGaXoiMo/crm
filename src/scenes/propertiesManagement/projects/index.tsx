import * as React from "react"

import { inject, observer } from "mobx-react"
import DataTable from "@components/DataTable"
import gettColumns from "./components/projectColumn"
import { Button, Col, Dropdown, Menu, Modal, Row, Table, message } from "antd"
import Stores from "@stores/storeIdentifier"
import { MoreOutlined } from "@ant-design/icons"
import { L, LNotification } from "@lib/abpUtility"
import ProjectFilterPanel from "./components/projectFilterPanel"
import ProjectStore from "@stores/projects/projectStore"
import { AppComponentListBase } from "@components/AppComponentBase"
import withRouter from "@components/Layout/Router/withRouter"
import ProjectsDetail from "./components/projectDetail"
import { appPermissions } from "@lib/appconst"
import { renderDotActive } from "@lib/helper"
import AddUserPermissionModal from "./components/userPermissionProject/addUserPermissionModal"
import ChooseInquiryToProposalModal from "@components/AppComponentBase/chooseInquiryToProposalModal"
import CreateProposalModal from "@scenes/activity/proposalActivity/components/createProposalModal"
import ProposalStore from "@stores/activity/proposalStore"
import { portalLayouts } from "@components/Layout/Router/router.config"
const confirm = Modal.confirm
export interface IProjectProps {
  history: any
  projectStore: ProjectStore
  proposalStore: ProposalStore
}

export interface IProjectState {
  maxResultCount: number
  skipCount: number
  filters: any
  visible: boolean
  permissionVisible: boolean
  createProposalModal: boolean
  projectId: any
  selectedRowKeys: any[]
  disableCreateProposal: boolean
  proposalChooseTemplateVisible: boolean
  unitAndInquiryProposal: any
}

@inject(Stores.ProjectStore, Stores.ProposalStore)
@observer
class Projects extends AppComponentListBase<IProjectProps, IProjectState> {
  formRef: any = React.createRef()

  state = {
    maxResultCount: 10,
    skipCount: 0,
    projectId: 0,
    filters: {
      isActive: true,
    },
    visible: false,
    permissionVisible: false,
    createProposalModal: false,
    selectedRowKeys: [] as any,
    disableCreateProposal: true,
    proposalChooseTemplateVisible: false,
    unitAndInquiryProposal: {} as any,
  }

  async componentDidMount() {
    await this.getAll()

    await Promise.all([])
  }
  getAll = async () => {
    await this.props.projectStore.getAll({
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
    await this.handleTableChange({
      current: 1,
      pageSize: this.state.maxResultCount,
    })
  }
  gotoDetail = async (id) => {
    if (id) {
      await this.props.projectStore.get(id)
      await this.setState({ projectId: id, visible: true })
    } else {
      await this.props.projectStore.createProject()
      this.setState({ projectId: null, visible: true })
    }
  }
  toggleModal = () =>
    this.setState((prevState) => ({
      permissionVisible: !prevState.permissionVisible,
    }))

  handleOk = async (params) => {
    if (params.length === 0) {
      message.warning({
        type: "warning",
        content: L("NOT_RECORD_TO_SAVE"),
        duration: 1,
        style: {
          marginTop: "90vh",
        },
      })
    } else {
      await this.props.projectStore.createOrUpdateProjectUser(params)
      await this.toggleModal()
      await this.getAll()
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
        await self.props.projectStore.activateOrDeactivate(id, isActive)
        self.handleTableChange({
          current: 1,
          pageSize: this.state.maxResultCount,
        })
      },
    })
  }
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
  }
  onSelectChange = (newSelectedRowKeys) => {
    this.setState({ selectedRowKeys: newSelectedRowKeys })
    if (newSelectedRowKeys.length < 1 || newSelectedRowKeys.length > 3) {
      this.setState({ disableCreateProposal: true })
    } else {
      this.setState({ disableCreateProposal: false })
    }
  }

  handleCreateProposal = () => {
    this.setState({ createProposalModal: true })
  }
  public render() {
    const {
      projectStore: { isLoading, tableData },
    } = this.props
    const rowSelection = {
      onChange: this.onSelectChange,
      selectedRowKeys: this.state.selectedRowKeys,
      columnWidth: 20,
      hideSelectAll: true,
    }
    const columns = gettColumns({
      title: L("PROJECT_NAME"),
      dataIndex: "projectName",
      key: "projectName",
      width: 230,
      ellipsis: false,

      render: (projectName: string, item: any) => (
        <Row>
          <Col
            sm={{ span: 21, offset: 0 }}
            style={{ overflow: "hidden", textOverflow: "ellipsis" }}
          >
            <a
              onClick={
                this.isGranted(appPermissions.project.detail)
                  ? () => this.gotoDetail(item.id)
                  : () => console.log()
              }
              className="link-text-table"
            >
              {renderDotActive(item.isActive)} {projectName}
            </a>
          </Col>
          <Col sm={{ span: 3, offset: 0 }}>
            <Dropdown
              trigger={["click"]}
              overlay={
                <Menu>
                  {this.isGranted(appPermissions.project.delete) && (
                    <Menu.Item
                      key={1}
                      onClick={() =>
                        this.activateOrDeactivate(item.id, !item.isActive)
                      }
                    >
                      {L(item.isActive ? "DEACTIVATE" : "ACTIVATE")}
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
            <ProjectFilterPanel handleSearch={this.handleFilterChange} />
          }
          handleSearch={this.handleFilterChange}
          searchPlaceholder={"PROJECT_NAME"}
          onCreate={() => {
            this.gotoDetail(null)
          }}
          onRefresh={() => this.getAll()}
          actionComponent={
            <>
              {" "}
              {this.isGranted(appPermissions.inquiry.create) && (
                <Button
                  className="button-primary"
                  disabled={this.state.disableCreateProposal}
                  onClick={() => this.handleCreateProposal()}
                >
                  {L("PROJECT_CREATE_PROPOSAL")}
                </Button>
              )}
              {this.isGranted(appPermissions.project.userPermission) && (
                <Button
                  className="button-primary"
                  onClick={() => this.toggleModal()}
                >
                  {L("PROJECT_USER_PERMISSION")}
                </Button>
              )}
            </>
          }
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
            dataSource={tableData.items ?? []}
            rowSelection={rowSelection}
            scroll={{ x: 1000, scrollToFirstRowOnChange: true }}
          />
        </DataTable>
        <ProjectsDetail
          id={this.state.projectId}
          visible={this.state.visible}
          onCancel={() => {
            this.setState({ visible: false })
          }}
          onOk={() => {
            this.getAll()
          }}
        />
        <AddUserPermissionModal
          id={this.state.projectId}
          visible={this.state.permissionVisible}
          onClose={this.toggleModal}
          onOk={this.handleOk}
        />
        <ChooseInquiryToProposalModal
          projectIds={this.state.selectedRowKeys}
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
export default withRouter(Projects)
