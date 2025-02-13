import { L } from "@lib/abpUtility"
import { Col, Form, Modal, Row, Select } from "antd"
import React from "react"
// import TextArea from "antd/lib/input/TextArea";
import AppDataStore from "@stores/appDataStore"
import { AppComponentListBase } from "@components/AppComponentBase"
import withRouter from "@components/Layout/Router/withRouter"
import { inject, observer } from "mobx-react"
import Stores from "@stores/storeIdentifier"
import LeaseAgreementStore from "@stores/communication/leaseAgreementStore"
import AppConsts from "@lib/appconst"
import TextArea from "antd/lib/input/TextArea"
import { validateMessages } from "@lib/validation"
const { leaseStage } = AppConsts

interface Props {
  visible: boolean
  onClose: () => void
  onOk: (data) => void
  expriedDate: any
  leaseAgreementStore: LeaseAgreementStore
  appDataStore: AppDataStore
}
@inject(Stores.AppDataStore, Stores.LeaseAgreementStore)
@observer
class DroppedModal extends AppComponentListBase<Props, any> {
  form: any = React.createRef()
  constructor(props) {
    super(props)
    this.state = {}
  }

  handleOk = async () => {
    const resValue = await this.form.current?.validateFields()

    await this.props.onOk(resValue)
  }

  render(): React.ReactNode {
    const {
      visible,
      onClose,
      appDataStore: { leaseAgreementStatus },
    } = this.props

    return (
      this.props.visible && (
        <Modal
          open={visible}
          destroyOnClose
          title={L("DROPPED_LA")}
          cancelText={L("BTN_CANCEL")}
          width={"40%"}
          onCancel={onClose}
          onOk={this.handleOk}
        >
          <Form
            layout={"vertical"}
            validateMessages={validateMessages}
            ref={this.form}
            size="middle"
          >
            <Row gutter={[16, 8]}>
              <>
                <Col sm={{ span: 24 }}>
                  <Form.Item
                    label={L("DROPPED_STATUS")}
                    name="statusId"
                    rules={[
                      {
                        required: true,
                      },
                    ]}
                  >
                    <Select
                      showArrow
                      placeholder={L("CHOOSE_REASON_DROPPED_LA")}
                    >
                      {this.renderOptions(
                        leaseAgreementStatus?.filter(
                          (item) =>
                            item?.parentId === leaseStage.drop &&
                            item?.id !== 20
                        )
                      )}
                    </Select>
                  </Form.Item>
                </Col>
                <Col sm={{ span: 24, offset: 0 }}>
                  <Form.Item
                    label={L("DROP_REASON")}
                    name="reasonDrop"
                    rules={[
                      {
                        required: true,
                      },
                      { max: 1000 },
                    ]}
                  >
                    <TextArea rows={4} />
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
export default withRouter(DroppedModal)
