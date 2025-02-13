import { L, LNotification } from "@lib/abpUtility"
import { Button, Col, Form, Modal, Row, Switch, Table } from "antd"
import React from "react"
import withRouter from "@components/Layout/Router/withRouter"
import { AppComponentListBase } from "@components/AppComponentBase"
import Stores from "@stores/storeIdentifier"
import { inject, observer } from "mobx-react"
import DataTable from "@components/DataTable"
import { CloseCircleFilled } from "@ant-design/icons"
import ProjectStore from "@stores/projects/projectStore"
import AppConsts from "@lib/appconst"
const { align } = AppConsts
const confirm = Modal.confirm
interface Props {
  projectStore: ProjectStore
  visible: boolean
  projectId: any
}

interface State {
  maxResultCount: number
  skipCount: number
}

@inject(Stores.ProjectStore)
@observer
class ProjectUserPermission extends AppComponentListBase<Props, State> {
  formRef: any = React.createRef()

  constructor(props) {
    super(props)
    this.state = {
      maxResultCount: 10,
      skipCount: 0,
    }
  }
  componentDidMount(): void {
    this.getAll("")
  }
  async componentDidUpdate(prevProps) {
    if (prevProps.visible !== this.props.visible) {
      if (this.props.visible) {
        this.getAll("")
      }
    }
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
  getAll = async (keyword?) => {
    await this.props.projectStore.getListProjectUserPermission({
      maxResultCount: this.state.maxResultCount,
      skipCount: this.state.skipCount,
      projectId: this.props.projectId,
      keyword: keyword,
    })
  }
  changePermission = async (id, projectId, userId, typeId) => {
    confirm({
      title: LNotification("DO_YOU_WANT_TO_CHANGE_PERMISSION"),
      okText: L("BTN_YES"),
      cancelText: L("BTN_NO"),
      onOk: async () => {
        await this.props.projectStore.updatePermission({
          id: id,
          projectId: projectId,
          userId: userId,
          typeId: typeId,
        })
        await this.getAll("")
      },
    })
  }
  removeUser = async (id) => {
    const self = this
    confirm({
      title: LNotification("DO_YOU_WANT_TO_REMOVE_THIS_USER"),
      okText: L("BTN_YES"),
      cancelText: L("BTN_NO"),
      onOk: async () => {
        await self.props.projectStore.deleteUserPermission(id)
      },
    })
  }
  render(): React.ReactNode {
    const {
      projectStore: { listProjectUserPermission, isLoading },
    } = this.props

    const columns = [
      {
        title: L("STAFF"),
        dataIndex: "user",
        key: "user",
        width: 300,
        ellipsis: false,
        render: (user) => <>{user?.displayName}</>,
      },

      {
        title: L("PERMISSION"),
        dataIndex: "typeId",
        key: "typeId",
        width: 300,
        align: align.center,
        ellipsis: false,
        render: (typeId: any, item: any) => (
          // <> {typeId === 2 ? L("WRITE") : L("READ")}</>
          <div>
            <style>
              {`
        .ant-switch{
          backgroundColor:blue
        }
        .ant-switch-checked{
          backgroundColor:greend
        }
        
        `}
            </style>

            <Switch
              // style={{ backgroundColor: "#30c562" }}
              checkedChildren={L("WRITE")}
              unCheckedChildren={L("READ")}
              onChange={() => {
                let typeId

                if (item.typeId === 2) {
                  typeId = 1
                } else {
                  typeId = 2
                }

                this.changePermission(
                  item.id,
                  item.projectId,
                  item.userId,
                  typeId
                )
              }}
              checked={typeId === 2}
            />
          </div>
        ),
      },
      {
        title: L(""),
        dataIndex: "action",
        key: "action",

        ellipsis: false,
        // align: "center",
        render: (_: any, record: any, index) => {
          return (
            <span>
              <Button
                type="text"
                icon={<CloseCircleFilled style={{ color: "red" }} />}
                onClick={() => this.removeUser(record?.id)}
              />
            </span>
          )
        },
      },
    ]

    return (
      <>
        <Form ref={this.formRef} layout={"vertical"} size="middle">
          <div className="w-100">
            <Row gutter={[8, 0]} style={{ alignItems: "center" }}>
              <Col sm={{ span: 24 }}>
                <DataTable
                  pagination={{
                    pageSize: this.state.maxResultCount,
                    total:
                      listProjectUserPermission === undefined
                        ? 0
                        : listProjectUserPermission.totalCount,
                    onChange: this.handleTableChange,
                  }}
                >
                  <Table
                    size="middle"
                    className="custom-ant-row"
                    rowKey={(record) => record?.id}
                    columns={columns}
                    pagination={false}
                    dataSource={listProjectUserPermission?.items ?? []}
                    loading={isLoading}
                    scroll={{ x: 100, scrollToFirstRowOnChange: true }}
                  />
                </DataTable>
              </Col>
            </Row>
          </div>
        </Form>
      </>
    )
  }
}
export default withRouter(ProjectUserPermission)
