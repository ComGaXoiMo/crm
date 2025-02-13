import { L } from "@lib/abpUtility"
import { Col, DatePicker, Form, Modal, Row } from "antd"
import React from "react"
import TextArea from "antd/lib/input/TextArea"
import { AppComponentListBase } from "@components/AppComponentBase"
import withRouter from "@components/Layout/Router/withRouter"
import CallStore from "@stores/activity/callStore"
import { inject, observer } from "mobx-react"
import Stores from "@stores/storeIdentifier"
import dayjs from "dayjs"
import { dateTimeFormat } from "@lib/appconst"
import { validateMessages } from "@lib/validation"

interface Props {
  visible: boolean
  callStore: CallStore
  inquiryId: any
  onClose: () => void
  onOk: (params) => void
}

@inject(Stores.CallStore)
@observer
class CallModal extends AppComponentListBase<Props, any> {
  form: any = React.createRef()

  constructor(props) {
    super(props)
    this.state = {}
  }

  async componentDidUpdate(prevProps) {
    const { callDetail } = this.props.callStore
    if (prevProps.visible !== this.props.visible) {
      if (this.props.visible) {
        this.form.current?.setFieldsValue({
          ...callDetail,
          callDate: dayjs(callDetail?.callDate),
        })
      }
    }
  }
  onOk = async () => {
    const { callDetail } = this.props.callStore
    let params = await this.form.current?.validateFields()
    params = await {
      ...callDetail,
      ...params,
      inquiryId: this.props.inquiryId,
    }

    await this.props.callStore.createOrUpdate(params)
    await this.props.onOk(params)
  }
  render(): React.ReactNode {
    const {
      visible,
      onClose,
      callStore: { isLoading },
    } = this.props

    return (
      this.props.visible && (
        <Modal
          open={visible}
          confirmLoading={isLoading}
          destroyOnClose
          title={
            this.props.callStore.callDetail?.id ? L("EDIT_CALL") : L("NEW_CALL")
          }
          cancelText={L("BTN_CANCEL")}
          onCancel={() => {
            onClose()
          }}
          onOk={this.onOk}
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
                  label={L("CALL_DATE")}
                  name="callDate"
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
export default withRouter(CallModal)
