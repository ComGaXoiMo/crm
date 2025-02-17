import * as React from "react"

import { inject, observer } from "mobx-react"
import { AppComponentListBase } from "@components/AppComponentBase"
import { Button, Divider, Table } from "antd"
import { L } from "@lib/abpUtility"
import Stores from "@stores/storeIdentifier"
import ProjectStore from "@stores/projects/projectStore"
// import FileUploadWrap from "@components/FileUpload/FileUploadCRM";
import FileStore from "@stores/common/fileStore"
import UnitStore from "@stores/projects/unitStore"
import withRouter from "@components/Layout/Router/withRouter"
import AppDataStore from "@stores/appDataStore"
import DocumentFilter from "./components/documentTrailFilter"
import gettColumns from "./components/documentColumn"
import DataTable from "@components/DataTable"
import { DeleteOutlined, EditOutlined } from "@ant-design/icons"
import CreateDocumentModal from "./components/createDocumentModal"

const dataFake = [
  {
    id: 1,
    name: "Document Lease",
    type: "LA",
    remakr: "Note ...",
  },
  {
    id: 2,
    name: "Document Tenant",
    type: "Offer",
    remakr: "Note ...",
  },
  {
    id: 3,
    name: "Document Tenant",
    type: "License",
    remakr: "Note ...",
  },
]

export interface IDocumentProps {
  projectStore: ProjectStore
  unitStore: UnitStore
  params: any
  appDataStore: AppDataStore
  fileStore: FileStore
}
export interface IDocumentState {
  maxResultCount: number
  skipCount: number
  filters: any
  projectProvinces: any[]
  projectId: number
  visible: boolean
  modalVisible: boolean
  dateSend: any
  title: string
  tabView: string
}

@inject(Stores.ProjectStore, Stores.UnitStore, Stores.AppDataStore)
@observer
class Document extends AppComponentListBase<IDocumentProps, IDocumentState> {
  formRef: any = React.createRef()
  formRefProjectAddress: any = React.createRef()

  constructor(props: IDocumentProps) {
    super(props)
    this.state = {
      maxResultCount: 10,
      skipCount: 0,
      projectId: 0,
      projectProvinces: [],
      filters: {},
      visible: false,
      title: L("CREATE"),
      modalVisible: false,
      dateSend: "null",
      tabView: L("LISTING"),
    }
  }

  async componentDidMount() {
    await Promise.all([this.getDetail(this.props.params?.id)])
  }
  getDetail = async (id?) => {
    console.log()
  }
  toggleModal = () => {
    this.setState({ dateSend: null })
    this.setState((prevState) => ({ modalVisible: !prevState.modalVisible }))
  }

  handleOk = async () => {
    this.toggleModal()
  }
  gotoDetail = (record) => {
    this.setState({ dateSend: record })
    this.setState({ modalVisible: true })
  }
  public render() {
    const columns = gettColumns({
      title: L("ACTIONS"),
      dataIndex: "operation",
      key: "operation",
      width: 80,
      render: (text: string, item: any) => (
        <div>
          {/* {this.isGranted(appPermissions.a.update) && ( */}
          <Button
            size="small"
            className="ml-1"
            shape="circle"
            icon={<EditOutlined />}
          />
          {/* )} */}
          {/* {this.isGranted(appPermissions.a.delete) && ( */}
          <Button
            size="small"
            className="ml-1"
            shape="circle"
            icon={<DeleteOutlined />}
            // onClick={() => this.activateOrDeactivate(item.id, !item.isActive)}
          />
          {/* )} */}
        </div>
      ),
    })
    return (
      <>
        <Divider
          orientation="left"
          orientationMargin="0"
          style={{ fontWeight: 600 }}
        >
          {L("Document")}
        </Divider>
        <DocumentFilter
          onCreate={() => {
            this.toggleModal()
          }}
        />
        {/* <Card className="card-detail-modal"> */}
        <DataTable
          // extraFilterComponent={filterComponent}
          // onRefresh={this.getAll}
          // onCreate={() => this.gotoDetail(null)}
          pagination={{
            pageSize: this.state.maxResultCount,
            // total: tableData === undefined ? 0 : tableData.totalCount,
          }}
        >
          <Table
            size="middle"
            className=""
            rowKey={(record) => record.id}
            columns={columns}
            onRow={(record) => ({
              onClick: () => this.gotoDetail(record),
            })}
            pagination={false}
            dataSource={dataFake}
            scroll={{ x: 800, y: 500, scrollToFirstRowOnChange: true }}
          />
        </DataTable>
        {/* </Card> */}
        <CreateDocumentModal
          dataSend={this.state.dateSend}
          visible={this.state.modalVisible}
          onClose={this.toggleModal}
          onOk={this.handleOk}
        />
      </>
    )
  }
}

export default withRouter(Document)
