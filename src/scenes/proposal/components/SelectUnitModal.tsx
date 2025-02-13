import { L } from "@lib/abpUtility"
import { Col, Form, Modal, Row, Select } from "antd"
import React from "react"
import moment from "moment"

interface Props {
  dataSend: any;
  visible: boolean;
  onClose: () => void;
  onOk: () => void;
}

interface State {
  isLoading: boolean;
}
const dataFake = {
  name: "CT Name",
  dateSent: moment("2023-04-04T08:07:31.5810056Z"),
}

export default class SelectUnitModal extends React.PureComponent<Props, State> {
  form: any = React.createRef();

  constructor(props) {
    super(props)
    this.state = { isLoading: true }
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
          open={visible}
          destroyOnClose
          title={this.props.dataSend ? L("SELECT_UNIT") : L("SELECT_UNIT")}
          cancelText={L("BTN_CANCEL")}
          onCancel={() => {
            onClose()
          }}
          onOk={onClose}
          // confirmLoading={this.state.uploading}
        >
          <Form
            layout={"vertical"}
            ref={this.form}
            //  onFinish={this.onSave}
            // validateMessages={validateMessages}
            size="middle"
          >
            <Row gutter={[16, 8]}>
              <Col sm={{ span: 24 }}>
                <Form.Item label={L("UNIT")} name="name">
                  <Select
                    getPopupContainer={(trigger) => trigger.parentNode}
                    showSearch
                    placeholder={L("")}
                    options={[
                      { value: "P023", name: "P023" },
                      { value: "P022", name: "P022" },
                      { value: "P021", name: "P021" },
                    ]}
                  ></Select>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Modal>
      )
    )
  }
}
