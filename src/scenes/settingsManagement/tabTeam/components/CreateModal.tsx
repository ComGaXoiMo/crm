import { AppComponentListBase } from "@components/AppComponentBase"
import withRouter from "@components/Layout/Router/withRouter"
import { L } from "@lib/abpUtility"
import { validateMessages } from "@lib/validation"
import OrganizationUnitStore from "@stores/organizationUnit/organizationUnitStore"
import Stores from "@stores/storeIdentifier"
import { Col, Form, Input, Modal, Row } from "antd"
import { inject, observer } from "mobx-react"
import React from "react"

interface Props {
  visible: boolean;
  onClose: () => void;
  onOk: () => void;
  status?: any;
  organizationUnitStore: OrganizationUnitStore;
}
interface State {
  loading: any;
}
@inject(Stores.OrganizationUnitStore)
@observer
class CreateModal extends AppComponentListBase<Props, State> {
  formRef: any = React.createRef();

  onCreate = async () => {
    const formValues = await this.formRef.current?.validateFields()
    const res = { ...formValues }
    await this.props.organizationUnitStore.createOU(res)
    this.props.onOk()
  };
  render(): React.ReactNode {
    const { visible, onClose } = this.props

    return (
      this.props.visible && (
        <Modal
          open={visible}
          destroyOnClose
          title={L("NEW_TEAM")}
          cancelText={L("BTN_CANCEL")}
          onCancel={onClose}
          onOk={this.onCreate}
        >
          <Form
            layout={"vertical"}
            ref={this.formRef}
            size="middle"
            validateMessages={validateMessages}
          >
            <Row gutter={[8, 0]}>
              <Col sm={{ span: 24 }}>
                <Form.Item
                  label={L("TEAM_NAME")}
                  name="displayName"
                  rules={[{ required: true }, { max: 128 }]}
                >
                  <Input placeholder={L("")}></Input>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Modal>
      )
    )
  }
}
export default withRouter(CreateModal)
