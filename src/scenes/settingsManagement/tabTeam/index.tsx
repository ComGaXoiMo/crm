import * as React from "react"

import { inject, observer } from "mobx-react"
import { AppComponentListBase } from "@components/AppComponentBase"
import {
  Button,
  Col,
  Dropdown,
  // Input,
  Menu,
  Row,
  Table,
  Modal as AntdModal,
} from "antd"
import { L, LNotification } from "@lib/abpUtility"
// import FileUploadWrap from "@components/FileUpload/FileUploadCRM";
import withRouter from "@components/Layout/Router/withRouter"
import getColumns from "./components/columns"
import DataTable from "@components/DataTable"
import Modal from "./components/Modal"
import {
  MoreOutlined,
  PlusCircleFilled,
  ReloadOutlined,
} from "@ant-design/icons"
import CreateModal from "./components/CreateModal"
import OrganizationUnitStore from "@stores/organizationUnit/organizationUnitStore"
import Stores from "@stores/storeIdentifier"
import { appPermissions } from "@lib/appconst"
// const Search = Input.Search;

const confirm = AntdModal.confirm
export interface ITeamProps {
  params: any;
  organizationUnitStore: OrganizationUnitStore;
}
export interface ITeamState {
  maxResultCount: number;
  skipCount: number;
  modalVisible: boolean;
  createModalVisible: boolean;
  dateSend: any;
  title: string;
  idOU: any;
}

@inject(Stores.OrganizationUnitStore)
@observer
class Team extends AppComponentListBase<ITeamProps, ITeamState> {
  formRef: any = React.createRef();
  formRefProjectAddress: any = React.createRef();

  constructor(props: ITeamProps) {
    super(props)
    this.state = {
      maxResultCount: 10,
      skipCount: 0,
      title: L("CREATE"),
      modalVisible: false,
      dateSend: "null",
      createModalVisible: false,
      idOU: undefined,
    }
  }

  async componentDidMount() {
    await this.getAll()
  }

  getAll = async () => {
    await this.props.organizationUnitStore.getAll({})
  };
  toggleModal = async () => {
    this.setState((prevState) => ({ modalVisible: !prevState.modalVisible }))
  };
  handleOk = async () => {
    this.getAll()
    this.toggleModal()
  };
  handleClose = async () => {
    await this.getAll()
    await this.toggleModal()
  };
  deleteOU = async (id: number) => {
    const self = this
    confirm({
      title: LNotification("DO_YOU_WANT_TO_DELETE_THIS_ITEM"),
      okText: L("BTN_YES"),
      cancelText: L("BTN_NO"),
      onOk: async () => {
        await self.props.organizationUnitStore.deleteOU(id)
        // self.handleTableChange({ current: 1, pageSize: 10 });
        await this.getAll()
      },
    })
  };
  renderFilterComponent = () => {
    return (
      <Row gutter={[8, 8]}>
        <Col sm={{ span: 6, offset: 0 }}>
          {/* <Search placeholder={L("TEAM_NAME")} /> */}
          <label> </label>
        </Col>

        {this.isGranted(appPermissions.adminTeam.create) && (
          <div style={{ position: "absolute", display: "flex", right: 10 }}>
            {/*  <Tooltip title={L("EXPORT_EXCEL")} placement="topLeft">
            <Button
              icon={<ExcelIcon />}
              className="button-primary"
              onClick={() => {}}
            ></Button></Tooltip> */}
            {this.isGranted(appPermissions.adminTeam.create) && (
              <Button
                icon={<PlusCircleFilled />}
                className="button-primary"
                onClick={() => this.setState({ createModalVisible: true })}
              ></Button>
            )}
            <Button
              icon={<ReloadOutlined />}
              className="button-primary"
              onClick={() => this.getAll()}
            ></Button>
          </div>
        )}
      </Row>
    )
  };

  public render() {
    const columns = getColumns({
      title: L("TEAM_NAME"),
      dataIndex: "displayName",
      key: "displayName",
      ellipsis: false,
      width: "20%",
      render: (text: string, item: any) => (
        <Row>
          <Col sm={{ span: 21, offset: 0 }}>
            <a
              onClick={() => {
                this.setState({ idOU: item?.id })
                this.toggleModal()
              }}
              className="link-text-table"
            >
              {text}
            </a>
          </Col>
          <Col sm={{ span: 3, offset: 0 }}>
            <Dropdown
              trigger={["click"]}
              overlay={
                <Menu>
                  {this.isGranted(appPermissions.adminTeam.delete) && (
                    <Menu.Item key={1} onClick={() => this.deleteOU(item.id)}>
                      {L("DELETE_ORGANIZATION_UNIT")}
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
    const {
      organizationUnitStore: { tableData, isLoading },
    } = this.props
    return (
      <>
        <DataTable
          // onCreate={() => this.setState({ createModalVisible: true })}

          pagination={{
            pageSize: this.state.maxResultCount,
          }}
          filterComponent={this.renderFilterComponent()}
        >
          <Table
            size="middle"
            className="custom-ant-row"
            rowKey={(record) => record.id}
            columns={columns}
            loading={isLoading}
            pagination={false}
            dataSource={tableData ?? []}
            // scroll={{ x: 1000, y: 1000, scrollToFirstRowOnChange: true }}
            bordered
          />
        </DataTable>
        <Modal
          visible={this.state.modalVisible}
          onClose={this.handleClose}
          onOk={this.handleOk}
          id={this.state.idOU}
        />
        <CreateModal
          visible={this.state.createModalVisible}
          onClose={() => {
            this.setState({ createModalVisible: false })
          }}
          onOk={() => {
            this.getAll(), this.setState({ createModalVisible: false })
          }}
        />
      </>
    )
  }
}

export default withRouter(Team)
