import { L, LNotification } from "@lib/abpUtility"
import { Button, Card, Modal, Table } from "antd"
import React from "react"
import withRouter from "@components/Layout/Router/withRouter"
import { AppComponentListBase } from "@components/AppComponentBase"
import CustomDrawer from "@components/Drawer/CustomDrawer"
import DataTable from "@components/DataTable"
import AppConsts, { appStatusColors } from "@lib/appconst"
import { CloseCircleFilled } from "@ant-design/icons"
import { renderDateTime, renderIsTrue } from "@lib/helper"
import AddStaffModal from "./AddStaffModal"
import OrganizationUnitStore from "@stores/organizationUnit/organizationUnitStore"
import { inject, observer } from "mobx-react"
import Stores from "@stores/storeIdentifier"
const { align } = AppConsts
const confirm = Modal.confirm
export interface Props {
  visible: boolean
  onClose: () => void
  onOk: () => Promise<any>
  id: any
  organizationUnitStore: OrganizationUnitStore
}

export interface State {
  modalVisible: boolean
  maxResultCount: number
  skipCount: number
}
@inject(Stores.OrganizationUnitStore)
@observer
class TeamModal extends AppComponentListBase<Props, State> {
  formRef: any = React.createRef()

  constructor(props) {
    super(props)
    this.state = { modalVisible: false, maxResultCount: 10, skipCount: 0 }
  }
  componentDidUpdate = async (prevProps) => {
    if (prevProps.id !== this.props.id) {
      this.getAll()
    }
  }
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
  }
  async getAll() {
    await this.props.organizationUnitStore.getOUUsers({
      maxResultCount: this.state.maxResultCount,
      skipCount: this.state.skipCount,
      id: this.props.id,
    })
  }
  toggleModal = async () => {
    this.setState((prevState) => ({ modalVisible: !prevState.modalVisible }))
  }
  handleOk = async () => {
    this.toggleModal()
  }
  onRemove = async (id?) => {
    confirm({
      title: LNotification("ARE_YOU_DELETE"),
      okText: L("BTN_YES"),
      cancelText: L("BTN_NO"),
      onOk: async () => {
        await this.props.organizationUnitStore.removeUserFromOrganizationUnit({
          OrganizationUnitId: this.props.id,
          UserId: id,
        })
        await this.getAll()
      },
    })
  }
  render(): React.ReactNode {
    const {
      organizationUnitStore: { userTableData },
      visible,
      onClose,
    } = this.props
    const columns = [
      {
        title: L("NAME"),
        dataIndex: "name",
        key: "name",
        ellipsis: false,
        width: "20%",
        render: (name: string, item: any) => <>{name}</>,
      },
      {
        title: L("IS_HEAD"),
        dataIndex: "isHead",
        align: align.center,
        key: "isHead",
        width: "10%",
        render: (isHead) => <div>{renderIsTrue(isHead)}</div>,
      },
      {
        title: L("CREATE_TIME"),
        dataIndex: "addedTime",
        key: "addedTime",
        width: "20%",
        render: (addedTime) => <div>{renderDateTime(addedTime)}</div>,
      },

      {
        title: L("DELETE"),
        dataIndex: "delete",
        key: "delete",
        align: align.center,
        width: "20%",
        render: (a, row) => (
          <div>
            {
              <>
                <Button
                  type="text"
                  icon={
                    <CloseCircleFilled
                      style={{ color: appStatusColors.error }}
                    />
                  }
                  onClick={() => this.onRemove(row?.id)}
                />
              </>
            }
          </div>
        ),
      },
    ]
    return (
      <CustomDrawer
        useBottomAction
        title={L("DETAIL")}
        visible={visible}
        onClose={() => {
          onClose()
        }}
        // isEdit={this.state.isEdit}
        updatePermission={true} //TODO: add permission
      >
        <Card className="card-detail-modal">
          <>
            <DataTable
              onCreate={this.toggleModal}
              pagination={{
                pageSize: this.state.maxResultCount,
                current: this.currentPage,
                total:
                  userTableData === undefined ? 0 : userTableData.totalCount,
                onChange: this.handleTableChange,
              }}
            >
              <Table
                size="middle"
                className=" custom-ant-row"
                rowKey={(record) => record.id}
                columns={columns}
                pagination={false}
                dataSource={userTableData?.items ?? []}
                bordered
              />
            </DataTable>
          </>
        </Card>
        <AddStaffModal
          idOU={this.props.id}
          visible={this.state.modalVisible}
          onClose={() => {
            this.toggleModal()
            this.getAll()
          }}
          onOk={() => {
            this.handleOk()
            this.getAll()
          }}
        />
      </CustomDrawer>
    )
  }
}
export default withRouter(TeamModal)
