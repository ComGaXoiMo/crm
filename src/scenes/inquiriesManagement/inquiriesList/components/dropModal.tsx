import { L } from "@lib/abpUtility"
import { Col, Form, Modal, Row, Select } from "antd"
import React from "react"
// import TextArea from "antd/lib/input/TextArea";
import AppDataStore from "@stores/appDataStore"
import { AppComponentListBase } from "@components/AppComponentBase"
import withRouter from "@components/Layout/Router/withRouter"
import { inject, observer } from "mobx-react"
import Stores from "@stores/storeIdentifier"
import { renderOptions } from "@lib/helper"

interface Props {
  visible: boolean;
  onClose: () => void;
  onOk: (id) => void;
  status?: any;
  appDataStore: AppDataStore;
}
interface State {
  subStage: any[];
  idChoose: any;
}
@inject(Stores.AppDataStore)
@observer
class DropModal extends AppComponentListBase<Props, State> {
  form: any = React.createRef();
  constructor(props) {
    super(props)
    this.state = {
      subStage: [],
      idChoose: undefined,
    }
  }
  async componentDidUpdate(prevProp) {
    if (prevProp.visible !== this.props.visible) {
      if (this.props.visible === true) {
        this.findSubStage()
      }
    }
  }
  handleOk = async () => {
    await this.form.current?.validateFields()
    await this.props.onOk(this.state.idChoose)
  };
  findSubStage = async () => {
    const subStage = this.props.appDataStore.inquirySubStage.filter(
      (item) => item.parentId === 5 // id of status cancel
    )
    this.setState({ subStage })
  };
  render(): React.ReactNode {
    const { visible, onClose } = this.props

    return (
      this.props.visible && (
        <Modal
          open={visible}
          destroyOnClose
          title={L("DROP_INQUIRY")}
          cancelText={L("BTN_CANCEL")}
          onCancel={onClose}
          onOk={this.handleOk}
        >
          <Form layout={"vertical"} ref={this.form} size="middle">
            <Row gutter={[16, 8]}>
              <Col sm={{ span: 24 }}>
                <Form.Item
                  label={L("INQUIRY_DETAIL_STATUS")}
                  name="detailStatus"
                  rules={[{ required: true }]}
                >
                  <Select
                    placeholder={L("")}
                    onChange={(value) => this.setState({ idChoose: value })}
                  >
                    {renderOptions(this.state.subStage)}
                  </Select>
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
export default withRouter(DropModal)
