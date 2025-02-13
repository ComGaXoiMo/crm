import { L } from "@lib/abpUtility"
import { Button, Col, Form, Modal, Row, Select, Switch, Table } from "antd"
import React from "react"
import withRouter from "@components/Layout/Router/withRouter"
import { AppComponentListBase } from "@components/AppComponentBase"
import Stores from "@stores/storeIdentifier"
import { inject, observer } from "mobx-react"
import UserStore from "@stores/administrator/userStore"
import _, { debounce } from "lodash"
import { filterOptions, renderOptions } from "@lib/helper"
import DataTable from "@components/DataTable"
import { CloseCircleFilled } from "@ant-design/icons"
import AppConsts from "@lib/appconst"
import ProjectStore from "@stores/projects/projectStore"
const { projectPermissionType, align } = AppConsts
interface Props {
  visible: boolean;
  onClose: () => void;
  onOk: (params) => void;
  data: any;
  userStore: UserStore;
  projectStore: ProjectStore;
}

interface State {
  listUser: any[];
  listProject: any[];
  maxResultCount: number;
  skipCount: number;
  dataTable: any;
}

@inject(Stores.UserStore, Stores.ProjectStore)
@observer
class AddUserPermissionModal extends AppComponentListBase<Props, State> {
  formRef: any = React.createRef();

  constructor(props) {
    super(props)
    this.state = {
      listUser: [] as any,
      listProject: [] as any,
      maxResultCount: 50,
      skipCount: 0,
      dataTable: [],
    }
  }
  async componentDidUpdate(prevProps) {
    if (prevProps.visible !== this.props.visible) {
      if (this.props.visible) {
        // this.form.current?.setFieldsValue(this.props.data);

        this.getStaff("")
        this.getProject()
      } else {
        this.setState({ dataTable: [] })
      }
    }
  }

  addData = async () => {
    const formValues = await this.formRef.current?.validateFields()

    const result = [] as any

    for (let i = 0; i < formValues.userId.length; i++) {
      for (let j = 0; j < formValues.projectId.length; j++) {
        const obj = {
          userId: formValues.userId[i],
          projectId: formValues.projectId[j],
          typeId: formValues.typeId,
        }

        result.push(obj)
      }
    }
    this.getStaff("")
    this.setState({ dataTable: result })
  };

  getStaff = async (keyword) => {
    await this.props.userStore.getAll({
      maxResultCount: this.state.maxResultCount,
      skipCount: this.state.skipCount,
      keyword: keyword,
    })
    const lsitUser = [...this.props.userStore.users.items]

    lsitUser.map((i) => {
      return { id: i.id, name: i.name }
    })
    this.setState({ listUser: lsitUser })
  };
  handleSearchStaff = debounce((keyword) => {
    this.getStaff(keyword)
  }, 400);

  getProject = async () => {
    await this.props.projectStore.getSimpleProject()
    this.setState({ listProject: this.props.projectStore?.listAllProject })
  };
  // handleSearchProject = debounce(() => {
  //   this.getProject();
  // }, 400);

  removeUser = async (index: number) => {
    await this.state.dataTable.splice(index, 1)
    await this.setState({ dataTable: [...this.state.dataTable] })
  };
  changePermission = async (item, index) => {
    let data
    if (item.typeId === 2) {
      data = { ...item, typeId: 1 }
    } else {
      data = { ...item, typeId: 2 }
    }
    await this.state.dataTable.splice(index, 1, data)
    await this.setState({ dataTable: [...this.state.dataTable] })
  };
  render(): React.ReactNode {
    const { visible, onClose, onOk } = this.props
    const { dataTable, listUser } = this.state

    const columns = [
      {
        title: L("STAFF"),
        dataIndex: "userId",
        key: "userId",
        width: 250,
        ellipsis: false,
        render: (userId: any) =>
          listUser.find((item) => item.id === userId)?.name,
      },
      {
        title: L("PROJECT"),
        dataIndex: "projectId",
        key: "projectId",
        width: 250,
        ellipsis: false,
        render: (projectId: any) =>
          this.state.listProject.find((item) => item.id === projectId)?.name,
      },
      {
        title: L("PERMISSION"),
        dataIndex: "typeId",
        key: "typeId",
        width: 250,
        align: align.center,
        ellipsis: false,
        render: (typeId: any, item: any, index) => (
          // <> {typeId === 2 ? L("WRITE") : L("READ")}</>
          <div>
            <Switch
              // style={{ backgroundColor: "#30c562" }}
              checkedChildren={L("WRITE")}
              unCheckedChildren={L("READ")}
              onChange={() => {
                this.changePermission(item, index)
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
        width: 80,
        ellipsis: false,
        align: align.center,
        // align: "center",
        render: (_: any, record: any, index) => {
          return (
            <span>
              <Button
                type="text"
                icon={<CloseCircleFilled style={{ color: "red" }} />}
                onClick={() => this.removeUser(index)}
              />
            </span>
          )
        },
      },
    ]

    return (
      this.props.visible && (
        <Modal
          style={{ top: 20 }}
          title={L("PROJECT_ADD_USER_PERMISSION")}
          visible={visible}
          maskClosable={false}
          // visible={true}
          width={"60%"}
          onOk={() => onOk(this.state.dataTable)}
          onCancel={onClose}
          closable={false}
        >
          <Form ref={this.formRef} layout={"vertical"} size="middle">
            <div className="w-100">
              <Row gutter={[8, 0]} style={{ alignItems: "center" }}>
                <Col sm={{ span: 7 }}>
                  <Form.Item label={L("STAFF")} name="userId">
                    <Select
                      getPopupContainer={(trigger) => trigger.parentNode}
                      showSearch
                      allowClear
                      mode="multiple"
                      onSearch={this.handleSearchStaff}
                      filterOption={filterOptions}
                      className="full-width"
                    >
                      {renderOptions(listUser ?? [])}
                    </Select>
                  </Form.Item>
                </Col>
                <Col sm={{ span: 7 }}>
                  <Form.Item label={L("PROJECT")} name="projectId">
                    <Select
                      getPopupContainer={(trigger) => trigger.parentNode}
                      showSearch
                      allowClear
                      mode="multiple"
                      filterOption={filterOptions}
                      className="full-width"
                    >
                      {renderOptions(this.props.projectStore?.listAllProject)}
                    </Select>
                  </Form.Item>
                </Col>
                <Col sm={{ span: 7 }}>
                  <Form.Item label={L("PROJECT_PERMISSION")} name="typeId">
                    <Select
                      getPopupContainer={(trigger) => trigger.parentNode}
                      showSearch
                      allowClear
                      filterOption={filterOptions}
                      className="full-width"
                    >
                      {renderOptions(projectPermissionType)}
                    </Select>
                  </Form.Item>
                </Col>
                <Col sm={{ span: 3 }}>
                  <Button
                    className="button-primary"
                    onClick={() => this.addData()}
                  >
                    {L("PUSH")}
                  </Button>
                </Col>
                <Col sm={{ span: 24 }}>
                  <DataTable
                  // pagination={{
                  //   pageSize: this.state.maxResultCount,
                  //   total: dataTable === undefined ? 0 : dataTable.totalCount,
                  //   // onChange: this.handleTableChange,
                  // }}
                  >
                    <Table
                      size="middle"
                      className="custom-ant-row"
                      rowKey={(record) => record.id}
                      columns={columns}
                      pagination={false}
                      dataSource={dataTable ?? []}
                      // loading={}
                      scroll={{ x: 100, scrollToFirstRowOnChange: true }}
                    />
                  </DataTable>
                </Col>
              </Row>
            </div>
          </Form>
        </Modal>
      )
    )
  }
}
export default withRouter(AddUserPermissionModal)
