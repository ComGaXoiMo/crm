import { L } from "@lib/abpUtility"
import { Col, DatePicker, Form, Modal, Row } from "antd"
import React from "react"
import { FormInstance } from "antd/lib/form"
import TextArea from "antd/lib/input/TextArea"
import withRouter from "@components/Layout/Router/withRouter"
import { AppComponentListBase } from "@components/AppComponentBase"
import TenantStore from "@stores/administrator/tenantStore"
import { inject, observer } from "mobx-react"
import Stores from "@stores/storeIdentifier"
import { validateMessages } from "@lib/validation"
import { dateFormat } from "@lib/appconst"

interface Props {
  visible: boolean;
  onClose: () => void;
  onOk: () => void;
  tenantStore: TenantStore;
  moveOutData: any;
}

interface State {
  isLoading: boolean;
}
@inject(Stores.TenantStore)
@observer
class MoveOutModal extends AppComponentListBase<Props, State> {
  form = React.createRef<FormInstance>();

  constructor(props) {
    super(props)
    this.state = { isLoading: false }
  }

  async componentDidUpdate(prevProps) {
    if (prevProps.visible !== this.props.visible) {
      await this.form.current?.resetFields()
    }
  }
  handleOk = async () => {
    let params = await this.form.current?.validateFields()
    params = {
      id: this.props.moveOutData?.id,
      userTenantId: this.props.moveOutData?.tenantId,
      ...params,
    }
    await this.setState({ isLoading: true })
    await this.props.tenantStore
      .moveTenantOutUnit(params)
      .finally(() => this.setState({ isLoading: false }))
    await this.props.onOk()
  };
  render(): React.ReactNode {
    const { visible, onClose } = this.props

    return (
      this.props.visible && (
        <Modal
          open={visible}
          destroyOnClose
          title={L("MOVE_OUT_TENANT")}
          cancelText={L("BTN_CANCEL")}
          onCancel={() => {
            onClose()
          }}
          onOk={this.handleOk}
          confirmLoading={this.state.isLoading}
        >
          <Form
            layout={"vertical"}
            ref={this.form}
            //  onFinish={this.onSave}
            validateMessages={validateMessages}
            size="middle"
          >
            <Row gutter={[8, 0]}>
              <Col sm={{ span: 24 }}>
                <Form.Item
                  rules={[{ required: true }]}
                  label={L("MOVE_OUT")}
                  name="moveOutDate"
                >
                  <DatePicker className="w-100" format={dateFormat} />
                </Form.Item>
              </Col>
              <Col sm={{ span: 24 }}>
                <Form.Item
                  rules={[{ required: true }]}
                  label={L("REASON")}
                  name="moveOutReason"
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
export default withRouter(MoveOutModal)
