import { L } from "@lib/abpUtility"
import { Col, Form, Modal, Row, Select } from "antd"
import React from "react"
import dayjs from "dayjs"

interface Props {
  dataSend: any
  visible: boolean
  onClose: () => void
  onOk: () => void
}

interface State {
  isLoading: boolean
}
const dataFake = {
  name: "CT Name",
  dateSent: dayjs("2023-04-04T08:07:31.5810056Z"),
}

export default class SelectProjectModal extends React.PureComponent<
  Props,
  State
> {
  form: any = React.createRef()

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
                <Form.Item label={L("PROJECT")} name="project">
                  <Select
                    getPopupContainer={(trigger) => trigger.parentNode}
                    placeholder={L("")}
                    options={[{ value: "THE WATERFRONT" }]}
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
