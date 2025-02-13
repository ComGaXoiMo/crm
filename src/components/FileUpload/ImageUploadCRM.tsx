import React from "react"
import { PlusOutlined } from "@ant-design/icons/lib"
import { Upload, message, Modal } from "antd"
import { AppComponentListBase } from "@components/AppComponentBase"
import { inject, observer } from "mobx-react"
import Stores from "../../stores/storeIdentifier"
import FileStore from "../../stores/common/fileStore"
import { L, LError, LNotification } from "@lib/abpUtility"
import fileService from "@services/common/fileService"
import { RcFile, UploadFile, UploadProps } from "antd/es/upload/interface"
import dayjs from "dayjs"
import withRouter from "@components/Layout/Router/withRouter"
import AppConsts from "@lib/appconst"
const { documentType } = AppConsts
const confirm = Modal.confirm

interface IImageUploadWrapProps {
  parentId: string
  moduleId: string
  type?: string
  fileStore: FileStore
  acceptedFileTypes?: string[]
  maxFile?: number
}
const getBase64 = (file: RcFile): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = (error) => reject(error)
  })
@inject(Stores.FileStore)
@observer
class ImageUploadWrapCRM extends AppComponentListBase<IImageUploadWrapProps> {
  state = {
    files: [] as any[],
    combineFileTypes: this.props.acceptedFileTypes?.join(","),
    previewOpen: false,
    previewImage: "",
    previewTitle: "",
  }

  componentDidMount = async () => {
    if (this.props.parentId) {
      this.initFiles()
    } else {
      this.props.fileStore.currentFiles = []
    }
  }

  componentDidUpdate = async (prevProps) => {
    if (prevProps.parentId !== this.props.parentId) {
      this.initFiles()
    }
  }

  initFiles = async () => {
    if (!this.props.moduleId || !this.props.parentId) {
      this.setState({ files: [] })
      return
    }
    const files = await fileService.getDocumentByModuleId(
      this.props.moduleId,
      this.props.parentId,
      this.props.type
    )
    const listFiles = files.filter(
      (item) => item.documentTypeId === documentType.image
    )

    await this.setState({ files: listFiles })
  }

  updateMainPhoto = async (file) => {
    if (file.id) {
      await this.props.fileStore.update({ ...file })
      file.isMainPhoto = !file.isMainPhoto
      file.isMainPhoto &&
        (await this.props.fileStore.updateMainPhoto(
          this.props.moduleId,
          this.props.parentId,
          file.id
        ))
      this.initFiles()
    }
  }
  handleCancel = () => {
    this.setState({ previewOpen: false })
  }
  handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as RcFile)
    }
    this.setState({
      previewImage: file.url || (file.preview as string),
      previewOpen: true,
      previewTitle:
        file.name || file.url!.substring(file.url!.lastIndexOf("/") + 1),
    })
  }

  handleRemoveFile = async (file) => {
    // If file already exist in db -> call API remove, otherwise just remove from state list
    confirm({
      title: LNotification("DO_YOU_WANT_TO_DEACTIVATE_THESE_ITEM"),
      okText: L("BTN_YES"),
      cancelText: L("BTN_NO"),
      onOk: async () => {
        if (file.id) {
          file.isActive = false
          await this.props.fileStore.delete(file.guid)
          this.initFiles()
          return
        }
        const index = this.state.files.indexOf(file)
        const newFileList = this.state.files.slice()
        newFileList.splice(index, 1)
        this.setState({ files: newFileList })
      },
    })
  }
  handleChange: UploadProps["onChange"] = ({ fileList: newFileList }) => {
    this.setState({ file: newFileList })
  }

  handleBeforeUploadFile = (file) => {
    const fileList = [
      ...this.state.files,
      ...(this.props.fileStore.currentFiles as any[]),
    ]
    if (this.props.maxFile && this.props.maxFile <= fileList.length) {
      message.warning(LError("MAX_FILE_UPLOAD_{0}", this.props.maxFile))
      return false
    }
    // Validate file type
    const extension = `.${file.name?.split(".").pop()}`
    if (
      !extension ||
      (this.props.acceptedFileTypes &&
        this.props.acceptedFileTypes.findIndex(
          (fileType) => fileType === extension
        ) === -1)
    ) {
      message.warning(LError("UNACCEPTED_FILE_TYPE_{0}", extension))
      return false
    }

    // TODO: implement upload file
    if (!this.props.moduleId || !this.props.parentId) {
      return false
    }
    const params = {
      uniqueId: this.props.parentId,
      documentTypeId: 8,
      uploadDate: dayjs().toDate(),
    }
    fileService
      .uploadDocument(this.props.moduleId, params, file)
      .then(this.initFiles)
    return false
  }

  uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  )

  render() {
    return (
      <div>
        <Upload
          listType="picture-card"
          fileList={this.state.files}
          onPreview={this.handlePreview}
          onChange={this.handleChange}
          onRemove={this.handleRemoveFile}
          beforeUpload={this.handleBeforeUploadFile}
        >
          {this.state.files.length >= 8 ? null : this.uploadButton}
        </Upload>
        <Modal
          open={this.state.previewOpen}
          title={this.state.previewTitle}
          footer={null}
          onCancel={this.handleCancel}
        >
          <img
            alt="example"
            style={{ width: "100%" }}
            src={this.state.previewImage}
          />
        </Modal>
      </div>
    )
  }
}

export default withRouter(ImageUploadWrapCRM)
