import React from "react"
import Icon, {
  DeleteOutlined,
  DownloadOutlined,
  InboxOutlined,
  StarFilled,
  StarOutlined,
} from "@ant-design/icons/lib"
import { Upload, message, Button, Modal } from "antd"
import AppComponentBase from "../AppComponentBase"
import { inject, observer } from "mobx-react"
import Stores from "../../stores/storeIdentifier"
import FileStore from "../../stores/common/fileStore"
import { L, LError, LNotification } from "@lib/abpUtility"
import fileService from "@services/common/fileService"
import { documentTypes } from "@lib/appconst"

const { Dragger } = Upload
const confirm = Modal.confirm

interface IFileUploadWrapProps {
  parentId: string
  moduleId: string
  type?: string
  fileStore: FileStore
  acceptedFileTypes?: string[]
  maxFile?: number
}

@inject(Stores.FileStore)
@observer
class FileUploadWrap extends AppComponentBase<IFileUploadWrapProps> {
  state = {
    files: [] as any[],
    combineFileTypes: this.props.acceptedFileTypes?.join(","),
  }

  componentDidMount(): void {
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
    this.setState({ files })
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
    fileService
      .upload(this.props.moduleId, this.props.parentId, file)
      .then(this.initFiles)
    return false
  }

  handleDownload = (file) => {
    window.open(file.url, "_blank")
  }

  renderImages = () => {
    return (
      <div
        className="ant-upload-picture-card-wrapper ant-row mt-3"
        style={{ justifyContent: "center" }}
      >
        {(this.state.files || []).map((file, index) => {
          return (
            <div
              key={index}
              className="ant-upload-list ant-upload-list-picture-card ant-col"
            >
              <div className="ant-upload-list-picture-card-container">
                <div className="ant-upload-list-item ant-upload-list-item-done ant-upload-list-item-list-type-picture-card">
                  <div className="ant-upload-list-item-info">
                    <a className="ant-upload-list-item-thumbnail">
                      <img
                        className="ant-upload-list-item-image"
                        src={file.url}
                      />
                    </a>
                    <a className="ant-upload-list-item-name ant-upload-list-item-name-icon-count-1">
                      {file.name}
                    </a>
                    {file.isMainPhoto && (
                      <span className="main-photo">
                        <StarFilled style={{ color: "yellow" }} />
                      </span>
                    )}
                  </div>
                  <span className="ant-upload-list-item-actions">
                    <Button
                      size="small"
                      shape="circle"
                      type="text"
                      style={{ color: "rgba(255,255,255,.85)" }}
                      onClick={() => this.updateMainPhoto(file)}
                    >
                      {file.isMainPhoto ? <StarOutlined /> : <StarFilled />}
                    </Button>
                    <Button
                      size="small"
                      shape="circle"
                      type="text"
                      onClick={() => this.handleRemoveFile(file)}
                      style={{ color: "rgba(255,255,255,.85)" }}
                    >
                      <DeleteOutlined />
                    </Button>
                  </span>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  renderDocuments = () => {
    return (
      <div className="ant-upload-list ant-upload-list-text">
        {(this.state.files || []).map((file, index) => {
          return (
            <div key={index}>
              <span>
                <div className="ant-upload-list-item ant-upload-list-item-done ant-upload-list-item-list-type-text">
                  <div className="ant-upload-list-item-info">
                    <span>
                      <div className="ant-upload-text-icon">
                        <Icon component={file.icon} style={{ top: "0" }} />
                      </div>
                      <a
                        className="ant-upload-list-item-name ant-upload-list-item-name-icon-count-1"
                        href={file.urlDownload}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {file.name}
                      </a>
                      <span className="ant-upload-list-item-card-actions ">
                        <Button
                          size="small"
                          shape="circle"
                          type="text"
                          onClick={() => this.handleDownload(file)}
                          style={{ color: "rgba(255,255,255,.85)" }}
                        >
                          <DownloadOutlined />
                        </Button>
                        <Button
                          size="small"
                          shape="circle"
                          type="text"
                          onClick={() => this.handleRemoveFile(file)}
                          style={{ color: "rgba(255,255,255,.85)" }}
                        >
                          <DeleteOutlined />
                        </Button>
                      </span>
                    </span>
                  </div>
                </div>
              </span>
            </div>
          )
        })}
      </div>
    )
  }

  render() {
    return (
      <div>
        <Dragger
          multiple={false}
          onRemove={this.handleRemoveFile}
          beforeUpload={this.handleBeforeUploadFile}
          fileList={[]}
        >
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">
            {L("FILE_INSTRUCTION")} {L(this.props.type || "DOCUMENT")}
          </p>
          <p className="ant-upload-hint">
            {this.props.acceptedFileTypes && this.props.acceptedFileTypes.length
              ? L("FILE_ACCEPTED_FILE_TYPE_{0}", this.state.combineFileTypes)
              : ""}
          </p>
        </Dragger>

        {this.props.type === documentTypes.image
          ? this.renderImages()
          : this.renderDocuments()}
      </div>
    )
  }
}

export default FileUploadWrap
