import { L } from "@lib/abpUtility"
import { Button, Col, Form, Input, Modal, Row, Select, Upload } from "antd"
import React from "react"
import { FormInstance } from "antd/lib/form"
import { UploadOutlined } from "@ant-design/icons"

interface Props {
  dataSend: any;
  visible: boolean;
  onClose: () => void;
  onOk: (file, packageId) => Promise<any>;
}

interface State {
  file?: any;
  uploading?: boolean;
}
const dataFake = {
  docName: "Document Lease",
  auther: "Bui Minh Hieu",
  remark: "Note ...",
  type: "LA",
}
export default class CreateDocumentModal extends React.PureComponent<
  Props,
  State
> {
  form = React.createRef<FormInstance>();

  constructor(props) {
    super(props)
    this.state = {}
  }
  async componentDidUpdate(prevProps) {
    if (prevProps.visible !== this.props.visible) {
      this.props.dataSend
        ? await this.form.current?.setFieldsValue(dataFake)
        : await this.form.current?.resetFields()
    }
  }
  render(): React.ReactNode {
    const { visible, onClose } = this.props

    return (
      this.props.visible && (
        <Modal
          width={"45%"}
          open={visible}
          destroyOnClose
          title={L("NEW_DOCUMENT")}
          cancelText={L("BTN_CANCEL")}
          onCancel={() => {
            onClose()
          }}
          confirmLoading={this.state.uploading}
        >
          <Form
            layout={"vertical"}
            ref={this.form}
            //  onFinish={this.onSave}
            // validateMessages={validateMessages}
            size="large"
          >
            <Row gutter={[16, 8]}>
              <Col sm={{ span: 24 }}>
                <Form.Item label={L("DOC_NAME")} name="docName">
                  <Input />
                </Form.Item>
              </Col>
              <Col sm={{ span: 24 }}>
                <Form.Item label={L("DOC_TYPE")} name="type">
                  <Select
                    getPopupContainer={(trigger) => trigger.parentNode}
                    showArrow
                    placeholder={L("")}
                    mode="multiple"
                    options={[
                      { value: "LA", name: "LA" },
                      { value: "Offer", name: "Offer" },
                      { value: "License", name: "License" },
                    ]}
                  ></Select>
                </Form.Item>
              </Col>
              <Col sm={{ span: 24 }}>
                <Form.Item label={L("REMARK")} name="remark">
                  <Input />
                </Form.Item>
              </Col>
              <Col sm={{ span: 24 }}>
                <Form.Item label={L("FILE_UPLOAD")} name="">
                  <Upload style={{ width: "100%" }}>
                    <Button icon={<UploadOutlined />}>Upload</Button>
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
