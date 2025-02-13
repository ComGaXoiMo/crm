import * as React from "react"

import { inject, observer } from "mobx-react"
import { AppComponentListBase } from "@components/AppComponentBase"
import { Button, Modal, Table } from "antd"
import { L, LNotification } from "@lib/abpUtility"
import Stores from "@stores/storeIdentifier"
// import FileUploadWrap from "@components/FileUpload/FileUploadCRM";
import withRouter from "@components/Layout/Router/withRouter"
import AppDataStore from "@stores/appDataStore"
import DocumentFilter from "./components/documentTrailFilter"
import gettColumns from "./components/documentColumn"
import DataTable from "@components/DataTable"
import { DeleteOutlined, DownloadOutlined } from "@ant-design/icons"
import CreateDocumentModal from "./components/createDocumentModal"
import FileStore from "@stores/common/fileStore"
import fileService from "@services/common/fileService"
import dayjs from "dayjs"
const confirm = Modal.confirm

export interface IComponentDocumentProps {
  params: any
  appDataStore: AppDataStore
  fileStore: FileStore
  inputId: any
  moduleId: string

  createPermission: boolean
  updatePermission: boolean
  deletePermission: boolean
}
export interface IComponentDocumentState {
  maxResultCount: number
  skipCount: number
  filters: any
  visible: boolean
  modalVisible: boolean
}

@inject(Stores.AppDataStore, Stores.FileStore)
@observer
class ComponentDocument extends AppComponentListBase<
  IComponentDocumentProps,
  IComponentDocumentState
> {
  formRef: any = React.createRef()

  constructor(props: IComponentDocumentProps) {
    super(props)
    this.state = {
      maxResultCount: 10,
      skipCount: 0,
      filters: {},
      visible: false,
      modalVisible: false,
    }
  }

  async componentDidMount() {
    this.getAll()
    await Promise.all([this.getDetail(this.props.params?.id)])
  }
  async componentDidUpdate(prevProps) {
    if (prevProps.inputId !== this.props.inputId) {
      this.getAll()
    }
  }

  getAll = async () => {
    await this.props.fileStore.getFiles(this.props.inputId)
  }
  getDetail = async (id?) => {
    console.log()
  }
  toggleModal = () => {
    this.setState((prevState) => ({ modalVisible: !prevState.modalVisible }))
  }

  handleOk = async (file) => {
    let formValues = await this.formRef.current?.validateFields()
    formValues = {
      ...formValues,
      uniqueId: this.props.inputId,
    }
    if (formValues.uploadDate) {
      formValues = {
        ...formValues,
        uploadDate: dayjs(formValues?.uploadDate).toDate(),
      }
    }
    await fileService
      .uploadDocument(this.props.moduleId, formValues, file)
      .then(this.getAll)
    this.toggleModal()
  }
  handleRemoveFile = async (file) => {
    confirm({
      title: LNotification("DO_YOU_WANT_TO_DEACTIVATE_THESE_ITEM"),
      okText: L("BTN_YES"),
      cancelText: L("BTN_NO"),
      onOk: async () => {
        if (file.id) {
          file.isActive = false
          await this.props.fileStore.delete(file.guid)
          this.getAll()
          return
        }
      },
    })
  }
  gotoDetail = (record) => {
    this.setState({ modalVisible: true })
  }
  public render() {
    const {
      fileStore: { currentFiles },
    } = this.props
    const columns = gettColumns({
      title: L("ACTIONS"),
      dataIndex: "operation",
      key: "operation",
      width: 80,
      render: (text: string, item: any) => (
        <div>
          {this.props.updatePermission && (
            <Button
              size="small"
              className="ml-1"
              shape="circle"
              icon={<DownloadOutlined />}
              // onClick={() => this.gotoDetail(1)}
              href={item?.fileUrl}
              target="_blank"
            />
          )}
          {this.props.deletePermission && (
            <Button
              size="small"
              className="ml-1"
              shape="circle"
              icon={<DeleteOutlined />}
              onClick={() => this.handleRemoveFile(item)}
            />
          )}
        </div>
      ),
    })
    return (
      <>
        <DocumentFilter
          onCreate={() => {
            this.toggleModal()
          }}
          onRefresh={() => {
            this.getAll()
          }}
          createPermission={this.props.createPermission}
        />

        <DataTable
          pagination={{
            pageSize: this.state.maxResultCount,
            // total: tableData === undefined ? 0 : tableData.totalCount,
          }}
        >
          <Table
            size="middle"
            className=""
            // rowKey={(record) => record.id}
            columns={columns}
            pagination={false}
            dataSource={currentFiles ?? []}
            scroll={{ x: 800, y: 500, scrollToFirstRowOnChange: true }}
            bordered
          />
        </DataTable>
        {/* </Card> */}

        <CreateDocumentModal
          form={this.formRef}
          visible={this.state.modalVisible}
          onClose={this.toggleModal}
          onOk={this.handleOk}
        />
      </>
    )
  }
}

export default withRouter(ComponentDocument)
