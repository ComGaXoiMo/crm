import { L, LError } from "@lib/abpUtility"
import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  Modal,
  Row,
  Select,
  Upload,
  message,
} from "antd"
import React from "react"
import { UploadOutlined } from "@ant-design/icons"
import { AppComponentListBase } from "@components/AppComponentBase"
import withRouter from "@components/Layout/Router/withRouter"
import Stores from "@stores/storeIdentifier"
import { inject, observer } from "mobx-react"
import AppDataStore from "@stores/appDataStore"
// import { UploadProps } from "antd/es/upload/interface";
import FileStore from "@stores/common/fileStore"
import rules from "./validation"
import { validateMessages } from "@lib/validation"
import AppConsts, { dateFormat } from "@lib/appconst"
import moment from "moment"
const { documentType } = AppConsts
interface Props {
  form: any;
  appDataStore: AppDataStore;
  fileStore: FileStore;

  visible: boolean;
  onClose: () => void;
  onOk: (file) => Promise<any>;
}

interface State {
  file?: any;
  uploading?: boolean;
}

@inject(Stores.AppDataStore, Stores.FileStore)
@observer
class CreateDocumentModal extends AppComponentListBase<Props, State> {
  // form = React.createRef<FormInstance>();
  form = this.props.form;
  constructor(props) {
    super(props)
    this.state = {
      file: undefined,
      uploading: false,
    }
  }

  handleOk = async () => {
    await this.setState({ uploading: true })
    this.props.onOk(this.state.file).finally(() => {
      this.setState({ uploading: false, file: undefined })
    })
  };
  handleClose = async () => {
    this.props.onClose()
    this.setState({ file: undefined })
  };
  beforeUpload = (file) => {
    const isLt2M = file.size / 1024 / 1024 < 20
    if (!isLt2M) {
      message.error(LError("MAX_FILE_SIZE_{0}", "20Mb"))
      this.setState({ file: undefined })
    } else {
      this.handleBeforeUploadFile(file)
    }

    return false
  };
  handleBeforeUploadFile = (file?) => {
    const docName = this.form.current?.getFieldValue("documentName")
    if (!docName || docName?.lenght === 0) {
      this.form.current?.setFieldValue("documentName", file?.name)
    }
    this.setState({ file: file })
  };
  render(): React.ReactNode {
    const {
      visible,
      appDataStore: { documentTypes },
    } = this.props

    return (
      this.props.visible && (
        <Modal
          width={"45%"}
          open={visible}
          destroyOnClose
          maskClosable={false}
          title={L("NEW_DOCUMENT")}
          cancelText={L("BTN_CANCEL")}
          onCancel={this.handleClose}
          onOk={this.handleOk}
          confirmLoading={this.state.uploading}
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
                  label={L("DOC_NAME")}
                  name="documentName"
                  rules={rules.docName}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col sm={{ span: 24 }}>
                <Form.Item
                  label={L("DOC_TYPE")}
                  name="documentTypeId"
                  rules={rules.required}
                  initialValue={documentType.other}
                >
                  <Select
                    showArrow
                    placeholder={L("")}
                    // mode="multiple"
                    options={documentTypes}
                  ></Select>
                </Form.Item>
              </Col>
              <Col sm={{ span: 24 }}>
                <Form.Item
                  label={L("UPLOAD_DATE")}
                  name="uploadDate"
                  rules={rules.required}
                  initialValue={moment()}
                >
                  <DatePicker className="w-100" format={dateFormat} />
                </Form.Item>
              </Col>
              <Col sm={{ span: 24 }}>
                <Form.Item
                  label={L("FILE_UPLOAD")}
                  name="uploadFile"
                  rules={rules.required}
                >
                  <Upload
                    style={{ width: "100%" }}
                    fileList={this.state.file ? [this.state.file] : []}
                    maxCount={1}
                    beforeUpload={this.beforeUpload}
                  >
                    <Button icon={<UploadOutlined />}>{L("UPLOAD")}</Button>
                  </Upload>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Modal>
      )
    )
  }
}
export default withRouter(CreateDocumentModal)
