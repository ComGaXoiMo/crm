import { L } from "@lib/abpUtility"
import { Col, Form, Input, Modal, Row } from "antd"
import React from "react"
import { FormInstance } from "antd/lib/form"

interface Props {
  dataSend: any;
  visible: boolean;
  onClose: () => void;
  onOk: () => Promise<any>;
}

interface State {
  file?: any;
  uploading?: boolean;
}

export default class DateStateSettingModal extends React.PureComponent<
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
        ? await this.form.current?.setFieldsValue(this.props.dataSend)
        : await this.form.current?.resetFields()
    }
  }
  render(): React.ReactNode {
    const { visible, onClose } = this.props

    return (
      this.props.visible && (
        <Modal
          open={visible}
          destroyOnClose
          title={L("EDIT")}
          cancelText={L("BTN_CANCEL")}
          onCancel={() => {
            onClose()
          }}
          confirmLoading={this.state.uploading}
        >
          <Form
            ref={this.form}
            layout={"vertical"}
            //  onFinish={this.onSave}
            // validateMessages={validateMessages}
            size="middle"
          >
            <Row gutter={[8, 0]}>
              <Col sm={{ span: 24 }}>
                <Form.Item label={L("STAGE")} name="stage">
                  <Input placeholder={L("")} />
                </Form.Item>
              </Col>
              <Col sm={{ span: 24 }}>
                <Form.Item label={L("NUM_DAY")} name="numDay">
                  <Input placeholder={L("")} />
                </Form.Item>
              </Col>
              {/* <Col sm={{ span: 24 }}>
                <Form.Item label={L("UNIT")} name="unit">
                    <Select
                      getPopupContainer={(trigger) => trigger.parentNode}                   placeholder={L("")}
                    mode="multiple"
                    options={[
                      { value: "P023", name: "P023" },
                      { value: "P024", name: "P024" },
                      { value: "P022", name: "P022" },
                    ]}
                  ></Select>
                </Form.Item>
              </Col> */}
              {/* <Col sm={{ span: 24 }}>
                <Form.Item label={L("REMARK")} name="remark">
                  <TextArea placeholder={L("")}></TextArea>
                </Form.Item>
              </Col> */}
            </Row>
          </Form>
        </Modal>
      )
    )
  }
}
