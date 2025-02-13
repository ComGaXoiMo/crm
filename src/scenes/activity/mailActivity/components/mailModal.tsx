import { L } from "@lib/abpUtility"
import { Button, Col, DatePicker, Form, Input, Modal, Row, Upload } from "antd"
import React from "react"
import TextArea from "antd/lib/input/TextArea"
import { UploadOutlined } from "@ant-design/icons"
import { AppComponentListBase } from "@components/AppComponentBase"
import withRouter from "@components/Layout/Router/withRouter"
import MailStore from "@stores/activity/mailStore"
import Stores from "@stores/storeIdentifier"
import { inject, observer } from "mobx-react"
import dayjs from "dayjs"
import fileService from "@services/common/fileService"
import { dateTimeFormat, moduleNames } from "@lib/appconst"
import FileStore from "@stores/common/fileStore"
import { validateMessages } from "@lib/validation"

interface Props {
  visible: boolean
  mailStore: MailStore
  fileStore: FileStore
  inquiryId: any
  onClose: () => void
  onOk: () => void
}

interface State {
  fileUpload: any
  files: any[]
}
@inject(Stores.MailStore, Stores.FileStore)
@observer
class MailModal extends AppComponentListBase<Props, State> {
  form: any = React.createRef()

  constructor(props) {
    super(props)
    this.state = {
      fileUpload: "",
      files: [] as any,
    }
  }

  async componentDidUpdate(prevProps) {
    const { mailDetail } = this.props.mailStore

    if (prevProps.visible !== this.props.visible) {
      this.getFile(this.props.mailStore?.mailDetail?.uniqueId)
      if (this.props.visible) {
        this.form.current?.setFieldsValue({
          ...mailDetail,
          sendDate: dayjs(mailDetail?.sendDate),
        })
      }
    }
  }
  getFile = async (uniqueId) => {
    await this.props.fileStore.getFiles(uniqueId)
    this.setState({ files: this.props.fileStore.currentFiles })
  }
  handleBeforeUploadFile = async (file?) => {
    this.setState({ fileUpload: file, files: [file] })

    return false
  }
  uploadFile = async () => {
    const { mailDetail } = this.props.mailStore
    const formValues = {
      uniqueId: mailDetail?.uniqueId,
      documentName: this.state.fileUpload?.name,
      uploadDate: dayjs().toJSON(),
    }
    await fileService.uploadDocument(
      moduleNames.mail,
      formValues,
      this.state.fileUpload
    )
  }
  onOk = async () => {
    const { mailDetail } = this.props.mailStore
    let params = await this.form.current?.validateFields()
    params = await {
      ...mailDetail,
      ...params,
      inquiryId: this.props.inquiryId,
    }
    await this.props.mailStore.createOrUpdate(params)
    if (this.form.current?.getFieldValue("file")) {
      await this.uploadFile()
    }

    await this.props.onOk()
  }
  render(): React.ReactNode {
    const {
      visible,
      onClose,
      mailStore: { isLoading },
    } = this.props

    return (
      this.props.visible && (
        <Modal
          confirmLoading={isLoading}
          open={visible}
          destroyOnClose
          title={L("NEW_MAIL")}
          cancelText={L("BTN_CANCEL")}
          onCancel={() => {
            onClose()
          }}
          onOk={this.onOk}
          // confirmLoading={this.state.uploading}
        >
          <Form
            layout={"vertical"}
            ref={this.form}
            //  onFinish={this.onSave}
            validateMessages={validateMessages}
            size="middle"
          >
            <Row gutter={[16, 8]}>
              <Col sm={{ span: 24 }}>
                <Form.Item
                  rules={[{ required: true }]}
                  label={L("MAIL_NAME")}
                  name="subject"
                >
                  <Input placeholder={L("")}></Input>
                </Form.Item>
              </Col>
              <Col sm={{ span: 24 }}>
                <Form.Item
                  rules={[{ required: true }]}
                  label={L("SEND_DATE")}
                  name="sendDate"
                >
                  <DatePicker
                    showTime
                    className="w-100"
                    format={dateTimeFormat}
                  />
                </Form.Item>
              </Col>

              <Col sm={{ span: 24 }}>
                <Form.Item
                  // rules={[{ required: true }]}
                  label={L("FILE")}
                  name="file"
                >
                  <Upload
                    style={{ width: "100%" }}
                    fileList={this.state.files}
                    showUploadList={{
                      showPreviewIcon: true,
                      showDownloadIcon: true,
                      showRemoveIcon: false,
                    }}
                    maxCount={1}
                    beforeUpload={this.handleBeforeUploadFile}
                  >
                    <Button icon={<UploadOutlined />}>{L("UPLOAD")}</Button>
                  </Upload>
                </Form.Item>
              </Col>

              <Col sm={{ span: 24 }}>
                <Form.Item
                  rules={[{ required: true }]}
                  label={L("DESCRIPTION")}
                  name="description"
                >
                  <TextArea placeholder={L("")}></TextArea>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Modal>
      )
    )
  }
}
export default withRouter(MailModal)
