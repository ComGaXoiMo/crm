import { L } from "@lib/abpUtility"
import { Col, Form, Modal, Row, Select } from "antd"
import React from "react"
// import TextArea from "antd/lib/input/TextArea";
import { AppComponentListBase } from "@components/AppComponentBase"
import withRouter from "@components/Layout/Router/withRouter"
import { inject, observer } from "mobx-react"
import AppConsts from "@lib/appconst"
const { listLaConfirmUnitStatus } = AppConsts

interface Props {
  visible: boolean
  onClose: () => void
  onOk: (id) => void
  expriedDate: any
}
@inject()
@observer
class ConfirmModal extends AppComponentListBase<Props, any> {
  form: any = React.createRef()
  constructor(props) {
    super(props)
    this.state = {}
  }

  handleOk = async () => {
    const resValue = await this.form.current?.validateFields()

    await this.props.onOk(resValue?.statusId)
  }
  render(): React.ReactNode {
    const { visible, onClose } = this.props

    return (
      this.props.visible && (
        <Modal
          open={visible}
          destroyOnClose
          title={L("CONFIRM_LA")}
          cancelText={L("BTN_CANCEL")}
          width={"40%"}
          onCancel={onClose}
          onOk={this.handleOk}
        >
          <Form layout={"vertical"} ref={this.form} size="middle">
            <Row gutter={[16, 8]}>
              <>
                <Col sm={{ span: 24 }}>
                  <Form.Item
                    label={L("CONFIRM_STATUS")}
                    name="statusId"
                    rules={[
                      {
                        required: true,
                      },
                    ]}
                  >
                    <Select showArrow placeholder={L("CHOOSE_UNIT_STATUS")}>
                      {this.renderOptions(listLaConfirmUnitStatus)}
                    </Select>
                  </Form.Item>
                </Col>
              </>
            </Row>
          </Form>
          <style>
            {`
              .ant-modal-body{
                padding: 8px;
              }

            `}
          </style>
        </Modal>
      )
    )
  }
}
export default withRouter(ConfirmModal)
