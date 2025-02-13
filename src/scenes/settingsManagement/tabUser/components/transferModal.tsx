import { L } from "@lib/abpUtility"
import { Col, Form, Modal, Row, Select } from "antd"
import React from "react"
import { FormInstance } from "antd/lib/form"
import { AppComponentListBase } from "@components/AppComponentBase"

interface Props {
  visible: boolean;
  onClose: () => void;
  onOk: () => void;
}

export default class TransferModal extends AppComponentListBase<Props> {
  form = React.createRef<FormInstance>();

  constructor(props) {
    super(props)
    this.state = {}
  }

  render(): React.ReactNode {
    const { visible, onClose, onOk } = this.props

    return (
      this.props.visible && (
        <Modal
          open={visible}
          destroyOnClose
          title={L("TRANSFER")}
          cancelText={L("BTN_CANCEL")}
          onCancel={() => {
            onClose()
          }}
          onOk={() => onOk()}
        >
          <Form ref={this.form} layout={"vertical"} size="middle">
            <Row gutter={[8, 0]}>
              <Col sm={{ span: 24 }}>
                <Form.Item label={L("STAFF")} name="staff">
                  <Select
                    getPopupContainer={(trigger) => trigger.parentNode}
                    placeholder={L("")}
                    options={[{ value: "Viet Nguyen" }, { value: "Agency 2" }]}
                  ></Select>
                </Form.Item>
              </Col>
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
