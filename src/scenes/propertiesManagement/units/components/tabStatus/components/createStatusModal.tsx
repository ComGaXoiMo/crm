import { L } from "@lib/abpUtility"
import { Col, DatePicker, Form, Modal, Row, Select } from "antd"
import React from "react"
import AppDataStore from "@stores/appDataStore"
import withRouter from "@components/Layout/Router/withRouter"
import { AppComponentListBase } from "@components/AppComponentBase"
import Stores from "@stores/storeIdentifier"
import { inject, observer } from "mobx-react"
import { validateMessages } from "@lib/validation"
import { dateFormat } from "@lib/appconst"

interface Props {
  visible: boolean;
  onClose: () => void;
  onOk: (id?) => void;
  formRef: any;
  data: any;
  appDataStore: AppDataStore;
  isLoading: boolean;
}

interface State {
  file?: any;
  uploading?: boolean;
}

@inject(Stores.AppDataStore)
@observer
class CreateStatusModal extends AppComponentListBase<Props, State> {
  form = this.props.formRef;

  constructor(props) {
    super(props)
    this.state = {}
  }
  async componentDidUpdate(prevProps) {
    if (prevProps.visible !== this.props.visible) {
      this.form.current?.setFieldsValue(this.props.data)
    }
  }
  render(): React.ReactNode {
    const {
      visible,
      onClose,
      onOk,
      appDataStore: { unitStatusOtherVacant },
      data,
    } = this.props

    return (
      this.props.visible && (
        <Modal
          width={"45%"}
          open={visible}
          title={L("STATUS")}
          cancelText={L("BTN_CANCEL")}
          onCancel={() => {
            onClose()
          }}
          onOk={() => onOk(data?.id)}
          confirmLoading={this.props.isLoading}
        >
          <Form
            layout={"vertical"}
            ref={this.form}
            validateMessages={validateMessages}
            size="middle"
          >
            <Row gutter={[16, 8]}>
              <Col sm={{ span: 24, offset: 0 }}>
                <Form.Item
                  rules={[{ required: true }]}
                  label={L("UNIT_STATUS")}
                  name="statusId"
                >
                  <Select>{this.renderOptions(unitStatusOtherVacant)}</Select>
                </Form.Item>
              </Col>
              <Col sm={{ span: 12 }}>
                <Form.Item label={L("STATUS_START_DATE")} name="startDate">
                  <DatePicker className="w-100" format={dateFormat} />
                </Form.Item>
              </Col>
              <Col sm={{ span: 12 }}>
                <Form.Item label={L("END_DATE")} name="endDate">
                  <DatePicker className="w-100" format={dateFormat} />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Modal>
      )
    )
  }
}
export default withRouter(CreateStatusModal)
