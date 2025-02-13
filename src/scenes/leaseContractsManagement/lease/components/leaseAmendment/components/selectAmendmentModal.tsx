import React from "react"
import withRouter from "@components/Layout/Router/withRouter"
import { AppComponentListBase } from "@components/AppComponentBase"
import Stores from "@stores/storeIdentifier"
import { inject, observer } from "mobx-react"
import _ from "lodash"

// import FormTextArea from "@components/FormItem/FormTextArea";
import LeaseAgreementStore from "@stores/communication/leaseAgreementStore"
import { Checkbox, Col, Form, Modal, Row } from "antd"
import { L } from "@lib/abpUtility"
import AppConsts from "@lib/appconst"
import AmendmentLAModal from "./amendmentLAModal"
const { amendmentLAItems } = AppConsts
interface Props {
  leaseAgreementId: any
  visible: boolean
  onClose: () => void
  onOk: () => void
  leaseAgreementStore: LeaseAgreementStore
}

interface State {
  modalVisible: boolean
  amendmentListItem: any[]
}

@inject(Stores.LeaseAgreementStore)
@observer
class SelectAmendmentModal extends AppComponentListBase<Props, State> {
  formRef: any = React.createRef()

  constructor(props) {
    super(props)
    this.state = {
      modalVisible: false,
      amendmentListItem: [] as any,
    }
  }
  async componentDidUpdate(prevProps) {
    console.log()
  }
  toggleModal = () =>
    this.setState((prevState) => ({ modalVisible: !prevState.modalVisible }))

  handleOk = async () => {
    const formValue = this.formRef.current.getFieldValue("listAmendmentItem")
    this.setState({ amendmentListItem: formValue, modalVisible: true })
  }

  onOkAmendment = () => {
    this.props.onOk()
  }
  render(): React.ReactNode {
    const { visible, onClose } = this.props
    return (
      <>
        <Modal
          open={visible}
          destroyOnClose
          title={<strong>{L("DO_YOU_WANT_AMEND_THIS_LEASE_AGREEMENT")}</strong>}
          cancelText={L("BTN_CANCEL")}
          onCancel={onClose}
          onOk={this.handleOk}
        >
          <Form layout={"vertical"} ref={this.formRef} size="middle">
            <Row gutter={[16, 16]}></Row>
            <Col sm={{ span: 24 }}>
              <span>{L("SELECT_INFORMATION_THAT_NDEEDED_TO_BE_AMENDED")}</span>
            </Col>
            <Form.Item name="listAmendmentItem">
              <Checkbox.Group>
                <Row>
                  {(amendmentLAItems || []).map((item, index) => (
                    <Col span={24} key={index}>
                      <Checkbox value={item?.id}>{item?.name}</Checkbox>
                    </Col>
                  ))}
                </Row>
              </Checkbox.Group>
            </Form.Item>
          </Form>
        </Modal>
        <AmendmentLAModal
          leaseAgreementId={this.props.leaseAgreementId}
          visible={this.state.modalVisible}
          onClose={this.toggleModal}
          listAmendmentItem={this.state.amendmentListItem}
          onOk={() => {
            this.props.leaseAgreementStore.getAllAmendmentForLA({
              leaseAgreementAmendmentId: this.props.leaseAgreementId,
            }),
              this.toggleModal(),
              onClose()
          }}
        />
      </>
    )
  }
}
export default withRouter(SelectAmendmentModal)
