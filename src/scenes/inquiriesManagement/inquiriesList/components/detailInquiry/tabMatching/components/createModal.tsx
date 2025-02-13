import { L } from "@lib/abpUtility"
import { Col, Form, Input, Modal, Row, Select } from "antd"
import React from "react"
import { FormInstance } from "antd/lib/form"
import TextArea from "antd/lib/input/TextArea"

interface Props {
  visible: boolean;
  onClose: () => void;
  onOk: (file, packageId) => Promise<any>;
}

interface State {
  file?: any;
  uploading?: boolean;
}

export default class CreateMatchingModal extends React.PureComponent<
  Props,
  State
> {
  form = React.createRef<FormInstance>();

  constructor(props) {
    super(props)
    this.state = {}
  }

  render(): React.ReactNode {
    const { visible, onClose } = this.props

    return (
      <Modal
        open={visible}
        destroyOnClose
        title={L("NEW_Matching")}
        cancelText={L("BTN_CANCEL")}
        onCancel={() => {
          onClose()
        }}
        confirmLoading={this.state.uploading}
      >
        <Form
          layout={"vertical"}
          //  onFinish={this.onSave}
          // validateMessages={validateMessages}
          size="middle"
        >
          <Row gutter={[16, 8]}>
            <Col sm={{ span: 24 }}>
              <Form.Item label={L("MAIL_INFOR")} name="">
                <Input placeholder={L("")}></Input>
              </Form.Item>
            </Col>
            <Col sm={{ span: 12 }}>
              <Form.Item label={L("TIME_LOG")} name="">
                <Select placeholder={L("")}></Select>
              </Form.Item>
            </Col>

            <Col sm={{ span: 12 }}>
              <Form.Item label={L("DATE_LOG")} name="">
                <Select placeholder={L("")}></Select>
              </Form.Item>
            </Col>

            <Col sm={{ span: 24 }}>
              <Form.Item label={L("ATTACK_FILE")} name="">
                <Input placeholder={L("")}></Input>
              </Form.Item>
            </Col>
            <Col sm={{ span: 24 }}>
              <Form.Item label={L("ATTACK_LINK")} name="">
                <Input placeholder={L("")}></Input>
              </Form.Item>
            </Col>

            <Col sm={{ span: 24 }}>
              <Form.Item label={L("RECAP_YOUR_CALL")} name="">
                <TextArea placeholder={L("")}></TextArea>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    )
  }
}
