import { AppComponentListBase } from "@components/AppComponentBase"
import withRouter from "@components/Layout/Router/withRouter"
import { L } from "@lib/abpUtility"
import Stores from "@stores/storeIdentifier"
import { Checkbox, Col, Form, Input, Modal, Row, Table } from "antd"
import { inject, observer } from "mobx-react"
import React from "react"
import AppConsts from "@lib/appconst"
import { debounce } from "lodash"
import OrganizationUnitStore from "@stores/organizationUnit/organizationUnitStore"
import DataTable from "@components/DataTable"
const { align } = AppConsts
const Search = Input.Search
interface Props {
  idOU: any;
  visible: boolean;
  onClose: () => void;
  onOk: () => void;
  status?: any;
  organizationUnitStore: OrganizationUnitStore;
}
interface State {
  selectedRowKeys: any[];
  filter: string;
  objCreate: any;
  maxResultCount: any;
  listLead: any[];
  skipCount: any;
}
@inject(Stores.OrganizationUnitStore)
@observer
class AddStaffModal extends AppComponentListBase<Props, State> {
  form: any = React.createRef();
  constructor(props: Props) {
    super(props)
    this.state = {
      selectedRowKeys: [],
      filter: "",
      objCreate: {} as any,
      maxResultCount: 10,
      skipCount: 0,
      listLead: [] as any,
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
  };
  async componentDidUpdate(prevProp) {
    if (prevProp.visible !== this.props.visible) {
      await this.setState({ skipCount: 0 })
      await this.getAll()
    }
  }
  async getAll() {
    await this.props.organizationUnitStore.findUsers({
      maxResultCount: this.state.maxResultCount,
      skipCount: this.state.skipCount,
      filter: this.state.filter,
      organizationUnitId: this.props.idOU,
    })
  }
  onSelectChange = (newSelectedRowKeys) => {
    this.setState({ selectedRowKeys: newSelectedRowKeys })
  };
  updateSearch = debounce((event) => {
    this.setState({ filter: event.target?.value })
  }, 100);

  handleSearch = (value: string) => {
    this.setState({ filter: value }, async () => await this.getAll())
  };
  onOk = async () => {
    const res = await this.state.selectedRowKeys.map((item) => {
      const checkIsHead = this.state.listLead.find((lead) => lead === item)
      if (checkIsHead) {
        return { userId: item, isHead: true }
      } else {
        return { userId: item, isHead: false }
      }
    })
    await this.setState({
      objCreate: {
        organizationUnitId: this.props.idOU,
        listUsersHead: res,
      },
    })
    await this.props.organizationUnitStore.addUsersToOrganizationUnit(
      this.state.objCreate
    )
    this.props.onOk()
  };
  onClose = async () => {
    this.props.onClose()
  };
  render(): React.ReactNode {
    const { listUsers } = this.props.organizationUnitStore
    const { visible } = this.props
    const columns = [
      {
        title: L("FULL_NAME"),
        dataIndex: "name",
        key: "name",
        ellipsis: false,
        render: (name, row) => <>{name}</>,
      },
      {
        title: L("IS_HEAD"),
        dataIndex: "isHead",
        key: "isHead",
        ellipsis: false,
        width: 200,
        align: align.left,
        render: (isHead, row) => (
          <>
            {this.state.selectedRowKeys.find((item) => item === row?.value) && (
              <Checkbox
                onChange={(e) => {
                  if (e.target.checked) {
                    this.setState({
                      listLead: [...this.state.listLead, row?.value],
                    })
                  }
                }}
              ></Checkbox>
            )}
          </>
        ),
      },
    ]

    const rowSelection = {
      selectedRowKeys: this.state.selectedRowKeys,
      onChange: this.onSelectChange,
    }
    return (
      this.props.visible && (
        <Modal
          open={visible}
          width={"60%"}
          destroyOnClose
          style={{ top: 20 }}
          title={L("SELECT_USER")}
          cancelText={L("BTN_CANCEL")}
          onCancel={this.onClose}
          onOk={this.onOk}
        >
          <Form layout={"vertical"} ref={this.form} size="middle">
            <Row gutter={[16, 8]}>
              <Col sm={{ span: 24 }}>
                <Search
                  placeholder={L("SEARCH")}
                  onChange={this.updateSearch}
                  onSearch={this.handleSearch}
                />
              </Col>
              <Col sm={{ span: 24 }}>
                <DataTable
                  pagination={{
                    pageSize: this.state.maxResultCount,
                    total: listUsers === undefined ? 0 : listUsers?.totalCount,
                    onChange: this.handleTableChange,
                  }}
                >
                  <Table
                    rowKey={(record) => record.value}
                    rowSelection={rowSelection}
                    pagination={false}
                    columns={columns}
                    dataSource={listUsers?.items ?? []}
                  />
                </DataTable>
              </Col>
            </Row>
          </Form>
        </Modal>
      )
    )
  }
}
export default withRouter(AddStaffModal)
